module.exports = {
  name: 'contract',
  port: 3023,
  scope: 'contract',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3023/remoteEntry.js',
    scope: 'contract',
    module: './routes'
  },
  menus: [
    {
      text: 'Contracts',
      url: '/contract',
      icon: 'icon-window-grid',
      location: 'mainNavigation'
    }
  ]
};