import {danger, fail, markdown} from 'danger';

function checkBypass(baseBranch: string, body: string): boolean {
  if (! body) {
    return false;
  }

  const allowedBranch = body.match(/ci-allow-merge-into *: *(\S+)/);
  return allowedBranch ? allowedBranch![1] === baseBranch : false;
}

async function main() {
  const base = danger.github.pr.base.ref;
  const head = danger.github.pr.head.ref;
  const body = danger.github.pr.body;

  if (! process.env.RULES || checkBypass(base, body)) {
    return;
  }

  const rules = JSON.parse(process.env.RULES);
  
  if (! rules[base]) {
    return;
  }

  const allowedBranches = rules[base];

  if ((Array.isArray(allowedBranches) && ! allowedBranches.includes(head))
    || (typeof allowedBranches === 'string' && allowedBranches !== head)
  ) {

    fail(`Merging "${head}" into "${base}" is not allowed.`);
    markdown(`
    If you want to allow this PR to be merged into "${base}", add the following line to your PR body:
    \`\`\`
    ci-allow-merge-into: ${base}
    \`\`\`
    `);
    return;
  }
}

main();