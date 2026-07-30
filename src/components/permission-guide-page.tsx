import Link from 'next/link';
import { ChmodToolShell } from '@/components/chmod-tool-shell';
import { CommonPermissions } from '@/components/common-permissions';
import { CopyCommandButton } from '@/components/copy-command-button';
import { PermissionBreakdown } from '@/components/permission-breakdown';
import type { GuideInline, PermissionGuide } from '@/content/chmod-permissions';

type PermissionGuidePageProps = {
  guide: PermissionGuide;
};

function renderInlineContent(items: GuideInline[]) {
  return items.map((item, index) => {
    if (typeof item === 'string') {
      return item;
    }

    if ('href' in item) {
      return (
        <Link href={item.href} key={`${item.href}-${index}`}>
          {item.text}
        </Link>
      );
    }

    return <code key={`${item.text}-${index}`}>{item.text}</code>;
  });
}

export function PermissionGuidePage({ guide }: PermissionGuidePageProps) {
  return (
    <main className="guide-page">
      <div className="shell guide-layout">
        <header className="guide-hero">
          <Link className="guide-back-link" href="/">
            chmod calculator
          </Link>
          <h1>{guide.h1}</h1>
          <p>{guide.summary}</p>
        </header>

        <PermissionBreakdown mode={guide.mode} />

        <section
          className="guide-calculator"
          aria-labelledby="calculator-title"
        >
          <div className="guide-section-heading">
            <p className="section-kicker">Try it yourself</p>
            <h2 id="calculator-title">Explore chmod {guide.mode}</h2>
            <p>{guide.calculatorIntro}</p>
          </div>
          <ChmodToolShell
            key={guide.mode}
            initialMode={guide.mode}
            variant="compact"
          />
        </section>

        <article className="guide-article">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <p key={`${section.heading}-${index}`}>
                  {renderInlineContent(paragraph)}
                </p>
              ))}
            </section>
          ))}
        </article>

        <section className="guide-command" aria-labelledby="command-title">
          <div>
            <p className="section-kicker">Command example</p>
            <h2 id="command-title">Apply chmod {guide.mode}</h2>
            <p>{guide.commandIntro}</p>
          </div>
          <div className="guide-command-row">
            <code>{guide.command}</code>
            <CopyCommandButton
              command={guide.command}
              ariaLabel={`Copy ${guide.command}`}
              commandType="octal"
            />
          </div>
        </section>

        <CommonPermissions currentSlug={guide.slug} />
      </div>
    </main>
  );
}
