import React from 'react';
import { 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  Headphones, 
  Facebook, 
  Instagram, 
  Linkedin, 
  QrCode,
  Smartphone
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t-4 border-[#ee4d2d] mt-12 text-gray-600 text-xs text-left">
      {/* 4 Feature Highlights */}
      <div className="border-b border-gray-100 py-8 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#ee4d2d] flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">7 Ngày Miễn Phí Trả Hàng</h4>
              <p className="text-gray-500 text-[11px] mt-0.5">Trả hàng miễn phí dễ dàng trong 7 ngày</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">100% Hàng Chính Hãng</h4>
              <p className="text-gray-500 text-[11px] mt-0.5">Cam kết chính hãng hoặc hoàn tiền gấp đôi</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Miễn Phí Vận Chuyển</h4>
              <p className="text-gray-500 text-[11px] mt-0.5">Giao hàng toàn quốc đơn từ 0Đ</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Hỗ Trợ 24/7 Chu Đáo</h4>
              <p className="text-gray-500 text-[11px] mt-0.5">Tổng đài CSKH miễn phí: 1900 1234</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 border-b border-gray-100">
        {/* Col 1 */}
        <div>
          <h4 className="font-bold text-gray-800 uppercase mb-3 text-xs">CHĂM SÓC KHÁCH HÀNG</h4>
          <ul className="space-y-2 text-[11px]">
            <li><a href="#help" className="hover:text-[#ee4d2d] transition-colors">Trung Tâm Trợ Giúp ShopH</a></li>
            <li><a href="#blog" className="hover:text-[#ee4d2d] transition-colors">ShopH Blog Hướng Dẫn</a></li>
            <li><a href="#guide" className="hover:text-[#ee4d2d] transition-colors">Hướng Dẫn Mua Hàng & Thanh Toán</a></li>
            <li><a href="#ship" className="hover:text-[#ee4d2d] transition-colors">Chính Sách Vận Chuyển</a></li>
            <li><a href="#return" className="hover:text-[#ee4d2d] transition-colors">Trả Hàng & Hoàn Tiền</a></li>
            <li><a href="#warranty" className="hover:text-[#ee4d2d] transition-colors">Chính Sách Bảo Hành</a></li>
          </ul>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="font-bold text-gray-800 uppercase mb-3 text-xs">VỀ SHOPH VIỆT NAM</h4>
          <ul className="space-y-2 text-[11px]">
            <li><a href="#about" className="hover:text-[#ee4d2d] transition-colors">Giới Thiệu Về ShopH</a></li>
            <li><a href="#career" className="hover:text-[#ee4d2d] transition-colors">Tuyển Dụng Nhân Tài</a></li>
            <li><a href="#terms" className="hover:text-[#ee4d2d] transition-colors">Điều Khoản Dịch Vụ</a></li>
            <li><a href="#privacy" className="hover:text-[#ee4d2d] transition-colors">Chính Sách Bảo Mật</a></li>
            <li><a href="#mall" className="hover:text-[#ee4d2d] transition-colors">Chính Hãng ShopH Mall</a></li>
            <li><a href="#seller" className="hover:text-[#ee4d2d] transition-colors">Kênh Người Bán Hàng</a></li>
          </ul>
        </div>

        {/* Col 3: Payment & Shipping */}
        <div>
          <h4 className="font-bold text-gray-800 uppercase mb-3 text-xs">THANH TOÁN</h4>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <span className="p-1.5 border border-gray-200 rounded text-center text-[10px] font-bold text-blue-700 bg-white">VISA</span>
            <span className="p-1.5 border border-gray-200 rounded text-center text-[10px] font-bold text-red-600 bg-white">Master</span>
            <span className="p-1.5 border border-gray-200 rounded text-center text-[10px] font-bold text-emerald-700 bg-white">VietQR</span>
            <span className="p-1.5 border border-gray-200 rounded text-center text-[10px] font-bold text-pink-600 bg-white">MoMo</span>
            <span className="p-1.5 border border-gray-200 rounded text-center text-[10px] font-bold text-orange-600 bg-white">COD</span>
            <span className="p-1.5 border border-gray-200 rounded text-center text-[10px] font-bold text-blue-500 bg-white">JCB</span>
          </div>

          <h4 className="font-bold text-gray-800 uppercase mb-2 text-xs">ĐƠN VỊ VẬN CHUYỂN</h4>
          <div className="grid grid-cols-3 gap-2">
            <span className="p-1.5 border border-gray-200 rounded text-center text-[10px] font-bold text-[#ee4d2d] bg-white">SPX</span>
            <span className="p-1.5 border border-gray-200 rounded text-center text-[10px] font-bold text-blue-600 bg-white">GHN</span>
            <span className="p-1.5 border border-gray-200 rounded text-center text-[10px] font-bold text-red-500 bg-white">Viettel</span>
          </div>
        </div>

        {/* Col 4: Follow Us */}
        <div>
          <h4 className="font-bold text-gray-800 uppercase mb-3 text-xs">THEO DÕI CHÚNG TÔI</h4>
          <ul className="space-y-2 text-[11px]">
            <li>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#ee4d2d] transition-colors">
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>Facebook</span>
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#ee4d2d] transition-colors">
                <Instagram className="w-4 h-4 text-pink-600" />
                <span>Instagram</span>
              </a>
            </li>
            <li>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#ee4d2d] transition-colors">
                <Linkedin className="w-4 h-4 text-blue-700" />
                <span>LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Col 5: App Download */}
        <div id="app-download">
          <h4 className="font-bold text-gray-800 uppercase mb-3 text-xs">TẢI ỨNG DỤNG SHOPH</h4>
          <div className="flex gap-3 items-center">
            <div className="w-18 h-18 p-1.5 border border-gray-200 rounded-lg bg-white shadow-sm flex items-center justify-center">
              <QrCode className="w-12 h-12 text-gray-800" />
            </div>
            <div className="flex flex-col gap-1.5">
              <button className="px-3 py-1.5 border border-gray-300 rounded text-[10px] font-semibold hover:border-[#ee4d2d] hover:text-[#ee4d2d] transition-colors text-left flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" />
                <span>App Store</span>
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded text-[10px] font-semibold hover:border-[#ee4d2d] hover:text-[#ee4d2d] transition-colors text-left flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Google Play</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Region & Copyright */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap items-center justify-between gap-4 text-[11px] text-gray-500">
        <div>
          <span>© 2026 shopH. Tất cả các quyền được bảo lưu. Phát triển bởi <strong>Trịnh Minh Hiếu (@hieutrinhminh2512)</strong></span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span>Quốc gia & Khu vực:</span>
          <span className="font-semibold text-gray-700">Việt Nam</span>
          <span>|</span>
          <span>Singapore</span>
          <span>|</span>
          <span>Indonesia</span>
          <span>|</span>
          <span>Thái Lan</span>
          <span>|</span>
          <span>Malaysia</span>
          <span>|</span>
          <span>Philippines</span>
          <span>|</span>
          <span>Brazil</span>
        </div>
      </div>

      {/* Legal disclaimer */}
      <div className="bg-[#f5f5f5] py-6 border-t border-gray-200 text-center text-[10px] text-gray-400 space-y-1">
        <p className="uppercase font-semibold tracking-wider text-gray-500">SÀN THƯƠNG MẠI ĐIỆN TỬ SHOPH VIỆT NAM</p>
        <p>Địa chỉ: Tòa nhà FPT Polytechnic, Phường Quan Hoa, Quận Cầu Giấy, TP. Hà Nội</p>
        <p>Mã số doanh nghiệp: 0108942105 do Sở Kế hoạch & Đầu tư TP Hà Nội cấp</p>
        <p>© 2026 - Bản quyền thuộc về shopH</p>
      </div>
    </footer>
  );
}
