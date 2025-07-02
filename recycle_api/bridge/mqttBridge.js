// mqttBridge.js
const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const userSocketMap = {}; // userId -> socket.id

const {
  AWS_IOT_ENDPOINT,
  AWS_IOT_CERT,
  AWS_IOT_KEY,
  AWS_IOT_CA,
  JWT_SECRET,
  CLIENT_ID
} = process.env;


function createMqttBridge(io) {

  //handshake authentication for socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth.token; // get token from client handshake

    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET); // verify token

      socket.user = payload; // attach user data to socket
      userSocketMap[payload.username] = socket.id; // map user to socket
      console.log(userSocketMap);
      
      next(); // allow connection
    } catch (err) {
      return next(new Error('Authentication error: Invalid token or expired'));
    }
  });

  io.on('connection', (socket) => {
    socket.emit('message', `Welcome ${socket.user.username}!`);
  });

  const client = mqtt.connect({
    host: AWS_IOT_ENDPOINT,
    protocol: 'mqtts',
    port: 8883,
    clientId: CLIENT_ID,
    key: fs.readFileSync(path.resolve(AWS_IOT_KEY)),
    cert: fs.readFileSync(path.resolve(AWS_IOT_CERT)),
    ca: fs.readFileSync(path.resolve(AWS_IOT_CA)),
    reconnectPeriod: 1000,
  });

  client.on('connect', () => {
    console.log('[MQTT] connected to AWS IoT Core');
    client.subscribe('innovation/recycle_events', { qos: 1 }, (err) => {
      if (err) console.error('Subscribe error', err);
      else console.log('Subscribed → innovation/recycle_events');
    });
  });

  client.on('message', async (topic, messageBuffer) => {
    if (topic !== 'innovation/recycle_events') return; // single‑topic guard

    let msg;
    try {
      msg = JSON.parse(messageBuffer.toString());
      console.log(msg);

    } catch (e) {
      console.error('Invalid JSON payload', e);
      return;
    }

    const { type, material, username } = msg;
    const socketId = userSocketMap[username]; // get socket id from map

    switch (type) {
      case 'SCAN':
        //await redis.set(`session:${binId}`, JSON.stringify({ userId }), 'EX', 120);
        io.to(`${socketId}`).emit('scan-success');
        break;

      case 'ITEM':
        //await db.User.updateOne({ _id: userId }, { $inc: { canCount: 1 } });
        //const user = await db.User.findById(userId, { canCount: 1 });
        console.log(`User ${username} canCount: ${material}`);
        
        io.to(`${socketId}`).emit('count',{material});
        //await redis.expire(`session:${binId}`, 120); // keep‑alive session
        break;

      case 'FINISH':
        //await redis.del(`session:${binId}`);
        io.to(`${socketId}`).emit('session-ended', message || 'ended');
        break;

      default:
        console.warn('Unknown event type', type);
    }
  });

  /**
   * Helper to publish an event back onto the same topic.
   * e.g., publishEvent({ type: 'FINISH', binId, userId, ts: Date.now() })
   */
  function publishEvent(event) {
    client.publish(
      'innovation/recycle_events',
      JSON.stringify(event),
      { qos: 1 },
      (err) => err && console.error('Publish error', err),
    );
  }

  return { publishEvent }
}
module.exports = { createMqttBridge };
