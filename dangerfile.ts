import {danger, message} from 'danger';
import * as fs from 'fs';

 
async function main() {
  const tsFiles = danger.git.created_files.filter(e => e.endsWith('.ts'));

  for (const file in tsFiles) {
    message(`./${file}`);
    const content = fs.readFileSync(`./${file}`).toString();
    message(content);
  }
}

main();