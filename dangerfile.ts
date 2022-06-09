import {danger, warn, message} from 'danger';

  
// No PR is too small to include a description of why you made a change
message(danger.git.created_files.join('\n'));