import { CheckResult, DangerCheck } from '../../lib/DangerCheck';
import { DangerUtils } from '../../lib/utils/DangerUtils';
import { BrokenLinkConfig, DangerConfig } from '../../lib/types/DangerConfig';
import { backquote, codeBlock } from '../../lib/utils/Markdown';
import * as fs from 'fs/promises';
import * as Path from 'path';
import glob from 'fast-glob';
import axios from 'axios';

const MD_LINK_PATTERN = /\[.*?\]\((.*?)\)/gm;
const LINK_ACHOR_PATTERN = /(.+)\/#(.+)/gm;

type DocRepositoryConfig = {
  url: string,
  repo_name: string,
  doc_version: number,
  stable: string,
  dev: string,
  name: string,
  deploy_path: string,
};

enum LinkErrorType {
  DeployPathNotFound,
  MalformedAnchor,
};

type LinkError = {
  path: string,
  link: string,
  errorType: LinkErrorType,
  line: number,
  message?: string,
};

export default class BrokenLinkCheck extends DangerCheck {
  private checkConfig: BrokenLinkConfig;
  private repositoriesConfig: DocRepositoryConfig[] = [];

  constructor (config: DangerConfig) {
    super(config);
    this.checkConfig = config.checks['broken-link-check']!;
  }

  async checkLinksAtPath(path: string): Promise<LinkError[]> {
    const content = await fs.readFile(path, 'utf-8');
    const errors: LinkError[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const match of line.matchAll(MD_LINK_PATTERN)) {
        const link = match[1];
  
        // We only want to check links like "/core/2/..." not the external links
        if (!link.startsWith('/')) {
          continue;
        }
        
  
        let found = false;
        for (const repo of this.repositoriesConfig) {
          if (link.startsWith(repo.deploy_path)) {
            found = true;
            break;
          }
        }
  
        if (!found) {
          errors.push({
            path,
            link,
            line: i + 1,
            errorType: LinkErrorType.DeployPathNotFound,
          });
        }
  
        const anchorMatch = LINK_ACHOR_PATTERN.exec(link);
  
        if (anchorMatch) {
          errors.push({
            path,
            link,
            line: i + 1,
            errorType: LinkErrorType.MalformedAnchor,
            message: `"should be "${anchorMatch[1]}#${anchorMatch[2]}"`
          });
        }
      }
    }

    return errors;
  }

  async checkAllPath(paths: string[]): Promise<LinkError[]> {
    const errors: LinkError[] = [];
    let promises: Promise<LinkError[]>[] = [];
    
    for (const path of paths) {
      promises.push(this.checkLinksAtPath(path));

      if (promises.length === 100) {
        const result = await Promise.all(promises);

        for (const linkErrors of result) {
          for (const error of linkErrors) {
            errors.push(error);
          }
        }

        promises = [];
      }
    }

    if (promises.length > 0) {
      const result = await Promise.all(promises);

      for (const linkErrors of result) {
        for (const error of linkErrors) {
          errors.push(error);
        }
      }

      promises = [];
    }

    return errors;
  }

  async init(): Promise<void> {
    try {
      const response = await axios.get('https://raw.githubusercontent.com/kuzzleio/documentation/master/.repos/repositories.json');
      this.repositoriesConfig = response.data as DocRepositoryConfig[];
    } catch (e) {
      console.error(e);
    }
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

    const files = await glob(Path.join(path, '**', '*.md'));

    const errors = await this.checkAllPath(files);

    if (errors.length === 0) {
      return {
        type: 'success'
      };
    }

    const message: string[] = [];

    const deployPathError = errors.filter(e => e.errorType === LinkErrorType.DeployPathNotFound);

    if (deployPathError.length > 0) {
      message.push(...[
        '#### Wrong Deploy Path',
        'The following links are absolute links but does not point to any of our listed [repositories deploy path](https://raw.githubusercontent.com/kuzzleio/documentation/master/.repos/repositories.json)',
        ''
      ]);

      const linksCodeBlock: string[] = [];
      let lastPath = '';

      for (const error of deployPathError) {
        const path = DangerUtils.reverseRepositoryPath(error.path);
        if (lastPath !== path) {
          if (lastPath !== '') {
            linksCodeBlock.push('');
          }
          linksCodeBlock.push(`[File] ${path}`);
          lastPath = path;
        }
        linksCodeBlock.push(`- {line: ${error.line}} ${error.link}`);
      }

      message.push(codeBlock(linksCodeBlock.join('\n')));
      message.push('');
    }

    const anchorError = errors.filter(e => e.errorType === LinkErrorType.MalformedAnchor);

    if (anchorError.length > 0) {
      message.push(...[
        '#### Malformed Anchor',
        'The following links are malformed, they should be in the form of `/path/to/url#anchor`',
        'Malformed anchor will cause the parser to generate a broken link',
        ''
      ]);

      const linksCodeBlock: string[] = [];
      let lastPath = '';

      for (const error of anchorError) {
        const path = DangerUtils.reverseRepositoryPath(error.path);
        if (lastPath !== path) {
          if (lastPath === '') {
            linksCodeBlock.push('');
          }
          linksCodeBlock.push(`[File] ${path}`);
          lastPath = path;
        }
        linksCodeBlock.push(`- {line: ${error.line}} ${error.link} ${error.message ? `(${error.message})` : ''}`);
      }

      message.push(codeBlock(linksCodeBlock.join('\n')));
      message.push('');
    }

    return {
      type: 'warn',
      message
    }
  }
}