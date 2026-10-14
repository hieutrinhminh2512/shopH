import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Zap, Flame, ChevronRight } from 'lucide-react';
import { formatCurrency, calculateDiscount } from '../utils/formatters';

export default function FlashSale() {
  const { products, viewProduct } = useShop();
  const flashSaleProducts = products.filter(p => p.isFlashSale);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 45,
    seconds: 20
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 4, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format2Digits = (num) => String(num).padStart(2, '0');

  if (flashSaleProducts.length === 0) return null;

  return (
    <section id="flash-sale-section" className="max-w-7xl mx-auto px-4 my-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Flash Sale Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-orange-50 via-white to-red-50 flex flex-wrap items-center justify-between border-b border-gray-100 gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[#ee4d2d]">
              <Flame className="w-6 h-6 fill-red-500 text-[#ee4d2d] animate-bounce" />
              <h2 className="text-xl font-black italic tracking-wider text-[#ee4d2d] drop-shadow-sm">
                F<Zap className="inline w-4 h-4 -mx-1 fill-amber-400 text-amber-500" />ASH SALE
              </h2>
            </div>

            {/* Countdown Badges */}
            <div className="flex items-center gap-1 text-xs font-bold">
              <span className="bg-black text-white px-2 py-1 rounded text-sm">
                {format2Digits(timeLeft.hours)}
              </span>
              <span className="text-black font-extrabold">:</span>
              <span className="bg-black text-white px-2 py-1 rounded text-sm">
                {format2Digits(timeLeft.minutes)}
              </span>
              <span className="text-black font-extrabold">:</span>
              <span className="bg-black text-white px-2 py-1 rounded text-sm">
                {format2Digits(timeLeft.seconds)}
              </span>
            </div>
          </div>

          <a
            href="#products-section"
            className="text-xs font-semibold text-[#ee4d2d] hover:text-[#d73211] flex items-center gap-1 group"
          >
            <span>Xem Tất Cả Khung Giờ</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Flash Sale Products Row */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {flashSaleProducts.slice(0, 6).map((product) => {
            const discount = calculateDiscount(product.originalPrice, product.price);
            const soldPercentage = Math.min(95, Math.floor((product.sold % 100) + 30));

            return (
              <div
                key={product.id}
                onClick={() => viewProduct(product)}
                className="group cursor-pointer bg-white rounded-md border border-gray-100 hover:border-[#ee4d2d] hover:shadow-lg transition-all duration-300 p-2 flex flex-col justify-between"
              >
                {/* Image & Discount */}
                <div className="relative aspect-square rounded overflow-hidden bg-gray-50 mb-2.5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {discount > 0 && (
                    <div className="absolute top-0 right-0 bg-yellow-400 text-red-600 font-extrabold text-[11px] px-1.5 py-0.5 rounded-bl shadow">
                      -{discount}%
                    </div>
                  )}
                  {product.isMall && (
                    <span className="absolute top-1 left-1 bg-[#d0011b] text-white text-[9px] font-bold px-1 py-0.5 rounded">
                      Mall
                    </span>
                  )}
                </div>

                {/* Pricing */}
                <div className="text-center">
                  <div className="text-base font-extrabold text-[#ee4d2d]">
                    {formatCurrency(product.price)}
                  </div>
                  {product.originalPrice && (
                    <div className="text-[11px] text-gray-400 line-through">
                      {formatCurrency(product.originalPrice)}
                    </div>
                  )}

                  {/* Flame Progress Bar */}
                  <div className="mt-2.5 relative h-4 bg-red-100 rounded-full overflow-hidden flex items-center justify-center">
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${soldPercentage}%` }}
                    />
                    <div className="relative z-10 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5 fill-white" />
                      <span>ĐÃ BÁN {soldPercentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
