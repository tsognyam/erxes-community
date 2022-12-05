module.exports = {
  name: 'registerorder',
  port: 3017,
  scope: 'registerorder',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'registerorder',
    module: './routes'
  },
  menus:[{"text":"Register Orders","url":"/register-orders","icon":"icon-star","location":"mainNavigation"}]
};
