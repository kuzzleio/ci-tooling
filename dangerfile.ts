import {danger, message} from 'danger';

 
async function main() {
  const tsFiles = danger.git.created_files.filter(e => e.endsWith('.ts'));

  for (const file in tsFiles) {
    const content = await danger.github.utils.fileContents(file);
    await message(content);
  }
}

main();