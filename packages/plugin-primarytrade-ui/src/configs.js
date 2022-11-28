module.exports = {
  name: 'primarytrade',
  port: 3023,
  scope: 'primarytrade',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3023/remoteEntry.js',
    scope: 'primarytrade',
    module: './routes'
  },
  menus: [
    {
      text: 'Primary trade',
      url: '/primarytrade',
      icon: 'icon-window-grid',
      location: 'mainNavigation'
    }
  ]
};