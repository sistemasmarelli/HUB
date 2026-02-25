
const PROXY_CONFIG = [
   {
      context: ['/totvs-rest', '/totvs-login', '/dts/datasul-rest/resources', '/api'],
      //target: 'http://CXSSRVT1206:8080',
      target: 'http://192.168.56.101:8080',
      secure: false,
      changeOrigin: false,
      logLevel: 'debug',
      autoRewrite: false
   }
];
module.exports = PROXY_CONFIG;