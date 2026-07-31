import { PermissionFixer } from '@/components/permission-fixer';
import { sshPermissionTargets } from '@/content/ssh-permission-fixes';

export function SshPermissionFixer() {
  return (
    <PermissionFixer
      targets={sshPermissionTargets}
      kicker="Choose the file that failed"
      title="Get the correct SSH permission command"
      selectLabel="File or directory type"
      selectId="ssh-file-type"
      commandType="ssh-fix"
    />
  );
}
