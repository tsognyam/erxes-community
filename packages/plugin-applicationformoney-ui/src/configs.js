module.exports = {
  name: 'applicationformoney',
  port: 3017,
  scope: 'applicationformoney',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'applicationformoney',
    module: './routes'
  },
  menus:[
    {
      text:"Applicationformoney",
      url:"/applicationformoney",
      icon:"icon-star",
      location:"mainNavigation"
    }
  ]
};
