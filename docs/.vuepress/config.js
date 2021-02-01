module.exports = {
    theme: "cosmos",
    title: "Vite.js",
    base: process.env.VUEPRESS_BASE || '/',

    locales: {
      "/": {
        lang: "en-US"
      },
    },

    themeConfig: {
      repo: "vitelabs/vite.js",
      docsRepo: "vitelabs/vite.js",
      docsDir: 'docs',
      editLinks: true,
      logo: {
        src: '/logo.svg',
      },
      custom: true,
      algolia: {
        id: "BH4D9OD16A",
        key: "ac317234e6a42074175369b2f42e9754",
        index: "cosmos-sdk"
      },
      topbar: {
        banner: false
      },
      sidebar: {
        // Auto-sidebar, true by default
        auto: true,
        nav: [
          {
            title: "Resources",
            children: [
              {
                title: "vite.org",
                path: "https://vite.org"
              }
            ]
          }
        ]
      },
      footer: {
        logo: "/logo.svg",
        textLink: {
          text: "vite.org",
          url: "https://vite.org"
        },
        services: [
          {
            service: "twitter",
            url: "https://twitter.com/vitelabs"
          },
          {
            service: "medium",
            url: "https://medium.com/vitelabs"
          },
          {
            service: "telegram",
            url: "https://t.me/vite_ann"
          },
          {
            service: "discord",
            url: "https://discord.com/invite/CsVY76q"
          },
          {
            service: "github",
            url: "https://github.com/vitelabs"
          }
        ],
        smallprint:
          `© ${new Date().getFullYear()} Vite Labs.`,
      }
    },
};