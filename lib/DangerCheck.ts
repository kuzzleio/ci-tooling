import { JSONObject } from './JSONObject';
import { DangerConfig } from './types/DangerConfig';

export type CheckResult = {
  type: 'message' | 'fail' | 'warn' | 'success';
  message: string | string[];
};

export abstract class DangerCheck {

  protected config: DangerConfig;

  // Name of the Check that will show up in Github
  protected name?: string;

  constructor (config: DangerConfig) {
    this.config = config;
  }

  abstract run (): Promise<CheckResult>;

  getName (): string {
    return this.name || this.constructor.name;
  }
}