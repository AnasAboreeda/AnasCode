import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import LinksGroups from "@/components/organisms/LinksGroups";
import SingleColumn from "@/components/templates/SingleColumn";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: site.pages.links.title,
  description: site.pages.links.description,
  path: "/links",
});

export default function LinksPage() {
  return (
    <SingleColumn>
      <Heading level={1}>{site.pages.links.title}</Heading>
      <Text className="text-zinc-600 dark:text-zinc-400 mb-8">
        {site.pages.links.description}
      </Text>
      <LinksGroups />
    </SingleColumn>
  );
}
