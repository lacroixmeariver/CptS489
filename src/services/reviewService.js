class ReviewService {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async createReview(customerId, merchantId, rating, comment) {
    const reviewDate = new Date().toLocaleDateString();
    await this.reviewRepository.save(
      customerId,
      merchantId,
      rating,
      comment,
      reviewDate,
    );
  }

  async deleteReview(reviewId, customerId) {
    await this.reviewRepository.deleteById(reviewId, customerId);
  }

  async getReviewsByCustomerId(customerId) {
    return await this.reviewRepository.findByCustomerId(customerId);
  }

  async getReviewsByMerchantId(merchantId) {
    return await this.reviewRepository.findByMerchantId(merchantId);
  }
}

module.exports = ReviewService;
