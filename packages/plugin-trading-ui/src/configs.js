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
      // scope: 'trading',
      location: 'mainNavigation',
      icon: 'icon-piggy-bank',
    },
    {
      text: 'Stock List',
      to: '/trading/stock-list',
      scope: 'trading',
      location: 'settings',
      image: '/images/icons/erxes-18.svg',
      permission: 'tradingStockShow'
    },
    {
      text: 'Stock Order',
      to: '/trading/stock-order',
      scope: 'trading',
      location: 'settings',
      image: '/images/icons/erxes-18.svg',
      permission: 'tradingOrderShow'
    },
    {
      text: 'Order List',
      to: '/trading/order-list',
      scope: 'trading',
      location: 'settings',
      image: '/images/icons/erxes-18.svg',
      permission: 'tradingOrderShow'
    },
    {
      text: 'Wallet List',
      to: '/trading/wallet-list',
      scope: 'trading',
      location: 'settings',
      image: '/images/icons/erxes-18.svg',
      permission: 'tradingWalletShow'
    },
    {
      text: 'Withdraw List',
      to: '/trading/withdraw-list',
      scope: 'trading',
      location: 'settings',
      image: '/images/icons/erxes-18.svg',
      permission: 'tradingWithdrawShow'
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
    },
    {
      text: 'Settlement list',
      to: '/trading/settlement-list',
      location: 'settings',
      scope: 'trading',
      image: '/images/icons/erxes-18.svg',
    },
  ]
};