import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/mockData';
import { 
  X, 
  Store, 
  PlusCircle, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Trash2, 
  Edit3, 
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Truck
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function SellerAdminModal() {
  const { 
    activeModal, 
    setActiveModal, 
    products, 
    addProduct, 
    deleteProduct, 
    orders, 
    updateOrderStatus, 
    resetAllData,
    showToast 
  } = useShop();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'add'

  // New product form
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'dien-thoai',
    image: '',
    brand: 'ShopH Official',
    stock: 50,
    description: '',
    isMall: true,
    isFreeshipXtra: true,
    isFlashSale: false,
    location: 'Hà Nội'
  });

  if (activeModal !== 'admin') return null;

  // Analytics metrics
  const totalRevenue = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.totalAmount : sum, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'shipping').length;

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.image.trim()) {
      showToast('Vui lòng điền đầy đủ tên sản phẩm, giá bán và link ảnh!', 'warning');
      return;
    }

    addProduct({
      name: formData.name,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price) * 1.3,
      category: formData.category,
      image: formData.image,
      brand: formData.brand,
      stock: Number(formData.stock) || 50,
      description: formData.description || 'Sản phẩm chính hãng chất lượng cao từ ShopH.',
      isMall: formData.isMall,
      isFreeshipXtra: formData.isFreeshipXtra,
      isFlashSale: formData.isFlashSale,
      location: formData.location
    });

    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      category: 'dien-thoai',
      image: '',
      brand: 'ShopH Official',
      stock: 50,
      description: '',
      isMall: true,
      isFreeshipXtra: true,
      isFlashSale: false,
      location: 'Hà Nội'
    });
    setActiveTab('products');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto relative text-left flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-600 to-[#ee4d2d] text-white">
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-amber-200" />
            <div>
              <h2 className="text-base sm:text-lg font-bold">Kênh Người Bán ShopH (Seller Center)</h2>
              <p className="text-xs text-orange-100">Quản lý sản phẩm, đơn đặt hàng và doanh số bán hàng</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Top Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-6 bg-orange-50/30 border-b border-gray-100">
          <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Doanh Thu</span>
            <span className="text-lg font-bold text-gray-900 block mt-1">{formatCurrency(totalRevenue)}</span>
          </div>
          <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 flex items-center gap-1"><Package className="w-3.5 h-3.5 text-blue-600" /> Đơn Cần Xử Lý</span>
            <span className="text-lg font-bold text-blue-600 block mt-1">{pendingOrdersCount} đơn</span>
          </div>
          <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 flex items-center gap-1"><Store className="w-3.5 h-3.5 text-orange-600" /> Tổng Sản Phẩm</span>
            <span className="text-lg font-bold text-gray-900 block mt-1">{products.length} mã</span>
          </div>
          <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-amber-600" /> Đánh Giá Shop</span>
            <span className="text-lg font-bold text-amber-600 block mt-1">4.9 / 5.0 ★</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold px-4">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-5 border-b-2 transition-colors ${
              activeTab === 'products' ? 'border-[#ee4d2d] text-[#ee4d2d] bg-white' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Quản Lý Sản Phẩm ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-5 border-b-2 transition-colors ${
              activeTab === 'orders' ? 'border-[#ee4d2d] text-[#ee4d2d] bg-white' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Đơn Hàng Của Khách ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'add' ? 'border-[#ee4d2d] text-[#ee4d2d] bg-white' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#ee4d2d]" />
            <span>Thêm Sản Phẩm Mới</span>
          </button>
        </div>

        {/* Tab 1: Products Management */}
        {activeTab === 'products' && (
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[55vh]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-gray-500">Danh sách các sản phẩm đang được hiển thị trên shop</span>
              <button
                onClick={() => setActiveTab('add')}
                className="bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Đăng Sản Phẩm</span>
              </button>
            </div>

            <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
              {products.map((p) => (
                <div key={p.id} className="p-3 bg-white flex items-center justify-between gap-4 text-xs hover:bg-gray-50/50">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded object-cover border border-gray-100 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 truncate">{p.name}</p>
                      <p className="text-[11px] text-gray-400">Thương hiệu: {p.brand || 'ShopH'} | Kho: {p.stock || 100} sp</p>
                      <div className="flex gap-2 mt-0.5">
                        {p.isMall && <span className="text-[9px] bg-red-100 text-red-600 font-bold px-1 rounded">Mall</span>}
                        {p.isFlashSale && <span className="text-[9px] bg-amber-100 text-amber-700 font-bold px-1 rounded">Flash Sale</span>}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-[#ee4d2d] text-sm">{formatCurrency(p.price)}</div>
                    <div className="text-gray-400 text-[11px]">Đã bán: {p.sold || 0}</div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Orders Management */}
        {activeTab === 'orders' && (
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[55vh] space-y-3">
            {orders.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-10">Chưa có đơn hàng nào phát sinh</p>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <div>
                      <span className="font-bold text-gray-800">Đơn hàng: {o.id}</span>
                      <span className="text-gray-400 ml-2">({formatDate(o.date)})</span>
                    </div>
                    <span className="font-bold px-2 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700">
                      {o.statusText}
                    </span>
                  </div>

                  <div className="space-y-1 text-gray-600">
                    <p><strong>Người nhận:</strong> {o.buyerName || 'Khách hàng'} - {o.buyerPhone}</p>
                    <p><strong>Địa chỉ:</strong> {o.address}</p>
                    <p><strong>Tổng thanh toán:</strong> <span className="text-base font-bold text-[#ee4d2d]">{formatCurrency(o.totalAmount)}</span></p>
                  </div>

                  {/* Order Status Action Changer */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <span className="text-gray-500 font-medium">Cập nhật nhanh:</span>
                    <button
                      onClick={() => updateOrderStatus(o.id, 'shipping', 'Shop đã giao cho ĐVVC')}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded"
                    >
                      Giao cho Shipper
                    </button>
                    <button
                      onClick={() => updateOrderStatus(o.id, 'completed', 'Giao hàng thành công')}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded"
                    >
                      Đã Giao Thành Công
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Add Product Form */}
        {activeTab === 'add' && (
          <form onSubmit={handleAddSubmit} className="p-4 sm:p-6 overflow-y-auto max-h-[55vh] space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Áo Khoác Gió Nam Cao Cấp Chống Nước..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:border-[#ee4d2d] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Danh mục *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:border-[#ee4d2d] focus:outline-none bg-white"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Giá bán (₫) *</label>
                <input
                  type="number"
                  required
                  placeholder="VD: 250000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:border-[#ee4d2d] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Giá gốc gạch ngang (₫)</label>
                <input
                  type="number"
                  placeholder="VD: 450000 (để trống sẽ tự tính)"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:border-[#ee4d2d] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Link Ảnh Sản Phẩm (URL) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:border-[#ee4d2d] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Thương hiệu</label>
                <input
                  type="text"
                  placeholder="VD: Nike, Apple, ShopH..."
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:border-[#ee4d2d] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Mô tả sản phẩm</label>
              <textarea
                rows={3}
                placeholder="Nhập thông số, chất liệu, tính năng nổi bật..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded focus:border-[#ee4d2d] focus:outline-none"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isMall}
                  onChange={(e) => setFormData({ ...formData, isMall: e.target.checked })}
                  className="accent-[#ee4d2d]"
                />
                <span className="font-bold text-red-600">Gắn nhãn Mall</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFlashSale}
                  onChange={(e) => setFormData({ ...formData, isFlashSale: e.target.checked })}
                  className="accent-[#ee4d2d]"
                />
                <span className="font-bold text-amber-600">Đưa vào Flash Sale</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFreeshipXtra}
                  onChange={(e) => setFormData({ ...formData, isFreeshipXtra: e.target.checked })}
                  className="accent-[#ee4d2d]"
                />
                <span className="font-bold text-emerald-600">Freeship Xtra</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold rounded-lg shadow-md transition-colors text-sm"
            >
              Đăng Bán Sản Phẩm Ngay
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs">
          <button
            onClick={resetAllData}
            className="text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục dữ liệu mẫu ban đầu</span>
          </button>

          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-semibold transition-colors"
          >
            Đóng Kênh Người Bán
          </button>
        </div>
      </div>
    </div>
  );
}
