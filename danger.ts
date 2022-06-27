import yaml from 'yaml';
import { schedule } from 'danger';

schedule(async () => {
  console.log(__dirname);
  console.log(process.env.DANGER_CONFIG);
  throw 'My Error';
});