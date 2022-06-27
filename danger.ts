import yaml from 'yaml';
import { schedule } from 'danger';

schedule(async () => {
  console.log(__dirname);
  console.log(process.env.REPOSITORY);
  console.log(process.env.GITHUB_REF_NAME);
  console.log(process.env.GITHUB_REF);
  console.log(process.env.GITHUB_PATH);
  console.log(process.env.GITHUB_WORKSPACE);
  console.log(process.env.GITHUB_HEAD_REF);
  console.log(process.env.GITHUB_BASE_REF);
  console.log(process.env.DANGER_CONFIG);
});