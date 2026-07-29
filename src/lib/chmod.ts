export const permissionParties = ['owner', 'group', 'other'] as const;
export const permissionNames = ['read', 'write', 'execute'] as const;

export type PermissionParty = (typeof permissionParties)[number];
export type PermissionName = (typeof permissionNames)[number];

export type PermissionSet = Record<PermissionName, boolean>;
export type PermissionMatrix = Record<PermissionParty, PermissionSet>;

const partySymbols: Record<PermissionParty, string> = {
  owner: 'u',
  group: 'g',
  other: 'o',
};

const permissionBits: Record<PermissionName, number> = {
  read: 4,
  write: 2,
  execute: 1,
};

function octalDigitToPermissionSet(digit: number): PermissionSet {
  return {
    read: (digit & permissionBits.read) !== 0,
    write: (digit & permissionBits.write) !== 0,
    execute: (digit & permissionBits.execute) !== 0,
  };
}

function permissionSetToOctalDigit(permissions: PermissionSet): number {
  return permissionNames.reduce(
    (digit, permission) =>
      permissions[permission] ? digit + permissionBits[permission] : digit,
    0
  );
}

function permissionSetToLetters(permissions: PermissionSet): string {
  return [
    permissions.read ? 'r' : '',
    permissions.write ? 'w' : '',
    permissions.execute ? 'x' : '',
  ].join('');
}

function permissionSetToSymbolicTriplet(permissions: PermissionSet): string {
  return [
    permissions.read ? 'r' : '-',
    permissions.write ? 'w' : '-',
    permissions.execute ? 'x' : '-',
  ].join('');
}

export function parseOctalMode(mode: string): PermissionMatrix | null {
  if (!/^[0-7]{3}$/.test(mode)) {
    return null;
  }

  const [owner, group, other] = mode.split('').map(Number);

  return {
    owner: octalDigitToPermissionSet(owner),
    group: octalDigitToPermissionSet(group),
    other: octalDigitToPermissionSet(other),
  };
}

export function permissionsToOctal(permissions: PermissionMatrix): string {
  return permissionParties
    .map((party) => permissionSetToOctalDigit(permissions[party]))
    .join('');
}

export function parseSymbolicMode(mode: string): PermissionMatrix | null {
  if (mode.length !== 10 || mode[0] !== '-') {
    return null;
  }

  const symbolicPermissions = mode.slice(1);
  const expectedCharacters = ['r', 'w', 'x'] as const;

  for (let index = 0; index < symbolicPermissions.length; index += 1) {
    const character = symbolicPermissions[index];
    const expected = expectedCharacters[index % 3];

    if (character !== expected && character !== '-') {
      return null;
    }
  }

  const sets = permissionParties.map((_, partyIndex) => {
    const offset = partyIndex * 3;

    return {
      read: symbolicPermissions[offset] === 'r',
      write: symbolicPermissions[offset + 1] === 'w',
      execute: symbolicPermissions[offset + 2] === 'x',
    };
  });

  return {
    owner: sets[0],
    group: sets[1],
    other: sets[2],
  };
}

export function permissionsToSymbolic(permissions: PermissionMatrix): string {
  return `-${permissionParties
    .map((party) => permissionSetToSymbolicTriplet(permissions[party]))
    .join('')}`;
}

export function permissionsToSymbolicExpression(
  permissions: PermissionMatrix
): string {
  const clauses = new Map<string, string[]>();

  for (const party of permissionParties) {
    const letters = permissionSetToLetters(permissions[party]);
    const parties = clauses.get(letters) ?? [];
    parties.push(partySymbols[party]);
    clauses.set(letters, parties);
  }

  return Array.from(
    clauses,
    ([letters, parties]) => `${parties.join('')}=${letters}`
  ).join(',');
}

export function setPermission(
  permissions: PermissionMatrix,
  party: PermissionParty,
  permission: PermissionName,
  enabled: boolean
): PermissionMatrix {
  return {
    ...permissions,
    [party]: {
      ...permissions[party],
      [permission]: enabled,
    },
  };
}

export function getPermissionRisk(permissions: PermissionMatrix): {
  isFullyOpen: boolean;
  isOtherWritable: boolean;
} {
  return {
    isFullyOpen: permissionsToOctal(permissions) === '777',
    isOtherWritable: permissions.other.write,
  };
}
