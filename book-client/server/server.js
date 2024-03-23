const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));
app.use(cors());

app.use('/api', createProxyMiddleware({
    target: 'http://localhost:8088/api/graphql', // this is your internal server
    changeOrigin: true,
    timeout: 15000, // 15 seconds timeout
    onProxyRes: function (proxyRes, req, res) {
        let body = [];
        proxyRes.on('data', function (chunk) {
            body.push(chunk);
        });
        proxyRes.on('end', function () {
            body = Buffer.concat(body).toString();
            console.log("Response body:", body);
            console.log("Response headers:", proxyRes.headers);
        });
    }
}));


app.listen(5015, () => {
    console.log('Proxy server is running on port 5005');
});