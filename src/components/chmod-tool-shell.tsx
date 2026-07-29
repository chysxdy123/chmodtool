'use client';

import { useId, useState } from 'react';
import { CopyCommandButton } from '@/components/copy-command-button';
import messages from '@/i18n/messages/en.json';
import {
  getPermissionRisk,
  parseOctalMode,
  parseSymbolicMode,
  permissionNames,
  permissionParties,
  permissionsToOctal,
  permissionsToSymbolic,
  permissionsToSymbolicExpression,
  setPermission,
  type PermissionMatrix,
} from '@/lib/chmod';

function createInitialPermissions(initialMode: string): PermissionMatrix {
  const permissions = parseOctalMode(initialMode);

  if (!permissions) {
    throw new Error(`The initial chmod mode "${initialMode}" must be valid.`);
  }

  return permissions;
}

const partyLabels = messages.tool.parties;
const permissionLabels = messages.tool.permissions;

type ChmodToolShellProps = {
  initialMode?: string;
  variant?: 'full' | 'compact';
};

export function ChmodToolShell({
  initialMode = '755',
  variant = 'full',
}: ChmodToolShellProps) {
  const idPrefix = useId().replaceAll(':', '');
  const [permissions, setPermissions] = useState<PermissionMatrix>(() =>
    createInitialPermissions(initialMode)
  );
  const [octalInput, setOctalInput] = useState(initialMode);
  const [symbolicInput, setSymbolicInput] = useState(() =>
    permissionsToSymbolic(createInitialPermissions(initialMode))
  );

  const octal = permissionsToOctal(permissions);
  const symbolicExpression = permissionsToSymbolicExpression(permissions);
  const numericCommand = `chmod ${octal} filename`;
  const symbolicCommand = `chmod ${symbolicExpression} filename`;
  const risk = getPermissionRisk(permissions);
  const octalIsValid = parseOctalMode(octalInput) !== null;
  const symbolicIsValid = parseSymbolicMode(symbolicInput) !== null;

  function updatePermissions(nextPermissions: PermissionMatrix) {
    setPermissions(nextPermissions);
    setOctalInput(permissionsToOctal(nextPermissions));
    setSymbolicInput(permissionsToSymbolic(nextPermissions));
  }

  function handleOctalChange(value: string) {
    setOctalInput(value);
    const nextPermissions = parseOctalMode(value);

    if (nextPermissions) {
      updatePermissions(nextPermissions);
    }
  }

  function handleSymbolicChange(value: string) {
    setSymbolicInput(value);
    const nextPermissions = parseSymbolicMode(value);

    if (nextPermissions) {
      updatePermissions(nextPermissions);
    }
  }

  return (
    <section
      id="chmod-tool"
      className={`tool-shell ${variant === 'compact' ? 'compact-tool' : ''}`}
      aria-label="chmod calculator"
      data-tool-root
    >
      <div className="calculator-flow">
        <section
          className="notation-editor"
          aria-labelledby={`${idPrefix}-notation-title`}
        >
          <p className="section-kicker">{messages.tool.notationKicker}</p>
          <h2 id={`${idPrefix}-notation-title`}>
            {messages.tool.notationTitle}
          </h2>

          <div className="notation-workspace">
            <div className="octal-workspace">
              <label
                className="notation-field"
                htmlFor={`${idPrefix}-octal-mode`}
              >
                <span>{messages.tool.octalLabel}</span>
                <input
                  id={`${idPrefix}-octal-mode`}
                  className="octal-input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  spellCheck="false"
                  maxLength={3}
                  pattern="[0-7]{3}"
                  value={octalInput}
                  aria-invalid={!octalIsValid}
                  aria-describedby={
                    octalIsValid
                      ? `${idPrefix}-octal-help`
                      : `${idPrefix}-octal-help ${idPrefix}-octal-error`
                  }
                  onChange={(event) =>
                    handleOctalChange(event.currentTarget.value)
                  }
                />
              </label>
              <p id={`${idPrefix}-octal-help`} className="field-help">
                {messages.tool.octalHelp}
              </p>
              {!octalIsValid && (
                <p id={`${idPrefix}-octal-error`} className="field-error">
                  {messages.tool.octalError}
                </p>
              )}

              {variant === 'full' && (
                <div
                  className="preset-control"
                  role="group"
                  aria-labelledby={`${idPrefix}-presets-label`}
                >
                  <span
                    id={`${idPrefix}-presets-label`}
                    className="control-label"
                  >
                    {messages.tool.presetsLabel}
                  </span>
                  <div className="preset-list">
                    {messages.tool.presets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className={[
                          'preset-button',
                          octal === preset ? 'active' : '',
                          preset === '777' ? 'risky' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        aria-pressed={octal === preset}
                        onClick={() => {
                          const nextPermissions = parseOctalMode(preset);
                          if (nextPermissions)
                            updatePermissions(nextPermissions);
                        }}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="symbolic-workspace">
              <label
                className="notation-field"
                htmlFor={`${idPrefix}-symbolic-mode`}
              >
                <span>{messages.tool.symbolicLabel}</span>
                <input
                  id={`${idPrefix}-symbolic-mode`}
                  className="symbolic-input"
                  type="text"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  maxLength={10}
                  value={symbolicInput}
                  aria-invalid={!symbolicIsValid}
                  aria-describedby={
                    !symbolicIsValid ? `${idPrefix}-symbolic-error` : undefined
                  }
                  onChange={(event) =>
                    handleSymbolicChange(
                      event.currentTarget.value.toLowerCase()
                    )
                  }
                />
              </label>
              {!symbolicIsValid && (
                <p id={`${idPrefix}-symbolic-error`} className="field-error">
                  {messages.tool.symbolicError}
                </p>
              )}
            </div>
          </div>
        </section>

        <section
          className="permission-editor"
          aria-labelledby={`${idPrefix}-permissions-title`}
        >
          <p className="section-kicker">{messages.tool.permissionKicker}</p>
          <h2 id={`${idPrefix}-permissions-title`}>
            {messages.tool.permissionTitle}
          </h2>

          <div className="permission-groups">
            {permissionParties.map((party) => (
              <fieldset className="permission-group" key={party}>
                <legend>{partyLabels[party].label}</legend>
                <p>{partyLabels[party].description}</p>
                <div className="permission-options">
                  {permissionNames.map((permission) => (
                    <label className="permission-option" key={permission}>
                      <input
                        type="checkbox"
                        checked={permissions[party][permission]}
                        onChange={(event) =>
                          updatePermissions(
                            setPermission(
                              permissions,
                              party,
                              permission,
                              event.currentTarget.checked
                            )
                          )
                        }
                      />
                      <span>{permissionLabels[permission]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </section>
      </div>

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
          aria-labelledby={`${idPrefix}-commands-title`}
        >
          <div className="command-heading">
            <p className="section-kicker">{messages.tool.commandKicker}</p>
            <h2 id={`${idPrefix}-commands-title`}>
              {messages.tool.commandTitle}
            </h2>
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
              />
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
