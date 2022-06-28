import { CheckResult, DangerCheck } from '../../lib/DangerCheck';
import { DangerConfig } from '../../lib/types/DangerConfig';
import { DangerUtils } from '../../lib/utils/DangerUtils';

export default class PRBodyCheck extends DangerCheck {

  constructor (config: DangerConfig) {
    super(config);
    this.name = 'PR Body Check';
  }

  async run(): Promise<CheckResult> {
    if (DangerUtils.github.pr.body.length === 0) {
      return {
        type: 'fail',
        message: [
          'Pull Requests must have a body.',
          'Add a body to your PR and try again.'
        ]
      }
    }

    return {
      type: 'success'
    }
  }
}