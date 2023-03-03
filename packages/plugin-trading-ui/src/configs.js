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
      to: '/trading/home',
      scope: 'trading',
      location: 'settings',
      image: '/images/icons/erxes-18.svg',
    },
    {
      text: 'Stock List',
      to: '/trading/stock-list',
      scope: 'trading',
      location: 'settings',
      image: '/images/icons/erxes-18.svg',
    },
    {
      text: 'Stock Order',
      to: '/trading/stock-order',
      scope: 'trading',
      location: 'settings',
      image: '/images/icons/erxes-18.svg',
    },
    {
      text: 'Order List',
      to: '/trading/order-list',
      scope: 'trading',
      location: 'settings',
      image: '/images/icons/erxes-18.svg',
    },
    {
      text: 'Wallet List',
      to: '/trading/wallet-list',
      scope: 'trading',
      location: 'settings',
      image: '/images/icons/erxes-18.svg',
    },
    {
      text: 'Withdraw List',
      to: '/trading/withdraw-list',
      scope: 'trading',
      location: 'settings',
      image: '/images/icons/erxes-18.svg',
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