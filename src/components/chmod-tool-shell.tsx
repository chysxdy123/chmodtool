'use client';

import { useEffect, useRef, useState } from 'react';
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

function createDefaultPermissions(): PermissionMatrix {
  const permissions = parseOctalMode('755');

  if (!permissions) {
    throw new Error('The default chmod mode must be valid.');
  }

  return permissions;
}

const defaultPermissions = createDefaultPermissions();

const partyLabels = messages.tool.parties;
const permissionLabels = messages.tool.permissions;

type CopyTarget = 'numeric' | 'symbolic';

export function ChmodToolShell() {
  const [permissions, setPermissions] =
    useState<PermissionMatrix>(defaultPermissions);
  const [octalInput, setOctalInput] = useState('755');
  const [symbolicInput, setSymbolicInput] = useState('-rwxr-xr-x');
  const [copiedTarget, setCopiedTarget] = useState<CopyTarget | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);
  const copyResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetTimer.current) {
        clearTimeout(copyResetTimer.current);
      }
    };
  }, []);

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

  async function copyCommand(command: string, target: CopyTarget) {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedTarget(target);
      setCopyFailed(false);
    } catch {
      setCopiedTarget(null);
      setCopyFailed(true);
    }

    if (copyResetTimer.current) {
      clearTimeout(copyResetTimer.current);
    }

    copyResetTimer.current = setTimeout(() => {
      setCopiedTarget(null);
      setCopyFailed(false);
    }, 2000);
  }

  return (
    <section
      id="chmod-tool"
      className="tool-shell"
      aria-label="chmod calculator"
      data-tool-root
    >
      <div className="calculator-flow">
        <section className="notation-editor" aria-labelledby="notation-title">
          <p className="section-kicker">{messages.tool.notationKicker}</p>
          <h2 id="notation-title">{messages.tool.notationTitle}</h2>

          <div className="notation-workspace">
            <div className="octal-workspace">
              <label className="notation-field" htmlFor="octal-mode">
                <span>{messages.tool.octalLabel}</span>
                <input
                  id="octal-mode"
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
                    octalIsValid ? 'octal-help' : 'octal-help octal-error'
                  }
                  onChange={(event) =>
                    handleOctalChange(event.currentTarget.value)
                  }
                />
              </label>
              <p id="octal-help" className="field-help">
                {messages.tool.octalHelp}
              </p>
              {!octalIsValid && (
                <p id="octal-error" className="field-error">
                  {messages.tool.octalError}
                </p>
              )}

              <div
                className="preset-control"
                role="group"
                aria-labelledby="presets-label"
              >
                <span id="presets-label" className="control-label">
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
                        if (nextPermissions) updatePermissions(nextPermissions);
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="symbolic-workspace">
              <label className="notation-field" htmlFor="symbolic-mode">
                <span>{messages.tool.symbolicLabel}</span>
                <input
                  id="symbolic-mode"
                  className="symbolic-input"
                  type="text"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  maxLength={10}
                  value={symbolicInput}
                  aria-invalid={!symbolicIsValid}
                  aria-describedby={
                    !symbolicIsValid ? 'symbolic-error' : undefined
                  }
                  onChange={(event) =>
                    handleSymbolicChange(
                      event.currentTarget.value.toLowerCase()
                    )
                  }
                />
              </label>
              {!symbolicIsValid && (
                <p id="symbolic-error" className="field-error">
                  {messages.tool.symbolicError}
                </p>
              )}
            </div>
          </div>
        </section>

        <section
          className="permission-editor"
          aria-labelledby="permissions-title"
        >
          <p className="section-kicker">{messages.tool.permissionKicker}</p>
          <h2 id="permissions-title">{messages.tool.permissionTitle}</h2>

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

      <section className="command-output" aria-labelledby="commands-title">
        <div className="command-heading">
          <p className="section-kicker">{messages.tool.commandKicker}</p>
          <h2 id="commands-title">{messages.tool.commandTitle}</h2>
        </div>
        <div className="command-list">
          <div className="command-row">
            <div>
              <span>{messages.tool.numericCommandLabel}</span>
              <code>{numericCommand}</code>
            </div>
            <button
              type="button"
              className="copy-button"
              onClick={() => copyCommand(numericCommand, 'numeric')}
            >
              {copiedTarget === 'numeric'
                ? messages.tool.copiedButton
                : messages.tool.copyButton}
            </button>
          </div>
          <div className="command-row">
            <div>
              <span>{messages.tool.symbolicCommandLabel}</span>
              <code>{symbolicCommand}</code>
            </div>
            <button
              type="button"
              className="copy-button"
              onClick={() => copyCommand(symbolicCommand, 'symbolic')}
            >
              {copiedTarget === 'symbolic'
                ? messages.tool.copiedButton
                : messages.tool.copyButton}
            </button>
          </div>
          <p className="copy-status" aria-live="polite">
            {copyFailed ? messages.tool.copyError : ''}
          </p>
        </div>
      </section>
    </section>
  );
}
