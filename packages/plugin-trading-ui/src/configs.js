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
      text: 'Trading',
      url: '/trading/order-list',
      icon: 'icon-laptop',
      location: 'mainNavigation',
    },
    {
      text: 'Stock List',
      to: '/trading/stock-list',
      location: 'settings',
      scope: 'trading',
      image: '/images/icons/erxes-18.svg',
    },
    {
      text: 'Stock Order',
      to: '/trading/stock-order',
      location: 'settings',
      scope: 'trading',
      image: '/images/icons/erxes-18.svg',
    },
    {
      text: 'Order List',
      to: '/trading/order-list',
      location: 'settings',
      scope: 'trading',
      image: '/images/icons/erxes-18.svg',
    },
    {
      text: 'Wallet List',
      to: '/trading/wallet-list',
      location: 'settings',
      scope: 'trading',
      image: '/images/icons/erxes-18.svg',
    },
    {
      text: 'Statement List',
      to: '/trading/statement-list',
      location: 'settings',
      scope: 'trading',
      image: '/images/icons/erxes-18.svg',
    },
    {
      text: 'Withdraw List',
      to: '/trading/withdraw-list',
      location: 'settings',
      scope: 'trading',
      image: '/images/icons/erxes-18.svg',
    },
  ]
};