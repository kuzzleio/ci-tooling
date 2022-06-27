import yaml from 'yaml';
import { schedule, fail } from 'danger';
import * as fs from 'fs/promises';
import { DangerRunner } from './lib/DangerRunner';


schedule(async () => {
  if (! process.env.DANGER_CONFIG) {
    return;
  }

  try {
    const buffer = await fs.readFile(`${process.env.GITHUB_WORKSPACE}/${process.env.SOURCE_FOLDER}/${process.env.DANGER_CONFIG}`, 'utf8');
    const config = yaml.parse(buffer.toString());

    const dangerRun = new DangerRunner(config);
    await dangerRun.run();
  } catch (e) {
    fail(`Failed to read ${process.env.DANGER_CONFIG}`);
    return;
  }
});