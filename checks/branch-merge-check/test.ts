import { CheckResult, DangerCheck } from '../../lib/DangerCheck';
import { DangerUtils } from '../../lib/DangerUtils';
import { JSONObject } from '../../lib/JSONObject';

export default class BranchMergeCheck extends DangerCheck {

  constructor (config: JSONObject) {
    super(config);
  }

  async run(): Promise<CheckResult> {
    return {
      type: 'message',
      message: DangerUtils.github.pr.base.ref
    };
  }
}