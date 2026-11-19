interface SeedMenuItem {
  name: string;
  price: number;
  emoji: string;
}

interface SeedCategory {
  name: string;
  items: SeedMenuItem[];
}

export const SEED_MENU: SeedCategory[] = [
  {
    name: 'Món chính',
    items: [
      { name: 'Phở bò tái', price: 55000, emoji: '🍜' },
      { name: 'Bún bò Huế', price: 55000, emoji: '🌶️' },
      { name: 'Cơm tấm sườn bì chả', price: 50000, emoji: '🍛' },
      { name: 'Bún chả Hà Nội', price: 50000, emoji: '🥢' },
      { name: 'Mì Quảng tôm thịt', price: 50000, emoji: '🍤' },
      { name: 'Cơm gà Hội An', price: 45000, emoji: '🍗' },
    ],
  },
  {
    name: 'Ăn vặt',
    items: [
      { name: 'Gỏi cuốn tôm thịt', price: 30000, emoji: '🥬' },
      { name: 'Chả giò', price: 35000, emoji: '🥟' },
      { name: 'Bánh xèo', price: 40000, emoji: '🥞' },
      { name: 'Nem nướng', price: 40000, emoji: '🍢' },
    ],
  },
  {
    name: 'Đồ uống',
    items: [
      { name: 'Cà phê sữa đá', price: 25000, emoji: '☕' },
      { name: 'Trà đá', price: 5000, emoji: '🧊' },
      { name: 'Nước mía', price: 15000, emoji: '🥤' },
      { name: 'Sinh tố bơ', price: 35000, emoji: '🥑' },
      { name: 'Trà chanh', price: 15000, emoji: '🍋' },
    ],
  },
  {
    name: 'Tráng miệng',
    items: [
      { name: 'Chè ba màu', price: 20000, emoji: '🍧' },
      { name: 'Bánh flan', price: 15000, emoji: '🍮' },
      { name: 'Sữa chua nếp cẩm', price: 20000, emoji: '🍨' },
    ],
  },
];

export const SEED_TABLE_COUNT = 8;
export const SEED_TABLE_SEATS = 4;
