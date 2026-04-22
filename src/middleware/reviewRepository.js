class ReviewRepository {
  constructor(dbPromise) {
    this.dbPromise = dbPromise;
  }

  async save(customerId, merchantId, rating, comment, reviewDate) {
    const db = await this.dbPromise;
    await db.run(
      `INSERT INTO Reviews (CustomerID, MerchantID, Rating, Comment, ReviewDate)
             VALUES (?, ?, ?, ?, ?)`,
      [customerId, merchantId, rating, comment || "", reviewDate],
    );
  }

  async deleteById(reviewId, customerId) {
    const db = await this.dbPromise;
    await db.run(`DELETE FROM Reviews WHERE ReviewID = ? AND CustomerID = ?`, [
      reviewId,
      customerId,
    ]);
  }

  async findByCustomerId(customerId) {
    const db = await this.dbPromise;
    return await db.all(
      `SELECT r.*, m.MerchantName
             FROM Reviews r
             JOIN Merchants m ON r.MerchantID = m.MerchantID
             WHERE r.CustomerID = ?
             ORDER BY r.ReviewID DESC`,
      [customerId],
    );
  }

  async findByMerchantId(merchantId) {
    const db = await this.dbPromise;
    return await db.all(
      `SELECT r.*, u.First_name || ' ' || u.Last_name AS CustomerName
             FROM Reviews r
             JOIN Customers c ON r.CustomerID = c.CustomerID
             JOIN Users u ON c.UserID = u.UserID
             WHERE r.MerchantID = ?
             ORDER BY r.ReviewID DESC`,
      [merchantId],
    );
  }
}

module.exports = ReviewRepository;
