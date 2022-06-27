export type BranchMergeConfig = {
  branches: {
    [branch: string]: string | string[];
  };
};

export type DangerConfig = {
  checks: {
    'branch-merge-check'?: BranchMergeConfig;
  };
};