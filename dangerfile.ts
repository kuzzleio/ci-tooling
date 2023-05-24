import yaml from 'yaml';
import * as fs from 'fs/promises';
import { DangerRunner } from './lib/DangerRunner';
import { DangerUtils } from './lib/utils/DangerUtils';
import { DangerConfig } from './lib/types/DangerConfig';
import { codeBlock } from './lib/utils/Markdown';


DangerUtils.schedule(async () => {
  if (! process.env.DANGER_CONFIG) {
    return;
  }

  try {
    const buffer = await fs.readFile(DangerUtils.getRepositoryPath(process.env.DANGER_CONFIG), 'utf8');
    const config = yaml.parse(buffer.toString()) as DangerConfig;

    console.log(`Using Config File: ${JSON.stringify(config, null, 2)}`);
    const dangerRun = new DangerRunner(config);
    await dangerRun.run();
  } catch (e) {
    console.error(`Failed to read ${process.env.DANGER_CONFIG}: ${e.stack}`);
    DangerUtils.fail(`Failed to read ${process.env.DANGER_CONFIG}: ${e.stack}`);
    DangerUtils.markdown(codeBlock(e.stack, 'js'));
    return;
  }
});