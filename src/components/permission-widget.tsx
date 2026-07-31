'use client';

import { useId, useState } from 'react';
import messages from '@/i18n/messages/en.json';
import {
  parseOctal,
  parseSymbolicMode,
  permissionNames,
  permissionParties,
  permissionSetToOctal,
  permissionsToSymbolic,
  setPermission,
  tryParseOctal,
  type PermissionParty,
  type PermissionSet,
} from '@/lib/permission-engine';

export type PermissionWidgetProps = {
  initialOctal?: string;
  mode?: 'full' | 'display';
  onChanged?: (octal: string) => void;
  showPresets?: boolean;
};

const partyLabels: Record<
  PermissionParty,
  { label: string; description: string }
> = {
  owner: messages.tool.parties.owner,
  group: messages.tool.parties.group,
  others: messages.tool.parties.other,
};

const permissionLabels = messages.tool.permissions;

function createInitialPermissions(initialOctal: string): PermissionSet {
  try {
    return parseOctal(initialOctal);
  } catch {
    throw new Error(
      `The initial chmod mode "${initialOctal}" must be a valid three- or four-digit octal permission.`
    );
  }
}

export function PermissionWidget({
  initialOctal = '755',
  mode = 'full',
  onChanged,
  showPresets = mode === 'full',
}: PermissionWidgetProps) {
  const idPrefix = useId().replaceAll(':', '');
  const isDisplayOnly = mode === 'display';
  const [permissions, setPermissions] = useState<PermissionSet>(() =>
    createInitialPermissions(initialOctal)
  );
  const [octalInput, setOctalInput] = useState(initialOctal);
  const [symbolicInput, setSymbolicInput] = useState(() =>
    permissionsToSymbolic(createInitialPermissions(initialOctal))
  );

  const octal = permissionSetToOctal(permissions);
  const octalIsValid = tryParseOctal(octalInput) !== null;
  const symbolicIsValid = parseSymbolicMode(symbolicInput) !== null;

  function updatePermissions(nextPermissions: PermissionSet) {
    const nextOctal = permissionSetToOctal(nextPermissions);

    setPermissions(nextPermissions);
    setOctalInput(nextOctal);
    setSymbolicInput(permissionsToSymbolic(nextPermissions));
    onChanged?.(nextOctal);
  }

  function handleOctalChange(value: string) {
    setOctalInput(value);
    const nextPermissions = tryParseOctal(value);

    if (nextPermissions) updatePermissions(nextPermissions);
  }

  function handleSymbolicChange(value: string) {
    setSymbolicInput(value);
    const nextPermissions = parseSymbolicMode(value);

    if (nextPermissions) updatePermissions(nextPermissions);
  }

  return (
    <div
      className={`permission-widget ${isDisplayOnly ? 'display-widget' : ''}`}
      data-permission-widget
      data-mode={mode}
    >
      <div className="calculator-flow">
        <section
          className="notation-editor"
          aria-labelledby={`${idPrefix}-notation-title`}
        >
          <p className="section-kicker">{messages.tool.notationKicker}</p>
          <h2 id={`${idPrefix}-notation-title`}>
            {isDisplayOnly
              ? 'Recommended permission'
              : messages.tool.notationTitle}
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
                  maxLength={4}
                  pattern="(?:[0-7]{3}|[0-7]{4})"
                  value={octalInput}
                  readOnly={isDisplayOnly}
                  aria-readonly={isDisplayOnly}
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
                {octalInput.length === 4
                  ? 'Four digits include setuid, setgid, or the sticky bit.'
                  : messages.tool.octalHelp}
              </p>
              {!octalIsValid && (
                <p id={`${idPrefix}-octal-error`} className="field-error">
                  Enter three or four digits from 0 to 7.
                </p>
              )}

              {showPresets && !isDisplayOnly && (
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
                        onClick={() => updatePermissions(parseOctal(preset))}
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
                  readOnly={isDisplayOnly}
                  aria-readonly={isDisplayOnly}
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
            {isDisplayOnly ? 'Permission bits' : messages.tool.permissionTitle}
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
                        disabled={isDisplayOnly}
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
    </div>
  );
}
