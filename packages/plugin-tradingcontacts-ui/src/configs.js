module.exports = {
  name: 'tradingcontacts',
  port: 3017,
  scope: 'tradingcontacts',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'tradingcontacts',
    module: './routes'
  },
  menus:[{"text":"Tradingcontactss","to":"/tradingcontactss","image":"/images/icons/erxes-18.svg","location":"settings","scope":"tradingcontacts"}]
};
