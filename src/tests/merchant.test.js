const e = require('express');
const Merchant = require('/src/backend/models/merchant');
const MenuItem = require('/src/backend/models/menuItem');

describe("Merchant Class", () => {

    test("adds a menu item", () =>
    {
        const merchant = new Merchant(1, "Test Merchant", "123 Test St", true, 4.5, [], "open");
        const menuItem = new MenuItem(1, "Test Item", 500, 9.99, "A delicious test item.");

        merchant.AddMenuItem(menuItem);

        expect(merchant.menuItems).toContain(menuItem);
    });

    test("removes a menu item", () =>
    {
        const menuItem1 = new MenuItem(1, "Test Item 1", 500, 9.99, "A delicious test item.");
        const menuItem2 = new MenuItem(2, "Test Item 2", 300, 5.99, "Another delicious test item.");
        const merchant = new Merchant(1, "Test Merchant", "123 Test St", true, 4.5, [menuItem1, menuItem2], "open");
        merchant.RemoveMenuItem(menuItem1);

        expect(merchant.menuItems).not.toContain(menuItem1);
        expect(merchant.menuItems).toContain(menuItem2);
    });

    test("updates status", () =>
    {
        const merchant = new Merchant(1, "Test Merchant", "123 Test St", true, 4.5, [], "closed");  
        merchant.UpdateStatus("open");

        expect(merchant.status).toBe("open");
    });

    test("calculates store score", () =>
    {
        const merchant = new Merchant(1, "Test Merchant", "123 Test St", true, 0, [], "open");
        const ratings = [5, 4, 3, 5, 4];
        merchant.calculateStoreScore(ratings);
        expect(merchant.storeScore).toBe(4.2);
    });
});