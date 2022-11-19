module.exports = {
  name: "stockTransfer",
  port: 3016,
  scope: "stockTransfer",
  exposes: {
    "./routes": "./src/routes.tsx",
  },
  routes: {
    url: "http://localhost:3016/remoteEntry.js",
    scope: "stockTransfer",
    module: "./routes",
  },
  menus: [
    {
      text: "Stock Transfer Request",
      url: "/stockTransfer",
      icon: "icon-window-grid",
      location: "mainNavigation",
    },
  ],
};
