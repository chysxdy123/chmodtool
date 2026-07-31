'use client';

import { useState } from 'react';
import { CopyCommandButton } from '@/components/copy-command-button';
import { PermissionWidget } from '@/components/permission-widget';
import { sshPermissionTargets } from '@/content/ssh-permission-fixes';
import { describePermission } from '@/lib/permission-engine';

export function SshPermissionFixer() {
  const [targetId, setTargetId] = useState(sshPermissionTargets[0].id);
  const target =
    sshPermissionTargets.find((item) => item.id === targetId) ??
    sshPermissionTargets[0];

  return (
    <section className="ssh-fixer" aria-labelledby="ssh-fixer-title">
      <div className="ssh-fixer-heading">
        <p className="section-kicker">Choose the file that failed</p>
        <h2 id="ssh-fixer-title">Get the correct SSH permission command</h2>
        <label htmlFor="ssh-file-type">File or directory type</label>
        <select
          id="ssh-file-type"
          value={targetId}
          onChange={(event) => setTargetId(event.currentTarget.value)}
        >
          {sshPermissionTargets.map((item) => (
            <option value={item.id} key={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="ssh-fixer-output" aria-live="polite">
        <div className="ssh-recommendation">
          <span>Recommended mode</span>
          <strong>{target.octal}</strong>
        </div>
        <div className="ssh-command-row">
          <code>{target.command}</code>
          <CopyCommandButton
            command={target.command}
            ariaLabel={`Copy ${target.command}`}
            commandType="ssh-fix"
          />
        </div>
        <p>{target.note}</p>
        <ul className="permission-description">
          {describePermission(target.octal).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      <div className="ssh-widget-wrap">
        <PermissionWidget
          key={target.id}
          initialOctal={target.octal}
          mode="display"
          showPresets={false}
        />
      </div>
    </section>
  );
}
