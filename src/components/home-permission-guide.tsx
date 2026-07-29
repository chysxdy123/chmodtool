import Link from 'next/link';
import messages from '@/i18n/messages/en.json';

const guide = messages.home.guide;

export function HomePermissionGuide() {
  return (
    <article className="home-guide" aria-labelledby="home-guide-title">
      <section>
        <h2 id="home-guide-title">{guide.introduction.title}</h2>
        {guide.introduction.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p>
          {guide.introduction.presetParagraph.map((item, index) =>
            item.href ? (
              <Link href={item.href} key={`${item.href}-${index}`}>
                {item.text}
              </Link>
            ) : (
              item.text
            )
          )}
        </p>
      </section>

      {[guide.notation, guide.permissionMeaning, guide.safeMode].map(
        (section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        )
      )}

      <section className="home-faq">
        <h2>{guide.faq.title}</h2>
        <dl>
          {guide.faq.items.map((item) => (
            <div key={item.question}>
              <dt>{item.question}</dt>
              <dd>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
