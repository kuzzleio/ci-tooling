import { CheckResult, DangerCheck } from '../../lib/DangerCheck';
import { DangerUtils } from '../../lib/utils/DangerUtils';
import { DangerConfig } from '../../lib/types/DangerConfig';
import { backquote, codeBlock } from '../../lib/utils/Markdown';

export default class BrokenLinkCheck extends DangerCheck {

  constructor (config: DangerConfig) {
    super(config);
  }

  async run(): Promise<CheckResult> {
    return {
      type: 'success',
      message: [
        DangerUtils.git.base,
        DangerUtils.git.head
      ]
    };
  }
}