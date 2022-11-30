module.exports = {
  name: 'toporganizations',
  port: 3017,
  scope: 'toporganizations',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'toporganizations',
    module: './routes'
  },
  menus:[
    {
      text:"TopOrganizations",
      url:"/topOrganizations",
      icon:"icon-star",
      location:"mainNavigation"
    }
  ]
};
