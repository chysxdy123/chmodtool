import assert from 'node:assert/strict';
import test from 'node:test';

import { sshPermissionTargets } from '../content/ssh-permission-fixes.ts';
import {
  describePermission,
  octalToSymbolic,
  parseOctal,
  permissionSetToOctal,
  riskLevel,
  symbolicToOctal,
} from './permission-engine.ts';

const conversionCases = [
  ['755', 'rwxr-xr-x'],
  ['644', 'rw-r--r--'],
  ['600', 'rw-------'],
  ['777', 'rwxrwxrwx'],
  ['4755', 'rwsr-xr-x'],
] as const;

test('converts common three-digit and special four-digit modes', () => {
  for (const [octal, symbolic] of conversionCases) {
    assert.equal(octalToSymbolic(octal), symbolic);
    assert.equal(symbolicToOctal(symbolic), octal);
    assert.equal(permissionSetToOctal(parseOctal(octal)), octal);
  }
});

test('parses setuid, setgid, and sticky bits', () => {
  assert.deepEqual(parseOctal('7755').special, {
    setuid: true,
    setgid: true,
    sticky: true,
  });
  assert.equal(octalToSymbolic('1777'), 'rwxrwxrwt');
  assert.equal(symbolicToOctal('rwxrwxrwt'), '1777');
});

test('rejects invalid octal input with clear errors', () => {
  for (const invalid of ['999', 'abc', '']) {
    assert.throws(() => parseOctal(invalid), /Invalid octal permission/);
    assert.throws(() => octalToSymbolic(invalid), /Invalid octal permission/);
  }
});

test('rejects malformed symbolic input', () => {
  for (const invalid of ['', 'rwxr-x', 'rwxq-xr-x', 'rwxr-xr-s']) {
    assert.throws(
      () => symbolicToOctal(invalid),
      /Invalid symbolic permission/
    );
  }
});

test('describes normal and special modes with the expected line count', () => {
  assert.equal(describePermission('755').length, 3);
  assert.equal(describePermission('4755').length, 4);
});

test('classifies representative permission risks', () => {
  for (const safe of ['755', '644', '600']) {
    assert.equal(riskLevel(safe), 'safe');
  }

  assert.equal(riskLevel('775'), 'caution');
  assert.equal(riskLevel('4755'), 'caution');
  assert.equal(riskLevel('777'), 'dangerous');
  assert.equal(riskLevel('666'), 'dangerous');
});

test('round-trips every three-digit permission combination', () => {
  for (let owner = 0; owner <= 7; owner += 1) {
    for (let group = 0; group <= 7; group += 1) {
      for (let others = 0; others <= 7; others += 1) {
        const octal = `${owner}${group}${others}`;
        assert.equal(symbolicToOctal(octalToSymbolic(octal)), octal);
      }
    }
  }
});

test('uses the expected SSH file and directory recommendations', () => {
  const modes = Object.fromEntries(
    sshPermissionTargets.map((target) => [target.id, target.octal])
  );

  assert.deepEqual(modes, {
    'private-key': '600',
    'public-key': '644',
    'authorized-keys': '600',
    'known-hosts': '644',
    config: '600',
    'ssh-directory': '700',
  });
});
