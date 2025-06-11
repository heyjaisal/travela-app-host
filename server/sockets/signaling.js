const registerSignalingEvents = (io, socket, getPeerSocket) => {
  // Helper to always get the latest peer socket
  const emitToPeer = (event, data) => {
    const peerSocket = getPeerSocket();
    if (peerSocket?.connected) {
      peerSocket.emit(event, data);
    }
  };

  // --- Join Call ---
  socket.on("joinCall", ({ roomId, callType }) => {
    socket.join(roomId);
    console.log(`🔔 ${socket.id} joined call room ${roomId} (${callType})`);

    const payload = { socketId: socket.id, callType };
    socket.to(roomId).emit("user-joined", payload);
    emitToPeer("user-joined", { ...payload, roomId });
  });

  // --- Signal Relay ---
  socket.on("signal", ({ signal, targetId, callerId }) => {
    console.log(`📡 Signal from ${callerId} to ${targetId}`);
    io.to(targetId).emit("signal", { signal, callerId });
    emitToPeer("signal", { signal, targetId, callerId });
  });

  // --- Reject Call ---
  socket.on("rejectCall", ({ roomId, reason }) => {
    console.log(`❌ Call in ${roomId} rejected by ${socket.id}: ${reason}`);
    const payload = { socketId: socket.id, reason };
    socket.to(roomId).emit("callRejected", payload);
    emitToPeer("callRejected", { ...payload, roomId });
  });

  // --- Leave Call ---
  socket.on("leaveCall", (roomId) => {
    console.log(`👋 ${socket.id} left call room ${roomId}`);
    socket.leave(roomId);
    socket.to(roomId).emit("user-left", socket.id);
    emitToPeer("user-left", { socketId: socket.id, roomId });
  });

  // --- Call Status Updates ---
  socket.on("callAccepted", ({ roomId, socketId }) => {
    console.log(`✅ Call accepted by ${socketId} in room ${roomId}`);
    socket.to(roomId).emit("callAccepted", { socketId });
    emitToPeer("callAccepted", { roomId, socketId });
  });

  socket.on("callEnded", ({ roomId, socketId }) => {
    console.log(`🛑 Call ended by ${socketId} in room ${roomId}`);
    socket.to(roomId).emit("callEnded", { socketId });
    emitToPeer("callEnded", { roomId, socketId });
  });

  socket.on("toggleMute", ({ roomId, socketId, muted }) => {
    console.log(`🔇 ${socketId} ${muted ? "muted" : "unmuted"} in room ${roomId}`);
    socket.to(roomId).emit("toggleMute", { socketId, muted });
    emitToPeer("toggleMute", { roomId, socketId, muted });
  });

  socket.on("toggleVideo", ({ roomId, socketId, videoOn }) => {
    console.log(`📷 ${socketId} turned video ${videoOn ? "on" : "off"} in room ${roomId}`);
    socket.to(roomId).emit("toggleVideo", { socketId, videoOn });
    emitToPeer("toggleVideo", { roomId, socketId, videoOn });
  });

  // --- Forwarded Events from Peer Backend ---
  const peerSocket = getPeerSocket();
  if (peerSocket?.connected) {
    const forward = (event, handler) => {
      peerSocket.off(event).on(event, handler);
    };

    forward("user-joined", ({ socketId, callType, roomId }) => {
      io.to(roomId).emit("user-joined", { socketId, callType });
    });

    forward("signal", ({ signal, targetId, callerId }) => {
      io.to(targetId).emit("signal", { signal, callerId });
    });

    forward("callRejected", ({ socketId, reason, roomId }) => {
      io.to(roomId).emit("callRejected", { socketId, reason });
    });

    forward("user-left", ({ socketId, roomId }) => {
      io.to(roomId).emit("user-left", socketId);
    });

    forward("callAccepted", ({ roomId, socketId }) => {
      io.to(roomId).emit("callAccepted", { socketId });
    });

    forward("callEnded", ({ roomId, socketId }) => {
      io.to(roomId).emit("callEnded", { socketId });
    });

    forward("toggleMute", ({ roomId, socketId, muted }) => {
      io.to(roomId).emit("toggleMute", { socketId, muted });
    });

    forward("toggleVideo", ({ roomId, socketId, videoOn }) => {
      io.to(roomId).emit("toggleVideo", { socketId, videoOn });
    });
  }
};

module.exports = registerSignalingEvents;
