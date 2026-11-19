import {
  ChartColumn,
  ChefHat,
  Clock3,
  HardDrive,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
import { BrandMark } from '@/components/ui/BrandMark';
import { MENU_IMAGES } from '@/data/menu-images';

interface Highlight {
  icon: LucideIcon;
  text: string;
}

const HIGHLIGHTS: readonly Highlight[] = [
  { icon: ChefHat, text: 'Gọi món theo bàn, gửi bếp chỉ với một chạm' },
  { icon: Clock3, text: 'Theo dõi đơn và thời gian khách chờ' },
  { icon: ChartColumn, text: 'Báo cáo doanh thu theo giờ, theo ngày' },
  { icon: HardDrive, text: 'Chạy ngay trên trình duyệt, dữ liệu lưu tại máy' },
];

const MOSAIC_IMAGE_COUNT = 9;
const MOSAIC_IMAGES = Object.values(MENU_IMAGES).slice(0, MOSAIC_IMAGE_COUNT);

export function LoginShowcase() {
  return (
    <aside className="relative hidden overflow-hidden bg-ink text-white lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-32 grid w-[720px] rotate-[-8deg] grid-cols-3 gap-4 opacity-60"
      >
        {MOSAIC_IMAGES.map((src) => (
          <div
            key={src}
            className="relative aspect-square overflow-hidden rounded-3xl"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="240px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-ink via-ink/90 to-ink/20"
      />

      <div className="relative flex items-center gap-3">
        <BrandMark />
        <span className="text-xl font-bold tracking-tight">YangPOS</span>
      </div>

      <div className="relative max-w-md">
        <p className="font-mono text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">
          Phần mềm bán hàng cho quán ăn
        </p>
        <h2 className="mt-4 text-4xl leading-tight font-bold tracking-tight xl:text-5xl">
          Gọi món nhanh,
          <br />
          bếp nhận đơn tức thì.
        </h2>
        <ul className="mt-8 flex flex-col gap-3.5">
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-white/85">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
                <Icon aria-hidden="true" className="size-[18px]" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
