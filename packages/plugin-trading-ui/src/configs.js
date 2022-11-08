module.exports = {
  name: 'trading',
  port: 3012,
  scope: 'trading',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3012/remoteEntry.js',
    scope: 'trading',
    module: './routes'
  },
  menus: [
    {
      text: 'Domestic trading',
      url: '/tradings/order-list',
      icon: 'icon-laptop',
      location: 'mainNavigation'
    },
    {
      text: 'Order List',
      to: '/tradings/order-list',
      image: '/images/icons/erxes-29.png',
      location: 'settings',
      scope: 'trading',
    },
    {
      text: 'Skills',
      to: '/settings/skills',
      image: '/images/icons/erxes-29.png',
      location: 'settings',
      scope: 'trading',
    },
  ]
};