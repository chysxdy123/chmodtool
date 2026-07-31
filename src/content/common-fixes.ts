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
  {
    slug: 'fix/pem-file-permissions',
    title: 'PEM file permissions too open',
    summary: 'Fix AWS EC2 .pem keys with chmod 400 or Windows icacls commands.',
  },
];
