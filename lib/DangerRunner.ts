import { CheckResult, DangerCheck } from './DangerCheck';
import { JSONObject } from './JSONObject';
import { fail, markdown } from 'danger';
import { codeBlock } from './utils/Markdown';

export class DangerRunner {
  private checks: DangerCheck[] = [];
  private config: JSONObject;

  constructor (config: JSONObject) {
    this.config = config;

    for (const check of Object.keys(this.config.checks)) {
      try {
        const dangerCheck = require(`${__dirname}/checks/${check}/test`).default;
        if (! (dangerCheck instanceof DangerCheck)) {
          break;
        }
        this.checks.push(new (dangerCheck as any)(this.config));
      } catch (e) {

      }
    }
  }

  async run () {
    const checkResults: string[] = [];
    let failed = false;

    for (const check of this.checks) {
      try {
        const result = await check.run();
        
        switch (result.type) {
          case 'message':
            checkResults.push(`### ${check.getName()}\n\n${result.message}`);
            break;
          case 'fail':
            failed = true;
            checkResults.push(`### :x: ${check.getName()}\n\n${result.message}`);
            break;
          case 'warn':
            checkResults.push(`### :warning: ${check.getName()}\n\n${result.message}`);
            break;
          case 'success':
            checkResults.push(`### :heavy_check_mark: ${check.getName()}\n\n${result.message}`);
            break;
        }
      } catch (e) {
        checkResults.push(`### :x: ${check.getName()}\n\n${codeBlock(e.stack, 'js')}`);
      }
    }

    if (checkResults.length > 0) {
      markdown(checkResults.join('\n\n'));
      if (failed) {
        fail('Found some issues !');
      }
    }
  }
}