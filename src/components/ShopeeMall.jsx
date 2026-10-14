import React from 'react';
import { MALL_BRANDS } from '../data/mockData';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, RotateCcw, Truck, ChevronRight } from 'lucide-react';

export default function ShopeeMall() {
  const { setOnlyMall } = useShop();

  const handleMallClick = () => {
    setOnlyMall(true);
    const elem = document.getElementById('products-section');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 my-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Mall Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-red-700 to-[#d0011b] text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="bg-white text-[#d0011b] text-xs font-black px-2 py-0.5 rounded tracking-wider uppercase">
                MALL
              </span>
              <h2 className="text-lg font-extrabold tracking-wide">
                SHOPH MALL CHÍNH HÃNG
              </h2>
            </div>

            <div className="hidden md:flex items-center gap-5 text-xs text-red-100 border-l border-red-500/50 pl-4">
              <div className="flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>7 Ngày Miễn Phí Trả Hàng</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Hàng Chính Hãng</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                <span>Miễn Phí Vận Chuyển</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleMallClick}
            className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
          >
            <span>Xem Tất Cả Thương Hiệu</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Brands Showcase */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {MALL_BRANDS.map((brand, idx) => (
            <div
              key={idx}
              onClick={handleMallClick}
              className="group cursor-pointer rounded-lg border border-gray-100 hover:border-red-300 hover:shadow-md transition-all p-3 text-center flex flex-col items-center justify-between bg-gradient-to-b from-gray-50/50 to-white"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-sm border border-gray-100 mb-2 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>
              <span className="text-xs font-bold text-gray-800 group-hover:text-red-600 transition-colors">
                {brand.name}
              </span>
              <span className="text-[11px] text-[#d0011b] font-medium mt-1 bg-red-50 px-2 py-0.5 rounded-full">
                {brand.promo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
