'use client';

import { useState } from 'react';
import { CopyCommandButton } from '@/components/copy-command-button';
import { PermissionWidget } from '@/components/permission-widget';
import messages from '@/i18n/messages/en.json';
import {
  getPermissionRisk,
  parseOctal,
  permissionsToSymbolicExpression,
} from '@/lib/permission-engine';

type ChmodToolShellProps = {
  initialMode?: string;
  variant?: 'full' | 'compact';
};

export function ChmodToolShell({
  initialMode = '755',
  variant = 'full',
}: ChmodToolShellProps) {
  const [octal, setOctal] = useState(() => {
    parseOctal(initialMode);
    return initialMode;
  });
  const permissions = parseOctal(octal);
  const symbolicExpression = permissionsToSymbolicExpression(permissions);
  const numericCommand = `chmod ${octal} filename`;
  const symbolicCommand = `chmod ${symbolicExpression} filename`;
  const risk = getPermissionRisk(permissions);

  return (
    <section
      id="chmod-tool"
      className={`tool-shell ${variant === 'compact' ? 'compact-tool' : ''}`}
      aria-label="chmod calculator"
      data-tool-root
    >
      <PermissionWidget
        initialOctal={initialMode}
        onChanged={setOctal}
        showPresets={variant === 'full'}
      />

      {(risk.isFullyOpen || risk.isOtherWritable) && (
        <div className="risk-notice" role="status" aria-live="polite">
          <strong>{messages.tool.riskTitle}</strong>
          <span>
            {risk.isFullyOpen
              ? messages.tool.riskFullyOpen
              : messages.tool.riskOtherWritable}
          </span>
        </div>
      )}

      {variant === 'full' && (
        <section
          className="command-output"
          aria-labelledby="chmod-commands-title"
        >
          <div className="command-heading">
            <p className="section-kicker">{messages.tool.commandKicker}</p>
            <h2 id="chmod-commands-title">{messages.tool.commandTitle}</h2>
          </div>
          <div className="command-list">
            <div className="command-row">
              <div>
                <span>{messages.tool.numericCommandLabel}</span>
                <code>{numericCommand}</code>
              </div>
              <CopyCommandButton
                command={numericCommand}
                ariaLabel={`Copy ${numericCommand}`}
                commandType="octal"
              />
            </div>
            <div className="command-row">
              <div>
                <span>{messages.tool.symbolicCommandLabel}</span>
                <code>{symbolicCommand}</code>
              </div>
              <CopyCommandButton
                command={symbolicCommand}
                ariaLabel={`Copy ${symbolicCommand}`}
                commandType="symbolic"
              />
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
