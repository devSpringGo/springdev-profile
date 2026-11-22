import { useEffect, useState } from 'react';

/**
 * Định tuyến đơn giản bằng hash để chạy được trên mọi hosting tĩnh:
 *   #/blog          → danh sách bài viết
 *   #/blog/<slug>   → một bài viết
 *   còn lại         → trang chủ (#about, #experience... là neo cuộn trong trang chủ)
 */
export type Route = { name: 'home' } | { name: 'blog' } | { name: 'post'; slug: string };

export const parseHash = (hash: string): Route => {
  const m = hash.match(/^#\/blog(?:\/([\w-]+))?\/?$/);
  if (m) return m[1] ? { name: 'post', slug: m[1] } : { name: 'blog' };
  return { name: 'home' };
};

export const routeKey = (r: Route) => (r.name === 'post' ? `post:${r.slug}` : r.name);

export const useRoute = (): Route => {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
};
