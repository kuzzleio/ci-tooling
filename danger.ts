import yaml from 'yaml';
import { schedule } from 'danger';
import fs from 'fs';

schedule(async () => {
  console.log(__dirname);
  console.log(process.env.GITHUB_REPOSITORY);
  console.log(process.env.GITHUB_REF_NAME);
  console.log(process.env.GITHUB_REF);
  console.log(process.env.GITHUB_PATH);
  console.log(process.env.GITHUB_WORKSPACE);
  console.log(process.env.GITHUB_HEAD_REF);
  console.log(process.env.GITHUB_BASE_REF);
  console.log(process.env.DANGER_CONFIG);
  const path = `${process.env.GITHUB_WORKSPACE}/${process.env.GITHUB_REPOSITORY}`;
  console.log(path);
  console.log(fs.existsSync(path));
});