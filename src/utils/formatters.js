// Currency formatting in Vietnamese Dong
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '0₫';
  return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
};

// Format sold count (e.g., 1200 -> "1.2k", 48000 -> "48k")
export const formatSold = (count) => {
  if (!count) return '0';
  if (count >= 1000) {
    const k = (count / 1000).toFixed(1);
    return k.endsWith('.0') ? `${Math.floor(count / 1000)}k` : `${k}k`;
  }
  return count.toString();
};

// Calculate discount percentage
export const calculateDiscount = (originalPrice, price) => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

// Format Date
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
