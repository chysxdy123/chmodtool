import {
  parseOctalMode,
  permissionParties,
  permissionsToSymbolic,
} from '@/lib/chmod';

type PermissionBreakdownProps = {
  mode: string;
};

const partyLabels = {
  owner: 'Owner',
  group: 'Group',
  other: 'Other',
} as const;

export function PermissionBreakdown({ mode }: PermissionBreakdownProps) {
  const permissions = parseOctalMode(mode);

  if (!permissions) {
    throw new Error(`The chmod mode "${mode}" must be valid.`);
  }

  const symbolic = permissionsToSymbolic(permissions).slice(1);

  return (
    <section className="permission-breakdown" aria-labelledby="breakdown-title">
      <div className="breakdown-heading">
        <p className="section-kicker">Permission breakdown</p>
        <h2 id="breakdown-title">
          <code>{mode}</code> = <code>{symbolic}</code>
        </h2>
      </div>
      <div className="breakdown-groups">
        {permissionParties.map((party, index) => {
          const triplet = symbolic.slice(index * 3, index * 3 + 3);

          return (
            <div className="breakdown-group" key={party}>
              <span>{partyLabels[party]}</span>
              <strong>{mode[index]}</strong>
              <code>{triplet}</code>
            </div>
          );
        })}
      </div>
    </section>
  );
}
