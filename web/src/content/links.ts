export type LinkGroup = {
  title: string;
  links: Array<{
    title: string;
    url: string;
    note?: string;
  }>;
};

export const linkGroups: LinkGroup[] = [
  {
    title: "Writing",
    links: [
      {
        title: "Medium",
        url: "https://medium.com/@anas-aboreeda",
        note: "Technical deep dives on software architecture and cloud",
      },
      {
        title: "AWS Tip",
        url: "https://awstip.com/@anas-aboreeda",
        note: "AWS certification study notes and cloud patterns",
      },
      {
        title: "Nerd For Tech",
        url: "https://medium.com/nerd-for-tech",
        note: "Contributing editor for software engineering topics",
      },
    ],
  },
  {
    title: "Code",
    links: [
      {
        title: "GitHub",
        url: "https://github.com/anasaboreeda",
        note: "Open source projects and experiments",
      },
    ],
  },
  {
    title: "Connect",
    links: [
      {
        title: "LinkedIn",
        url: "https://linkedin.com/in/anasaboreeda",
        note: "Professional network and career updates",
      },
      {
        title: "Email",
        url: "mailto:info@anascode.com",
        note: "Direct contact",
      },
    ],
  },
];
