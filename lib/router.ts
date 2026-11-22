import { useEffect, useState } from 'react';

/**
 * Định tuyến bằng đường dẫn thật (để Google index được từng bài):
 *   /blog          → danh sách bài viết
 *   /blog/<slug>   → một bài viết
 *   /              → trang chủ (/#about, /#contact... là neo cuộn trong trang chủ)
 *
 * Lúc build, vite-plugin-blog.ts tạo sẵn file HTML cho /blog và từng bài (có tiêu đề, mô tả, nội dung)
 * để công cụ tìm kiếm và Facebook / Zalo đọc được mà không cần chạy JavaScript.
 * Link kiểu cũ #/blog/<slug> vẫn dùng được: tự chuyển sang /blog/<slug>.
 */
export type Route = { name: 'home' } | { name: 'blog' } | { name: 'post'; slug: string };

export const parsePath = (pathname: string): Route => {
  const m = pathname.match(/^\/blog(?:\/([\w-]+))?\/?$/);
  if (m) return m[1] ? { name: 'post', slug: m[1] } : { name: 'blog' };
  return { name: 'home' };
};

export const routeKey = (r: Route) => (r.name === 'post' ? `post:${r.slug}` : r.name);

const CHANGE = 'routechange';

export const navigate = (to: string, replace = false) => {
  if (replace) history.replaceState(null, '', to);
  else history.pushState(null, '', to);
  window.dispatchEvent(new Event(CHANGE));
};

/** Chuyển link kiểu cũ #/blog/... (đã chia sẻ trước đây) sang đường dẫn mới. */
const upgradeLegacyHash = () => {
  const { hash } = window.location;
  if (hash.startsWith('#/')) history.replaceState(null, '', hash.slice(1) || '/');
};

/** Bấm vào link trong trang: đổi trang bằng JavaScript thay vì tải lại cả trang. */
const onClick = (e: MouseEvent) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element | null)?.closest?.('a');
  if (!a || a.target || a.hasAttribute('download')) return;

  const url = new URL(a.href, window.location.href);
  if (url.origin !== window.location.origin) return;
  // Chỉ xử lý các trang của ứng dụng; file tĩnh (rss.xml, ảnh...) để trình duyệt tự mở
  if (url.pathname !== '/' && !url.pathname.startsWith('/blog')) return;
  if (/\.[a-z0-9]+$/i.test(url.pathname)) return;
  // Cùng trang, chỉ khác neo (#muc): để trình duyệt tự cuộn
  if (url.pathname === window.location.pathname && url.hash) return;

  e.preventDefault();
  // Bấm link của chính trang đang xem (vd. logo khi đang ở trang chủ): cuộn lên đầu
  if (url.pathname === window.location.pathname) {
    history.replaceState(null, '', url.pathname + url.search);
    return window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  navigate(url.pathname + url.search + url.hash);
};

export const useRoute = (): Route => {
  const [route, setRoute] = useState<Route>(() => {
    upgradeLegacyHash();
    return parsePath(window.location.pathname);
  });

  useEffect(() => {
    const update = () => {
      upgradeLegacyHash();
      setRoute(parsePath(window.location.pathname));
    };
    window.addEventListener('popstate', update);
    window.addEventListener('hashchange', update);
    window.addEventListener(CHANGE, update);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener('hashchange', update);
      window.removeEventListener(CHANGE, update);
      document.removeEventListener('click', onClick);
    };
  }, []);

  return route;
};
