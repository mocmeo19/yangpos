/** Trang con (vd /settings/printer) vẫn tô sáng mục cha; trang chủ "/" chỉ khớp chính nó. */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
