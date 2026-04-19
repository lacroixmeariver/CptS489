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

    async openStore(merhantId)
    {
        const merchant = await this.merchantRepository.getById(merhantId);

        merchant.updateStatus("open");

        await this.merchantRepository.update(merchant);
        return merchant;
    }

    async closeStore(merchantId)
    {
        const merchant = await this.merchantRepository.getById(merchantId);

        merchant.updateStatus("close");

        await this.merchantRepository.update(merchant);
        return merchant;
    }

    async addMenuItem(merchantId, menuItem)
    {
        const merchant = await this.merchantRepository.getById(merchantId);

        merchant.addMenuItem(menuItem)
        
        await this.merchantRepository.update(merchant);
        return merchant;
    }

    async removeMenuItem(merchantId, itemId)
    {
        const merchant = await this.merchantRepository.getById(merchantId);

        merchant.removeMenuItem(itemId);

        await this.merchantRepository.update(merchant);
        return merchant;
    }

    async editMenuItem(merchantId, updatedItem)
    {
        const merchant = await this.merchantRepository.getById(merchantId);

        merchant.editMenuItem(updatedItem);

        await this.merchantRepository.update(merchant);
        return merchant;
    }

    async getMenu(merchantId)
    {
        const merchant = await this.merchantRepository.getById(merchantId);
        return merchant.menuItems;
    }
}

module.exports = MerchantService;