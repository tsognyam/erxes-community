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
      "text":"Nominal Account",
      "url":"/nominal/statement",
      "icon":"icon-star",
      "location":"mainNavigation"
    },
    {
      'text': 'Money Transfer',
      'to': '/nominal/money-transfer',
      'image': '/images/icons/erxes-29.png',
      'location': 'settings',
      'scope': 'nominal',
    },
    {
      'text': 'Transaction Statement',
      'to': '/nominal/transaction-statement',
      'image': '/images/icons/erxes-28.png',
      'location': 'settings',
      'scope': 'nominal',
    },
  ]
};
