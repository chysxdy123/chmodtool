export type CommonFix = {
  slug: string;
  title: string;
  summary: string;
};

export const commonFixes: CommonFix[] = [
  {
    slug: 'fix/ssh-key-permissions-too-open',
    title: 'SSH key permissions too open',
    summary:
      'Fix private key, authorized_keys, config, and .ssh directory modes.',
  },
];
