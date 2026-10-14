import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Star, 
  Truck, 
  ShieldCheck, 
  Share2, 
  Heart, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Check, 
  MessageSquare,
  ThumbsUp,
  Ticket
} from 'lucide-react';
import { formatCurrency, formatSold, calculateDiscount } from '../utils/formatters';

export default function ProductDetailModal() {
  const { 
    activeModal, 
    closeModal, 
    selectedProduct, 
    setActiveModal, 
    addToCart, 
    addProductReview,
    showToast
  } = useShop();

  const [activeImage, setActiveImage] = useState('');
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc'); // 'desc' | 'specs' | 'reviews'
  const [isFavorite, setIsFavorite] = useState(false);

  // New review form state
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Sync state whenever selectedProduct changes
  useEffect(() => {
    if (selectedProduct) {
      setActiveImage(selectedProduct.images?.[0] || selectedProduct.image || '');
      const initialVariants = {};
      if (selectedProduct.variants) {
        selectedProduct.variants.forEach(v => {
          initialVariants[v.name] = v.options[0];
        });
      }
      setSelectedVariants(initialVariants);
      setQuantity(1);
      setActiveTab('desc');
      setShowReviewForm(false);
    }
  }, [selectedProduct]);

  if (activeModal !== 'product-detail' || !selectedProduct) return null;

  const discount = calculateDiscount(selectedProduct.originalPrice, selectedProduct.price);

  const getVariantString = () => {
    return Object.entries(selectedVariants).map(([k, v]) => v).join(', ');
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, getVariantString(), quantity);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, getVariantString(), quantity);
    setActiveModal('checkout');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewComment.trim()) {
      showToast('Vui lòng nhập nội dung đánh giá!', 'warning');
      return;
    }
    addProductReview(selectedProduct.id, {
      rating: newReviewRating,
      comment: newReviewComment,
      variant: getVariantString()
    });
    setNewReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto relative text-left">
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          {/* Top Product Hero Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: Gallery */}
            <div className="md:col-span-5 flex flex-col gap-3">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-100 bg-gray-50 relative group">
                <img
                  src={activeImage}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {discount > 0 && (
                  <div className="absolute top-0 right-0 bg-[#ffd424] text-[#ee4d2d] px-2 py-1 text-center font-bold text-xs shadow-sm">
                    GIẢM {discount}%
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {(selectedProduct.images || [selectedProduct.image]).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImage === img ? 'border-[#ee4d2d] ring-2 ring-orange-200' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Share & Favorite */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 px-1 border-t border-gray-100">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    showToast('Đã sao chép liên kết sản phẩm!', 'info');
                  }}
                  className="flex items-center gap-1.5 hover:text-gray-700"
                >
                  <Share2 className="w-4 h-4 text-gray-400" />
                  <span>Chia sẻ sản phẩm</span>
                </button>

                <button
                  onClick={() => {
                    setIsFavorite(!isFavorite);
                    showToast(isFavorite ? 'Đã bỏ yêu thích' : 'Đã thêm vào mục Yêu thích!', 'info');
                  }}
                  className={`flex items-center gap-1.5 transition-colors ${
                    isFavorite ? 'text-red-500 font-bold' : 'hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{isFavorite ? 'Đã thích' : 'Yêu thích'}</span>
                </button>
              </div>
            </div>

            {/* Right: Info & Actions */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                {/* Title & Badges */}
                <div className="flex items-center gap-2 mb-2">
                  {selectedProduct.isMall ? (
                    <span className="bg-[#d0011b] text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                      Shopee Mall
                    </span>
                  ) : (
                    <span className="bg-[#ee4d2d] text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                      Yêu Thích+
                    </span>
                  )}
                  {selectedProduct.isFreeshipXtra && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded">
                      Freeship Xtra
                    </span>
                  )}
                </div>

                <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                  {selectedProduct.name}
                </h1>

                {/* Rating & Sold Row */}
                <div className="flex items-center gap-4 mt-2.5 text-xs text-gray-500 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-1 text-[#ee4d2d] font-bold">
                    <span className="underline text-sm">{selectedProduct.rating || 5.0}</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#ee4d2d]" />
                      ))}
                    </div>
                  </div>
                  <span className="text-gray-300">|</span>
                  <div>
                    <span className="underline font-bold text-gray-800">{selectedProduct.reviewsCount || 0}</span> Đánh Giá
                  </div>
                  <span className="text-gray-300">|</span>
                  <div>
                    <span className="font-bold text-gray-800">{formatSold(selectedProduct.sold)}</span> Đã Bán
                  </div>
                </div>

                {/* Price Box */}
                <div className="my-4 p-4 rounded-lg bg-orange-50/60 border border-orange-100 flex items-center gap-4 flex-wrap">
                  {selectedProduct.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatCurrency(selectedProduct.originalPrice)}
                    </span>
                  )}
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#ee4d2d]">
                    {formatCurrency(selectedProduct.price)}
                  </span>
                  {discount > 0 && (
                    <span className="bg-[#ee4d2d] text-white text-xs font-bold px-2 py-0.5 rounded">
                      GIẢM {discount}%
                    </span>
                  )}
                </div>

                {/* Shop Voucher Tag */}
                <div className="flex items-center gap-3 py-2 text-xs">
                  <span className="text-gray-500 w-24 flex-shrink-0">Mã Giảm Giá Của Shop:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-orange-100 text-[#ee4d2d] border border-orange-300 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                      <Ticket className="w-3 h-3" /> Giảm 50k
                    </span>
                    <span className="bg-orange-100 text-[#ee4d2d] border border-orange-300 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                      <Ticket className="w-3 h-3" /> Giảm 15%
                    </span>
                  </div>
                </div>

                {/* Shipping */}
                <div className="flex items-start gap-3 py-2 text-xs">
                  <span className="text-gray-500 w-24 flex-shrink-0">Vận Chuyển:</span>
                  <div className="space-y-1 text-gray-700">
                    <div className="flex items-center gap-1.5 font-medium text-emerald-700">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span>Miễn phí vận chuyển cho đơn hàng từ 300.000₫</span>
                    </div>
                    <div className="text-gray-500 text-[11px]">
                      Vận chuyển từ <strong>{selectedProduct.location || 'Hà Nội'}</strong> đến địa chỉ của bạn
                    </div>
                  </div>
                </div>

                {/* Variants Selector */}
                {selectedProduct.variants?.map((variant) => (
                  <div key={variant.name} className="flex items-start gap-3 py-2.5 text-xs">
                    <span className="text-gray-500 w-24 pt-1 flex-shrink-0">{variant.name}:</span>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((opt) => {
                        const isChosen = selectedVariants[variant.name] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: opt }))}
                            className={`px-3 py-1.5 rounded border text-xs font-medium transition-all ${
                              isChosen
                                ? 'border-[#ee4d2d] text-[#ee4d2d] bg-orange-50 font-bold'
                                : 'border-gray-200 hover:border-gray-400 text-gray-700'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Quantity */}
                <div className="flex items-center gap-3 py-3 text-xs">
                  <span className="text-gray-500 w-24 flex-shrink-0">Số Lượng:</span>
                  <div className="flex items-center">
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 border-r border-gray-300"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-12 h-8 flex items-center justify-center font-bold text-gray-800 text-xs">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(selectedProduct.stock || 99, quantity + 1))}
                        className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 border-l border-gray-300"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-gray-400 text-xs ml-4">
                      {selectedProduct.stock || 100} sản phẩm có sẵn
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-lg bg-orange-50 border border-[#ee4d2d] text-[#ee4d2d] hover:bg-orange-100 text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Thêm Vào Giỏ Hàng</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:opacity-95 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Mua Ngay
                </button>
              </div>
            </div>
          </div>

          {/* Details & Reviews Tabs */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-6 border-b border-gray-200 text-sm font-bold pb-2">
              <button
                onClick={() => setActiveTab('desc')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === 'desc' ? 'border-[#ee4d2d] text-[#ee4d2d]' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Mô Tả Sản Phẩm
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'reviews' ? 'border-[#ee4d2d] text-[#ee4d2d]' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>Đánh Giá Từ Khách Hàng</span>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  {selectedProduct.reviews?.length || 0}
                </span>
              </button>
            </div>

            {/* Tab: Description */}
            {activeTab === 'desc' && (
              <div className="py-6 space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
                  <div><strong className="text-gray-500">Thương hiệu:</strong> {selectedProduct.brand || 'ShopH Mall'}</div>
                  <div><strong className="text-gray-500">Xuất xứ:</strong> Việt Nam / Chính Hãng</div>
                  <div><strong className="text-gray-500">Kho hàng:</strong> {selectedProduct.stock || 100}</div>
                  <div><strong className="text-gray-500">Gửi từ:</strong> {selectedProduct.location || 'Hà Nội'}</div>
                </div>

                <p>{selectedProduct.description}</p>
                <p>
                  Sản phẩm được cam kết chính hãng 100%, bảo hành 12 tháng 1 đổi 1 trong 30 ngày nếu phát sinh lỗi kỹ thuật từ nhà sản xuất. Đóng gói 3 lớp chống sốc an toàn tuyệt đối khi vận chuyển.
                </p>
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === 'reviews' && (
              <div className="py-6 space-y-6">
                {/* Summary rating */}
                <div className="bg-orange-50/70 p-5 rounded-lg border border-orange-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <span className="text-3xl font-extrabold text-[#ee4d2d]">
                        {selectedProduct.rating || 5.0}
                      </span>
                      <span className="text-xs text-gray-500 block">trên 5</span>
                    </div>
                    <div className="flex gap-1 text-[#ee4d2d]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#ee4d2d]" />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow"
                  >
                    {showReviewForm ? 'Đóng Form' : 'Viết Đánh Giá Của Bạn'}
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                    <h4 className="text-xs font-bold text-gray-800 uppercase">Đánh giá sản phẩm này</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Chọn số sao:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setNewReviewRating(s)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star className={`w-5 h-5 ${s <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Hãy chia sẻ cảm nhận thực tế về chất lượng sản phẩm, dịch vụ giao hàng..."
                      className="w-full text-xs p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                    />
                    <button
                      type="submit"
                      className="bg-[#ee4d2d] text-white text-xs font-bold px-5 py-2 rounded hover:bg-[#d73211]"
                    >
                      Gửi Đánh Giá
                    </button>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-4 divide-y divide-gray-100">
                  {(!selectedProduct.reviews || selectedProduct.reviews.length === 0) ? (
                    <p className="text-xs text-gray-400 italic text-center py-4">Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên!</p>
                  ) : (
                    selectedProduct.reviews.map((rev) => (
                      <div key={rev.id} className="pt-4 flex gap-3 text-xs">
                        <img
                          src={rev.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                          alt={rev.user}
                          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-800">{rev.user}</span>
                            <span className="text-gray-400 text-[10px]">{rev.date}</span>
                          </div>
                          <div className="flex gap-0.5 text-amber-400">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                          {rev.variant && (
                            <p className="text-[11px] text-gray-400">Phân loại hàng: {rev.variant}</p>
                          )}
                          <p className="text-gray-700 leading-relaxed mt-1">{rev.comment}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
