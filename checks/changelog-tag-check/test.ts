import { CheckResult, DangerCheck } from '../../lib/DangerCheck';
import { DangerUtils } from '../../lib/utils/DangerUtils';
import { BranchMergeConfig, DangerConfig } from '../../lib/types/DangerConfig';
import { backquote, codeBlock } from '../../lib/utils/Markdown';

export default class ChangelogTagCheck extends DangerCheck {

  constructor (config: DangerConfig) {
    super(config);
  }

  async run(): Promise<CheckResult> {
    const labels = DangerUtils.github.issue.labels.map(e => e.name);
    const body = DangerUtils.github.pr.body;

    if (body.includes('ci-no-changelog-tag')) {
      return {
        type: 'warn',
        message: codeBlock('Bypassed')
      };
    }
  
    if (labels.findIndex(e => e.startsWith('changelog:')) < 0) {
      return {
        type: 'fail',
        message: [
          `Pull Requests must have a ${backquote('changelog:XXX')} label.`,
          `If you want to allow this PR to not have a changelog tag, add the following line to the PR body:`,
          '\n',
          codeBlock('ci-no-changelog-tag')
        ],
      }
    }

    return {
      type: 'success',
    };
  }
}