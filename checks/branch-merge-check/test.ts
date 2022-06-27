import { CheckResult, DangerCheck } from '../../lib/DangerCheck';
import { DangerUtils } from '../../lib/utils/DangerUtils';
import { BranchMergeConfig, DangerConfig } from '../../lib/types/DangerConfig';
import { codeBlock } from '../../lib/utils/Markdown';

export default class BranchMergeCheck extends DangerCheck {

  protected checkConfig: BranchMergeConfig;

  constructor (config: DangerConfig) {
    super(config);
    this.checkConfig = config.checks['branch-merge-check']!;
  }

  private checkBypass(baseBranch: string, body: string): boolean {
    if (! body) {
      return false;
    }
  
    const allowedBranch = body.match(/ci-allow-merge-into *: *(\S+)/);
    return allowedBranch ? allowedBranch![1] === baseBranch : false;
  }

  private isMergeAllowed(head: string, base: string) {
    const allowedBranches = this.checkConfig.branches[base];

    if (Array.isArray(allowedBranches)) {
      const regexes = allowedBranches
        .filter(e => e.startsWith('/') && e.endsWith('/'))
        .map(e => new RegExp(e.slice(1, -1)));
      const strings = allowedBranches.filter(e => ! e.startsWith('/') || ! e.endsWith('/'));

      if (strings.includes(head)) {
        return true;
      }
      
      for (const regex of regexes) {
        if (regex.test(head)) {
          return true;
        }
      }

      return false;
    }

    if (typeof allowedBranches === 'string') {
      if (allowedBranches.startsWith('/') && allowedBranches.endsWith('/')) {
        return new RegExp(allowedBranches.slice(1, -1)).test(head);
      }
      return allowedBranches === head;
    }

    return true;
  }

  async run(): Promise<CheckResult> {
    const base = DangerUtils.github.pr.base.ref;
    const head = DangerUtils.github.pr.head.ref;
    const body = DangerUtils.github.pr.body;
    
    if ( ! this.checkConfig.branches
      || ! this.checkConfig.branches[base]
    ) {
      return {
        type: 'success',
      };
    }

    if (this.checkBypass(base, body)) {
      return {
        type: 'warn',
        message: codeBlock('Bypassed')
      };
    }
  
    if (! this.isMergeAllowed(head, base)) {
      return {
        type: 'fail',
        message: [
          `Merging "${head}" into "${base}" is not allowed.`,
          `If you want to allow this PR to be merged into "${base}", add the following line to your PR body:`,
          '\n',
          codeBlock(`ci-allow-merge-into: ${base}`)
        ],
      }
    }

    return {
      type: 'success',
    };
  }
}