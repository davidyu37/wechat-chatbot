require('dotenv').config();
const express = require('express');
const http = require('http');
const wechat = require('wechat'); // Github: https://github.com/node-webot/wechat

const app = express();
const router = express.Router();

const config = {
  token: process.env.TOKEN,
  appid: process.env.APP_ID,
  // encodingAESKey: ''
};


app.use(express.query());
app.use('/wechat', wechat(config, function (req, res, next) {
  // All WeChat related info are in req.weixin
  var message = req.weixin;
  console.log(message);
  // Wechat expects you to respond, or else it will tell the user that the service is unavailable after three tries.
  res.reply(message);
  // Doc: https://github.com/node-webot/wechat/blob/master/README.en.md
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

server.on('error', onError);
server.on('listening', onListening);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
