module.exports = {
  name: 'commission',
  port: 3021,
  scope: 'commission',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3021/remoteEntry.js',
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