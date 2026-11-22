import React, { useEffect, useState } from 'react';
import { Code2, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ui';

const links = [
  { href: '/#about', label: 'Về mình' },
  { href: '/#projects', label: 'Dự án' },
  { href: '/#experience', label: 'Hành trình' },
  { href: '/blog', label: 'Blog' },
];

/** Thanh menu trên cùng, dùng cho mọi trang. Ở trang chủ, menu trong suốt khi ở đầu trang. */
const Navbar: React.FC<{ overlay?: boolean }> = ({ overlay = false }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = !overlay || scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid ? 'border-b border-line bg-paper/85 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-10">
        <a href="/" className="group flex items-center gap-2" aria-label="DEVSPRING – về trang chủ">
          <Code2
            size={26}
            strokeWidth={2.4}
            aria-hidden="true"
            className="text-accent transition-transform duration-300 group-hover:-rotate-6"
          />
          <span className="text-xl font-extrabold tracking-wide">
            DEV<span className="text-accent">SPRING</span>
          </span>
        </a>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 text-sm md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-full px-3.5 py-2 text-ink/75 hover:bg-raised hover:text-ink transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/#contact"
            className="ml-2 hidden rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink/85 transition-colors sm:inline-block"
          >
            Nhắn cho mình
          </a>
          <ThemeToggle className="ml-2" />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 ml-1 p-2 text-muted hover:text-ink md:hidden"
            aria-label={open ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="mx-auto max-w-6xl space-y-1 px-6 pb-4 sm:px-10 md:hidden">
          {[...links, { href: '/#contact', label: 'Liên hệ' }].map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 text-ink/80 hover:bg-raised">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
};

export default Navbar;
