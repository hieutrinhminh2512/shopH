import React from 'react';
import { ShopProvider } from './context/ShopContext';
import Navbar from './components/Navbar';
import BannerSlider from './components/BannerSlider';
import Categories from './components/Categories';
import FlashSale from './components/FlashSale';
import ShopeeMall from './components/ShopeeMall';
import ProductList from './components/ProductList';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import QRPayModal from './components/QRPayModal';
import OrderHistoryModal from './components/OrderHistoryModal';
import SellerAdminModal from './components/SellerAdminModal';
import AuthModal from './components/AuthModal';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';
import Toast from './components/Toast';

export default function App() {
  return (
    <ShopProvider>
      <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-[#222]">
        {/* Navigation */}
        <Navbar />

        {/* Main Storefront Body */}
        <main className="flex-1">
          {/* Hero Carousel & Quick Services */}
          <BannerSlider />

          {/* Categories Grid */}
          <Categories />

          {/* Flash Sale with Countdown */}
          <FlashSale />

          {/* Shopee Mall Official Brands */}
          <ShopeeMall />

          {/* Main Discover & Products Section */}
          <ProductList />
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Interactive Modals */}
        <ProductDetailModal />
        <CartDrawer />
        <CheckoutModal />
        <QRPayModal />
        <OrderHistoryModal />
        <SellerAdminModal />
        <AuthModal />

        {/* Floating Widgets & Notifications */}
        <ChatWidget />
        <Toast />
      </div>
    </ShopProvider>
  );
}
