import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import SingleColumn from "@/components/templates/SingleColumn";
import { about } from "@/content/about";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description: about.intro,
  path: "/about",
});

export default function AboutPage() {
  return (
    <SingleColumn>
      <Heading level={1}>About</Heading>

      <section className="mb-8">
        <Text className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {about.intro}
        </Text>
      </section>

      <section className="mb-8">
        <Text className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {about.background}
        </Text>
      </section>

      <section className="mb-8">
        <Text className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {about.currentFocus}
        </Text>
      </section>

      {/* Career Timeline */}
      <section className="mb-12">
        <Heading level={2} className="text-2xl mb-6">
          Career Journey
        </Heading>
        <div className="space-y-8">
          {about.timeline.map((period, index) => (
            <div key={index} className="relative mt-2 pl-8 border-l-2 border-(--color-light-shade)/40 dark:border-(--color-dark-shade)">
              <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-(--color-dark-shade) dark:bg-(--color-light-shade)"></div>
              <div className="mb-2">
                <span className="text-sm font-semibold text-(--color-dark-shade) dark:text-(--color-light-shade)">
                  {period.year}
                </span>
                <Heading level={3} className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  {period.title}
                </Heading>
                {"company" in period && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {period.company} {"location" in period && period.location && `• ${period.location}`}
                  </p>
                )}
                {"location" in period && !("company" in period) && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {period.location}
                  </p>
                )}
              </div>
              <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
                {period.achievements.map((achievement, i) => (
                  <li key={i} className="text-sm leading-relaxed flex">
                    <span className="mr-2 text-(--color-dark-shade) dark:text-(--color-light-shade)">→</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Expertise */}
      <section className="mb-12">
        <Heading level={2} className="text-2xl mb-6">
          Expertise
        </Heading>

        <div className="mb-6">
          <Heading level={3} className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
            Leadership & Team Building
          </Heading>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
            {about.expertise.leadership.map((item, i) => (
              <li key={i} className="text-sm flex">
                <span className="mr-2 text-(--color-dark-shade) dark:text-(--color-light-shade)">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <Heading level={3} className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
            Architecture & System Design
          </Heading>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
            {about.expertise.architecture.map((item, i) => (
              <li key={i} className="text-sm flex">
                <span className="mr-2 text-(--color-dark-shade) dark:text-(--color-light-shade)">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Heading level={3} className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
            Technical Skills
          </Heading>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
            {about.expertise.technical.map((item, i) => (
              <li key={i} className="text-sm flex">
                <span className="mr-2 text-(--color-dark-shade) dark:text-(--color-light-shade)">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Philosophy */}
      <section className="mb-12">
        <Heading level={2} className="text-2xl mb-6">
          Engineering Philosophy
        </Heading>
        <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
          {about.philosophy.map((principle, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-3 text-lg text-(--color-dark-shade) dark:text-(--color-light-shade)">→</span>
              <span className="leading-relaxed">{principle}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Interests */}
      <section className="mb-12">
        <Heading level={2} className="text-2xl mb-6">
          Interests & Focus Areas
        </Heading>
        <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
          {about.interests.map((interest, index) => (
            <li key={index} className="flex">
              <span className="mr-2 text-(--color-dark-shade) dark:text-(--color-light-shade)">•</span>
              <span>{interest}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Achievements */}
      <section className="mb-12">
        <Heading level={2} className="text-2xl mb-6">
          Key Achievements
        </Heading>
        <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
          {about.achievements.map((achievement, index) => (
            <li key={index} className="flex">
              <span className="mr-2 text-(--color-dark-shade) dark:text-(--color-light-shade)">✓</span>
              <span>{achievement}</span>
            </li>
          ))}
        </ul>
      </section>
    </SingleColumn>
  );
}
