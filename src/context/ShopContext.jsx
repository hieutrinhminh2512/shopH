import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_USER, INITIAL_ORDERS, VOUCHERS } from '../data/mockData';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Products
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('shoph_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('shoph_products', JSON.stringify(products));
  }, [products]);

  // Cart
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('shoph_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shoph_cart', JSON.stringify(cart));
  }, [cart]);

  // Orders
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('shoph_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('shoph_orders', JSON.stringify(orders));
  }, [orders]);

  // User
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shoph_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  useEffect(() => {
    localStorage.setItem('shoph_user', JSON.stringify(user));
  }, [user]);

  // Modals & Navigation
  const [activeModal, setActiveModal] = useState(null); // 'product-detail' | 'cart' | 'checkout' | 'orders' | 'admin' | 'auth' | 'qr-pay'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pendingOrder, setPendingOrder] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [ratingFilter, setRatingFilter] = useState(0);
  const [onlyMall, setOnlyMall] = useState(false);
  const [onlyFreeship, setOnlyFreeship] = useState(false);

  // Vouchers & Shopee Coins
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [useCoins, setUseCoins] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart operations
  const addToCart = (product, variant = '', quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.productId === product.id && item.variant === variant);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        const newItem = {
          cartItemId: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          originalPrice: product.originalPrice,
          variant: variant || (product.variants?.[0]?.options?.[0] || 'Mặc định'),
          quantity,
          selected: true,
          stock: product.stock,
          shopName: product.brand || 'ShopH Mall'
        };
        return [newItem, ...prev];
      }
    });
    showToast(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`, 'success');
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const updateCartQuantity = (cartItemId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const maxStock = item.stock || 99;
        const newQty = Math.max(1, Math.min(maxStock, item.quantity + delta));
        if (delta > 0 && item.quantity >= maxStock) {
          showToast(`Sản phẩm chỉ còn ${maxStock} trong kho!`, 'warning');
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
  };

  const toggleCartItemSelection = (cartItemId) => {
    setCart(prev => prev.map(item => 
      item.cartItemId === cartItemId ? { ...item, selected: !item.selected } : item
    ));
  };

  const toggleSelectAll = (selectAll) => {
    setCart(prev => prev.map(item => ({ ...item, selected: selectAll })));
  };

  // Cart Totals calculation
  const selectedCartItems = cart.filter(item => item.selected);
  const cartSubtotal = selectedCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartTotalOriginal = selectedCartItems.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
  const cartSavedAmount = Math.max(0, cartTotalOriginal - cartSubtotal);

  // Voucher discount calculation
  let voucherDiscount = 0;
  if (activeVoucher && cartSubtotal >= activeVoucher.minSpend) {
    if (activeVoucher.type === 'fixed' || activeVoucher.type === 'shipping') {
      voucherDiscount = activeVoucher.discountAmount;
    } else if (activeVoucher.type === 'percent') {
      voucherDiscount = Math.min(activeVoucher.maxDiscount || Infinity, (cartSubtotal * activeVoucher.discountPercent) / 100);
    }
  }

  // Coins discount (1 coin = 1 VND)
  const coinsDiscount = useCoins && user?.coins ? Math.min(user.coins, Math.floor(cartSubtotal * 0.5)) : 0;

  // Shipping fee estimate
  const baseShippingFee = selectedCartItems.length > 0 ? (cartSubtotal >= 300000 ? 0 : 25000) : 0;
  const finalShippingFee = (activeVoucher?.type === 'shipping' && cartSubtotal >= activeVoucher.minSpend) ? 0 : baseShippingFee;

  const finalTotal = Math.max(0, cartSubtotal - voucherDiscount - coinsDiscount + finalShippingFee);

  // Create Order
  const createOrder = ({ shippingAddress, paymentMethod, shippingUnit, note, customShippingFee, customTotalAmount }) => {
    if (selectedCartItems.length === 0) {
      showToast('Vui lòng chọn ít nhất 1 sản phẩm để đặt hàng!', 'warning');
      return null;
    }

    const orderId = `SPH-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      status: paymentMethod.includes('VietQR') ? 'pending' : 'shipping',
      statusText: paymentMethod.includes('VietQR') ? 'Chờ thanh toán QR' : 'Đang chuẩn bị hàng',
      items: selectedCartItems.map(item => ({
        id: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        variant: item.variant,
        quantity: item.quantity
      })),
      totalAmount: customTotalAmount !== undefined ? customTotalAmount : finalTotal,
      subtotal: cartSubtotal,
      shippingFee: customShippingFee !== undefined ? customShippingFee : finalShippingFee,
      discountAmount: voucherDiscount + coinsDiscount,
      paymentMethod,
      shippingUnit: shippingUnit || 'SPX Express Giao Siêu Tốc',
      trackingNumber: `VN${Math.floor(100000000 + Math.random() * 900000000)}SPX`,
      address: shippingAddress || user.addresses[0].address,
      note: note || '',
      buyerName: user.name,
      buyerPhone: user.phone
    };

    setOrders(prev => [newOrder, ...prev]);

    // Remove purchased items from cart
    setCart(prev => prev.filter(item => !item.selected));

    // Deduct coins if used
    if (useCoins && coinsDiscount > 0) {
      setUser(prev => ({ ...prev, coins: prev.coins - coinsDiscount }));
    }

    // Reset active voucher
    setActiveVoucher(null);
    setUseCoins(false);

    showToast(`Đặt hàng thành công! Mã đơn: ${orderId}`, 'success');

    if (paymentMethod.includes('VietQR')) {
      setPendingOrder(newOrder);
      setActiveModal('qr-pay');
    } else {
      setActiveModal('orders');
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus, newStatusText) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          statusText: newStatusText || (
            newStatus === 'completed' ? 'Giao hàng thành công' :
            newStatus === 'shipping' ? 'Đang giao hàng' :
            newStatus === 'cancelled' ? 'Đã hủy đơn' : 'Đã xác nhận'
          )
        };
      }
      return order;
    }));
    showToast(`Đã cập nhật trạng thái đơn ${orderId}`, 'info');
  };

  const cancelOrder = (orderId) => {
    updateOrderStatus(orderId, 'cancelled', 'Đã hủy bởi người mua');
  };

  // Product Admin Operations
  const addProduct = (newProduct) => {
    const product = {
      ...newProduct,
      id: `sp-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      sold: 0,
      reviews: [],
      variants: newProduct.variants?.length ? newProduct.variants : [
        { name: 'Phân loại', options: ['Bản Tiêu Chuẩn', 'Bản Cao Cấp'] }
      ],
      images: newProduct.images?.length ? newProduct.images : [newProduct.image]
    };
    setProducts(prev => [product, ...prev]);
    showToast('Đã đăng sản phẩm mới lên sàn thành công!', 'success');
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    showToast('Đã lưu thay đổi thông tin sản phẩm!', 'success');
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Đã xóa sản phẩm khỏi hệ thống!', 'info');
  };

  const addProductReview = (productId, reviewData) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newReview = {
          id: Date.now(),
          user: user.name || 'Người mua ẩn danh',
          avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
          rating: reviewData.rating,
          date: new Date().toLocaleDateString('vi-VN'),
          comment: reviewData.comment,
          variant: reviewData.variant || 'Mặc định'
        };
        const updatedReviews = [newReview, ...(p.reviews || [])];
        const avgRating = (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1);
        return {
          ...p,
          reviews: updatedReviews,
          reviewsCount: (p.reviewsCount || 0) + 1,
          rating: parseFloat(avgRating)
        };
      }
      return p;
    }));
    showToast('Cảm ơn bạn đã gửi đánh giá sản phẩm!', 'success');
  };

  const resetAllData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setUser(INITIAL_USER);
    setCart([]);
    localStorage.removeItem('shoph_products');
    localStorage.removeItem('shoph_orders');
    localStorage.removeItem('shoph_user');
    localStorage.removeItem('shoph_cart');
    showToast('Đã khôi phục dữ liệu mẫu ban đầu!', 'info');
  };

  // Helper to open product detail
  const viewProduct = (product) => {
    setSelectedProduct(product);
    setActiveModal('product-detail');
  };

  return (
    <ShopContext.Provider value={{
      // Products
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      addProductReview,
      resetAllData,
      viewProduct,

      // Cart
      cart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      toggleCartItemSelection,
      toggleSelectAll,
      selectedCartItems,
      cartSubtotal,
      cartTotalOriginal,
      cartSavedAmount,
      baseShippingFee,
      finalShippingFee,
      finalTotal,

      // Vouchers & Coins
      vouchers: VOUCHERS,
      activeVoucher,
      setActiveVoucher,
      voucherDiscount,
      useCoins,
      setUseCoins,
      coinsDiscount,

      // Orders
      orders,
      createOrder,
      updateOrderStatus,
      cancelOrder,
      pendingOrder,
      setPendingOrder,

      // User
      user,
      setUser,

      // Search & Filters
      searchQuery,
      setSearchQuery,
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

      // Modals
      activeModal,
      setActiveModal,
      closeModal,
      selectedProduct,
      setSelectedProduct,

      // Toasts
      toasts,
      showToast,
      removeToast
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
