module.exports = {
  name: 'commission',
  port: 3014,
  scope: 'commission',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3014/remoteEntry.js',
    scope: 'commission',
    module: './routes'
  },
  menus: [
    {
      text: 'Trading Commission',
      url: '/commission',
      icon: 'icon-window-grid',
      location: 'mainNavigation'
    }
  ]
};