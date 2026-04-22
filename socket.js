const { Server } = require("socket.io");
const driverService = require("./src/services/driverService");

let io;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    socket.on("driver:status", async ({ user, isOnline }) => {
      await driverService.setDriverStatus(user, isOnline, io.emit.bind(io));
    });

    socket.on("driver:accept_order", async ({ user, orderId }) => {
      console.log("driver:accept_order received:", {
        user: user?.UserID,
        orderId,
      });
      await driverService.acceptOrder(user, orderId, io.emit.bind(io));
    });

    socket.on("driver:reject_order", async ({ user, orderId }) => {
      await driverService.rejectOrder(user, orderId, io.emit.bind(io));
    });

    socket.on("driver:update_status", async ({ user, orderId, status }) => {
      await driverService.updateDeliveryStatus(
        user,
        orderId,
        status,
        io.emit.bind(io),
      );
    });
  });
}

// export io so other files can emit if needed later
function getIO() {
  if (!io) throw new Error("Socket not initialized");
  return io;
}

function emit(event, data) {
  if (!io) {
    return;
  }
  io.emit(event, data);
}

module.exports = { initSocket, emit };
