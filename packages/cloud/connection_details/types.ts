export interface ConnectionDetailsOpts {
  links?: ConnectionDetailsOptsLinks;
  endpoints?: ConnectionDetailsOptsEndpoints;
  apiKeys?: ConnectionDetailsOptsApiKeys;
}


export interface ConnectionDetailsOptsLinks {
  learnMore?: string;
}

export interface ConnectionDetailsOptsEndpoints {
  url?: string;
  id?: string;
}

export interface ConnectionDetailsOptsApiKeys {
  manageKeysLink?: string;
  createKey: (name: string) => Promise<{key: string}>;
}
