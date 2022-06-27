import { JSONObject } from './JSONObject';

export type CheckResult = {
  type: 'message' | 'fail' | 'warn' | 'success';
  message: string;
};

export abstract class DangerCheck {

  protected config: JSONObject;

  // Name of the Check that will show up in Github
  protected name?: string;

  constructor (config: JSONObject) {
    this.config = config;
  }

  abstract run (): Promise<CheckResult>;

  getName(): string {
    return this.name || this.constructor.name;
  }
}