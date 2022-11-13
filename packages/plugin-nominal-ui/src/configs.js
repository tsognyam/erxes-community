module.exports = {
  name: 'nominal',
  port: 3017,
  scope: 'nominal',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'nominal',
    module: './routes'
  },
  menus:[
    {
      "text":"Nominal",
      "url":"/nominal",
      "icon":"icon-star",
      "location":"mainNavigation"}]
};
