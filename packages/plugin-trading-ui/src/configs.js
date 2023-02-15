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
      icon: 'icon-laptop',
      location: 'mainNavigation',
    },
    {
      text: 'Stock List',
      url: '/trading/stock-list',
      icon: 'icon-laptop',
      location: 'mainNavigation',
    },
    {
      text: 'Stock Order',
      url: '/trading/stock-order',
      icon: 'icon-laptop',
      location: 'mainNavigation',
    },
    {
      text: 'Order List',
      url: '/trading/order-list',
      icon: 'icon-laptop',
      location: 'mainNavigation',
    },
    {
      text: 'Wallet List',
      url: '/trading/wallet-list',
      icon: 'icon-laptop',
      location: 'mainNavigation',
    },
    {
      text: 'Withdraw List',
      url: '/trading/withdraw-list',
      icon: 'icon-laptop',
      location: 'mainNavigation',
    },
    {
      text: 'Nominal statement list',
      url: '/trading/nominal-statement-list',
      icon: 'icon-laptop',
      location: 'mainNavigation',
    }
  ]
};