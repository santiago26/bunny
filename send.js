var amqp = require('amqplib/callback_api')
var creds = require('./credentials')
function send (text) {
  amqp.connect(creds, function (err, conn) {
    conn.createChannel(function (err, ch) {
      var q = 'hello'
      var msg = text

      ch.assertQueue(q, {durable: false})
    // Note: on Node 6 Buffer.from(msg) should be used
      ch.sendToQueue(q, new Buffer(msg))
      console.log(' [x] Sent %s', msg)
    })
    setTimeout(function () { conn.close(); process.exit(0) }, 500)
  })
}

send('Hello World! HelloHello')
