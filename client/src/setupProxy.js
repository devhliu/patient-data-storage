const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://127.0.0.1:5000',
      // target: 'https://patient-data-storage.herokuapp.com',
      changeOrigin: true,
    })
  );
};