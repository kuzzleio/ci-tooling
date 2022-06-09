import {danger, message} from 'danger';
import * as fs from 'fs';

 
async function main() {
  const tsFiles = danger.git.created_files.filter(e => e.endsWith('.ts'));

  for (const file of tsFiles) {
    const jsonDiff = await danger.git.structuredDiffForFile(file);
    message('```json\n' + JSON.stringify(jsonDiff, null, 2) + '\n```');
  }
}

main();