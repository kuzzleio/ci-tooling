import { DangerCheck } from './DangerCheck';
import { DangerUtils } from './utils/DangerUtils';
import { DangerConfig } from './types/DangerConfig';
import { codeBlock } from './utils/Markdown';

export class DangerRunner {
  private checks: DangerCheck[] = [];
  private config: DangerConfig;
  private loadFailed = false;

  constructor (config: DangerConfig) {
    this.config = config;

    for (const check of Object.keys(this.config.checks)) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const dangerCheck = require(`${__dirname}/../checks/${check}/test.js`).default;
        if (! dangerCheck || ! (dangerCheck.prototype instanceof DangerCheck)) {
          console.error(`${check} is not a valid DangerCheck class: skipped`);
          continue;
        }
        this.checks.push(new (dangerCheck as any)(this.config));
      }
      catch (e) {
        this.loadFailed = true;
        DangerUtils.markdown(`# :x: Failed to load test suite\n\n${e.stack}`);
        DangerUtils.fail('Found some issues !');
      }
    }
  }

  private getMessage (message: string | string[]): string {
    if (Array.isArray(message)) {
      return message.join('\n');
    }
    return message;
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
        console.log(`Result: ${JSON.stringify(result, null, 2)}`);
        
        switch (result.type) {
          case 'message':
            checkResults.push(`### ${check.getName()}\n\n${this.getMessage(result.message)}`);
            break;
          case 'fail':
            failed = true;
            checkResults.push(`### :x: ${check.getName()}\n\n${this.getMessage(result.message)}`);
            break;
          case 'warn':
            checkResults.push(`### :warning: ${check.getName()}\n\n${this.getMessage(result.message)}`);
            break;
          case 'success':
            checkResults.push(`### :heavy_check_mark: ${check.getName()}\n\n${this.getMessage(result.message)}`);
            break;
        }
      }
      catch (e) {
        checkResults.push(`### :x: ${check.getName()}\n\n${codeBlock(e.stack, 'js')}`);
      }
    }

    if (checkResults.length > 0) {
      if (failed) {
        DangerUtils.fail('Found some issues !');
      }
      DangerUtils.markdown('## Executed Checks\n\n' + checkResults.join('\n\n'));
    }
  }
}