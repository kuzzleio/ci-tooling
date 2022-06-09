import {danger, warn, message} from 'danger';

  
// No PR is too small to include a description of why you made a change
message(danger.git.modified_files.join('\n'));