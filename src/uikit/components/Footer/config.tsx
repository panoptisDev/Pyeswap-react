import { Language } from "../LangSelector/types";
import { FooterLinkType } from "./types";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://docs.pye.net/contact-us",
      },
      {
        label: "Blog",
        href: "https://pyeswap.medium.com/",
      },
      {
        label: "Community",
        href: "https://docs.pye.net/contact-us/telegram",
      },
      {
        label: "PYE",
        href: "https://docs.pye.net/tokenomics/pye",
      },
      {
        label: "—",
      },
      {
        label: "Online Store",
        href: "https://pye.creator-spring.com/",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer",
        href: "Support https://docs.pye.net/contact-us/customer-support",
      },
      {
        label: "Troubleshooting",
        href: "https://docs.pye.net/help/troubleshooting",
      },
      {
        label: "Guides",
        href: "https://docs.pye.net/get-started",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/pyeswap",
      },
      {
        label: "Documentation",
        href: "https://docs.pye.net",
      },
      {
        label: "Bug Bounty",
        href: "https://app.gitbook.com/@pyeswap-1/s/pyeswap/code/bug-bounty",
      },
      {
        label: "Audits",
        href: "https://docs.pye.net/help/faq#is-pyeswap-safe-has-pyeswap-been-audited",
      },
      {
        label: "Careers",
        href: "https://docs.pye.net/hiring/become-a-chef",
      },
    ],
  },
];

export const socials = [
  {
    label: "Twitter",
    icon: "Twitter",
    href: "https://twitter.com/pyeswap",
  },
  {
    label: "Telegram",
    icon: "Telegram",
    items: [
      {
        label: "English",
        href: "https://t.me/pyeswap",
      },
      {
        label: "Bahasa Indonesia",
        href: "https://t.me/PyeSwapIndonesia",
      },
      {
        label: "中文",
        href: "https://t.me/PyeSwap_CN",
      },
      {
        label: "Tiếng Việt",
        href: "https://t.me/PyeSwapVN",
      },
      {
        label: "Italiano",
        href: "https://t.me/pyeswap_ita",
      },
      {
        label: "русский",
        href: "https://t.me/pyeswap_ru",
      },
      {
        label: "Türkiye",
        href: "https://t.me/pyeswapturkiye",
      },
      {
        label: "Português",
        href: "https://t.me/PyeSwapPortuguese",
      },
      {
        label: "Español",
        href: "https://t.me/PyeswapEs",
      },
      {
        label: "日本語",
        href: "https://t.me/pyeswapjp",
      },
      {
        label: "Français",
        href: "https://t.me/pyeswapfr",
      },
      {
        label: "Announcements",
        href: "https://t.me/PyeSwapAnn",
      },
      {
        label: "Whale Alert",
        href: "https://t.me/PyeSwapWhales",
      },
    ],
  },
  {
    label: "Reddit",
    icon: "Reddit",
    href: "https://reddit.com/r/pyeswap",
  },
  {
    label: "Instagram",
    icon: "Instagram",
    href: "https://instagram.com/pyeswap_official",
  },
  {
    label: "Github",
    icon: "Github",
    href: "https://github.com/pyeswap/",
  },
  {
    label: "Discord",
    icon: "Discord",
    href: "https://discord.gg/pyeswap",
  },
];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
