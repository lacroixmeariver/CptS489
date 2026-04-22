console.log("driver.js loaded");
const socket = io();

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

function toggleOnlineStatus(cb) {
  const dot = document.getElementById("status-dot");
  const text = document.getElementById("status-text");
  const isOnline = cb.checked;

  dot.classList.toggle("active", isOnline);
  text.textContent = isOnline ? "You are Online" : "You are Offline";
  socket.emit("driver:status", {
    user: currentUser,
    isOnline,
  });
}

// Incoming order offer — show accept/reject UI
socket.on("driver:order_offer", ({ driver, order }) => {
  if (driver.UserID !== currentUser.UserID) return; // not for this driver
  showOrderOffer(order);
});

socket.on("driver:order_assigned", () => {
  showSection("current-order", true);
});

socket.on("driver:status:update", () => {
  showSection("current-order", true);
});

socket.on("order_status_changed", () => {
  showSection("current-order", true);
});

function showOrderOffer(order) {
  // banner for accepting/rejecting offers
  const existing = document.getElementById("order-offer-banner");
  if (existing) existing.remove();
  const id = order.OrderID ?? order.orderId;

  const banner = document.createElement("div");
  banner.id = "order-offer-banner";
  banner.style.cssText =
    "position:fixed;top:20px;right:20px;z-index:9999;width:320px;background:#fff;border:2px solid var(--golden-yellow-secondary);border-radius:14px;padding:20px;box-shadow:0 4px 24px rgba(0,0,0,0.13);font-family:Poppins,sans-serif;";
  banner.innerHTML = `
    <div style="font-weight:700;font-size:1rem;margin-bottom:6px;"> <i class="bi bi-bell-fill"></i> New Order Available</div>
    <div style="font-size:0.85rem;color:#555;margin-bottom:4px;">Order #${id}</div>
    <div style="font-size:0.85rem;color:#555;margin-bottom:14px;"><i class="bi bi-geo-alt"></i> ${order.DeliveryAddress || "Address on file"}</div>
    <div style="display:flex;gap:10px;">
      <button onclick="respondToOffer(true, ${id})" 
        style="flex:1;padding:8px;background:var(--sage-green-secondary,#4caf50);color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer;">
        Accept
      </button>
      <button onclick="respondToOffer(false, ${id})"
        style="flex:1;padding:8px;background:#f5f5f5;color:#555;border:1px solid #ddd;border-radius:8px;font-weight:600;cursor:pointer;">
        Reject
      </button>
    </div>
    <div id="offer-countdown" style="font-size:0.75rem;color:#aaa;margin-top:10px;text-align:center;">
      Auto-declining in <span id="offer-timer">30</span>s
    </div>
  `;
  document.body.appendChild(banner);

  // times out after 30 seconds 
  let seconds = 30;
  const interval = setInterval(() => {
    seconds--;
    const element = document.getElementById("offer-timer");
    if (element) element.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(interval);
      respondToOffer(false, order.OrderID, null);
    }
  }, 1000);
  banner._interval = interval;
}

function respondToOffer(accepted, orderId) {
  const banner = document.getElementById("order-offer-banner");
  if (banner) {
    clearInterval(banner._interval);
    banner.remove();
  }
  if (accepted) {
    socket.emit("driver:accept_order", { user: currentUser, orderId });
  } else {
    socket.emit("driver:reject_order", { user: currentUser, orderId });
  }
}

function submitStatusUpdate(key) {
  const statusMap = {
    arrived: "Ready For Pickup",
    "picked-up": "Ready For Pickup",
    "out-for-delivery": "Accepted",
    delivered: "Completed",
  };
  const el = document.getElementById("current-order-id");
  if (!el) {
    console.error("current-order-id element not found");
    return;
  }
  const orderId = parseInt(el.dataset.orderId);
  // console.log( // debug print
  //   "submitStatusUpdate:",
  //   key,
  //   "->",
  //   statusMap[key],
  //   "orderId:",
  //   orderId,
  // );
  socket.emit("driver:update_status", {
    user: currentUser,
    orderId,
    status: statusMap[key],
  });
}
