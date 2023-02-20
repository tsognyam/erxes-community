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
      url: '/trading/home',
      icon: 'icon-dashboard',
      location: 'settings',
    },
    {
      text: 'Stock List',
      url: '/trading/stock-list',
      icon: 'icon-laptop',
      location: 'settings',
    },
    {
      text: 'Stock Order',
      url: '/trading/stock-order',
      icon: 'icon-laptop',
      location: 'settings',
    },
    {
      text: 'Order List',
      url: '/trading/order-list',
      icon: 'icon-laptop',
      location: 'settings',
    },
    {
      text: 'Wallet List',
      url: '/trading/wallet-list',
      icon: 'icon-wallet',
      location: 'settings',
    },
    {
      text: 'Withdraw List',
      url: '/trading/withdraw-list',
      icon: 'icon-laptop',
      location: 'settings',
    },
    {
      text: 'Nominal statement list',
      to: '/trading/nominal-statement-list',
      location: 'settings',
      scope: 'trading',
      image: '/images/icons/erxes-18.svg',
    },
    {
      text: 'Contract note list',
      to: '/trading/contract-list',
      location: 'settings',
      scope: 'trading',
      image: '/images/icons/erxes-18.svg',
    }
  ]
};