import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function OrderHistoryModal() {
  const { 
    activeModal, 
    setActiveModal, 
    orders, 
    updateOrderStatus, 
    cancelOrder, 
    setPendingOrder,
    addToCart,
    showToast 
  } = useShop();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'shipping' | 'completed' | 'cancelled'
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);

  if (activeModal !== 'orders') return null;

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const getStatusBadge = (status, text) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{text || 'Chờ thanh toán'}</span>;
      case 'shipping':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Truck className="w-3.5 h-3.5" />{text || 'Đang giao hàng'}</span>;
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />{text || 'Hoàn thành'}</span>;
      case 'cancelled':
        return <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{text || 'Đã hủy'}</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full">{text}</span>;
    }
  };

  const handleReorder = (order) => {
    order.items.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image
      }, item.variant, item.quantity);
    });
    setActiveModal('cart');
    showToast('Đã thêm toàn bộ sản phẩm của đơn hàng vào giỏ!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto relative text-left flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-white">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-[#ee4d2d]" />
            <h2 className="text-base sm:text-lg font-bold text-gray-800">Đơn Mua Của Tôi ({orders.length})</h2>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-none bg-gray-50/50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'all' ? 'border-[#ee4d2d] text-[#ee4d2d] bg-white' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Tất cả ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-5 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'pending' ? 'border-[#ee4d2d] text-[#ee4d2d] bg-white' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Chờ thanh toán ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-5 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'shipping' ? 'border-[#ee4d2d] text-[#ee4d2d] bg-white' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Vận chuyển ({orders.filter(o => o.status === 'shipping').length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-5 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'completed' ? 'border-[#ee4d2d] text-[#ee4d2d] bg-white' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Hoàn thành ({orders.filter(o => o.status === 'completed').length})
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-5 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'cancelled' ? 'border-[#ee4d2d] text-[#ee4d2d] bg-white' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Đã hủy ({orders.filter(o => o.status === 'cancelled').length})
          </button>
        </div>

        {/* Orders List Content */}
        <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto">
          {filteredOrders.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <Package className="w-16 h-16 mx-auto stroke-1 mb-3 text-gray-300" />
              <p className="text-sm font-semibold text-gray-700">Chưa có đơn hàng nào trong mục này</p>
              <button
                onClick={() => setActiveModal(null)}
                className="mt-4 bg-[#ee4d2d] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow hover:bg-[#d73211] transition-colors"
              >
                Khám Phá Sản Phẩm Ngay
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order Top Bar */}
                <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-[#ee4d2d] text-sm">ShopH Mall</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500 font-mono">Mã đơn: <strong>{order.id}</strong></span>
                    <span className="text-gray-400 text-[11px]">{formatDate(order.date)}</span>
                  </div>
                  <div>
                    {getStatusBadge(order.status, order.statusText)}
                  </div>
                </div>

                {/* Items */}
                <div className="p-4 divide-y divide-gray-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3 text-xs">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-md object-cover border border-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                        {item.variant && (
                          <p className="text-gray-400 text-[11px] mt-0.5">Phân loại: {item.variant}</p>
                        )}
                        <span className="text-gray-500 text-[11px]">x{item.quantity}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-800 text-sm">{formatCurrency(item.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment Meta */}
                <div className="px-4 py-2.5 bg-gray-50/40 border-t border-gray-100 text-[11px] text-gray-500 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Vận chuyển: <strong>{order.shippingUnit}</strong> ({order.trackingNumber})</span>
                  </div>
                  <div>
                    <span>Phương thức: <strong>{order.paymentMethod}</strong></span>
                  </div>
                </div>

                {/* Bottom Total & Actions */}
                <div className="px-4 py-3 bg-white border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-gray-500">Thành tiền: </span>
                    <span className="text-base font-black text-[#ee4d2d]">{formatCurrency(order.totalAmount)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            setPendingOrder(order);
                            setActiveModal('qr-pay');
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
                        >
                          Thanh Toán QR Ngay
                        </button>
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="border border-gray-300 text-gray-600 hover:text-red-600 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                        >
                          Hủy đơn
                        </button>
                      </>
                    )}

                    {order.status === 'shipping' && (
                      <>
                        <button
                          onClick={() => setSelectedOrderForTracking(order)}
                          className="border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                        >
                          Xem hành trình giao hàng
                        </button>
                        <button
                          onClick={() => {
                            updateOrderStatus(order.id, 'completed', 'Đã nhận được hàng');
                            showToast('Cảm ơn bạn đã xác nhận nhận hàng!', 'success');
                          }}
                          className="bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
                        >
                          Đã Nhận Được Hàng
                        </button>
                      </>
                    )}

                    {order.status === 'completed' && (
                      <button
                        onClick={() => handleReorder(order)}
                        className="bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors shadow-sm"
                      >
                        Mua Lại
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tracking Details Sub-modal */}
        {selectedOrderForTracking && (
          <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-5 max-w-md w-full shadow-2xl relative text-left">
              <button
                onClick={() => setSelectedOrderForTracking(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-sm text-gray-800 mb-1">
                Chi Tiết Vận Chuyển: {selectedOrderForTracking.trackingNumber}
              </h3>
              <p className="text-xs text-gray-500 mb-4">Đơn vị vận chuyển: {selectedOrderForTracking.shippingUnit}</p>

              {/* Steps timeline */}
              <div className="space-y-4 border-l-2 border-[#ee4d2d] ml-3 pl-4 text-xs">
                <div className="relative">
                  <div className="absolute -left-[23px] top-0 w-3 h-3 bg-[#ee4d2d] rounded-full ring-4 ring-orange-100"></div>
                  <p className="font-bold text-gray-800">Bưu tá đang giao hàng tới bạn</p>
                  <p className="text-[11px] text-gray-400">Hôm nay - Vui lòng chú ý điện thoại</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[23px] top-0 w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <p className="font-bold text-gray-800">Đơn hàng đã rời kho phân loại Cầu Giấy</p>
                  <p className="text-[11px] text-gray-400">Hôm qua, 18:30</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[23px] top-0 w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <p className="font-bold text-gray-800">Người gửi đã chuẩn bị xong đơn hàng</p>
                  <p className="text-[11px] text-gray-400">12/10/2026, 09:15</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderForTracking(null)}
                className="mt-6 w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
