import React from 'react';
import { PROFILE } from '../data/profile';

/**
 * Nền toàn trang, chọn ở ACTIVE_BACKGROUND trong data/profile.ts:
 * - scene   : tranh phong cảnh núi – biển vẽ bằng SVG, bình minh (sáng) / đêm trăng (tối)
 * - photo   : ảnh chụp, có lớp phủ cho dễ đọc chữ
 * - contour : các đường đồng mức kiểu bản đồ địa hình
 * Màu của tranh phong cảnh nằm ở các biến --sky-*, --mtn-*, --sea... trong index.html.
 */

const W = 1600;
const H = 1000;
const HORIZON = 815;

/* ---------- Tiện ích sinh hình ---------- */

/** Số ngẫu nhiên có hạt giống, để hình luôn giống nhau giữa các lần tải. */
const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

type Peak = [center: number, height: number, width: number];

/** Đường sống núi: tổng các "đỉnh" hình chuông + gợn nhỏ, đóng xuống đáy khung hình. */
const ridge = (base: number, peaks: Peak[], rough: number, seed: number, from = 0, to = W) => {
  let d = `M${from} ${H}`;
  for (let x = from; x <= to; x += 6) {
    let h = 0;
    for (const [c, ph, w] of peaks) h += ph * Math.exp(-(((x - c) / w) ** 2));
    h +=
      rough *
      (Math.sin(x * 0.013 + seed) * 0.5 +
        Math.sin(x * 0.031 + seed * 2.3) * 0.3 +
        Math.sin(x * 0.071 + seed * 4.1) * 0.2);
    d += `L${x} ${(base - Math.max(h, 0)).toFixed(1)}`;
  }
  return `${d}L${to} ${H}Z`;
};

/* Các lớp núi: xa → gần (nhạt → đậm) */
const FAR = ridge(HORIZON, [[120, 170, 160], [420, 120, 140], [760, 195, 190], [1100, 135, 150], [1430, 205, 170]], 12, 0.4);
const MID = ridge(HORIZON + 4, [[0, 205, 230], [300, 95, 120], [620, 70, 110], [980, 48, 160], [1320, 88, 140]], 9, 1.7);
/* Bán đảo phía phải đổ xuống biển (cảm hứng Sơn Trà) */
const HEADLAND = ridge(H + 40, [[1600, 350, 320], [1390, 150, 150]], 10, 2.9, 1060, W);
/* Đồi thấp tiền cảnh bên trái */
const FOREGROUND = ridge(H + 30, [[0, 165, 250], [260, 55, 140]], 7, 3.6, 0, 540);

/* Sao (chỉ hiện ở chế độ tối) */
const STARS = (() => {
  const r = rng(42);
  return Array.from({ length: 55 }, () => ({
    x: r() * W,
    y: r() * HORIZON * 0.6,
    s: r() < 0.1 ? 1.4 : 0.5 + r() * 0.6,
    o: 0.2 + r() * 0.45,
  }));
})();

/* Gợn sóng lấp lánh trên mặt biển */
// Đặt mặt trời / trăng ở lề phải để không nằm sau chữ
const SUN_X = 1480;
const SHIMMER = (() => {
  const r = rng(7);
  // chỉ nằm trong vệt phản chiếu của mặt trời / mặt trăng trên mặt biển
  return Array.from({ length: 46 }, () => {
    const y = HORIZON + 6 + r() ** 1.3 * (H - HORIZON - 8);
    const depth = (y - HORIZON) / (H - HORIZON);
    const x = SUN_X + (r() - 0.5) * (50 + depth * 220);
    return { x, y, w: 6 + depth * 40 * r() + 4, o: 0.25 + r() * 0.5 };
  });
})();

const fill = (v: string, a = 1) => ({ fill: `rgb(var(${v}) / ${a})` });
const stop = (v: string, a = 1) => ({ stopColor: `rgb(var(${v}))`, stopOpacity: a });

const Scene: React.FC = () => (
  <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
    <defs>
      <linearGradient id="bg-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={stop('--sky-top')} />
        <stop offset="0.62" style={stop('--sky-mid')} />
        <stop offset="1" style={stop('--sky-horizon')} />
      </linearGradient>
      <radialGradient id="bg-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" style={stop('--sun-glow', 0.55)} />
        <stop offset="1" style={stop('--sun-glow', 0)} />
      </radialGradient>
      <linearGradient id="bg-sea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={stop('--sea-top')} />
        <stop offset="1" style={stop('--sea-bottom')} />
      </linearGradient>
      <linearGradient id="bg-mist" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={stop('--mist', 0)} />
        <stop offset="1" style={stop('--mist', 0.75)} />
      </linearGradient>
    </defs>

    {/* Trời */}
    <rect width={W} height={HORIZON + 10} fill="url(#bg-sky)" />

    {/* Sao */}
    <g style={{ opacity: 'var(--star-opacity)' as unknown as number }}>
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.s} style={fill('--star', s.o)} />
      ))}
    </g>

    {/* Mặt trời / mặt trăng */}
    <circle cx={SUN_X} cy={330} r={230} fill="url(#bg-glow)" />
    <circle cx={SUN_X} cy={330} r={46} style={fill('--sun')} />

    {/* Núi xa, sương mù chân núi, núi gần hơn */}
    <path d={FAR} style={fill('--mtn-far')} />
    <rect y={HORIZON - 150} width={W} height={150} fill="url(#bg-mist)" />
    <path d={MID} style={fill('--mtn-mid')} />

    {/* Biển */}
    <rect y={HORIZON} width={W} height={H - HORIZON} fill="url(#bg-sea)" />
    <rect y={HORIZON} width={W} height={1.5} style={fill('--shimmer', 0.35)} />
    {/* Quầng phản chiếu trên mặt biển */}
    <ellipse cx={SUN_X} cy={HORIZON + 90} rx={170} ry={95} fill="url(#bg-glow)" opacity={0.7} />
    {SHIMMER.map((s, i) => (
      <rect key={i} x={s.x - s.w / 2} y={s.y} width={s.w} height={1.6} rx={0.8} style={fill('--shimmer', s.o)} />
    ))}

    {/* Tiền cảnh */}
    <path d={HEADLAND} style={fill('--mtn-near')} />
    <path d={FOREGROUND} style={fill('--mtn-near')} />
  </svg>
);

/* ---------- Nền đường đồng mức ---------- */

const contours = (cx: number, cy: number, count: number, base: number, step: number, seed: number) => {
  const paths: string[] = [];
  const N = 140;
  for (let k = 0; k < count; k++) {
    let d = '';
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI * 2;
      const r =
        base +
        k * step +
        (10 + k * 1.6) * Math.sin(3 * t + seed + k * 0.32) +
        (6 + k * 0.9) * Math.sin(5 * t - seed * 1.7 + k * 0.21) +
        (4 + k * 0.5) * Math.sin(2 * t + seed * 0.6 + k * 0.47);
      d += `${i === 0 ? 'M' : 'L'}${(cx + r * Math.cos(t) * 1.15).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`;
    }
    paths.push(`${d}Z`);
  }
  return paths;
};

const Contours: React.FC = () => {
  const clusters = [contours(1380, 120, 30, 26, 19, 0.7), contours(120, 1020, 22, 30, 21, 2.3)];
  return (
    <>
      <div className="absolute -right-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent)/0.10),transparent)]" />
      <div className="absolute -bottom-56 -left-56 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent)/0.06),transparent)]" />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_70%_65%_at_50%_50%,transparent_25%,black_80%)]"
        fill="none"
      >
        {clusters.map((paths, c) =>
          paths.map((d, k) => (
            <path
              key={`${c}-${k}`}
              d={d}
              strokeWidth={k % 5 === 4 ? 1.2 : 0.8}
              style={{ stroke: k % 5 === 4 ? 'rgb(var(--accent) / 0.22)' : 'rgb(var(--ink) / 0.075)' }}
            />
          ))
        )}
      </svg>
    </>
  );
};

/* ---------- Thành phần chính ---------- */

const Background: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    {PROFILE.backgroundStyle === 'scene' && <Scene />}

    {PROFILE.backgroundStyle === 'photo' && (
      <>
        <img
          src={PROFILE.backgroundImage}
          alt=""
          style={{ objectPosition: PROFILE.backgroundPosition }}
          className="h-full w-full scale-[1.02] object-cover blur-[1px]"
        />
        {/* Lớp phủ để chữ dễ đọc nhưng vẫn thấy rõ ảnh */}
        <div className="absolute inset-0 bg-paper/[0.78]" />
      </>
    )}

    {PROFILE.backgroundStyle === 'contour' && <Contours />}
  </div>
);

export default Background;
