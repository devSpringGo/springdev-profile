/**
 * Plugin Vite cho SEO của blog. Khi `npm run build`, tạo thêm trong dist/:
 *
 *   blog.html                → trang /blog (danh sách bài, có sẵn nội dung)
 *   blog/<slug>.html         → trang /blog/<slug>: tiêu đề, mô tả, ảnh xem trước (Open Graph),
 *                              dữ liệu có cấu trúc (JSON-LD) và nội dung bài viết dạng HTML
 *   rss.xml                  → RSS cho người theo dõi blog
 *   sitemap.xml, robots.txt  → cho Google
 *
 * Cloudflare Pages tự phục vụ /blog/<slug> từ file blog/<slug>.html.
 * Công cụ tìm kiếm và Facebook / Zalo đọc được trang mà không cần chạy JavaScript;
 * người xem thì vẫn thấy trang React như bình thường (React vẽ đè lên nội dung có sẵn).
 *
 * Thẻ <head> của trang chủ cũng do plugin này chèn vào chỗ <!--seo--> trong index.html.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import { SITE, formatDate, loadPosts, postPath, type Post } from './lib/blog';
import { blocksToHtml, escapeHtml as esc, firstImage, parseBlocks } from './lib/markdown';

const BLOG_DIR = 'content/blog';

const readPosts = (root: string): Post[] => {
  const dir = path.join(root, BLOG_DIR);
  if (!fs.existsSync(dir)) return [];
  const files: Record<string, string> = {};
  for (const name of fs.readdirSync(dir)) {
    if (name.endsWith('.md')) files[name] = fs.readFileSync(path.join(dir, name), 'utf8');
  }
  return loadPosts(files);
};

const abs = (url: string) => (url.startsWith('/') ? SITE.url + url : url);

/** JSON đặt trong <script>: chặn chuỗi "</script>" làm vỡ trang. */
const jsonLd = (data: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

/* ---------------- Thẻ <head> ---------------- */

type Head = {
  title: string;
  description: string;
  url: string;
  type: 'website' | 'article';
  image: string;
  largeImage?: boolean;
  extra?: string[];
};

const headTags = (h: Head) =>
  [
    '<!--seo:start-->',
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}" />`,
    `<link rel="canonical" href="${esc(h.url)}" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:locale" content="vi_VN" />`,
    `<meta property="og:type" content="${h.type}" />`,
    `<meta property="og:title" content="${esc(h.title)}" />`,
    `<meta property="og:description" content="${esc(h.description)}" />`,
    `<meta property="og:url" content="${esc(h.url)}" />`,
    `<meta property="og:image" content="${esc(h.image)}" />`,
    `<meta name="twitter:card" content="${h.largeImage ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${esc(h.title)}" />`,
    `<meta name="twitter:description" content="${esc(h.description)}" />`,
    `<meta name="twitter:image" content="${esc(h.image)}" />`,
    `<link rel="alternate" type="application/rss+xml" title="${esc(SITE.blogTitle)}" href="/rss.xml" />`,
    ...(h.extra ?? []),
    '<!--seo:end-->',
  ].join('\n    ');

const homeHead = () =>
  headTags({
    title: SITE.title,
    description: SITE.description,
    url: `${SITE.url}/`,
    type: 'website',
    image: SITE.image,
    extra: [
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: SITE.author,
        jobTitle: 'Full-stack Developer',
        url: `${SITE.url}/`,
        image: SITE.image,
        address: { '@type': 'PostalAddress', addressLocality: 'Đà Nẵng', addressCountry: 'VN' },
      }),
    ],
  });

const blogHead = () =>
  headTags({
    title: SITE.blogTitle,
    description: SITE.blogDescription,
    url: `${SITE.url}/blog`,
    type: 'website',
    image: SITE.image,
  });

const postHead = (p: Post, image: string | null) => {
  const url = SITE.url + postPath(p.slug);
  const description = p.excerpt || SITE.blogDescription;
  return headTags({
    title: `${p.title} — ${SITE.author}`,
    description,
    url,
    type: 'article',
    image: image ? abs(image) : SITE.image,
    largeImage: !!image,
    extra: [
      ...(p.date ? [`<meta property="article:published_time" content="${esc(p.date)}" />`] : []),
      `<meta property="article:author" content="${esc(SITE.author)}" />`,
      ...p.tags.map((t) => `<meta property="article:tag" content="${esc(t)}" />`),
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: p.title,
        description,
        datePublished: p.date,
        inLanguage: 'vi',
        keywords: p.tags.join(', '),
        url,
        mainEntityOfPage: url,
        image: image ? abs(image) : SITE.image,
        author: { '@type': 'Person', name: SITE.author, url: `${SITE.url}/` },
      }),
    ],
  });
};

/* ---------------- Nội dung có sẵn trong <div id="root"> ---------------- */

const shell = (inner: string) =>
  `<div id="root"><div class="min-h-screen bg-paper pt-16">${inner}</div></div>`;

const postBody = (p: Post, html: string) =>
  shell(`<article class="mx-auto max-w-3xl px-6 py-12 sm:px-10 sm:py-16">
  <a href="/blog" class="text-sm font-medium text-muted">← Tất cả bài viết</a>
  <header class="mt-10 border-b border-line pb-10">
    <h1 class="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-[2.75rem]">${esc(p.title)}</h1>
    ${p.excerpt ? `<p class="mt-5 text-lg leading-relaxed text-muted">${esc(p.excerpt)}</p>` : ''}
    <p class="mt-8 text-sm text-muted">${esc(SITE.author)} · <time datetime="${esc(p.date)}">${esc(formatDate(p.date))}</time> · ${p.readingMinutes} phút đọc</p>
  </header>
  <div class="prerendered mt-10">${html}</div>
</article>`);

const blogBody = (posts: Post[]) =>
  shell(`<div class="mx-auto max-w-3xl px-6 py-14 sm:px-10 sm:py-20">
  <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">Bài viết</h1>
  <p class="mt-4 max-w-xl text-lg leading-relaxed text-muted">${esc(SITE.blogDescription)}</p>
  <ul class="mt-14">${posts
    .map(
      (p) => `
    <li class="border-b border-line py-7"><a href="${postPath(p.slug)}">
      <time datetime="${esc(p.date)}" class="text-sm text-muted">${esc(formatDate(p.date))}</time>
      <h2 class="text-lg font-semibold leading-snug">${esc(p.title)}</h2>
      <p class="mt-2 leading-relaxed text-muted">${esc(p.excerpt)}</p>
    </a></li>`
    )
    .join('')}
  </ul>
</div>`);

/* ---------------- RSS, sitemap ---------------- */

const rfc822 = (date: string) => new Date(`${date}T08:00:00+07:00`).toUTCString();
const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

export const buildRss = (posts: Post[]) => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
  <title>${esc(SITE.blogTitle)}</title>
  <link>${SITE.url}/blog</link>
  <description>${esc(SITE.blogDescription)}</description>
  <language>vi</language>
  <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />
  ${posts[0]?.date ? `<lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate>` : ''}
${posts
  .slice(0, 30)
  .map((p) => {
    const url = SITE.url + postPath(p.slug);
    return `  <item>
    <title>${esc(p.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    ${p.date ? `<pubDate>${rfc822(p.date)}</pubDate>` : ''}
    <description>${esc(p.excerpt)}</description>
${p.tags.map((t) => `    <category>${esc(t)}</category>`).join('\n')}
    <content:encoded>${cdata(blocksToHtml(parseBlocks(p.content), SITE.url))}</content:encoded>
  </item>`;
  })
  .join('\n')}
</channel>
</rss>
`;

export const buildSitemap = (posts: Post[]) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE.url}/</loc></url>
  <url><loc>${SITE.url}/blog</loc>${posts[0]?.date ? `<lastmod>${posts[0].date}</lastmod>` : ''}</url>
${posts.map((p) => `  <url><loc>${SITE.url}${postPath(p.slug)}</loc>${p.date ? `<lastmod>${p.date}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`;

/* ---------------- Plugin ---------------- */

export default function blogSeo(): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'springgo-blog-seo',

    configResolved(c) {
      config = c;
    },

    transformIndexHtml(html) {
      return html.replace('<!--seo-->', homeHead());
    },

    // Chạy `npm run dev` cũng xem được rss.xml, sitemap.xml
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];
        const posts = () => readPosts(config.root);
        const send = (type: string, body: string) => {
          res.setHeader('content-type', `${type}; charset=utf-8`);
          res.end(body);
        };
        if (url === '/rss.xml') return send('application/rss+xml', buildRss(posts()));
        if (url === '/sitemap.xml') return send('application/xml', buildSitemap(posts()));
        if (url === '/robots.txt') return send('text/plain', robots);
        next();
      });
    },

    closeBundle() {
      if (config.command !== 'build' || config.build.ssr) return;
      const outDir = path.resolve(config.root, config.build.outDir);
      const templatePath = path.join(outDir, 'index.html');
      if (!fs.existsSync(templatePath)) return;

      const template = fs.readFileSync(templatePath, 'utf8');
      if (!template.includes('<!--seo:end-->') || !template.includes('<div id="root"></div>')) {
        throw new Error('[blog-seo] index.html thiếu <!--seo--> hoặc <div id="root"></div>');
      }
      const page = (head: string, body: string) =>
        template.replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, head).replace('<div id="root"></div>', body);

      const posts = readPosts(config.root);
      const write = (file: string, content: string) => {
        const full = path.join(outDir, file);
        fs.mkdirSync(path.dirname(full), { recursive: true });
        fs.writeFileSync(full, content);
      };

      write('blog.html', page(blogHead(), blogBody(posts)));
      for (const p of posts) {
        const blocks = parseBlocks(p.content);
        write(`blog/${p.slug}.html`, page(postHead(p, firstImage(blocks)), postBody(p, blocksToHtml(blocks))));
      }
      write('rss.xml', buildRss(posts));
      write('sitemap.xml', buildSitemap(posts));
      write('robots.txt', robots);

      config.logger.info(`[blog-seo] đã tạo ${posts.length} trang bài viết, blog.html, rss.xml, sitemap.xml, robots.txt`);
    },
  };
}
