export type GuideInline =
  | string
  | { text: string; href: string }
  | { text: string; code: true };

export type GuideSection = {
  heading: string;
  paragraphs: GuideInline[][];
};

export type PermissionGuide = {
  slug: string;
  mode: string;
  title: string;
  description: string;
  h1: string;
  summary: string;
  homeSummary: string;
  calculatorIntro: string;
  command: string;
  commandIntro: string;
  sections: GuideSection[];
};

export const permissionGuides: PermissionGuide[] = [
  {
    slug: 'chmod-755',
    mode: '755',
    title: 'chmod 755 - what it means and when to use it',
    description:
      'Learn what chmod 755 means, why it is common for Linux directories and executable files, and when 644 is the safer choice.',
    h1: 'chmod 755: what it means and when to use it',
    summary:
      'chmod 755 lets the owner read, write, and execute while everyone else can read and execute. It is a practical default for public directories and executable files, but not for every file in a web tree.',
    homeSummary: 'Public directories and executable files',
    calculatorIntro:
      'The calculator starts at 755. Change any checkbox, octal digit, or permission character to compare another mode.',
    command: 'chmod 755 filename',
    commandIntro:
      'Apply 755 to one file or directory after confirming that it should be readable and executable by other users.',
    sections: [
      {
        heading: 'What chmod 755 grants',
        paragraphs: [
          [
            'The first digit belongs to the owner. A 7 combines read (4), write (2), and execute (1), so the owner receives rwx. The second and third digits are both 5, combining read (4) and execute (1) for the group and all other users. The complete permission string is rwxr-xr-x: only the owner can modify the item.',
          ],
          [
            'Execute means different things for files and directories. On a file, it allows the operating system to run the file as a program or script. On a directory, it allows a user to enter the directory and reach items inside it. Directory read permission controls whether names can be listed, so read and execute are commonly granted together on public directory trees.',
          ],
        ],
      },
      {
        heading: 'Typical directory and web server uses',
        paragraphs: [
          [
            '755 is common for directories that serve public application code, static assets, or documentation. A deployment account can update the directory, while a web server process can traverse it and read its contents without receiving write access. The same mode also fits scripts and binaries that users need to run but should not edit.',
          ],
          [
            'Do not assume that an entire website should be recursively set to 755. Regular HTML, CSS, JavaScript, image, and configuration files usually do not need execute permission. Upload or cache directories may need carefully scoped write access for a service account, but that is better solved with correct ownership or group permissions than by making the whole web root writable.',
          ],
        ],
      },
      {
        heading: '755 compared with 644',
        paragraphs: [
          [
            'A familiar web layout uses 755 for directories and ',
            { text: 'chmod 644', href: '/chmod-644' },
            ' for ordinary files. Both modes let other users read content, but 755 adds execute permission. That execute bit is necessary for directory traversal and executable programs; it is unnecessary on a normal document. Setting a directory to 644 often breaks access because users can see names but cannot traverse the directory reliably.',
          ],
          [
            'For private material, neither 755 nor 644 is appropriate because both expose content to other users. Credentials and private keys generally need ',
            { text: 'chmod 600', href: '/chmod-600' },
            ' or a similarly restrictive mode.',
          ],
        ],
      },
      {
        heading: 'Security checks before using 755',
        paragraphs: [
          [
            '755 is safer than ',
            { text: 'chmod 777', href: '/chmod-777' },
            ' because group members and other users cannot write. It is not private, however: other users may read a file or traverse a directory. Confirm that the content is intended to be visible, verify who owns it, and avoid applying permissions recursively until you know which entries are files and which are directories.',
          ],
          [
            'Use the ',
            { text: 'chmod calculator', href: '/' },
            ' to test a narrower combination when an application needs something different. Start with the least access that allows the process to work, then add a specific group permission rather than opening access to everyone.',
          ],
        ],
      },
    ],
  },
  {
    slug: 'chmod-644',
    mode: '644',
    title: 'chmod 644 - standard permissions for regular files',
    description:
      'Understand chmod 644 for Linux files, why websites and configuration files commonly use it, and when sensitive files need chmod 600 instead.',
    h1: 'chmod 644: standard permissions for regular files',
    summary:
      'chmod 644 gives the owner read and write access while the group and everyone else receive read-only access. It is the usual mode for non-executable files that must be publicly readable.',
    homeSummary: 'Standard readable permissions for regular files',
    calculatorIntro:
      'This calculator is preset to 644. Adjust the mode to see how read, write, and execute bits change for each user class.',
    command: 'chmod 644 filename',
    commandIntro:
      'Use 644 for a regular file that its owner maintains and other users are allowed to read.',
    sections: [
      {
        heading: 'What chmod 644 means',
        paragraphs: [
          [
            'The owner digit is 6, which combines read (4) and write (2). The group digit and other-users digit are both 4, granting read permission only. In symbolic form, 644 is rw-r--r--. The owner can open and edit the file, while everyone else can open it but cannot modify or execute it.',
          ],
          [
            'That lack of execute permission is intentional. Text files, images, style sheets, JSON documents, and most configuration files are data rather than programs. Giving them execute permission does not make them easier to read and can make the intended role of the file less clear during audits.',
          ],
        ],
      },
      {
        heading: 'Why websites and configuration files use 644',
        paragraphs: [
          [
            'Static web content commonly uses 644 because the deployment owner needs to update it and the web server only needs to read it. The same pattern works for many system configuration files: root or an administrator owns the file, services can read the settings, and unprivileged users cannot alter them. This keeps routine content available without giving the serving process unnecessary write access.',
          ],
          [
            'The mode is appropriate only when world-readable content is acceptable. A public website asset fits that description. A configuration file containing an API token, database password, signing key, or private endpoint may not. Also remember that 644 is usually wrong for directories, because directories need execute permission for traversal; public directories more often use ',
            { text: 'chmod 755', href: '/chmod-755' },
            '.',
          ],
        ],
      },
      {
        heading: '644 compared with 600',
        paragraphs: [
          [
            'The practical difference between 644 and ',
            { text: 'chmod 600', href: '/chmod-600' },
            ' is who can read the file. Both let the owner read and write, but 600 removes all group and other-user access. Choose 644 when a service or ordinary user legitimately needs to read non-secret content. Choose 600 when disclosure itself is a risk, as with SSH private keys, credential files, personal backups, or token-bearing dotfiles.',
          ],
          [
            'File ownership remains important. If the wrong account owns a 644 file, the intended administrator may not be able to update it, while the actual owner still can. Fix the owner or group instead of granting write permission to everyone.',
          ],
        ],
      },
      {
        heading: 'Security and maintenance notes',
        paragraphs: [
          [
            'World-readable does not mean harmless. Before using 644, inspect the file for secrets, internal paths, customer data, or debugging output. Shared teams that genuinely need write access may prefer 664 with a controlled group, but that decision should follow group membership and ownership checks rather than convenience.',
          ],
          [
            'Use the ',
            { text: 'chmod calculator', href: '/' },
            ' to compare 644 with a stricter or group-writable mode. Avoid ',
            { text: 'chmod 777', href: '/chmod-777' },
            ' as a shortcut for a write error: it adds execute and write permissions far beyond what a normal file needs.',
          ],
        ],
      },
    ],
  },
  {
    slug: 'chmod-777',
    mode: '777',
    title: 'chmod 777 - why it is dangerous and safer alternatives',
    description:
      'Learn why chmod 777 is dangerous, why it rarely fixes permission problems correctly, and how ownership and group permissions provide safer alternatives.',
    h1: 'chmod 777: why it is dangerous and what to use instead',
    summary:
      'chmod 777 gives read, write, and execute permission to the owner, group, and every other user. It removes a major Linux security boundary and is rarely the correct fix for a permission error.',
    homeSummary: 'Fully open access and its security risks',
    calculatorIntro:
      'The calculator starts at 777 and displays a warning. Remove unnecessary bits to model a least-privilege alternative.',
    command: 'chmod 777 filename',
    commandIntro:
      'This command is shown for recognition and testing, not as a recommended default. Review the safer alternatives below before running it.',
    sections: [
      {
        heading: 'Why every digit matters',
        paragraphs: [
          [
            'Each 7 combines read (4), write (2), and execute (1). The first 7 applies to the owner, the second to the assigned group, and the third to every other user. The result is rwxrwxrwx. On a file, any local user or service account can read it, replace its contents, and attempt to execute it. On a directory, those users can list names, traverse the directory, and create new entries.',
          ],
          [
            'Directory write permission is especially important. A user who can write to a directory may be able to rename or delete entries there even when the files have more restrictive modes. The exact result depends on ownership and special bits, but 777 should be treated as granting untrusted accounts the ability to change that part of the filesystem.',
          ],
        ],
      },
      {
        heading: 'The risk of letting everyone write',
        paragraphs: [
          [
            'A compromised web process, scheduled job, plugin, or local account can modify a world-writable file. If that file is later executed or served to visitors, the change can become code execution, defacement, data theft, or persistent malware. A world-writable directory can also become a place to store unexpected files or replace content that a more privileged process trusts.',
          ],
          [
            '777 does not mean "make this work." It means "let every account read, change, and execute this." That is a much larger decision than granting one application the access it needs, and it remains risky even when a server has only one human administrator because services run under separate accounts.',
          ],
        ],
      },
      {
        heading: 'Why chmod 777 is not a real bug fix',
        paragraphs: [
          [
            'When an application reports permission denied, chmod 777 may hide the symptom, which is why it appears in quick forum answers. The underlying cause is often a wrong owner, a missing group membership, an inaccessible parent directory, an ACL, a read-only mount, or a security system such as SELinux. Opening every bit makes diagnosis harder and leaves the original ownership model unfixed.',
          ],
          [
            'Check the process account, inspect the full path, and decide exactly which operation needs access. If one service must write, assign the directory to that service or a controlled group. Commands such as chown and chgrp address identity; chmod should then grant only the required owner or group bits.',
          ],
        ],
      },
      {
        heading: 'Safer alternatives',
        paragraphs: [
          [
            'Public directories commonly use ',
            { text: 'chmod 755', href: '/chmod-755' },
            ', while normal website files use ',
            { text: 'chmod 644', href: '/chmod-644' },
            '. A team that needs shared write access can use a controlled group with modes such as 775 for directories or 664 for files. Credentials should be restricted with ',
            { text: 'chmod 600', href: '/chmod-600' },
            '. Private directories often use 700.',
          ],
          [
            "Shared temporary directories are a special case: systems commonly use 1777 with the sticky bit so users cannot remove one another's files. That is not equivalent to plain 777 and is outside a basic three-digit permission mode. Use the ",
            { text: 'chmod calculator', href: '/' },
            ' to remove broad permissions one class at a time and verify the result before changing a production path.',
          ],
        ],
      },
    ],
  },
  {
    slug: 'chmod-600',
    mode: '600',
    title: 'chmod 600 - secure permissions for SSH keys and credentials',
    description:
      'Learn why chmod 600 is required for SSH private keys and useful for credential files, dotfiles, tokens, and other owner-only data.',
    h1: 'chmod 600: secure permissions for SSH keys and credentials',
    summary:
      'chmod 600 allows only the file owner to read and write. Group members and all other users receive no access, making it a standard choice for SSH private keys and local credential files.',
    homeSummary: 'Owner-only files such as SSH private keys',
    calculatorIntro:
      'The calculator is preset to 600. Add or remove bits to compare owner-only access with more permissive modes.',
    command: 'chmod 600 ~/.ssh/id_ed25519',
    commandIntro:
      'Apply 600 to an SSH private key so only its owner can read or replace it.',
    sections: [
      {
        heading: 'What chmod 600 grants',
        paragraphs: [
          [
            'The first digit is 6, combining read (4) and write (2) for the owner. The group and other-user digits are 0, so those classes receive no permissions. The symbolic result is rw-------. The owner can view and update the file, but the file is not executable and no other ordinary account can read it through standard Unix permission checks.',
          ],
          [
            '600 is a file mode. A directory usually needs execute permission so its owner can enter it, which is why a private directory commonly uses 700 instead. A file inside that directory may still use 600 for an additional layer of access control.',
          ],
        ],
      },
      {
        heading: 'Why SSH private keys need 600',
        paragraphs: [
          [
            'An SSH private key proves your identity to a remote server. If another local user can read that key, that user may be able to authenticate as you. OpenSSH therefore checks private-key permissions before use. When a key is accessible to group members or other users, ssh can refuse to load it and report that the permissions are too open.',
          ],
          [
            'Setting the private key to 600 satisfies the common requirement: the owner can read the key and replace it, while other users cannot. The key must also belong to the account running ssh. If chmod 600 does not solve the warning, inspect the owner with ls -l and correct ownership rather than adding broader permissions. Public keys are not secret and can usually be more readable; the restriction applies to the private key.',
          ],
        ],
      },
      {
        heading: 'Dotfiles, tokens, and credential files',
        paragraphs: [
          [
            '600 is also useful for files such as .env, cloud credentials, API tokens, password-store exports, database client settings, and private backups. These files often need to be edited by one account but never read by unrelated users. Owner-only access reduces accidental disclosure on shared workstations, development servers, and multi-user Linux hosts.',
          ],
          [
            "The application reading the file must run as the owner or with an explicitly designed privilege path. If a web service cannot read a 600 file, changing it to world-readable is usually the wrong response. Assign the correct owner, use a controlled service group with a carefully chosen mode, or move the secret into the platform's supported secret store.",
          ],
        ],
      },
      {
        heading: '600 compared with 644',
        paragraphs: [
          [
            { text: 'chmod 644', href: '/chmod-644' },
            ' keeps owner write access but lets every user read the file. That is suitable for public web assets and non-secret configuration, not private credentials. ',
            { text: 'chmod 755', href: '/chmod-755' },
            ' goes further by adding execute permission and is intended for traversable directories or executable files, not keys.',
          ],
          [
            'Remember that permissions are not encryption. Root, privileged backup software, or a compromised owner account may still read the file. Verify ownership, protect backups, and rotate exposed credentials. Use the ',
            { text: 'chmod calculator', href: '/' },
            ' to compare 600 with another mode before granting additional group or other-user access.',
          ],
        ],
      },
    ],
  },
  {
    slug: 'chmod-700',
    mode: '700',
    title: 'chmod 700',
    description:
      'Understand chmod 700 for private directories and owner-only scripts, including why ~/.ssh uses it and how it differs from chmod 755.',
    h1: 'chmod 700',
    summary:
      'chmod 700 gives the owner read, write, and execute permission while denying every permission to the group and all other users. It is a standard mode for private directories and owner-only executable files.',
    homeSummary: 'Private directories and owner-only scripts',
    calculatorIntro:
      'The calculator is preset to 700. Compare its owner-only access with a mode that grants selected permissions to a group or other users.',
    command: 'chmod 700 ~/.ssh',
    commandIntro:
      'Use 700 on a private directory such as ~/.ssh so only its owner can list, change, or enter it.',
    sections: [
      {
        heading: 'What chmod 700 means',
        paragraphs: [
          [
            'The owner digit is 7, combining read (4), write (2), and execute (1). The group and other-user digits are both 0. For a directory, the result appears as drwx------; for a regular executable file, it appears as -rwx------. Only the owner can inspect, change, or use the item through normal Unix permission checks.',
          ],
          [
            'On a directory, read allows the owner to list names, write allows entries to be created or removed, and execute allows traversal into the directory. Removing all three bits from group and other users makes both the directory listing and the paths beneath it inaccessible to ordinary accounts, subject to privileged access and any additional ACLs.',
          ],
        ],
      },
      {
        heading: 'Why the ~/.ssh directory commonly uses 700',
        paragraphs: [
          [
            'The ~/.ssh directory can reveal host aliases, usernames, known hosts, and the filenames of private keys. Mode 700 prevents another local user from listing those names or traversing the directory. It also prevents group members from adding or replacing files in a location that the SSH client trusts.',
          ],
          [
            'OpenSSH checks more than the key file itself. A key may have a restrictive mode and still fail when its parent directory is writable or accessible in an unsafe way. If SSH reports that a directory or key is too open, follow the ',
            {
              text: 'SSH permissions troubleshooting steps',
              href: '/fix/ssh-key-permissions-too-open',
            },
            ' to check the directory, file, owner, and key being loaded.',
          ],
        ],
      },
      {
        heading: 'Private scripts and application directories',
        paragraphs: [
          [
            'A user-private bin directory or a script that only its owner should run can also use 700. The execute bit is required for the script to run directly, while the zero group and other digits keep unrelated accounts from reading its source or invoking it. This can be appropriate for maintenance utilities that contain internal paths or account-specific operations.',
          ],
          [
            'The owner must still be correct. Applying 700 to an item owned by root will not give an ordinary user access, and applying it to a service directory may lock the service out when the process runs under another account. Fix ownership or choose a controlled group before widening permissions simply to make a process work.',
          ],
        ],
      },
      {
        heading: '700 compared with 755 and 600',
        paragraphs: [
          [
            { text: 'chmod 755', href: '/chmod-755' },
            ' lets group members and other users read and traverse a directory. Mode 700 removes that access completely, which makes it suitable for a private home subdirectory but unsuitable for a public web directory that a server or other users must traverse.',
          ],
          [
            'Private files more commonly use ',
            { text: 'chmod 600', href: '/chmod-600' },
            ' because ordinary data and private keys do not need execute permission. Use 700 when the owner must traverse a directory or run a file; use 600 when the owner only needs to read and write a non-executable file.',
          ],
        ],
      },
    ],
  },
  {
    slug: 'chmod-400',
    mode: '400',
    title: 'chmod 400',
    description:
      'Understand chmod 400 for read-only private keys and sensitive files, why AWS PEM guides recommend it, and how it differs from chmod 600.',
    h1: 'chmod 400',
    summary:
      'chmod 400 gives the owner read permission and denies write, execute, group, and other-user access. It is useful for private keys and sensitive files that should be read but not changed during normal use.',
    homeSummary: 'Read-only private keys and sensitive files',
    calculatorIntro:
      'The calculator starts at 400. Add owner write permission to compare 600, or inspect exactly which classes remain unable to read the file.',
    command: 'chmod 400 my-key.pem',
    commandIntro:
      'Apply 400 to a private key that only its owner needs to read and that no routine process should modify.',
    sections: [
      {
        heading: 'What chmod 400 grants',
        paragraphs: [
          [
            'The first digit is 4, granting read permission to the owner. The group and other-user digits are 0, and no write or execute bits are present. A regular file appears as -r--------. Its owner can open the file, while ordinary processes cannot modify or execute it and other local users receive no access.',
          ],
          [
            'Mode 400 is a guard against routine writes, not an immutable lock. The file owner can change the mode again, and privileged accounts may still alter the file. Use it to express that normal operation is read-only; use filesystem immutability, protected deployment controls, or a secret manager when stronger change protection is required.',
          ],
        ],
      },
      {
        heading: 'Read-only keys and credentials',
        paragraphs: [
          [
            'Authentication clients generally need to read a private key but do not need to rewrite it. Removing owner write permission reduces the chance that a script, editor, or mistaken redirect overwrites the only local copy. The same pattern can fit exported credentials or signed material that an application consumes without updating.',
          ],
          [
            'A read-only mode does not replace backups or key rotation. Before restricting the working copy, store recovery material according to the provider guidance and verify that the application truly reads rather than updates the file. A program that legitimately rewrites a credential needs an owner-writable mode or a separate managed storage workflow.',
          ],
        ],
      },
      {
        heading: 'Why AWS tutorials use chmod 400 for PEM files',
        paragraphs: [
          [
            'An EC2 key-pair download is used as an SSH private key. The SSH client needs to read it, but editing the downloaded key is not part of connecting to an instance. Mode 400 therefore supplies the required read access while denying both local disclosure to other users and unnecessary owner writes.',
          ],
          [
            'If the SSH client reports an unprotected private key or ignores the PEM file, the problem is a task-specific connection error rather than a request for a permission definition. Use the ',
            {
              text: 'AWS PEM permissions fix',
              href: '/fix/pem-file-permissions',
            },
            ' for macOS, Linux, Windows, WSL, username, key-pair, and security-group checks.',
          ],
        ],
      },
      {
        heading: '400 compared with 600',
        paragraphs: [
          [
            { text: 'chmod 600', href: '/chmod-600' },
            ' adds owner write permission while keeping group and other users blocked. Choose 600 for a private file that its owner must edit, such as an actively maintained credential file. Choose 400 for a consumed key or secret that should remain read-only during ordinary use.',
          ],
          [
            'Both modes depend on correct ownership. If the wrong account owns a 400 file, the intended process cannot read it, and broadening the group or other digits is rarely the right repair. Confirm the owner and the account running the command before granting additional access.',
          ],
        ],
      },
    ],
  },
  {
    slug: 'chmod-775',
    mode: '775',
    title: 'chmod 775',
    description:
      'Understand chmod 775 for shared team directories, how group write access differs from chmod 755, and when a trusted group should use it.',
    h1: 'chmod 775',
    summary:
      'chmod 775 gives the owner and group full read, write, and execute access while other users can read and traverse. It is designed for shared directories maintained by a trusted Unix group.',
    homeSummary: 'Group-writable team and deployment directories',
    calculatorIntro:
      'The calculator is preset to 775. Remove group write access to compare 755, or remove other-user access for a private team workspace.',
    command: 'chmod 775 /var/www/shared',
    commandIntro:
      'Use 775 on a shared directory only after assigning it to the trusted group whose members need to create and update entries.',
    sections: [
      {
        heading: 'What chmod 775 means',
        paragraphs: [
          [
            'The owner and group digits are both 7, combining read (4), write (2), and execute (1). The other-user digit is 5, combining read and execute without write. A directory appears as drwxrwxr-x: its owner and assigned group can list, enter, and change entries, while everyone else can list and traverse but cannot create or remove entries.',
          ],
          [
            'On a regular file, 775 also grants execute permission to the owner, group, and other users. That is appropriate only when the file is meant to be executable. The common 775 use case is a directory; ordinary shared data files usually need a mode without execute bits.',
          ],
        ],
      },
      {
        heading: 'Shared project and deployment directories',
        paragraphs: [
          [
            'A development team can use 775 when several trusted accounts need to update the same project directory. A deployment user and a CI service can likewise share a group so either can publish artifacts without making the directory writable by every account on the host. Group ownership is what determines who receives the middle digit.',
          ],
          [
            "Set and verify the directory group before relying on 775. New entries may inherit each creator's primary group unless the directory uses an appropriate setgid workflow, commonly represented by a leading 2 in a four-digit mode. Test file creation from each participating account instead of assuming the parent mode alone guarantees lasting collaboration.",
          ],
        ],
      },
      {
        heading: '775 compared with 755',
        paragraphs: [
          [
            { text: 'chmod 755', href: '/chmod-755' },
            ' grants the same read and traverse access to the group and other users but reserves write permission for the owner. It fits a directory maintained by one deployment account. Mode 775 adds group write permission, which is the specific capability a multi-user team needs.',
          ],
          [
            'Do not add group write access just to suppress a permission error. Confirm which process needs to create, rename, or delete entries, place only that account in the assigned group, and check parent-directory ownership. A controlled identity model is safer and easier to audit than an oversized group.',
          ],
        ],
      },
      {
        heading: 'Security boundaries for a writable group',
        paragraphs: [
          [
            'Every member of the assigned group can change the directory. On a source tree or deployment path, one compromised group account may replace content used by other members or by a service. Review group membership, avoid mixing unrelated applications, and do not use 775 when the directory contents must remain private from other users.',
          ],
          [
            'Files stored inside a shared directory need their own modes. A group-editable data file can use ',
            { text: 'chmod 660', href: '/chmod-660' },
            ' without receiving an execute bit, while executable team scripts may need a different mode. Directory permission does not automatically make every existing file group-writable.',
          ],
        ],
      },
    ],
  },
  {
    slug: 'chmod-440',
    mode: '440',
    title: 'chmod 440',
    description:
      'Understand chmod 440 for owner-and-group read-only configuration, including service credentials and comparisons with chmod 400 and 640.',
    h1: 'chmod 440',
    summary:
      'chmod 440 lets the owner and assigned group read a file while denying every write, execute, and other-user permission. It fits configuration or credential files consumed by a controlled service group.',
    homeSummary: 'Group-readable, read-only service configuration',
    calculatorIntro:
      'The calculator starts at 440. Remove group read access to compare 400, or add owner write access to model a maintained configuration file.',
    command: 'chmod 440 /etc/myapp/secrets.conf',
    commandIntro:
      'Use 440 when an owner and a trusted service group must read a configuration file but normal operation should not modify it.',
    sections: [
      {
        heading: 'What chmod 440 grants',
        paragraphs: [
          [
            'The owner and group digits are both 4, granting read permission only. The other-user digit is 0. A regular file appears as -r--r-----: the owner and members of the assigned group can open it, but nobody receives a standard write or execute bit and users outside the group receive no access.',
          ],
          [
            'Mode 440 is normally a file permission. A directory with no execute bit cannot be traversed even by a user who can list its names, so private service directories need a separate traversable mode. The parent directories must also allow the service account to reach the file.',
          ],
        ],
      },
      {
        heading: 'Read-only configuration for a service group',
        paragraphs: [
          [
            "A root-owned application configuration can use 440 when the service runs under an account belonging to the file's assigned group. The service gains only the read access needed to load settings, while unrelated users cannot inspect the file and the running service cannot rewrite it through ordinary permissions.",
          ],
          [
            'This pattern is useful for database credentials, signing configuration, or connection settings shared by a small operational group. Keep that group narrowly scoped, verify supplementary group membership for the service process, and restart the process when required so it receives updated membership.',
          ],
        ],
      },
      {
        heading: '440 compared with 400',
        paragraphs: [
          [
            { text: 'chmod 400', href: '/chmod-400' },
            ' allows only the owner to read. Mode 440 adds read access for the assigned group, making it suitable when a service account differs from the administrative owner. If no group member needs the file, 400 provides the narrower access boundary.',
          ],
          [
            'Group read permission can disclose every secret in the file to every group member. Do not use a broad convenience group merely because one process needs access. Create or reuse a purpose-specific service group and audit its membership before relying on the middle 4.',
          ],
        ],
      },
      {
        heading: '440 compared with 640 and 644',
        paragraphs: [
          [
            'Mode 640 adds owner write permission, allowing an administrator or deployment process that owns the file to edit it in place. Mode 440 is more appropriate for an installed configuration that should remain unchanged between controlled deployments. The owner can still change the mode, so this is operational protection rather than immutability.',
          ],
          [
            { text: 'chmod 644', href: '/chmod-644' },
            ' makes the file readable by every local user. That may fit non-secret configuration, but it is too broad for credentials or internal settings. Choose 440 when a defined service group needs access and everyone outside that group should be excluded.',
          ],
        ],
      },
    ],
  },
  {
    slug: 'chmod-660',
    mode: '660',
    title: 'chmod 660',
    description:
      'Understand chmod 660 for group-shared read-write files, how it differs from chmod 664 and 770, and when collaborative data should use it.',
    h1: 'chmod 660',
    summary:
      'chmod 660 gives the owner and assigned group read and write permission while denying all access to other users. It is intended for shared data that trusted group members or processes must update.',
    homeSummary: 'Private group-shared read-write data files',
    calculatorIntro:
      'The calculator is preset to 660. Compare it with owner-only 600 or add selected access only when users outside the group have a real need.',
    command: 'chmod 660 /var/data/shared.db',
    commandIntro:
      'Use 660 on a non-executable data file whose owner and trusted group both need to read and update it.',
    sections: [
      {
        heading: 'What chmod 660 means',
        paragraphs: [
          [
            'The owner and group digits are both 6, combining read (4) and write (2). The other-user digit is 0, and no class receives execute permission. A regular file appears as -rw-rw----. Its owner and assigned group can open and modify it, while users outside that group cannot read, change, or run it.',
          ],
          [
            'The absence of execute permission identifies the item as data rather than a program. Mode 660 is generally unsuitable for directories because directories need execute permission for traversal. A shared file can use 660 inside a separately configured group-traversable directory.',
          ],
        ],
      },
      {
        heading: 'Collaborative data, logs, and process files',
        paragraphs: [
          [
            'A team can use 660 for a data file that several members must edit without exposing it to every account on the system. Applications can use the same pattern when two trusted processes share a group and both need to update a database export, queue state, or another non-executable working file.',
          ],
          [
            'Log and Unix socket permissions are often created by a service rather than maintained manually. Configure the service, its umask, or its socket settings so the desired owner and group mode persists after restart or rotation. A one-time chmod may be overwritten the next time the service recreates the file.',
          ],
        ],
      },
      {
        heading: '660 compared with 664',
        paragraphs: [
          [
            'Mode 664 grants the same owner and group read-write access but also lets every other local user read the file. That can be reasonable for non-sensitive shared content. Mode 660 closes the file to users outside the assigned group, which is safer for private team data, internal logs, and application state.',
          ],
          [
            'Before selecting either mode, verify the file group and the accounts that need write access. If only one person or process should edit the file, ',
            { text: 'chmod 600', href: '/chmod-600' },
            ' is the narrower choice. Do not add group write access as a substitute for correcting mistaken ownership.',
          ],
        ],
      },
      {
        heading: '660 compared with shared directory modes',
        paragraphs: [
          [
            'Mode 770 gives owner and group read, write, and execute permissions while excluding other users. Its execute bits suit a private shared directory or an intentionally executable file, not ordinary data. Applying 770 to a database or log adds execution capability with no benefit.',
          ],
          [
            'For a team directory that remains readable and traversable by other users, ',
            { text: 'chmod 775', href: '/chmod-775' },
            ' provides the directory execute bits and controlled group write access. Configure the directory and the files inside it separately: the container may use 775 while non-executable shared files use 660.',
          ],
        ],
      },
    ],
  },
];

export function getPermissionGuide(slug: string): PermissionGuide | undefined {
  return permissionGuides.find((guide) => guide.slug === slug);
}
