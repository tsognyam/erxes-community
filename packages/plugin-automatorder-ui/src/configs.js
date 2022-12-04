module.exports = {
  name: 'automatorder',
  port: 3107,
  scope: 'automatorder',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3107/remoteEntry.js',
    scope: 'automatorder',
    module: './routes'
  },
  menus:[{"text":"Automat Orders","url":"/automatorders","icon":"icon-star","location":"mainNavigation"}]
};
