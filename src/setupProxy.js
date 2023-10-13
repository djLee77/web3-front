const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      // 백엔드 주소
      target: "https://port-0-mall-deploy-jvvy2blm8p9dcp.sel5.cloudtype.app/",
      changeOrigin: true,
    })
  );
};