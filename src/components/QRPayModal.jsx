import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { X, CheckCircle2, Copy, AlertCircle, QrCode } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function QRPayModal() {
  const { activeModal, setActiveModal, pendingOrder, updateOrderStatus, showToast } = useShop();

  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

  useEffect(() => {
    if (activeModal !== 'qr-pay') return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeModal]);

  if (activeModal !== 'qr-pay' || !pendingOrder) return null;

  const minutes = Math.floor(timeLeft / 1000 * 60) || Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  const bankName = 'MBBank (Ngân Hàng Quân Đội)';
  const accountNumber = '0987654321';
  const accountHolder = 'TRINH MINH HIEU';
  const transferContent = `THANHTOAN ${pendingOrder.id}`;

  const qrUrl = `https://api.vietqr.io/image/970422-${accountNumber}-compact2.jpg?amount=${pendingOrder.totalAmount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(accountHolder)}`;

  const copyToClipboard = (text, label) => {
    navigator.clipboard?.writeText(text);
    showToast(`Đã sao chép ${label}!`, 'info');
  };

  const handleConfirmPaid = () => {
    updateOrderStatus(pendingOrder.id, 'shipping', 'Đã thanh toán qua VietQR - Đang giao hàng');
    showToast('Xác nhận thanh toán thành công! Đơn hàng đang được chuẩn bị.', 'success');
    setActiveModal('orders');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-left relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            <h3 className="font-bold text-base">Thanh Toán Chuyển Khoản VietQR</h3>
          </div>
          <button
            onClick={() => setActiveModal('orders')}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-center">
          {/* Countdown */}
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1.5 rounded-full mb-4">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Mã QR hết hạn sau: <strong>{formattedMinutes}:{formattedSeconds}</strong></span>
          </div>

          {/* QR Code */}
          <div className="bg-white p-3 rounded-xl border-2 border-dashed border-blue-200 shadow-sm inline-block max-w-[240px] mx-auto">
            <img
              src={qrUrl}
              alt="VietQR Code"
              className="w-full h-auto rounded"
              onError={(e) => {
                // fallback placeholder if api is blocked
                e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(`MBBank|${accountNumber}|${pendingOrder.totalAmount}|${transferContent}`);
              }}
            />
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Mở App ngân hàng bất kỳ (MB, Vietcombank, Techcombank, VPBank...) để quét mã QR
          </p>

          {/* Bank Transfer Details Box */}
          <div className="mt-4 bg-gray-50 rounded-lg p-3 text-xs text-left space-y-2 border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Ngân hàng:</span>
              <span className="font-bold text-gray-800">{bankName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Số tài khoản:</span>
              <div className="flex items-center gap-1">
                <span className="font-mono font-bold text-blue-700 text-sm">{accountNumber}</span>
                <button
                  onClick={() => copyToClipboard(accountNumber, 'Số tài khoản')}
                  className="text-gray-400 hover:text-blue-600 p-0.5"
                  title="Sao chép"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Chủ tài khoản:</span>
              <span className="font-bold text-gray-800">{accountHolder}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Số tiền:</span>
              <span className="font-extrabold text-[#ee4d2d] text-sm">
                {formatCurrency(pendingOrder.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Nội dung chuyển khoản:</span>
              <div className="flex items-center gap-1">
                <span className="font-mono font-bold text-gray-800 bg-yellow-100 px-1 rounded">{transferContent}</span>
                <button
                  onClick={() => copyToClipboard(transferContent, 'Nội dung CK')}
                  className="text-gray-400 hover:text-blue-600 p-0.5"
                  title="Sao chép"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 space-y-2">
            <button
              onClick={handleConfirmPaid}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs rounded-lg shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Tôi Đã Chuyển Khoản Thành Công</span>
            </button>

            <button
              onClick={() => setActiveModal('orders')}
              className="w-full py-2.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              Thanh toán sau (Vào đơn mua của tôi)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
