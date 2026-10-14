import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { useShop } from '../context/ShopContext';

export default function Categories() {
  const { selectedCategory, setSelectedCategory } = useShop();

  const handleSelect = (categoryId) => {
    setSelectedCategory(categoryId);
    const elem = document.getElementById('products-section');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 my-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
          <h2 className="text-base font-bold uppercase text-gray-700 tracking-wide">
            DANH MỤC SẢN PHẨM
          </h2>
          <button 
            onClick={() => handleSelect('all')}
            className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors ${
              selectedCategory === 'all' 
                ? 'bg-[#ee4d2d] text-white' 
                : 'text-gray-500 hover:text-[#ee4d2d] hover:bg-orange-50'
            }`}
          >
            Tất cả danh mục
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`flex flex-col items-center text-center p-2.5 rounded-lg border transition-all duration-200 group ${
                  isSelected 
                    ? 'border-[#ee4d2d] bg-orange-50/50 shadow-sm scale-[1.02]' 
                    : 'border-transparent hover:border-gray-200 hover:shadow-md hover:bg-white'
                }`}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-50 border border-gray-100 mb-2 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>
                <span className={`text-xs font-medium line-clamp-2 leading-tight transition-colors ${
                  isSelected ? 'text-[#ee4d2d] font-bold' : 'text-gray-700 group-hover:text-[#ee4d2d]'
                }`}>
                  {cat.name}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  {cat.count} sản phẩm
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
