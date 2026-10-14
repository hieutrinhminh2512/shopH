import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, User, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

export default function AuthModal() {
  const { activeModal, setActiveModal, user, setUser, showToast } = useShop();

  const [name, setName] = useState(user?.name || 'Trịnh Minh Hiếu');
  const [phone, setPhone] = useState(user?.phone || '0987 654 321');
  const [email, setEmail] = useState(user?.email || 'hieutrinhminh2512@gmail.com');
  const [address, setAddress] = useState(user?.addresses?.[0]?.address || 'Số 12 ngõ 45 Cầu Giấy, Hà Nội');

  if (activeModal !== 'auth') return null;

  const handleSave = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name,
      phone,
      email,
      addresses: [
        {
          id: 'addr-1',
          fullName: name,
          phone,
          address,
          isDefault: true
        }
      ]
    }));
    showToast('Đã lưu thông tin tài khoản thành công!', 'success');
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden text-left relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
              alt="Avatar"
              className="w-12 h-12 rounded-full border-2 border-white object-cover"
            />
            <div>
              <h3 className="font-bold text-base">{user?.name}</h3>
              <p className="text-xs text-orange-100">Tài khoản ShopH Thành Viên VIP</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Họ và tên</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:border-[#ee4d2d] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Số điện thoại</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:border-[#ee4d2d] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:border-[#ee4d2d] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Địa chỉ nhận hàng mặc định</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:border-[#ee4d2d] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold rounded-lg shadow-md transition-colors"
            >
              Cập Nhật Thông Tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
