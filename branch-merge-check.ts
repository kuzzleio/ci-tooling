import {danger, message} from 'danger';

 
async function main() {
  const base = danger.github.pr.base;
  const head = danger.github.pr.head;
  message(`${base} -> ${head}`);
}

main();