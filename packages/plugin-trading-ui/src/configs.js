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
      url: '/domestic/order-list',
      icon: 'icon-laptop',
      location: 'mainNavigation'
    },
    {
      text: 'Stock List',
      to: '/domestic/stock-list',
      image: '/images/icons/erxes-29.png',
      location: 'settings',
      scope: 'trading',
    },
    {
      text: 'Stock Order',
      to: '/domestic/stock-order',
      image: '/images/icons/erxes-29.png',
      location: 'settings',
      scope: 'trading',
    },
    {
      text: 'Order List',
      to: '/domestic/order-list',
      image: '/images/icons/erxes-29.png',
      location: 'settings',
      scope: 'trading',
    },
  ]
};