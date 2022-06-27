import { CheckResult, DangerCheck } from '../../lib/DangerCheck';
import { JSONObject } from '../../lib/JSONObject';

export default class BranchMergeCheck extends DangerCheck {

  constructor (config: JSONObject) {
    super(config);
  }

  run(): Promise<CheckResult> {
    return Promise.resolve({
      type: 'message',
      message: 'This is a message'
    });
  }
}