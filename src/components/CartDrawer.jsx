import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Ticket, 
  Coins, 
  Truck, 
  ArrowRight,
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function CartDrawer() {
  const {
    activeModal,
    setActiveModal,
    cart,
    updateCartQuantity,
    removeFromCart,
    toggleCartItemSelection,
    toggleSelectAll,
    selectedCartItems,
    cartSubtotal,
    cartSavedAmount,
    activeVoucher,
    setActiveVoucher,
    voucherDiscount,
    useCoins,
    setUseCoins,
    coinsDiscount,
    finalShippingFee,
    finalTotal,
    vouchers,
    user,
    showToast
  } = useShop();

  const [inputVoucher, setInputVoucher] = useState('');
  const [showVoucherList, setShowVoucherList] = useState(false);

  if (activeModal !== 'cart') return null;

  const isAllSelected = cart.length > 0 && cart.every(i => i.selected);

  const handleApplyVoucherCode = (e) => {
    e.preventDefault();
    const found = vouchers.find(v => v.code.toUpperCase() === inputVoucher.trim().toUpperCase());
    if (found) {
      if (cartSubtotal < found.minSpend) {
        showToast(`Đơn hàng chưa đạt mức tối thiểu ${formatCurrency(found.minSpend)} để dùng mã này!`, 'warning');
        return;
      }
      setActiveVoucher(found);
      showToast(`Áp dụng mã ${found.code} thành công!`, 'success');
      setInputVoucher('');
    } else {
      showToast('Mã voucher không hợp lệ hoặc đã hết hạn!', 'warning');
    }
  };

  const handleProceedCheckout = () => {
    if (selectedCartItems.length === 0) {
      showToast('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!', 'warning');
      return;
    }
    setActiveModal('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between text-left animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-white">
          <div className="flex items-center gap-2 text-gray-800">
            <ShoppingBag className="w-5 h-5 text-[#ee4d2d]" />
            <h2 className="text-base sm:text-lg font-bold">Giỏ Hàng Của Bạn ({cart.length})</h2>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Freeship Alert Banner */}
        <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
          <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          {cartSubtotal >= 300000 ? (
            <span className="font-medium">
              Bạn đã đủ điều kiện nhận <strong>Miễn Phí Vận Chuyển 0Đ</strong>!
            </span>
          ) : (
            <span>
              Mua thêm <strong>{formatCurrency(300000 - cartSubtotal)}</strong> để được Miễn Phí Vận Chuyển toàn quốc.
            </span>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <ShoppingBag className="w-16 h-16 mx-auto stroke-1 mb-3 text-gray-300" />
              <p className="text-sm font-semibold text-gray-700">Giỏ hàng của bạn còn trống</p>
              <p className="text-xs text-gray-400 mt-1">Hãy lướt Shopee và chọn những món đồ bạn yêu thích nhé!</p>
              <button
                onClick={() => setActiveModal(null)}
                className="mt-4 bg-[#ee4d2d] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow hover:bg-[#d73211] transition-colors"
              >
                Tiếp Tục Mua Sắm
              </button>
            </div>
          ) : (
            <>
              {/* Select All Row */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="rounded accent-[#ee4d2d]"
                  />
                  <span>Chọn tất cả ({cart.length} sản phẩm)</span>
                </label>
                <span className="text-gray-400">Đã chọn: {selectedCartItems.length}</span>
              </div>

              {/* Items */}
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className={`p-3 rounded-lg border transition-all flex gap-3 ${
                    item.selected ? 'border-orange-200 bg-orange-50/20' : 'border-gray-100 bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleCartItemSelection(item.cartItemId)}
                    className="mt-3 rounded accent-[#ee4d2d] flex-shrink-0"
                  />

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover border border-gray-100 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-medium text-gray-800 line-clamp-2">{item.name}</h4>
                      {item.variant && (
                        <span className="inline-block mt-1 text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {item.variant}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs font-bold text-[#ee4d2d]">
                        {formatCurrency(item.price)}
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Stepper */}
                        <div className="flex items-center border border-gray-200 rounded">
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, -1)}
                            className="w-6 h-6 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, 1)}
                            className="w-6 h-6 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Bottom Checkout Section */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 bg-white p-4 space-y-3 shadow-lg">
            {/* Voucher Row */}
            <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
              <div className="flex items-center gap-1.5 font-bold text-gray-800">
                <Ticket className="w-4 h-4 text-[#ee4d2d]" />
                <span>ShopH Voucher</span>
              </div>

              <div className="flex items-center gap-2">
                {activeVoucher ? (
                  <div className="flex items-center gap-1 bg-orange-100 text-[#ee4d2d] px-2 py-1 rounded text-xs font-bold">
                    <span>{activeVoucher.code} (-{formatCurrency(voucherDiscount)})</span>
                    <button
                      onClick={() => setActiveVoucher(null)}
                      className="ml-1 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowVoucherList(!showVoucherList)}
                    className="text-[#ee4d2d] hover:underline font-semibold"
                  >
                    Chọn hoặc nhập mã
                  </button>
                )}
              </div>
            </div>

            {/* Voucher Selector Dropdown */}
            {showVoucherList && (
              <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100 space-y-2 text-xs">
                <form onSubmit={handleApplyVoucherCode} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã voucher (VD: FREESHIP0D, SHOPH50K)"
                    value={inputVoucher}
                    onChange={(e) => setInputVoucher(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded uppercase focus:outline-none focus:border-[#ee4d2d]"
                  />
                  <button
                    type="submit"
                    className="bg-[#ee4d2d] text-white px-3 py-1.5 rounded font-bold hover:bg-[#d73211]"
                  >
                    Áp Dụng
                  </button>
                </form>

                <div className="space-y-1.5 pt-1">
                  {vouchers.map((v) => (
                    <div
                      key={v.code}
                      onClick={() => {
                        if (cartSubtotal >= v.minSpend) {
                          setActiveVoucher(v);
                          setShowVoucherList(false);
                          showToast(`Đã áp dụng mã ${v.code}!`, 'success');
                        } else {
                          showToast(`Chưa đạt mức chi tiêu tối thiểu ${formatCurrency(v.minSpend)}`, 'warning');
                        }
                      }}
                      className="p-2 bg-white rounded border border-gray-200 hover:border-[#ee4d2d] cursor-pointer flex justify-between items-center transition-colors"
                    >
                      <div>
                        <div className="font-bold text-[#ee4d2d]">{v.code} - {v.title}</div>
                        <div className="text-[11px] text-gray-500">{v.description}</div>
                      </div>
                      <span className="text-[11px] text-[#ee4d2d] font-bold">Dùng ngay</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shopee Coins Row */}
            <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
              <div className="flex items-center gap-1.5 text-gray-800">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>ShopH Xu</span>
                <span className="text-gray-400 text-[11px]">
                  (Khả dụng: {user?.coins?.toLocaleString()} Xu)
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCoins}
                  onChange={(e) => setUseCoins(e.target.checked)}
                  disabled={!user?.coins || user.coins <= 0}
                  className="rounded accent-amber-500"
                />
                <span className="text-xs font-semibold text-amber-600">
                  {useCoins ? `-${formatCurrency(coinsDiscount)}` : 'Dùng Xu'}
                </span>
              </label>
            </div>

            {/* Cost Summary Breakdown */}
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Tổng tiền hàng:</span>
                <span>{formatCurrency(cartSubtotal)}</span>
              </div>
              {voucherDiscount > 0 && (
                <div className="flex justify-between text-[#ee4d2d]">
                  <span>Voucher giảm giá:</span>
                  <span>-{formatCurrency(voucherDiscount)}</span>
                </div>
              )}
              {coinsDiscount > 0 && (
                <div className="flex justify-between text-amber-600">
                  <span>Trừ ShopH Xu:</span>
                  <span>-{formatCurrency(coinsDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>{finalShippingFee === 0 ? <strong className="text-emerald-600">Miễn phí</strong> : formatCurrency(finalShippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-1 border-t border-gray-100">
                <span>Tổng thanh toán:</span>
                <span className="text-base text-[#ee4d2d] font-extrabold">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleProceedCheckout}
              disabled={selectedCartItems.length === 0}
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:opacity-95 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Mua Hàng ({selectedCartItems.length} sản phẩm)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
