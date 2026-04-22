const { dbPromise } = require("../config/db");

exports.getRevenuePage = async (req, res, next) => {
  try {
    const db = await dbPromise;

    const [totalRevenue, recentOrders, topMerchants] = await Promise.all([
      db.get(`
        SELECT
          COALESCE(SUM(o.TotalAmount), 0) AS allTime,
          COALESCE(SUM(CASE WHEN o.TimeOrdered >= datetime('now', '-30 days') THEN o.TotalAmount ELSE 0 END), 0) AS monthly,
          COALESCE(SUM(CASE WHEN o.TimeOrdered >= datetime('now', '-1 days') THEN o.TotalAmount ELSE 0 END), 0) AS daily
        FROM Orders o
        WHERE o.OrderStatus = 'Completed'
      `),
      db.all(`
        SELECT o.OrderID, o.TotalAmount, o.TimeOrdered AS OrderDate, u.First_name, u.Last_name, m.MerchantName
        FROM Orders o
        JOIN Customers c ON o.CustomerID = c.CustomerID
        JOIN Users u ON c.UserID = u.UserID
        JOIN Merchants m ON o.MerchantID = m.MerchantID
        WHERE o.OrderStatus = 'Completed'
        ORDER BY o.TimeOrdered DESC
        LIMIT 20
      `),
      db.all(`
        SELECT m.MerchantName, COUNT(o.OrderID) AS orderCount, COALESCE(SUM(o.TotalAmount), 0) AS totalRevenue
        FROM Merchants m
        LEFT JOIN Orders o ON m.MerchantID = o.MerchantID AND o.OrderStatus = 'Completed'
        GROUP BY m.MerchantID
        ORDER BY totalRevenue DESC
        LIMIT 10
      `),
    ]);

    res.render("admins/revenue", {
      user: req.user,
      totalRevenue,
      recentOrders,
      topMerchants,
    });
  } catch (err) {
    next(err);
  }
};
