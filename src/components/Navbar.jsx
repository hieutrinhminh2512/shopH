import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingBag, 
  Search, 
  ShoppingCart, 
  Bell, 
  HelpCircle, 
  Globe, 
  Store, 
  Smartphone, 
  Facebook, 
  Instagram, 
  User as UserIcon, 
  Package, 
  LogOut, 
  Coins,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function Navbar() {
  const { 
    cart, 
    user, 
    setActiveModal, 
    searchQuery, 
    setSearchQuery, 
    setSelectedCategory,
    removeFromCart
  } = useShop();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Scroll to products
    const elem = document.getElementById('products-section');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const hotKeywords = ['Tai nghe chống ồn', 'Áo polo nam', 'Bàn phím cơ', 'Son kem lì', 'Nồi chiên 8L', 'Sneaker'];

  return (
    <header className="bg-gradient-to-b from-[#f53d2d] to-[#f63] text-white shadow-md sticky top-0 z-40">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center text-xs font-normal border-b border-white/10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveModal('admin')}
            className="flex items-center gap-1 hover:text-white/80 transition-colors font-medium text-amber-200"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Kênh Người Bán</span>
          </button>
          <span className="text-white/30">|</span>
          <a href="#app-download" className="flex items-center gap-1 hover:text-white/80 transition-colors">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Tải ứng dụng</span>
          </a>
          <span className="text-white/30">|</span>
          <div className="flex items-center gap-2">
            <span>Kết nối</span>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white/80">
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white/80">
              <Instagram className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 relative">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="flex items-center gap-1 hover:text-white/80 transition-colors relative py-1"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Thông Báo</span>
              <span className="w-2 h-2 rounded-full bg-yellow-400 absolute top-0 -left-1 animate-pulse"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-2xl border border-gray-100 py-2 z-50 text-left">
                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-sm text-gray-900">Thông báo mới nhận</span>
                  <span className="text-[11px] text-[#ee4d2d] cursor-pointer hover:underline">Đánh dấu đã đọc</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  <div className="p-3 hover:bg-orange-50/50 transition-colors cursor-pointer flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Siêu Sale 15.10 Bùng Nổ!</p>
                      <p className="text-[11px] text-gray-500 line-clamp-2">Voucher 50K và freeship 0Đ đã được gửi vào kho voucher của bạn.</p>
                      <span className="text-[10px] text-gray-400">10 phút trước</span>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-orange-50/50 transition-colors cursor-pointer flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Đơn hàng SPH-894210 đang giao</p>
                      <p className="text-[11px] text-gray-500 line-clamp-2">Shipper SPX Express đang trên đường giao hàng đến bạn.</p>
                      <span className="text-[10px] text-gray-400">1 giờ trước</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 text-center border-t border-gray-100 bg-gray-50/60">
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      setActiveModal('orders');
                    }}
                    className="text-xs text-gray-600 hover:text-[#ee4d2d]"
                  >
                    Xem tất cả đơn hàng
                  </button>
                </div>
              </div>
            )}
          </div>

          <a href="#help" className="flex items-center gap-1 hover:text-white/80 transition-colors">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hỗ Trợ</span>
          </a>

          <div className="flex items-center gap-1 cursor-pointer hover:text-white/80">
            <Globe className="w-3.5 h-3.5" />
            <span>Tiếng Việt</span>
            <ChevronDown className="w-3 h-3" />
          </div>

          <span className="text-white/30">|</span>

          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 hover:text-white/90 transition-colors font-medium py-1"
            >
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"} 
                alt="Avatar" 
                className="w-5 h-5 rounded-full object-cover border border-white"
              />
              <span className="max-w-[120px] truncate">{user?.name || 'Trịnh Minh Hiếu'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-2xl border border-gray-100 py-1.5 z-50 text-left">
                <div className="px-4 py-2.5 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50">
                  <p className="text-xs text-gray-500">Xin chào,</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{user?.coins?.toLocaleString()} Xu ShopH</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setShowUserMenu(false);
                    setActiveModal('orders');
                  }}
                  className="w-full px-4 py-2 text-xs flex items-center gap-2.5 text-gray-700 hover:bg-orange-50 hover:text-[#ee4d2d] transition-colors"
                >
                  <Package className="w-4 h-4 text-gray-400" />
                  <span>Đơn Mua Của Tôi</span>
                </button>

                <button 
                  onClick={() => {
                    setShowUserMenu(false);
                    setActiveModal('admin');
                  }}
                  className="w-full px-4 py-2 text-xs flex items-center gap-2.5 text-gray-700 hover:bg-orange-50 hover:text-[#ee4d2d] transition-colors"
                >
                  <Store className="w-4 h-4 text-gray-400" />
                  <span>Quản Lý Kênh Bán Hàng</span>
                </button>

                <div className="border-t border-gray-100 my-1"></div>

                <button 
                  onClick={() => {
                    setShowUserMenu(false);
                    setActiveModal('auth');
                  }}
                  className="w-full px-4 py-2 text-xs flex items-center gap-2.5 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đổi tài khoản</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <div 
          onClick={() => {
            setSelectedCategory('all');
            setSearchQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 cursor-pointer flex-shrink-0 group"
        >
          <div className="w-11 h-11 bg-white text-[#ee4d2d] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
            <ShoppingBag className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight text-white drop-shadow">shopH</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-400 text-orange-900 font-bold uppercase tracking-wider">
                VN
              </span>
            </div>
            <p className="text-[10px] text-orange-100 font-medium tracking-wide">MUA SẮM SIÊU RẺ - FREESHIP 0Đ</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-3xl">
          <form onSubmit={handleSearchSubmit} className="relative flex shadow-md rounded-sm overflow-hidden bg-white p-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Shopee bao ship 0Đ - Tìm sản phẩm, thương hiệu hoặc tên shop..."
              className="w-full px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] hover:opacity-95 text-white px-7 py-2 rounded-sm flex items-center justify-center transition-opacity flex-shrink-0"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Hot keyword suggestions below search */}
          <div className="flex items-center gap-3 mt-1.5 text-xs text-white/90 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
            {hotKeywords.map((kw, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(kw);
                  const elem = document.getElementById('products-section');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-yellow-200 transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Cart Icon & Preview */}
        <div 
          className="relative flex-shrink-0"
          onMouseEnter={() => setShowCartPreview(true)}
          onMouseLeave={() => setShowCartPreview(false)}
        >
          <button
            onClick={() => setActiveModal('cart')}
            className="relative p-2.5 hover:text-white/90 transition-transform active:scale-95 flex items-center justify-center"
            aria-label="Giỏ hàng"
          >
            <ShoppingCart className="w-8 h-8" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-[#ee4d2d] border border-[#ee4d2d] font-bold text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center shadow-md animate-bounce">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* Cart Hover Popup */}
          {showCartPreview && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-white text-gray-800 rounded-lg shadow-2xl border border-gray-100 z-50 p-3">
              <div className="text-xs font-semibold text-gray-400 px-2 pb-2 border-b border-gray-100">
                Sản phẩm mới thêm ({cart.length})
              </div>

              {cart.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <div className="w-16 h-16 bg-orange-50 text-[#ee4d2d] rounded-full flex items-center justify-center mx-auto mb-2">
                    <ShoppingCart className="w-8 h-8 stroke-1" />
                  </div>
                  <p className="text-xs font-medium">Chưa có sản phẩm nào trong giỏ</p>
                </div>
              ) : (
                <>
                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 py-1">
                    {cart.slice(0, 4).map((item) => (
                      <div key={item.cartItemId} className="py-2.5 px-2 flex items-center gap-3 hover:bg-orange-50/50 rounded transition-colors group">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-12 rounded object-cover border border-gray-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-800 font-medium truncate">{item.name}</p>
                          <p className="text-[11px] text-gray-400">{item.variant}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-[#ee4d2d] font-bold">{formatCurrency(item.price)}</span>
                            <span className="text-xs text-gray-500">x{item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {cart.length > 4 ? `+ ${cart.length - 4} sản phẩm khác` : `${cartCount} sản phẩm`}
                    </span>
                    <button
                      onClick={() => setActiveModal('cart')}
                      className="bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xs font-semibold px-4 py-2 rounded shadow transition-colors"
                    >
                      Xem Giỏ Hàng
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
