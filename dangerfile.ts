import {danger, warn, message} from 'danger';

 
async function main() {
  const tsFiles = danger.git.created_files.filter(e => e.endsWith('.ts'));

  for (let i = 0; i < 10; i++) {
    await message(''+i);
  }

  for (const file in tsFiles) {

    const jsonDiff = await danger.git.JSONDiffForFile(file);
    await message(JSON.stringify(jsonDiff, null, 2));
  }
}

main();