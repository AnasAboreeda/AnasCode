export const site = {
  title: "Anas Aboreeda",
  description:
    "Software Engineering Manager & Architect at Scopus AI and LeapSpace (Elsevier AI solutions). Building AI-powered systems, leading engineering teams, and architecting scalable solutions.",
  url: "https://www.anascode.com",
  author: {
    name: "Anas Aboreeda",
    email: "info@anascode.com",
    location: "Amsterdam, The Netherlands",
  },
  nav: [
    { href: "/articles", label: "Articles" },
    { href: "/links", label: "Links" },
    { href: "/about", label: "About" },
  ],
  footer: {
    links: [
      { href: "https://github.com/anasaboreeda", label: "GitHub", external: true },
      { href: "https://linkedin.com/in/anasaboreeda", label: "LinkedIn", external: true },
      { href: "https://medium.com/@anas-aboreeda", label: "Medium", external: true },
      { href: "/rss", label: "RSS", external: false },
      { href: "/sitemap-page", label: "Sitemap", external: false },
    ],
  },
  pages: {
    home: {
      title: "Anas Aboreeda",
      subtitle: "Software Engineering Manager & Architect building AI-powered systems at scale.",
      tagline: "Based in Amsterdam, managing engineering teams at Scopus AI and LeapSpace (Elsevier AI solutions). 22+ years crafting software, 12+ years driving innovation across international companies, 5+ years shaping teams and architecture.",
      recentArticlesTitle: "Recent articles",
      viewAllArticlesText: "View all articles →",
    },
    articles: {
      title: "Articles",
      description: "Technical insights on AI systems, microservices architecture, cloud engineering, security, and engineering leadership. Sharing lessons from building scalable systems and leading high-performing teams.",
    },
    links: {
      title: "Links",
      description: "Places to find me across the web.",
    },
  },
} as const;
