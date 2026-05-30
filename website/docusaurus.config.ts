import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'Burokku',
  tagline: 'A modern WordPress block theme',
  favicon: 'img/favicon.ico',

  url: 'https://spaghetti-dojo.github.io',
  baseUrl: '/burokku/',

  organizationName: 'Spaghetti-Dojo',
  projectName: 'burokku',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: '../docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/Spaghetti-Dojo/burokku/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Burokku',
      items: [
        {
          href: 'https://github.com/Spaghetti-Dojo/burokku',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'WordPress CSS',
              to: '/wordpress-css',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Spaghetti-Dojo/burokku',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Spaghetti Dojo.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
