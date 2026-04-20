const { openDelimiter } = require("ejs");
const MerchantRepository = require("../middleware/merchantRepository")

class MerchantService
{
    constructor(merchantRepository)
    {
        this.merchantRepository = merchantRepository;
    }

    async getMerchantByID(merchantId)
    {
        return await this.merchantRepository.getById(merchantId)
    }

    async getMerchantByUserID(userId)
    {
        return await this.merchantRepository.getByUserId(userId)
    }

    async openStore(merhantId)
    {
        const merchant = await this.merchantRepository.getById(merhantId);

        merchant.UpdateStatus("open");

        await this.merchantRepository.update(merchant);
        return merchant;
    }

    async closeStore(merchantId)
    {
        const merchant = await this.merchantRepository.getById(merchantId);

        merchant.UpdateStatus("closed");

        await this.merchantRepository.update(merchant);
        return merchant;
    }

    async addMenuItem(merchantId, menuItem)
    {
        console.log('Adding menu item to merchant:', merchantId, menuItem);
        const merchant = await this.merchantRepository.getById(merchantId);

        merchant.AddMenuItem(menuItem)
        
        await this.merchantRepository.update(merchant);
        return merchant;
    }

    async removeMenuItem(merchantId, itemId)
    {
        const merchant = await this.merchantRepository.getById(merchantId);

        merchant.RemoveMenuItem(itemId);

        await this.merchantRepository.deleteMenuItem(itemId);

        return merchant;
    }

    async editMenuItem(merchantId, itemId, updatedFields)
    {
        const merchant = await this.merchantRepository.getById(merchantId);

        console.log('Before update:', updatedFields);

        await this.merchantRepository.updateItems(merchantId, itemId, updatedFields);
        return merchant;
    }

    async getMenu(merchantId)
    {
        const merchant = await this.merchantRepository.getById(merchantId);
        return merchant.menuItems;
    }

    async toggleMenuItemAvailability(merchantId, itemId)
    {
        const merchant = await this.merchantRepository.getById(merchantId);
        const id = parseInt(itemId);
        const item = merchant.menuItems.find(i => i.itemId === id);
        if (!item) return;

        item.available = !item.available;
        await this.merchantRepository.update(merchant);
    }

    async getAllMerchantsWithStats()
    {
        return await this.merchantRepository.getAllWithStats();
    }

    async getReviews(merchantId)
    {
        return await this.merchantRepository.getReviews(merchantId);
    }

}

module.exports = MerchantService;