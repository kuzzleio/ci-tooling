import { CheckResult, DangerCheck } from '../../lib/DangerCheck';
import { DangerUtils } from '../../lib/utils/DangerUtils';
import { BrokenLinkConfig, DangerConfig } from '../../lib/types/DangerConfig';
import { backquote, codeBlock } from '../../lib/utils/Markdown';
import * as fs from 'fs/promises';
import * as Path from 'path';
import * as glob from 'fast-glob';


export default class BrokenLinkCheck extends DangerCheck {
  private checkConfig: BrokenLinkConfig;

  constructor (config: DangerConfig) {
    super(config);
    this.checkConfig = config.checks['broken-link-check']!;
  }

  async run(): Promise<CheckResult> {
    if (!this.checkConfig.path) {
      return {
        type: 'warn',
        message: [
          'No "path" to the documentation has been configured'
        ]
      };
    }
    
    const path = DangerUtils.getRepositoryPath(this.checkConfig.path);

    const files = await glob(Path.join(path, '**', '*.md'))

    return {
      type: 'success',
      message: files
    };
  }
}