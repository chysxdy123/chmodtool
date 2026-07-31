import {
  octalToSymbolic,
  parseOctal,
  permissionParties,
} from '@/lib/permission-engine';

type PermissionBreakdownProps = {
  mode: string;
};

const partyLabels = {
  owner: 'Owner',
  group: 'Group',
  others: 'Other',
} as const;

export function PermissionBreakdown({ mode }: PermissionBreakdownProps) {
  parseOctal(mode);
  const symbolic = octalToSymbolic(mode);
  const accessDigits = mode.slice(-3);

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
              <strong>{accessDigits[index]}</strong>
              <code>{triplet}</code>
            </div>
          );
        })}
      </div>
    </section>
  );
}
