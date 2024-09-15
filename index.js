const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const TARGET_URL = 'http://26.0.163.162:8088/Api';
const SECURE_PROXY = 'true';
const PORT=7088

const app = express();
app.use(cors({ origin: "*", credentials: true, optionSuccessStatus: 200 }));


// Default route for health check
app.get('/', (req, res) => {
  res.send('WELCOME! in the wonderful world to service by the Server 6:26');
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}, targeting: ${TARGET_URL}`);
});


app.use('/api', createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true,
  secure: SECURE_PROXY,
  pathRewrite: { '^/api': '' },
  timeout: 10000, // Set timeout to 10 seconds
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request: ${req.method} ${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Received response status code: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error(`Proxy error: ${err.message}`);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Something went wrong with the proxy server.');
  },
}));

// Only export the app, do not call app.listen() when deploying to Vercel
module.exports = app;

