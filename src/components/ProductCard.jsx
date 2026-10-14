import React from 'react';
import { useShop } from '../context/ShopContext';
import { Star, ShoppingCart, MapPin } from 'lucide-react';
import { formatCurrency, formatSold, calculateDiscount } from '../utils/formatters';

export default function ProductCard({ product }) {
  const { viewProduct, addToCart } = useShop();

  const discount = calculateDiscount(product.originalPrice, product.price);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, product.variants?.[0]?.options?.[0] || 'Mặc định', 1);
  };

  return (
    <div
      onClick={() => viewProduct(product)}
      className="group relative bg-white rounded-md border border-gray-100 hover:border-[#ee4d2d] hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Mall / Yêu thích Tag */}
        {product.isMall ? (
          <span className="absolute top-1.5 left-0 bg-[#d0011b] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-r shadow-sm">
            Mall
          </span>
        ) : (
          <span className="absolute top-1.5 left-0 bg-[#ee4d2d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-r shadow-sm">
            Yêu thích+
          </span>
        )}

        {/* Discount Ribbon Tag */}
        {discount > 0 && (
          <div className="absolute top-0 right-0 bg-[#ffd424] text-[#ee4d2d] px-1.5 py-0.5 text-center shadow-sm">
            <span className="text-[10px] font-bold leading-none block">GIẢM</span>
            <span className="text-xs font-black leading-none block">{discount}%</span>
          </div>
        )}

        {/* Quick Add Button on Hover */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[#ee4d2d] hover:bg-[#d73211] text-white flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-10"
          title="Thêm nhanh vào giỏ"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags */}
          <div className="flex items-center gap-1.5 mb-1.5">
            {product.isFreeshipXtra && (
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-1 py-0.2 rounded">
                Freeship Xtra
              </span>
            )}
            <span className="text-[9px] font-bold text-[#ee4d2d] bg-orange-50 border border-orange-200 px-1 py-0.2 rounded">
              Xử lý bởi ShopH
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xs text-gray-800 font-medium line-clamp-2 leading-relaxed group-hover:text-[#ee4d2d] transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="mt-2.5">
          {/* Pricing */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-[#ee4d2d]">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-gray-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Rating, Sold & Location */}
          <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-500">
            <div className="flex items-center gap-1">
              <div className="flex items-center text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                <span className="text-gray-700 font-semibold text-[11px] ml-0.5">{product.rating || 5.0}</span>
              </div>
              <span>•</span>
              <span>Đã bán {formatSold(product.sold)}</span>
            </div>

            <div className="flex items-center gap-0.5 text-gray-400 text-[10px]">
              <MapPin className="w-2.5 h-2.5" />
              <span>{product.location || 'Hà Nội'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
