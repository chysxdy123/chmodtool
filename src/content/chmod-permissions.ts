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
];

export function getPermissionGuide(slug: string): PermissionGuide | undefined {
  return permissionGuides.find((guide) => guide.slug === slug);
}
