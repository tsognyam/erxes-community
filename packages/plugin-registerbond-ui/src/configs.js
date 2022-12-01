module.exports = {
  name: 'registerbond',
  port: 3017,
  scope: 'registerbond',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'registerbond',
    module: './routes'
  },
  menus:[
    {
      text:"Registerbond",
      url:"/bond-list",
      icon:"icon-star",
      location:"mainNavigation"
    }
  ]
};
