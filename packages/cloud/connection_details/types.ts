export interface ConnectionDetailsOpts {
  links?: ConnectionDetailsOptsLinks;
  endpoints?: ConnectionDetailsOptsEndpoints;
  apiKeys?: ConnectionDetailsOptsApiKeys;
}


export interface ConnectionDetailsOptsLinks {
  learnMore?: string;
  manageApiKeys?: string;
}

export interface ConnectionDetailsOptsEndpoints {
  url?: string;
  id?: string;
}

export interface ConnectionDetailsOptsApiKeys {
  createKey: (name: string) => Promise<{key: string}>;
}
