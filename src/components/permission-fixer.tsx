'use client';

import { useState } from 'react';
import { CopyCommandButton } from '@/components/copy-command-button';
import { PermissionWidget } from '@/components/permission-widget';
import type { PermissionFixTarget } from '@/content/permission-fix-target';
import type { CopyCommandType } from '@/lib/analytics';
import { describePermission } from '@/lib/permission-engine';

type PermissionFixerProps = {
  targets: readonly PermissionFixTarget[];
  kicker: string;
  title: string;
  selectLabel: string;
  selectId: string;
  commandType: CopyCommandType;
};

export function PermissionFixer({
  targets,
  kicker,
  title,
  selectLabel,
  selectId,
  commandType,
}: PermissionFixerProps) {
  const [targetId, setTargetId] = useState(targets[0].id);
  const target = targets.find((item) => item.id === targetId) ?? targets[0];

  return (
    <section className="ssh-fixer" aria-labelledby={`${selectId}-title`}>
      <div className="ssh-fixer-heading">
        <p className="section-kicker">{kicker}</p>
        <h2 id={`${selectId}-title`}>{title}</h2>
        <label htmlFor={selectId}>{selectLabel}</label>
        <select
          id={selectId}
          value={targetId}
          onChange={(event) => setTargetId(event.currentTarget.value)}
        >
          {targets.map((item) => (
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
            commandType={commandType}
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
