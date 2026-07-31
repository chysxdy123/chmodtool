export const permissionParties = ['owner', 'group', 'others'] as const;
export const permissionNames = ['read', 'write', 'execute'] as const;

export type PermissionParty = (typeof permissionParties)[number];
export type PermissionName = (typeof permissionNames)[number];
export type RiskLevel = 'safe' | 'caution' | 'dangerous';

export type PermissionBits = Record<PermissionName, boolean>;

export type SpecialPermissions = {
  setuid: boolean;
  setgid: boolean;
  sticky: boolean;
};

export type PermissionSet = Record<PermissionParty, PermissionBits> & {
  special?: SpecialPermissions;
};

const partySymbols: Record<PermissionParty, string> = {
  owner: 'u',
  group: 'g',
  others: 'o',
};

const permissionBits: Record<PermissionName, number> = {
  read: 4,
  write: 2,
  execute: 1,
};

function invalidOctalError(octal: string): Error {
  const received = octal.length === 0 ? 'an empty string' : `"${octal}"`;

  return new Error(
    `Invalid octal permission ${received}. Expected three or four digits from 0 to 7.`
  );
}

function invalidSymbolicError(symbolic: string): Error {
  const received = symbolic.length === 0 ? 'an empty string' : `"${symbolic}"`;

  return new Error(
    `Invalid symbolic permission ${received}. Expected rwxr-xr-x, optionally prefixed by a file type character.`
  );
}

function octalDigitToPermissionBits(digit: number): PermissionBits {
  return {
    read: (digit & permissionBits.read) !== 0,
    write: (digit & permissionBits.write) !== 0,
    execute: (digit & permissionBits.execute) !== 0,
  };
}

function permissionBitsToOctalDigit(permissions: PermissionBits): number {
  return permissionNames.reduce(
    (digit, permission) =>
      permissions[permission] ? digit + permissionBits[permission] : digit,
    0
  );
}

function permissionBitsToLetters(permissions: PermissionBits): string {
  return [
    permissions.read ? 'r' : '',
    permissions.write ? 'w' : '',
    permissions.execute ? 'x' : '',
  ].join('');
}

function permissionBitsToSymbolicTriplet(permissions: PermissionBits): string {
  return [
    permissions.read ? 'r' : '-',
    permissions.write ? 'w' : '-',
    permissions.execute ? 'x' : '-',
  ].join('');
}

function specialPermissionsToOctalDigit(
  special: SpecialPermissions | undefined
): number {
  if (!special) return 0;

  return (
    (special.setuid ? 4 : 0) +
    (special.setgid ? 2 : 0) +
    (special.sticky ? 1 : 0)
  );
}

function octalDigitToSpecialPermissions(digit: number): SpecialPermissions {
  return {
    setuid: (digit & 4) !== 0,
    setgid: (digit & 2) !== 0,
    sticky: (digit & 1) !== 0,
  };
}

function applySpecialSymbol(
  triplet: string,
  enabled: boolean,
  activeCharacter: 's' | 't',
  inactiveCharacter: 'S' | 'T'
): string {
  if (!enabled) return triplet;

  const executeCharacter =
    triplet[2] === 'x' ? activeCharacter : inactiveCharacter;

  return `${triplet.slice(0, 2)}${executeCharacter}`;
}

function normalizeSymbolic(symbolic: string): string {
  if (symbolic.length === 9) return symbolic;

  if (symbolic.length === 10 && /^[-bcdlps]$/.test(symbolic[0])) {
    return symbolic.slice(1);
  }

  throw invalidSymbolicError(symbolic);
}

function parseSymbolicTriplet(
  triplet: string,
  party: PermissionParty
): { permissions: PermissionBits; special: boolean } {
  const specialCharacters = party === 'others' ? ['t', 'T'] : ['s', 'S'];
  const executeIsValid =
    triplet[2] === 'x' ||
    triplet[2] === '-' ||
    specialCharacters.includes(triplet[2]);

  if (
    (triplet[0] !== 'r' && triplet[0] !== '-') ||
    (triplet[1] !== 'w' && triplet[1] !== '-') ||
    !executeIsValid
  ) {
    throw invalidSymbolicError(triplet);
  }

  return {
    permissions: {
      read: triplet[0] === 'r',
      write: triplet[1] === 'w',
      execute: triplet[2] === 'x' || /[st]/.test(triplet[2]),
    },
    special: specialCharacters.includes(triplet[2]),
  };
}

export function parseOctal(octal: string): PermissionSet {
  if (!/^(?:[0-7]{3}|[0-7]{4})$/.test(octal)) {
    throw invalidOctalError(octal);
  }

  const accessDigits = octal.slice(-3).split('').map(Number);
  const permissionSet: PermissionSet = {
    owner: octalDigitToPermissionBits(accessDigits[0]),
    group: octalDigitToPermissionBits(accessDigits[1]),
    others: octalDigitToPermissionBits(accessDigits[2]),
  };

  if (octal.length === 4) {
    permissionSet.special = octalDigitToSpecialPermissions(Number(octal[0]));
  }

  return permissionSet;
}

export function permissionSetToOctal(permissions: PermissionSet): string {
  const accessDigits = permissionParties
    .map((party) => permissionBitsToOctalDigit(permissions[party]))
    .join('');

  if (!permissions.special) return accessDigits;

  return `${specialPermissionsToOctalDigit(permissions.special)}${accessDigits}`;
}

export function octalToSymbolic(octal: string): string {
  const permissions = parseOctal(octal);
  const special = permissions.special;
  const owner = applySpecialSymbol(
    permissionBitsToSymbolicTriplet(permissions.owner),
    special?.setuid ?? false,
    's',
    'S'
  );
  const group = applySpecialSymbol(
    permissionBitsToSymbolicTriplet(permissions.group),
    special?.setgid ?? false,
    's',
    'S'
  );
  const others = applySpecialSymbol(
    permissionBitsToSymbolicTriplet(permissions.others),
    special?.sticky ?? false,
    't',
    'T'
  );

  return `${owner}${group}${others}`;
}

export function symbolicToOctal(symbolic: string): string {
  const normalized = normalizeSymbolic(symbolic);
  const owner = parseSymbolicTriplet(normalized.slice(0, 3), 'owner');
  const group = parseSymbolicTriplet(normalized.slice(3, 6), 'group');
  const others = parseSymbolicTriplet(normalized.slice(6, 9), 'others');
  const hasSpecial = owner.special || group.special || others.special;

  return permissionSetToOctal({
    owner: owner.permissions,
    group: group.permissions,
    others: others.permissions,
    ...(hasSpecial
      ? {
          special: {
            setuid: owner.special,
            setgid: group.special,
            sticky: others.special,
          },
        }
      : {}),
  });
}

export function describePermission(octal: string, locale = 'en'): string[] {
  const permissions = parseOctal(octal);
  const useChinese = locale.toLowerCase().startsWith('zh');
  const partyLabels: Record<PermissionParty, string> = {
    owner: useChinese ? '所有者' : 'Owner',
    group: useChinese ? '用户组' : 'Group',
    others: useChinese ? '其他用户' : 'Others',
  };
  const permissionLabels: Record<PermissionName, string> = {
    read: useChinese ? '读取' : 'read',
    write: useChinese ? '写入' : 'write',
    execute: useChinese ? '执行' : 'execute',
  };
  const lines = permissionParties.map((party) => {
    const enabledPermissions = permissionNames
      .filter((permission) => permissions[party][permission])
      .map((permission) => permissionLabels[permission]);
    const description =
      enabledPermissions.length === 0
        ? useChinese
          ? '无权限'
          : 'no permissions'
        : enabledPermissions.join(', ');

    return `${partyLabels[party]}: ${description}${useChinese ? '。' : '.'}`;
  });

  if (permissions.special) {
    const enabledSpecial = [
      permissions.special.setuid ? 'setuid' : '',
      permissions.special.setgid ? 'setgid' : '',
      permissions.special.sticky ? 'sticky' : '',
    ].filter(Boolean);

    const specialDescription =
      enabledSpecial.length > 0
        ? enabledSpecial.join(', ')
        : useChinese
          ? '无'
          : 'none';

    lines.push(
      useChinese
        ? `特殊位: ${specialDescription}。`
        : `Special bits: ${specialDescription}.`
    );
  }

  return lines;
}

export function riskLevel(octal: string): RiskLevel {
  const permissions = parseOctal(octal);
  const hasSpecial =
    permissions.special &&
    (permissions.special.setuid ||
      permissions.special.setgid ||
      permissions.special.sticky);

  if (permissions.others.write) return 'dangerous';
  if (permissions.group.write || hasSpecial) return 'caution';

  return 'safe';
}

export function tryParseOctal(octal: string): PermissionSet | null {
  try {
    return parseOctal(octal);
  } catch {
    return null;
  }
}

export function parseSymbolicMode(symbolic: string): PermissionSet | null {
  try {
    return parseOctal(symbolicToOctal(symbolic));
  } catch {
    return null;
  }
}

export function permissionsToSymbolic(permissions: PermissionSet): string {
  return `-${octalToSymbolic(permissionSetToOctal(permissions))}`;
}

export function permissionsToSymbolicExpression(
  permissions: PermissionSet
): string {
  const clauses = new Map<string, string[]>();

  for (const party of permissionParties) {
    const letters = permissionBitsToLetters(permissions[party]);
    const parties = clauses.get(letters) ?? [];
    parties.push(partySymbols[party]);
    clauses.set(letters, parties);
  }

  const expressions = Array.from(
    clauses,
    ([letters, parties]) => `${parties.join('')}=${letters}`
  );

  if (permissions.special?.setuid) expressions.push('u+s');
  if (permissions.special?.setgid) expressions.push('g+s');
  if (permissions.special?.sticky) expressions.push('+t');

  return expressions.join(',');
}

export function setPermission(
  permissions: PermissionSet,
  party: PermissionParty,
  permission: PermissionName,
  enabled: boolean
): PermissionSet {
  return {
    ...permissions,
    [party]: {
      ...permissions[party],
      [permission]: enabled,
    },
  };
}

export function getPermissionRisk(permissions: PermissionSet): {
  isFullyOpen: boolean;
  isOtherWritable: boolean;
} {
  return {
    isFullyOpen: permissionSetToOctal(permissions).slice(-3) === '777',
    isOtherWritable: permissions.others.write,
  };
}
