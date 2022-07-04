# ci-tooling
Tooling for Kuzzle CI

The main goal of this repository is to centralize our GithubActions workflows in a repository and use them in our
projects instead of duplicating them in each repository.

This makes it easier to use and maintain, since modifiying one of the workflow in this repository updates them for all
the repositories using it.

## Add a new reusable workflow

Add a new file in the folder `.github/workflows`.

Here `my-workflow.yaml`

```yaml
name: <Workflow Name>
on:
  workflow_call:
    # You can add input fields to your workflow
    # 
    # inputs:
    #   INPUT_FIELD:
    #     description: 'Field description'
    #     required: true
    #     type: string

my-workflow:
    name: Documentation - Deploy
    runs-on: ubuntu-latest
    steps:
    # - steps to execute in the workflow
```

## Utilize a reusable workflow 

In your repository you can add a new job in workflow files and you can call a reusable workflow
using the `uses` directive you can execute a workflow file from another repository.

```yaml
jobs:
  my-workflow:
    name: My Workflow
    uses: kuzzleio/ci-tooling/.github/workflows/my-workflow.yaml@master # Execute the workflow from the ci-tooling repository
    secrets: inherit # Pass the secrets to the workflow
    with:
      # Pass inputs to the workflow if needed
```

## Danger Checks

Danger Checks are scripts that get executed in Pull Requests

### How to use the Danger check workflow

Add a new job to your workflow that uses the `danger.yaml` workflow from this repository

```yaml
danger-js:
  name: Danger JS
  uses: kuzzleio/ci-tooling/.github/workflows/danger.yaml@master
  secrets: inherit
  with:
    DANGER_CONFIG: './.ci/danger.config.yml' # Path to the danger config to use (The file must be in the repository that calls the danger workflow)
```

### Danger Config File

The Danger workflow knows which checks to perform based on the given config file
Danger will execute each checks configured in the config-file.
Checks name must be identical to the folder names in `kuzzleio/ci-tooling/checks`

**Config file example**
```yaml
checks: # List of checks to perform with their configuration
  branch-merge-check: # Execute the branch-merge-check
    # Configuration for branch-check-merge
    branches:
      master:
        - /.*-dev/
  changelog-tag-check: # Execute the changelog-tag-check
  pr-body-check: # Execute the pr-body-check
```

### Add a new Danger check

To add a new Danger check you need to add a new folder with a `test.ts` file in the folder at `kuzzlio/ci-tooling/checks`
The folder name will be the name of the check to add in the `danger.config.yaml` of all the repositories that needs it to be executed.

#### Example
If you want to add a new check to check if a Pull Request title contains `[WIP]` and block the PR from merging.

**Step 1 - Add a new check**

I add a new folder in the `checks` folder called `pr-wip-check` for example and add a new `test.ts` file in it.

```ts
import { CheckResult, DangerCheck } from '../../lib/DangerCheck';
import { DangerUtils } from '../../lib/utils/DangerUtils';

/**
 * Create a new class that extends DangerCheck that should be exported by default
 * This class will be instanciated with a config and run by Danger when needed
 */
export default class PRWIPCheck extends DangerCheck {

  // The whole danger configuration will be given
  constructor (config: DangerConfig) {
    super(config);
    this.name = 'PR WIP Check'; // Name of the check that will be displayed
  }

  /**
   * This method will be run by Danger when the checks need to be performed
   * A CheckResult object should be resolved, this way Danger know what to output
   * for the check.
   */
  async run(): Promise<CheckResult> {
    const title = DangerUtils.github.pr.title; // Retrieved the title of the PR
    
    // Checks if the title contains [WIP] and fails if so
    if (title.includes('[WIP]')) {
      // Tells danger that the check failed and what message to show
      return {
        type: 'fail',
        message: 'Pull Request is Work In Progress and should not be merged'
      }
    }

    // Tells danger that the check succeeded, here no message was given but you could have given it one to show.
    return {
      type: 'success',
    };
  }
}
```

**Step 2 - Push your check on the master branch of kuzzleio/ci-tooling**
**Step 3 - Tells danger to execute it in your danger config**

Go to a repository that has a `danger.config.yaml` and uses the danger workflow
Then add the name of your check folder to the config file

```yaml
checks:
  branch-merge-check:
    branches:
      master:
        - /.*-dev/
  changelog-tag-check:
  pr-body-check:
  # Add the name of the check folder to execute
  pr-wip-check: # Execute the pr-wip-check
```