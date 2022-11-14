import { FooterLinkType } from 'uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    label: t('About'),
    items: [
      {
        label: t('Contact'),
        href: 'https://pye.net/',
      },
      {
        label: t('Brand'),
        href: 'https://pye.net/',
      },
      {
        label: t('Blog'),
        href: 'https://pye.net',
      },
      {
        label: t('Apple PYE'),
        href: 'https://pye.net/',
      },
      {
        label: t('Cherry PYE'),
        href: 'https://pye.net/',
      },
    ],
  },
  {
    label: t('Help'),
    items: [
      {
        label: t('Customer Support'),
        href: 'https://pye.net/',
      },
      {
        label: t('Troubleshooting'),
        href: 'https://pye.net/',
      },
      {
        label: t('Guides'),
        href: 'https://pye.net/',
      },
    ],
  },
  {
    label: t('Developers'),
    items: [
    //  {
    //    label: 'Github',
    //    href: 'https://github.com/pyeswap',
    //  },
      {
        label: t('Documentation'),
        href: 'https://pye.net',
      },
    //  {
    //    label: t('Bug Bounty'),
    //    href: 'https://docs.pye.net/code/bug-bounty',
    //  },
    //  {
    //    label: t('Audits'),
    //    href: 'https://docs.pye.net/help/faq#is-pyeswap-safe-has-pyeswap-been-audited',
    //  },
      {
        label: t('Careers'),
        href: 'https://devteamsix.com',
      },
    ],
  },
]
