const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Admin joins the admin room
    socket.on('join-admin', () => {
      socket.join('admin');
      console.log(`👨‍💼 Admin joined: ${socket.id}`);
    });

    // Customer joins their order-specific room for status updates
    socket.on('join-order', (orderId) => {
      socket.join(`order-${orderId}`);
      console.log(`👤 Customer joined order room: order-${orderId}`);
    });

    // Leave order room
    socket.on('leave-order', (orderId) => {
      socket.leave(`order-${orderId}`);
      console.log(`👤 Customer left order room: order-${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;
