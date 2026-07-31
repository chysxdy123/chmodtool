import type { Metadata } from 'next';
import Link from 'next/link';
import { CopyCommandButton } from '@/components/copy-command-button';
import { SshPermissionFixer } from '@/components/ssh-permission-fixer';
import { siteConfig } from '@/lib/config';
import { createPageMetadata } from '@/lib/seo';

const path = '/fix/ssh-key-permissions-too-open';
const title = 'SSH Key Permissions Too Open — Fix 0644 for id_rsa';
const description =
  'Fix WARNING: UNPROTECTED PRIVATE KEY FILE and SSH key permissions too open errors with chmod 600, correct .ssh modes, and copy-ready commands.';

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path,
});

const faqItems = [
  {
    question: 'What permissions should an SSH private key have?',
    answer:
      'Use chmod 600 for an SSH private key. This lets only the file owner read and write the key and removes access for group members and other users.',
  },
  {
    question: 'Why does SSH say permissions 0644 for id_rsa are too open?',
    answer:
      'Mode 0644 allows other local users to read the private key. OpenSSH treats that as a possible key disclosure and refuses to use the file.',
  },
  {
    question: 'Can an SSH public key use chmod 644?',
    answer:
      'Yes. A .pub file contains the public half of the key pair and is intended to be shared, so chmod 644 is normally appropriate.',
  },
  {
    question: 'What permissions should the ~/.ssh directory have?',
    answer:
      'Use chmod 700 ~/.ssh so only the owner can list, change, or enter the directory. Files inside it still need their own correct modes.',
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

const sshError = `@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0644 for '~/.ssh/id_rsa' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "~/.ssh/id_rsa": bad permissions`;

const windowsCommand = `icacls "$env:USERPROFILE\\.ssh\\id_rsa" /inheritance:r
icacls "$env:USERPROFILE\\.ssh\\id_rsa" /grant:r "$env:USERNAME:(R)"`;

const diagnosticCommands = [
  {
    title: 'Lock down the parent directory',
    explanation:
      'OpenSSH can reject a key when its .ssh directory is writable by other users.',
    command: 'chmod 700 ~/.ssh',
  },
  {
    title: 'Restore the file owner',
    explanation:
      'A correctly restricted file can still fail when it belongs to the wrong account.',
    command: 'chown "$USER":"$(id -gn)" ~/.ssh/id_rsa',
  },
  {
    title: 'Run SSH in verbose mode',
    explanation:
      'Verbose output shows which key file SSH loads and the exact check that fails.',
    command: 'ssh -v user@example.com',
  },
];

export default function SshKeyPermissionsPage() {
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
            <h1>Fix: SSH Key Permissions Are Too Open</h1>
            <p>
              Seeing <strong>ssh key permissions too open</strong> or a
              “WARNING: UNPROTECTED PRIVATE KEY FILE” message? Choose the file
              below, copy the command, and retry SSH.
            </p>
          </header>

          <section className="ssh-error-block" aria-labelledby="error-title">
            <div>
              <p className="section-kicker">The error you are fixing</p>
              <h2 id="error-title">“0644 for id_rsa are too open”</h2>
            </div>
            <pre>{sshError}</pre>
          </section>

          <SshPermissionFixer />

          <article className="ssh-explanation">
            <section>
              <h2>Why SSH refuses a private key with open permissions</h2>
              <p>
                A private key proves your identity to a remote server. If any
                other local account can read it, that account can copy the key
                and potentially authenticate as you.
              </p>
              <p>
                OpenSSH checks the file before authentication and ignores keys
                that are readable by group members or everyone else. Changing
                the private key to 600 gives read and write access only to its
                owner.
              </p>
              <p>
                This check protects the private key, not the public `.pub` file.
                Public keys can normally use 644 because sharing them does not
                reveal the secret half of the pair.
              </p>
            </section>

            <details className="windows-fix">
              <summary>OpenSSH for Windows: use icacls instead</summary>
              <div>
                <p>
                  Windows OpenSSH usually stores keys in{' '}
                  <code>%USERPROFILE%\.ssh</code>. NTFS access rules replace
                  Unix chmod bits, so remove inherited access and grant your
                  account read permission.
                </p>
                <div className="ssh-command-row">
                  <code>{windowsCommand}</code>
                  <CopyCommandButton
                    command={windowsCommand}
                    ariaLabel="Copy Windows icacls commands"
                    commandType="windows"
                  />
                </div>
                <p>
                  Run these commands in PowerShell and replace{' '}
                  <code>id_rsa</code> when your private key has another name.
                </p>
              </div>
            </details>
          </article>

          <section
            className="ssh-troubleshooting"
            aria-labelledby="still-error-title"
          >
            <div className="ssh-section-heading">
              <p className="section-kicker">Still seeing the error?</p>
              <h2 id="still-error-title">
                Check the directory, owner, and loaded key
              </h2>
            </div>
            <div className="diagnostic-list">
              {diagnosticCommands.map((item) => (
                <div className="diagnostic-row" key={item.title}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.explanation}</p>
                  </div>
                  <div className="ssh-command-row">
                    <code>{item.command}</code>
                    <CopyCommandButton
                      command={item.command}
                      ariaLabel={`Copy ${item.command}`}
                      commandType="diagnostic"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="ssh-faq" aria-labelledby="ssh-faq-title">
            <div className="ssh-section-heading">
              <p className="section-kicker">Quick answers</p>
              <h2 id="ssh-faq-title">SSH key permissions FAQ</h2>
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
              Need to compare another mode? Use the{' '}
              <Link href="/">chmod calculator</Link> to convert any octal or
              symbolic permission.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
