import type { Metadata } from 'next';
import Link from 'next/link';
import { CopyCommandButton } from '@/components/copy-command-button';
import { PermissionFixer } from '@/components/permission-fixer';
import { pemPermissionTargets } from '@/content/pem-permission-fixes';
import { siteConfig } from '@/lib/config';
import { createPageMetadata } from '@/lib/seo';

const path = '/fix/pem-file-permissions';
const title = 'PEM File Permissions Too Open — Fix for AWS EC2 SSH';
const description =
  'Fix WARNING: UNPROTECTED PRIVATE KEY FILE for .pem keys. chmod 400 for AWS EC2, Windows icacls steps, and copy-ready commands that work.';

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path,
});

const faqItems = [
  {
    question: 'Should an AWS PEM file use chmod 400 or chmod 600?',
    answer:
      'AWS recommends chmod 400 for an EC2 private key: only the owner can read it, and no account can write to it. OpenSSH also accepts 600 because group and other access remain disabled. Use 400 for a downloaded key you do not need to edit; use 600 only when an owner-only process must update the file.',
  },
  {
    question: 'How do I fix PEM permissions on Windows without chmod?',
    answer:
      'Use icacls in PowerShell to remove inherited access, remove broad user groups, and grant your Windows account read permission. NTFS access rules perform the job that chmod performs on Linux and macOS.',
  },
  {
    question: 'Why does EC2 still say Permission denied (publickey)?',
    answer:
      'File permissions are only one possible cause. Confirm that the PEM file belongs to this instance, use the correct login name for the AMI, and verify that the security group allows inbound SSH on port 22 from your IP address.',
  },
  {
    question: 'What is the difference between a PEM file and a PPK file?',
    answer:
      "PEM is the private-key format commonly used by OpenSSH and the ssh command. PPK is PuTTY's native key format. Current PuTTY versions can import PEM keys, or you can convert a PEM key with PuTTYgen when an older PuTTY workflow requires PPK.",
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  url: `${siteConfig.url}${path}`,
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

const pemError = `@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0644 for 'mykey.pem' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "mykey.pem": bad permissions`;

const windowsCommands = `$key = "$env:USERPROFILE\\.ssh\\mykey.pem"
icacls $key /inheritance:r
icacls $key /remove:g "BUILTIN\\Users" "NT AUTHORITY\\Authenticated Users" "Everyone"
icacls $key /grant:r "$env:USERNAME:(R)"`;

const connectionCommand = 'ssh -i mykey.pem ec2-user@YOUR_INSTANCE_IP';

const troubleshootingSteps = [
  {
    number: '1',
    title: "Confirm that this is the instance's key pair",
    explanation:
      'In the EC2 console, open the instance details and compare its Key pair name with the .pem file you downloaded. A different private key cannot authenticate to the instance.',
  },
  {
    number: '2',
    title: 'Use the login name for the AMI',
    explanation:
      'Amazon Linux commonly uses ec2-user, Ubuntu uses ubuntu, and Debian may use admin. The right key with the wrong username still returns Permission denied (publickey).',
  },
  {
    number: '3',
    title: 'Restrict the PEM file to your account',
    explanation:
      'On macOS or Linux, run chmod 400 mykey.pem. On Windows, use the icacls block above. Then retry the SSH command from the same directory.',
  },
  {
    number: '4',
    title: 'Check inbound SSH access',
    explanation:
      'The instance security group must allow TCP port 22 from your current public IP. A timeout usually points to networking rather than the PEM file.',
  },
];

export default function PemFilePermissionsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <main className="ssh-fix-page">
        <div className="shell ssh-fix-layout">
          <header className="ssh-fix-hero">
            <Link className="guide-back-link" href="/">
              chmod calculator
            </Link>
            <h1>Fix: PEM File Permissions Are Too Open (AWS EC2)</h1>
            <p>
              If your <strong>PEM file permissions are too open</strong>, SSH
              will ignore the AWS EC2 private key. Choose the item below, copy
              the recommended command, and retry the connection.
            </p>
          </header>

          <section
            className="ssh-error-block"
            aria-labelledby="pem-error-title"
          >
            <div>
              <p className="section-kicker">The AWS SSH error you are fixing</p>
              <h2 id="pem-error-title">
                “Permissions 0644 for mykey.pem are too open”
              </h2>
            </div>
            <pre>{pemError}</pre>
          </section>

          <PermissionFixer
            targets={pemPermissionTargets}
            kicker="Choose what needs to be secured"
            title="Get the correct PEM permission command"
            selectLabel="Key file or SSH location"
            selectId="pem-file-type"
            commandType="pem-fix"
          />

          <article className="ssh-explanation pem-explanation">
            <section>
              <h2>Why AWS recommends chmod 400 for a PEM key</h2>
              <p>
                The <code>.pem</code> file downloaded when you create an EC2 key
                pair is the private half of that key. Anyone who can read it can
                try to authenticate as you, so OpenSSH refuses to use the file
                while group members or other local users have access.
              </p>
              <p>
                Mode <strong>400</strong> means the owner can read the key, but
                nobody can write to or execute it. That matches the AWS guidance
                for an EC2 key you download once and should not modify.
              </p>
            </section>

            <section
              className="pem-mode-comparison"
              aria-labelledby="pem-mode-title"
            >
              <h2 id="pem-mode-title">chmod 400 vs 600 for a PEM file</h2>
              <div>
                <p>
                  <strong>400</strong>
                  Owner can read only. Use this for an AWS-downloaded PEM key.
                </p>
                <p>
                  <strong>600</strong>
                  Owner can read and write. OpenSSH accepts it, but the extra
                  write permission is usually unnecessary for an EC2 key.
                </p>
              </div>
              <p>
                Both modes block group and other users. If you need a broader
                explanation of owner-only SSH keys, see the{' '}
                <Link href="/fix/ssh-key-permissions-too-open">
                  SSH key permissions guide
                </Link>{' '}
                or inspect <Link href="/chmod-600">chmod 600</Link> bit by bit.
              </p>
            </section>
          </article>

          <section
            className="pem-windows-fix"
            aria-labelledby="windows-pem-title"
          >
            <div className="ssh-section-heading">
              <p className="section-kicker">Windows PowerShell</p>
              <h2 id="windows-pem-title">Restrict a PEM file with icacls</h2>
              <p>
                Windows uses NTFS access rules instead of Unix permission bits.
                These commands remove inherited and broad access, then leave
                your current account with read permission. Change the path in
                the first line if your key is stored elsewhere.
              </p>
            </div>
            <div className="ssh-command-row pem-windows-command">
              <code>{windowsCommands}</code>
              <CopyCommandButton
                command={windowsCommands}
                ariaLabel="Copy Windows PEM icacls commands"
                commandType="windows"
              />
            </div>
            <p>
              Run PowerShell as your normal Windows account. If Windows uses
              localized group names, remove unwanted entries through File
              Properties → Security instead. In WSL, keep the key inside your
              Linux home directory and run <code>chmod 400 ~/mykey.pem</code>;
              permissions under <code>/mnt/c</code> may follow Windows mount
              settings instead.
            </p>
          </section>

          <section
            className="ssh-troubleshooting"
            aria-labelledby="ec2-check-title"
          >
            <div className="ssh-section-heading">
              <p className="section-kicker">Permission denied (publickey)?</p>
              <h2 id="ec2-check-title">Check the full EC2 connection path</h2>
              <p>
                PEM permissions fix one local check. Work through these items in
                order so a key, username, or network problem is not mistaken for
                a chmod problem.
              </p>
            </div>
            <ol className="pem-checklist">
              {troubleshootingSteps.map((item) => (
                <li key={item.number}>
                  <span>{item.number}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.explanation}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="ssh-command-row pem-connect-command">
              <code>{connectionCommand}</code>
              <CopyCommandButton
                command={connectionCommand}
                ariaLabel={`Copy ${connectionCommand}`}
                commandType="diagnostic"
              />
            </div>
          </section>

          <section className="ssh-faq" aria-labelledby="pem-faq-title">
            <div className="ssh-section-heading">
              <p className="section-kicker">Quick answers</p>
              <h2 id="pem-faq-title">PEM file permissions FAQ</h2>
            </div>
            <dl>
              {faqItems.map((item) => (
                <div key={item.question}>
                  <dt>{item.question}</dt>
                  <dd>{item.answer}</dd>
                </div>
              ))}
            </dl>
            <p>
              Need to verify another mode? Use the{' '}
              <Link href="/">chmod calculator</Link> to convert octal and
              symbolic permissions.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
