import yaml from 'yaml';
import { schedule } from 'danger';

schedule(async () => {
  throw 'My Error';
});