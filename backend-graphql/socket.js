let io;
const { Server } = require("socket.io");

module.exports = {
  init: httpServer => {
    io = new Server(httpServer, {
      cors: {
        origin: '*',
        allowedHeaders: '*',
        credentials: true,
      }
    })
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('socket.io connection unestablished.')
    }
    return io
  }
}




