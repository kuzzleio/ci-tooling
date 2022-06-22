import {danger, message} from 'danger';

 
async function main() {
  const base = danger.github.pr.base.ref;
  const head = danger.github.pr.head.ref;
  message(`${base} -> ${head} [${process.env.RULES}]`);
}

main();