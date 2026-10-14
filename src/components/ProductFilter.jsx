import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/mockData';
import { Filter, Star, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

export default function ProductFilter({ totalProducts }) {
  const {
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    ratingFilter,
    setRatingFilter,
    onlyMall,
    setOnlyMall,
    onlyFreeship,
    setOnlyFreeship,
  } = useShop();

  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const handlePriceApply = (e) => {
    e.preventDefault();
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSortBy('popular');
    setPriceRange({ min: '', max: '' });
    setRatingFilter(0);
    setOnlyMall(false);
    setOnlyFreeship(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      {/* Header */}
      <div 
        onClick={() => setIsMobileExpanded(!isMobileExpanded)}
        className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3 cursor-pointer md:cursor-default select-none"
      >
        <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
          <Filter className="w-4 h-4 text-[#ee4d2d]" />
          <span>BỘ LỌC TÌM KIẾM</span>
          <span className="md:hidden text-xs text-[#ee4d2d] font-normal flex items-center gap-0.5">
            {isMobileExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); clearAllFilters(); }}
          className="text-[11px] text-[#ee4d2d] hover:underline flex items-center gap-1 font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Xóa tất cả</span>
        </button>
      </div>

      {/* Filter Body (collapsible on mobile) */}
      <div className={`${isMobileExpanded ? 'block' : 'hidden md:block'} space-y-4`}>
        {/* Category Filter */}
        <div className="pb-4 border-b border-gray-100">
          <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Theo Danh Mục</h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-[#ee4d2d]">
              <input
                type="radio"
                name="cat"
                checked={selectedCategory === 'all'}
                onChange={() => setSelectedCategory('all')}
                className="accent-[#ee4d2d]"
              />
              <span>Tất cả sản phẩm</span>
            </label>
            {CATEGORIES.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-[#ee4d2d]"
              >
                <input
                  type="radio"
                  name="cat"
                  checked={selectedCategory === cat.id}
                  onChange={() => setSelectedCategory(cat.id)}
                  className="accent-[#ee4d2d]"
                />
                <span className="truncate">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Dịch vụ & Khuyến mãi */}
        <div className="pb-4 border-b border-gray-100">
          <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Dịch Vụ & Khuyến Mãi</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyFreeship}
                onChange={(e) => setOnlyFreeship(e.target.checked)}
                className="rounded accent-[#ee4d2d]"
              />
              <span className="font-medium text-emerald-700">Freeship Xtra</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyMall}
                onChange={(e) => setOnlyMall(e.target.checked)}
                className="rounded accent-[#ee4d2d]"
              />
              <span className="font-medium text-[#d0011b]">Shopee Mall Chính Hãng</span>
            </label>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="pb-4 border-b border-gray-100">
          <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Khoảng Giá (₫)</h4>
          <form onSubmit={handlePriceApply} className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Từ ₫"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded focus:border-[#ee4d2d] focus:outline-none"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Đến ₫"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded focus:border-[#ee4d2d] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xs font-semibold py-1.5 rounded uppercase tracking-wider transition-colors shadow-sm"
            >
              ÁP DỤNG
            </button>
          </form>
        </div>

        {/* Rating Filter */}
        <div>
          <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Đánh Giá Sao</h4>
          <div className="space-y-1.5">
            {[5, 4, 3].map((star) => (
              <button
                key={star}
                onClick={() => setRatingFilter(ratingFilter === star ? 0 : star)}
                className={`w-full flex items-center justify-between text-xs px-2 py-1.5 rounded transition-colors ${
                  ratingFilter === star ? 'bg-orange-50 text-[#ee4d2d] font-bold border border-[#ee4d2d]' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-gray-500">{star === 5 ? '5 sao' : `Từ ${star} sao`}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
