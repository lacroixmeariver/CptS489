// Seed script - run once with: node src/database/seed.js
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(DB_PATH);

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');
  return { salt, hash };
}

const merchantCreds = hashPassword('password');
const customerCreds = hashPassword('password');

const now = new Date().toISOString();
const yesterday = new Date(Date.now() - 86400000).toISOString();

db.serialize(() => {
  // --- Users ---
  db.run(
    `INSERT INTO Users (Email, Password_hash, Salt, First_name, Last_name, Role, Status, Phone_number)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['test@store.com', merchantCreds.hash, merchantCreds.salt, 'Test', 'Store', 'vendor', 0, '555-100-0001'],
    function (err) {
      if (err) return console.error('Merchant user error:', err.message);
      const merchantUserID = this.lastID;
      console.log('Inserted merchant user, UserID:', merchantUserID);

      // --- Merchant ---
      db.run(
        `INSERT INTO Merchants (UserID, MerchantName, MerchantAddress, Verified, StoreScore, Status, Bio)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [merchantUserID, 'Test Store', '123 Test Ave, Pullman WA 99163', 'Approved', 4.5, 'open', 'A great test store for all your needs.'],
        function (err) {
          if (err) return console.error('Merchant record error:', err.message);
          const merchantID = this.lastID;
          console.log('Inserted merchant, MerchantID:', merchantID);

          // --- Menu Items ---
          db.run(
            `INSERT INTO MenuItems (MerchantID, ItemName, Calories, Price, Description, Available)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [merchantID, 'Cheeseburger', 750, 9.99, 'Classic cheeseburger with lettuce, tomato, and special sauce.', 1],
            function (err) {
              if (err) return console.error('MenuItem 1 error:', err.message);
              const item1ID = this.lastID;

              db.run(
                `INSERT INTO MenuItems (MerchantID, ItemName, Calories, Price, Description, Available)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [merchantID, 'Fries', 380, 3.49, 'Crispy golden fries, lightly salted.', 1],
                function (err) {
                  if (err) return console.error('MenuItem 2 error:', err.message);
                  const item2ID = this.lastID;
                  console.log('Inserted menu items:', item1ID, item2ID);

                  // --- Customer User ---
                  db.run(
                    `INSERT INTO Users (Email, Password_hash, Salt, First_name, Last_name, Role, Status, Phone_number)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    ['test@customer.com', customerCreds.hash, customerCreds.salt, 'Test', 'Customer', 'customer', 0, '555-200-0002'],
                    function (err) {
                      if (err) return console.error('Customer user error:', err.message);
                      const customerUserID = this.lastID;
                      console.log('Inserted customer user, UserID:', customerUserID);

                      // --- Customer ---
                      db.run(
                        `INSERT INTO Customers (UserID, Address) VALUES (?, ?)`,
                        [customerUserID, '456 Customer Blvd, Pullman WA 99163'],
                        function (err) {
                          if (err) return console.error('Customer record error:', err.message);
                          const customerID = this.lastID;
                          console.log('Inserted customer, CustomerID:', customerID);

                          // --- Order 1: Pending ---
                          db.run(
                            `INSERT INTO Orders (CustomerID, MerchantID, OrderStatus, TimeOrdered, TotalAmount)
                             VALUES (?, ?, ?, ?, ?)`,
                            [customerID, merchantID, 'Pending', now, 13.48],
                            function (err) {
                              if (err) return console.error('Order 1 error:', err.message);
                              const order1ID = this.lastID;
                              console.log('Inserted pending order, OrderID:', order1ID);

                              db.run(
                                `INSERT INTO OrderItems (OrderID, ItemID, Quantity, PriceAtPurchase) VALUES (?, ?, ?, ?)`,
                                [order1ID, item1ID, 1, 9.99],
                                (err) => { if (err) console.error('OrderItem 1a error:', err.message); }
                              );
                              db.run(
                                `INSERT INTO OrderItems (OrderID, ItemID, Quantity, PriceAtPurchase) VALUES (?, ?, ?, ?)`,
                                [order1ID, item2ID, 1, 3.49],
                                (err) => { if (err) console.error('OrderItem 1b error:', err.message); }
                              );

                              // --- Order 2: Completed ---
                              db.run(
                                `INSERT INTO Orders (CustomerID, MerchantID, OrderStatus, TimeOrdered, TimeCompleted, TotalAmount)
                                 VALUES (?, ?, ?, ?, ?, ?)`,
                                [customerID, merchantID, 'Completed', yesterday, now, 19.98],
                                function (err) {
                                  if (err) return console.error('Order 2 error:', err.message);
                                  const order2ID = this.lastID;
                                  console.log('Inserted completed order, OrderID:', order2ID);

                                  db.run(
                                    `INSERT INTO OrderItems (OrderID, ItemID, Quantity, PriceAtPurchase) VALUES (?, ?, ?, ?)`,
                                    [order2ID, item1ID, 2, 9.99],
                                    (err) => { if (err) console.error('OrderItem 2a error:', err.message); }
                                  );

                                  // --- Review ---
                                  db.run(
                                    `INSERT INTO Reviews (CustomerID, MerchantID, Rating, Comment, ReviewDate)
                                     VALUES (?, ?, ?, ?, ?)`,
                                    [customerID, merchantID, 5, 'Amazing food, fast delivery! Would order again.', yesterday],
                                    function (err) {
                                      if (err) return console.error('Review error:', err.message);
                                      console.log('Inserted review, ReviewID:', this.lastID);
                                      console.log('\nSeed complete!');
                                      db.close();
                                    }
                                  );
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});
