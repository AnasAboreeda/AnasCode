import { linkGroups } from "@/content/links";

import Heading from "../atoms/Heading";
import LinkText from "../atoms/LinkText";
import Text from "../atoms/Text";

export default function LinksGroups() {
  return (
    <div>
      {linkGroups.map((group) => (
        <section key={group.title} className="mb-12">
          <Heading level={2} className="mb-6">
            {group.title}
          </Heading>
          <ul className="list-none p-0 space-y-6">
            {group.links.map((link) => (
              <li
                key={link.url}
                className="border-l-2 pl-4 py-2"
                style={{ borderColor: "var(--color-accent)" }}
              >
                <LinkText href={link.url} external className="font-semibold text-lg">
                  {link.title} →
                </LinkText>
                {link.note && (
                  <Text as="span" className="block text-sm text-zinc-600 dark:text-zinc-400 mt-2 mb-0">
                    {link.note}
                  </Text>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
