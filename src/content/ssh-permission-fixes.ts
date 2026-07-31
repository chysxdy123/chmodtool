export type SshPermissionTarget = {
  id: string;
  label: string;
  octal: string;
  command: string;
  note: string;
};

export const sshPermissionTargets: SshPermissionTarget[] = [
  {
    id: 'private-key',
    label: 'id_rsa / id_ed25519 (private key)',
    octal: '600',
    command: 'chmod 600 ~/.ssh/id_rsa',
    note: 'Use the actual private-key filename if it is not id_rsa. Never apply this command to the matching .pub file.',
  },
  {
    id: 'public-key',
    label: '*.pub (public key)',
    octal: '644',
    command: 'chmod 644 ~/.ssh/id_rsa.pub',
    note: 'Public keys are designed to be shared, so read access for group and other users is acceptable.',
  },
  {
    id: 'authorized-keys',
    label: 'authorized_keys',
    octal: '600',
    command: 'chmod 600 ~/.ssh/authorized_keys',
    note: 'OpenSSH also accepts 644 in common configurations, but 600 is the safer owner-only default.',
  },
  {
    id: 'known-hosts',
    label: 'known_hosts',
    octal: '644',
    command: 'chmod 644 ~/.ssh/known_hosts',
    note: 'known_hosts contains public host keys and normally does not need to be private.',
  },
  {
    id: 'config',
    label: 'config',
    octal: '600',
    command: 'chmod 600 ~/.ssh/config',
    note: 'SSH config can reveal internal hosts and usernames, so owner-only access is a conservative default.',
  },
  {
    id: 'ssh-directory',
    label: '~/.ssh directory',
    octal: '700',
    command: 'chmod 700 ~/.ssh',
    note: 'Directories need execute permission for traversal. 700 keeps the directory accessible only to its owner.',
  },
];
