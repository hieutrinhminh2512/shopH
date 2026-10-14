import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  MapPin, 
  Truck, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Wallet, 
  CheckCircle, 
  ShieldCheck,
  ChevronRight,
  Edit2
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import confetti from 'canvas-confetti';

export default function CheckoutModal() {
  const {
    activeModal,
    setActiveModal,
    selectedCartItems,
    cartSubtotal,
    voucherDiscount,
    coinsDiscount,
    finalShippingFee,
    finalTotal,
    activeVoucher,
    user,
    createOrder,
    showToast
  } = useShop();

  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'vietqr' | 'momo' | 'card'
  const [shippingUnit, setShippingUnit] = useState('spx'); // 'spx' | 'ghn' | 'express'
  const [orderNote, setOrderNote] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [customAddress, setCustomAddress] = useState(user?.addresses?.[0]?.address || 'Số 12 ngõ 45 Cầu Giấy, Hà Nội');
  const [recipientName, setRecipientName] = useState(user?.name || 'Trịnh Minh Hiếu');
  const [recipientPhone, setRecipientPhone] = useState(user?.phone || '0987 654 321');

  if (activeModal !== 'checkout') return null;

  const extraExpressFee = shippingUnit === 'express' ? 35000 : 0;
  const actualShippingFee = finalShippingFee + extraExpressFee;
  const actualFinalTotal = Math.max(0, cartSubtotal - voucherDiscount - coinsDiscount + actualShippingFee);

  const handlePlaceOrder = () => {
    if (!recipientName.trim() || !recipientPhone.trim() || !customAddress.trim()) {
      showToast('Vui lòng điền đầy đủ thông tin giao hàng!', 'warning');
      return;
    }

    let paymentMethodName = 'COD - Thanh toán khi nhận hàng';
    if (paymentMethod === 'vietqr') paymentMethodName = 'VietQR - Quét mã ngân hàng';
    if (paymentMethod === 'momo') paymentMethodName = 'Ví MoMo / ShopeePay';
    if (paymentMethod === 'card') paymentMethodName = 'Thẻ tín dụng / ghi nợ';

    let shippingUnitName = 'SPX Express (Nhanh)';
    if (shippingUnit === 'express') shippingUnitName = 'Hỏa Tốc 2H';
    if (shippingUnit === 'ghn') shippingUnitName = 'Giao Hàng Nhanh (GHN)';

    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    createOrder({
      shippingAddress: `${customAddress} (Người nhận: ${recipientName} - ${recipientPhone})`,
      paymentMethod: paymentMethodName,
      shippingUnit: shippingUnitName,
      note: orderNote,
      customShippingFee: actualShippingFee,
      customTotalAmount: actualFinalTotal
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto relative text-left">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-white">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#ee4d2d]">shopH</span>
            <span className="text-gray-300">|</span>
            <h2 className="text-base sm:text-lg font-bold text-gray-800">Thanh Toán Đơn Hàng</h2>
          </div>
          <button
            onClick={() => setActiveModal('cart')}
            className="w-8 h-8 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* 1. Shipping Address */}
          <div className="border border-orange-200 bg-orange-50/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-[#ee4d2d] text-sm">
                <MapPin className="w-4 h-4" />
                <span>Địa Chỉ Nhận Hàng</span>
              </div>
              <button
                onClick={() => setIsEditingAddress(!isEditingAddress)}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isEditingAddress ? 'Thu gọn' : 'Thay đổi'}</span>
              </button>
            </div>

            {isEditingAddress ? (
              <div className="space-y-3 pt-2 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-600 block mb-1">Họ và tên người nhận:</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:border-[#ee4d2d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 block mb-1">Số điện thoại liên hệ:</label>
                    <input
                      type="text"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:border-[#ee4d2d] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600 block mb-1">Địa chỉ chi tiết (Số nhà, đường, phường, quận, tỉnh/TP):</label>
                  <input
                    type="text"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:border-[#ee4d2d] focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-700">
                <p className="font-bold text-gray-900">{recipientName} - {recipientPhone}</p>
                <p className="mt-0.5 text-gray-600">{customAddress}</p>
                <span className="inline-block mt-1 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold">
                  Mặc định
                </span>
              </div>
            )}
          </div>

          {/* 2. Purchased Items List */}
          <div className="border border-gray-100 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
              Sản phẩm mua ({selectedCartItems.length})
            </h3>
            <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto">
              {selectedCartItems.map((item) => (
                <div key={item.cartItemId} className="py-2.5 flex items-center gap-3 text-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover border border-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 truncate">{item.name}</h4>
                    <p className="text-[11px] text-gray-400">Loại: {item.variant}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">{formatCurrency(item.price)}</div>
                    <div className="text-gray-400 text-[11px]">x{item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Note for seller */}
            <div className="pt-2">
              <input
                type="text"
                placeholder="Lời nhắn cho người bán (tùy chọn: màu sắc mong muốn, thời gian giao...)"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                className="w-full p-2 text-xs border border-gray-200 rounded focus:border-[#ee4d2d] focus:outline-none bg-gray-50/50"
              />
            </div>
          </div>

          {/* 3. Shipping Options */}
          <div className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-center gap-2 font-bold text-gray-800 text-xs uppercase mb-3">
              <Truck className="w-4 h-4 text-[#ee4d2d]" />
              <span>Đơn vị vận chuyển</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <label
                onClick={() => setShippingUnit('spx')}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  shippingUnit === 'spx' ? 'border-[#ee4d2d] bg-orange-50/30 ring-1 ring-[#ee4d2d]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-bold text-gray-800">SPX Express (Nhanh)</div>
                <div className="text-[11px] text-gray-500 mt-1">Dự kiến nhận: 1-2 ngày</div>
                <div className="text-xs font-bold text-[#ee4d2d] mt-2">
                  {finalShippingFee === 0 ? 'Miễn phí' : formatCurrency(finalShippingFee)}
                </div>
              </label>

              <label
                onClick={() => setShippingUnit('express')}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  shippingUnit === 'express' ? 'border-[#ee4d2d] bg-orange-50/30 ring-1 ring-[#ee4d2d]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-bold text-gray-800">Hỏa Tốc 2H</div>
                <div className="text-[11px] text-gray-500 mt-1">Nhận ngay trong hôm nay</div>
                <div className="text-xs font-bold text-[#ee4d2d] mt-2">+35.000₫</div>
              </label>

              <label
                onClick={() => setShippingUnit('ghn')}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  shippingUnit === 'ghn' ? 'border-[#ee4d2d] bg-orange-50/30 ring-1 ring-[#ee4d2d]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-bold text-gray-800">Giao Hàng Nhanh (GHN)</div>
                <div className="text-[11px] text-gray-500 mt-1">Dự kiến nhận: 2-3 ngày</div>
                <div className="text-xs font-bold text-[#ee4d2d] mt-2">
                  {finalShippingFee === 0 ? 'Miễn phí' : formatCurrency(finalShippingFee)}
                </div>
              </label>
            </div>
          </div>

          {/* 4. Payment Method */}
          <div className="border border-gray-100 rounded-lg p-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase mb-3">Phương thức thanh toán</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* COD */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'cod' ? 'border-[#ee4d2d] bg-orange-50/30 ring-1 ring-[#ee4d2d]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <div className="font-bold text-gray-800">Thanh toán khi nhận hàng (COD)</div>
                  <div className="text-[11px] text-gray-400">Thanh toán tiền mặt cho shipper</div>
                </div>
              </label>

              {/* VietQR */}
              <label
                onClick={() => setPaymentMethod('vietqr')}
                className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'vietqr' ? 'border-[#ee4d2d] bg-orange-50/30 ring-1 ring-[#ee4d2d]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <QrCode className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="font-bold text-gray-800 flex items-center gap-1.5">
                    <span>Chuyển khoản VietQR</span>
                    <span className="bg-blue-100 text-blue-700 font-bold text-[9px] px-1 py-0.2 rounded">Khuyên dùng</span>
                  </div>
                  <div className="text-[11px] text-gray-400">Quét mã QR qua App Ngân hàng</div>
                </div>
              </label>

              {/* MoMo */}
              <label
                onClick={() => setPaymentMethod('momo')}
                className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'momo' ? 'border-[#ee4d2d] bg-orange-50/30 ring-1 ring-[#ee4d2d]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Wallet className="w-5 h-5 text-pink-600 flex-shrink-0" />
                <div>
                  <div className="font-bold text-gray-800">Ví MoMo / ShopeePay</div>
                  <div className="text-[11px] text-gray-400">Liên kết ví điện tử thanh toán 1 chạm</div>
                </div>
              </label>

              {/* Credit Card */}
              <label
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'card' ? 'border-[#ee4d2d] bg-orange-50/30 ring-1 ring-[#ee4d2d]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div>
                  <div className="font-bold text-gray-800">Thẻ Quốc Tế Visa / Master</div>
                  <div className="text-[11px] text-gray-400">Bảo mật chuẩn PCI-DSS</div>
                </div>
              </label>
            </div>
          </div>

          {/* 5. Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-xs text-gray-600 border border-gray-100">
            <div className="flex justify-between">
              <span>Tổng tiền hàng:</span>
              <span className="font-medium text-gray-800">{formatCurrency(cartSubtotal)}</span>
            </div>
            {voucherDiscount > 0 && (
              <div className="flex justify-between text-[#ee4d2d]">
                <span>Mã giảm giá Voucher:</span>
                <span>-{formatCurrency(voucherDiscount)}</span>
              </div>
            )}
            {coinsDiscount > 0 && (
              <div className="flex justify-between text-amber-600">
                <span>ShopH Xu đã giảm:</span>
                <span>-{formatCurrency(coinsDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span className="font-medium text-gray-800">
                {actualShippingFee === 0 ? <strong className="text-emerald-600">Miễn phí</strong> : formatCurrency(actualShippingFee)}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-bold text-gray-900">
              <span>Tổng số tiền cần thanh toán:</span>
              <span className="text-xl text-[#ee4d2d] font-black">{formatCurrency(actualFinalTotal)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Được bảo vệ 100% bởi ShopH Đảm Bảo</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveModal('cart')}
              className="text-xs font-semibold px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Quay lại giỏ hàng
            </button>
            <button
              onClick={handlePlaceOrder}
              className="bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:opacity-95 text-white font-bold text-sm px-8 py-3 rounded-lg shadow-lg transition-all"
            >
              Đặt Hàng Ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
