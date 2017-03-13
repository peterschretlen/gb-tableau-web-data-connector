'use strict';
const express = require('express');
const httpProxy = require('http-proxy');
const https = require('https');
const fs = require('fs');

const conf = require('./conf.js');

const port = process.argv[2] || 8000;
const appName = "/";
const app = express();

/**********************************
/* PROXY for routing non-CORS API calls
*/

const httpsAgent = new https.Agent({ keepAlive:true, maxSockets:10 });

const proxyOptions = {
    changeOrigin: true,
    target: `https://${conf.client}.groupbycloud.com`,
    agent: httpsAgent
};

const apiProxy = httpProxy.createProxyServer(proxyOptions);

httpProxy.prototype.onError = function (err) {
    console.log(err);
};

const logPost = function(request){
    if(request.method !== 'POST')   
        return;

    let body = "";
    request.on('data', function (chunk) {body += chunk;});
    request.on('end', function () { console.log('POSTED DATA: ' + body);});
};

apiProxy.on('proxyReq', (proxyReq, req, res, options) => {
  proxyReq.setHeader('Authorization', conf.key);
  logPost(req);
});


apiProxy.on('proxyRes', (proxyRes, req, res, options) => {
  console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
});

app.use(appName, express.static(__dirname + '/src/public/'));

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});


//all requests route through here!
app.all('*', function(req, res) {
  
  console.log(req.url);

  if(req.url.startsWith('/wisdom/')){

    apiProxy.web(req, res);
    //console.log( JSON.stringify(req.headers, null, '\t') );

    res.on('finish', function() { console.log("The proxy request was completed"); });
    return;
  }

  console.log("Sending request " + req.url + " to app" );
  res.sendFile(__dirname + '/src/public/index.html');
});