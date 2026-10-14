import React, { useState, useEffect } from 'react';
import { BANNERS, SUB_BANNERS, QUICK_SERVICES } from '../data/mockData';
import { ChevronLeft, ChevronRight, ShieldCheck, Zap, Ticket, Truck, Laptop, Shirt, Globe, Coins } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setSelectedCategory, setOnlyMall, setOnlyFreeship, setActiveModal } = useShop();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  const renderServiceIcon = (iconName) => {
    const props = { className: "w-6 h-6" };
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Ticket': return <Ticket {...props} />;
      case 'Truck': return <Truck {...props} />;
      case 'Laptop': return <Laptop {...props} />;
      case 'Shirt': return <Shirt {...props} />;
      case 'Globe': return <Globe {...props} />;
      case 'Coins': return <Coins {...props} />;
      default: return <Zap {...props} />;
    }
  };

  const handleQuickServiceClick = (serviceId) => {
    const elem = document.getElementById('products-section');
    if (serviceId === 'mall') {
      setOnlyMall(true);
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    } else if (serviceId === 'freeship') {
      setOnlyFreeship(true);
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    } else if (serviceId === 'flash') {
      const flashElem = document.getElementById('flash-sale-section');
      if (flashElem) flashElem.scrollIntoView({ behavior: 'smooth' });
    } else if (serviceId === 'voucher') {
      setActiveModal('cart');
    } else if (serviceId === 'tech') {
      setSelectedCategory('dien-thoai');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    } else if (serviceId === 'fashion') {
      setSelectedCategory('thoi-trang-nam');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white py-6 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Banner Grid (2/3 Main slider + 1/3 Side banners) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 rounded-lg overflow-hidden">
          {/* Main Hero Slider */}
          <div className="lg:col-span-2 relative h-56 sm:h-72 md:h-80 rounded-lg overflow-hidden group shadow-sm cursor-pointer">
            {BANNERS.map((banner, index) => (
              <div
                key={banner.id}
                onClick={() => {
                  const elem = document.getElementById('products-section');
                  if (banner.id === 1) {
                    const flash = document.getElementById('flash-sale-section');
                    if (flash) flash.scrollIntoView({ behavior: 'smooth' });
                  } else if (banner.id === 2) {
                    setSelectedCategory('dien-thoai');
                    setOnlyMall(true);
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  } else if (banner.id === 3) {
                    setSelectedCategory('thoi-trang-nam');
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                  <span className="inline-block px-2.5 py-1 rounded-sm bg-[#ee4d2d] text-white text-xs font-bold tracking-wider mb-2 w-max shadow">
                    {banner.tag}
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black drop-shadow-md">
                    {banner.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-200 mt-1 max-w-md drop-shadow">
                    {banner.subtitle}
                  </p>
                </div>
              </div>
            ))}

            {/* Slider Controls */}
            <button
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-10 bg-black/30 hover:bg-black/60 text-white rounded-r flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-10 bg-black/30 hover:bg-black/60 text-white rounded-l flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {BANNERS.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-6 bg-[#ee4d2d]' : 'w-2 bg-white/70 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Sub-banners */}
          <div className="hidden lg:flex flex-col gap-3 h-80">
            {SUB_BANNERS.map((sub) => (
              <div
                key={sub.id}
                onClick={() => {
                  const elem = document.getElementById('products-section');
                  if (sub.id === 1) {
                    setOnlyMall(true);
                  } else {
                    setOnlyFreeship(true);
                  }
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="relative flex-1 rounded-lg overflow-hidden group cursor-pointer shadow-sm"
              >
                <img
                  src={sub.image}
                  alt={sub.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-sm font-bold">{sub.title}</span>
                  <span className="text-xs text-yellow-300 font-semibold">{sub.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8 Quick Services Row */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mt-6 pt-5 border-t border-gray-100">
          {QUICK_SERVICES.map((service) => (
            <button
              key={service.id}
              onClick={() => handleQuickServiceClick(service.id)}
              className="flex flex-col items-center text-center group transition-transform hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-1.5 shadow-sm border border-gray-100 group-hover:shadow-md transition-all ${service.color}`}>
                {renderServiceIcon(service.icon)}
              </div>
              <span className="text-xs text-gray-700 font-medium group-hover:text-[#ee4d2d] transition-colors leading-tight line-clamp-2">
                {service.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
