var amqp = require('amqplib/callback_api')
var creds = require('./credentials')
var restify = require('restify')
process.env.TW_API = '1234567890'
process.env.TW_SUB = 'subdomain'
// const tw = require('teamwork-api')()

function send (req, res, next) {
  console.log('Restify GET send()')
  amqp.connect(creds, function (err, conn) {
    conn.createChannel(function (err, ch) {
      var q = 'hello'
      var msg = req.params.action + ' ' + req.params.name

      ch.assertQueue(q, {durable: false})
      // Note: on Node 6 Buffer.from(msg) should be used
      ch.sendToQueue(q, new Buffer(msg))
      console.log(' [x] Sent %s', msg)
    })
    setTimeout(function () { conn.close() }, 500)
  })
  res.send(`done:  + ${JSON.stringify(req.params)} 
  ----------------------------------
   ${res}`)
  next()
}

function respond (req, res, next) {
  res.send('hello ' + req.params.name)
  next()
}

var server = restify.createServer()
server.get('/:action/:name', send)
// server.head('/:action/:name', send)

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url)
})
