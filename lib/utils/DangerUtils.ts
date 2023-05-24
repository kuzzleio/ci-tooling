import { GitHubDSL } from 'danger/distribution/dsl/GitHubDSL';
import { GitDSL } from 'danger/distribution/dsl/GitDSL';
import * as Path from 'path';

type CallbackableFn = (callback: (done: any) => void) => void

type Scheduleable = Promise<any> | Promise<void> | CallbackableFn

/**
 * Since DangerJS is doing so many ugly hacks to make it work on the CLI
 * where it injects itself in the global scope, and we cannot import danger
 * otherwise it will fail to load the danger script.
 * 
 * So to allow TypeScript to compile the danger script, we need to
 * create some types that are compatible with the danger script and that will allow us to
 * use the global methods without importing danger since it's injected.
 */
export class DangerUtils {
  static fail (message: string, file?: string, line?: number): void {
    // @ts-ignore
    fail(message, file, line);
  }

  static warn (message: string, file?: string, line?: number): void {
    // @ts-ignore
    warn(message, file, line);
  }

  static message (message: string, file?: string, line?: number): void {
    // @ts-ignore
    message(message, file, line);
  }

  static markdown (message: string): void {
    // @ts-ignore
    markdown(message);
  }
  
  static get github (): GitHubDSL {
    // @ts-ignore
    return danger.github;
  }
  
  static get git (): GitDSL {
    // @ts-ignore
    return danger.git;
  }

  static schedule (schedulable: Scheduleable): void {
    // @ts-ignore
    schedule(schedulable);
  }

  static getRepositoryPath (path: string): string {
    return Path.join(process.env.GITHUB_WORKSPACE ?? '', process.env.SOURCE_FOLDER ?? '', path);
  }

  static reverseRepositoryPath (path: string): string {
    const folder = Path.join(process.env.GITHUB_WORKSPACE ?? '', process.env.SOURCE_FOLDER ?? '');

    return path.substring(folder.length + Path.sep.length);
  }

}