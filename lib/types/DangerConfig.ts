export type BranchMergeConfig = {
  branches: {
    [branch: string]: string | string[];
  };
};

export type BrokenLinkConfig = {
  path?: string;
};

export type DangerConfig = {
  checks: {
    'branch-merge-check'?: BranchMergeConfig;
    'broken-link-check'?: BrokenLinkConfig;
  };
};