import {danger, message} from 'danger';
import * as fs from 'fs';

 
async function main() {
  const tsFiles = danger.git.created_files.filter(e => e.endsWith('.ts'));

  for (const file of tsFiles) {
    console.log(`./${file}`);
    const jsonDiff = await danger.git.structuredDiffForFile(file);
    message(`./${file}`);
    const content = fs.readFileSync(`./${file}`).toString();
    message(content);
    message(JSON.stringify(jsonDiff, null, 2));
  }
}

main();