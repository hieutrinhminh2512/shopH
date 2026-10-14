import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';
import { Sparkles, TrendingUp, Tag, Clock, ArrowDownUp, SearchX } from 'lucide-react';

export default function ProductList() {
  const {
    products,
    searchQuery,
    selectedCategory,
    sortBy,
    setSortBy,
    priceRange,
    ratingFilter,
    onlyMall,
    onlyFreeship,
    setSelectedCategory,
    setSearchQuery,
  } = useShop();

  const [activeTab, setActiveTab] = useState('recommend'); // 'recommend' | 'bestseller' | 'deals' | 'newest'
  const [visibleCount, setVisibleCount] = useState(15);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand?.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesDesc) return false;
      }

      // Category
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Mall filter
      if (onlyMall && !product.isMall) {
        return false;
      }

      // Freeship filter
      if (onlyFreeship && !product.isFreeshipXtra) {
        return false;
      }

      // Price range
      if (priceRange.min && product.price < Number(priceRange.min)) {
        return false;
      }
      if (priceRange.max && product.price > Number(priceRange.max)) {
        return false;
      }

      // Rating filter
      if (ratingFilter > 0 && (product.rating || 0) < ratingFilter) {
        return false;
      }

      // Tab specific filtering
      if (activeTab === 'deals' && (!product.originalPrice || product.originalPrice <= product.price)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') {
        return a.price - b.price;
      } else if (sortBy === 'price_desc') {
        return b.price - a.price;
      } else if (sortBy === 'top_sales' || activeTab === 'bestseller') {
        return (b.sold || 0) - (a.sold || 0);
      } else if (sortBy === 'latest' || activeTab === 'newest') {
        return b.id.localeCompare(a.id);
      } else if (activeTab === 'deals') {
        const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
        const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
        return discB - discA;
      } else {
        // 'popular'
        return (b.rating || 0) * (b.reviewsCount || 0) - (a.rating || 0) * (a.reviewsCount || 0);
      }
    });
  }, [products, searchQuery, selectedCategory, sortBy, priceRange, ratingFilter, onlyMall, onlyFreeship, activeTab]);

  return (
    <section id="products-section" className="max-w-7xl mx-auto px-4 my-8">
      {/* Shopee Tabs Row */}
      <div className="bg-white rounded-t-lg shadow-sm border border-gray-100 flex items-center overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('recommend')}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-sm tracking-wide transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'recommend'
              ? 'border-[#ee4d2d] text-[#ee4d2d]'
              : 'border-transparent text-gray-600 hover:text-[#ee4d2d]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>GỢI Ý HÔM NAY</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('bestseller');
            setSortBy('top_sales');
          }}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-sm tracking-wide transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'bestseller'
              ? 'border-[#ee4d2d] text-[#ee4d2d]'
              : 'border-transparent text-gray-600 hover:text-[#ee4d2d]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>BÁN CHẠY NHẤT</span>
        </button>

        <button
          onClick={() => setActiveTab('deals')}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-sm tracking-wide transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'deals'
              ? 'border-[#ee4d2d] text-[#ee4d2d]'
              : 'border-transparent text-gray-600 hover:text-[#ee4d2d]'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>SIÊU DEAL GIẢM SỐC</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('newest');
            setSortBy('latest');
          }}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-sm tracking-wide transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'newest'
              ? 'border-[#ee4d2d] text-[#ee4d2d]'
              : 'border-transparent text-gray-600 hover:text-[#ee4d2d]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>HÀNG MỚI VỀ</span>
        </button>
      </div>

      {/* Main Content Layout (Filter + Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-3">
        {/* Left Filter Sidebar */}
        <div className="md:col-span-1">
          <ProductFilter totalProducts={filteredProducts.length} />
        </div>

        {/* Right Products Area */}
        <div className="md:col-span-3 lg:col-span-4 flex flex-col justify-between">
          {/* Sort Control Bar */}
          <div className="bg-gray-100/90 rounded-md p-3 mb-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-600 font-medium">Sắp xếp theo:</span>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  sortBy === 'popular'
                    ? 'bg-[#ee4d2d] text-white font-bold shadow-sm'
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                }`}
              >
                Phổ biến
              </button>
              <button
                onClick={() => setSortBy('latest')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  sortBy === 'latest'
                    ? 'bg-[#ee4d2d] text-white font-bold shadow-sm'
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                }`}
              >
                Mới nhất
              </button>
              <button
                onClick={() => setSortBy('top_sales')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  sortBy === 'top_sales'
                    ? 'bg-[#ee4d2d] text-white font-bold shadow-sm'
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                }`}
              >
                Bán chạy
              </button>

              {/* Price Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy.startsWith('price') ? sortBy : ''}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-3 py-1.5 rounded appearance-none cursor-pointer pr-7 transition-colors focus:outline-none ${
                    sortBy.startsWith('price')
                      ? 'bg-[#ee4d2d] text-white font-bold shadow-sm'
                      : 'bg-white text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <option value="" disabled>Giá</option>
                  <option value="price_asc" className="text-gray-800 bg-white">Giá: Thấp đến Cao</option>
                  <option value="price_desc" className="text-gray-800 bg-white">Giá: Cao đến Thấp</option>
                </select>
                <ArrowDownUp className={`w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${
                  sortBy.startsWith('price') ? 'text-white' : 'text-gray-500'
                }`} />
              </div>
            </div>

            <div className="text-gray-500 font-medium">
              Tìm thấy <strong className="text-[#ee4d2d]">{filteredProducts.length}</strong> sản phẩm
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-100 my-4 shadow-sm">
              <SearchX className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800 mb-1">
                Không tìm thấy sản phẩm phù hợp
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
                Hãy thử kiểm tra lại từ khóa tìm kiếm hoặc bỏ bớt các tiêu chí lọc để xem thêm nhiều sản phẩm.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setOnlyMall(false);
                  setOnlyFreeship(false);
                  setPriceRange({ min: '', max: '' });
                  setRatingFilter(0);
                }}
                className="bg-[#ee4d2d] text-white text-xs font-semibold px-4 py-2 rounded shadow hover:bg-[#d73211] transition-colors"
              >
                Xóa bộ lọc & Xem tất cả sản phẩm
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredProducts.length && (
                <div className="text-center mt-8 mb-4">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 8)}
                    className="bg-white border border-gray-200 hover:border-[#ee4d2d] hover:text-[#ee4d2d] text-gray-700 text-xs font-semibold px-10 py-3 rounded shadow-sm hover:shadow transition-all"
                  >
                    Xem Thêm ({filteredProducts.length - visibleCount} sản phẩm nữa)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
