import {danger, message} from 'danger';

 
async function main() {
  const base = danger.git.base;
  const head = danger.git.head;
  message(`${base} -> ${head}`);
}

main();