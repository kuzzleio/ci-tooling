import { DangerCheck } from './DangerCheck';
import { JSONObject } from './JSONObject';
import { codeBlock } from './utils/Markdown';

export class DangerRunner {
  private checks: DangerCheck[] = [];
  private config: JSONObject;
  private loadFailed = false;

  constructor (config: JSONObject) {
    this.config = config;

    for (const check of Object.keys(this.config.checks)) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const dangerCheck = require(`${__dirname}/../checks/${check}/test.js`).default;
        if (! (dangerCheck instanceof DangerCheck)) {
          break;
        }
        this.checks.push(new (dangerCheck as any)(this.config));
      }
      catch (e) {
        this.loadFailed = true;
        markdown(`# :x: Failed to load test suite\n\n${e.stack}`);
        fail('Found some issues !');
      }
    }
  }

  async run () {
    if (this.loadFailed) {
      return;
    }

    const checkResults: string[] = [];
    let failed = false;

    for (const check of this.checks) {
      try {
        console.log(`Running ${check.getName()}`);
        const result = await check.run();
        console.log(result);
        
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
      }
      catch (e) {
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