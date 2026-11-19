import type { AdSlide } from '@/types/customer-display';

/** Banner riêng cho màn hình khách, không phụ thuộc vào thực đơn đang bán. */
export const CUSTOMER_DISPLAY_ADS: readonly AdSlide[] = [
  {
    id: 'welcome',
    imageSrc: '/images/customer-display/restaurant-welcome.png',
    imageAlt: 'Không gian quán ăn ấm cúng với bàn ăn và ánh đèn vàng',
    eyebrow: 'Chào mừng quý khách',
    title: 'Bữa ngon,\ntrọn vị yêu thương.',
    description:
      'Một bữa ăn ngon, một khoảng thời gian thật vui. Cảm ơn bạn đã ghé quán!',
    accent: 'amber',
  },
  {
    id: 'offers',
    imageSrc: '/images/customer-display/restaurant-offers.png',
    imageAlt: 'Hộp quà và thiệp ưu đãi bên bàn trà tại quán',
    eyebrow: 'Khuyến mãi tại quán',
    title: 'Thêm ưu đãi,\nthêm niềm vui.',
    description:
      'Hỏi nhân viên về chương trình khuyến mãi và điều kiện áp dụng khi gọi món.',
    accent: 'rose',
  },
  {
    id: 'gathering',
    imageSrc: '/images/customer-display/restaurant-gathering.png',
    imageAlt: 'Nhóm bạn cùng trò chuyện và dùng bữa trong không gian ấm áp',
    eyebrow: 'Hẹn nhau tại quán',
    title: 'Đông đủ hơn,\nvui nhiều hơn.',
    description:
      'Cùng gia đình, bạn bè quây quần bên bàn ăn và sẻ chia những câu chuyện.',
    accent: 'sage',
  },
];
