import type { PermissionFixTarget } from './permission-fix-target';

export const pemPermissionTargets: PermissionFixTarget[] = [
  {
    id: 'pem-private-key',
    label: '.pem private key (chmod 400)',
    octal: '400',
    command: 'chmod 400 mykey.pem',
    note: 'Replace mykey.pem with the path to the key pair you downloaded from AWS. Mode 400 lets only you read the file.',
  },
  {
    id: 'key-directory',
    label: 'Directory storing the key',
    octal: '700',
    command: 'chmod 700 ~/.ssh',
    note: 'A private key stored in ~/.ssh also needs a directory that other local users cannot enter or change.',
  },
  {
    id: 'ssh-config',
    label: 'SSH config',
    octal: '600',
    command: 'chmod 600 ~/.ssh/config',
    note: 'SSH config may contain hostnames and usernames. Owner-only read and write access is a conservative default.',
  },
];
