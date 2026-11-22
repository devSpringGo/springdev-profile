import React, { useEffect, useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { SectionId } from '../types';
import { NOW, PROFILE, TOOLBOX } from '../data/profile';
import { Section, Tile } from './ui';
import { posts } from '../data/posts';

const strong = 'font-medium text-ink';

/** Giờ hiện tại ở Đà Nẵng, cập nhật mỗi 20 giây. */
const useDaNangTime = () => {
  const fmt = () =>
    new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hour12: false }).format(
      new Date()
    );
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const t = setInterval(() => setTime(fmt()), 20000);
    return () => clearInterval(t);
  }, []);
  return time;
};

const About: React.FC = () => {
  const time = useDaNangTime();

  return (
    <Section id={SectionId.ABOUT} eyebrow="Về mình" title="Một chút về mình">
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Câu chuyện */}
        <Tile className="flex flex-col justify-between gap-8 lg:col-span-2 lg:row-span-2">
          <div className="space-y-4 text-[1.0625rem] leading-relaxed text-muted">
            <p>
              Mình là Tiến, lập trình viên ở Đà Nẵng. Hơn hai năm nay, phần lớn những gì mình làm là{' '}
              <span className={strong}>phần mềm nội bộ cho doanh nghiệp</span>: quản lý hợp đồng, nghiệp vụ kế
              toán, các module vận hành. Người dùng là chính đồng nghiệp trong công ty, nên mình được nghe phản
              hồi rất thật và rất nhanh.
            </p>
            <p>
              Mình bắt đầu với WinForms, chuyển sang web nội bộ, và giờ thì tự tay làm từ đầu đến cuối. Thứ
              mình để tâm nhất là <span className={strong}>dữ liệu đúng</span>,{' '}
              <span className={strong}>truy vấn chạy nhanh</span> và{' '}
              <span className={strong}>màn hình đủ rõ ràng</span> để người nhập liệu hằng ngày không phải nghĩ
              nhiều.
            </p>
            <p>
              Thỉnh thoảng mình ghi lại những gì học được ở{' '}
              <a
                href="/blog"
                className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-accent hover:text-accent transition-colors"
              >
                blog
              </a>
              .
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-4 border-t border-line pt-6">
            {[
              { value: '2023', label: 'Năm bắt đầu đi làm' },
              { value: '3', label: 'Công ty đã gắn bó' },
              { value: String(posts.length), label: 'Bài viết trên blog' },
            ].map((f) => (
              <div key={f.label}>
                <dd className="text-3xl font-bold tracking-tight">{f.value}</dd>
                <dt className="mt-1 text-sm text-muted">{f.label}</dt>
              </div>
            ))}
          </dl>
        </Tile>

        {/* Bây giờ */}
        <Tile>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-semibold">Bây giờ</h3>
            <p className="text-xs text-muted">{NOW.updated}</p>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            {NOW.items.map((it) => (
              <div key={it.label}>
                <dt className="font-medium text-accent">{it.label}</dt>
                <dd className="mt-0.5 leading-relaxed text-ink/80">{it.text}</dd>
              </div>
            ))}
          </dl>
        </Tile>

        {/* Đà Nẵng */}
        <Tile className="relative overflow-hidden pb-14 sm:pb-16">
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <MapPin size={15} className="text-accent" /> {PROFILE.location}
          </p>
          <p className="mt-3 font-mono text-5xl font-medium tracking-tight">{time}</p>
          <p className="mt-1 text-sm text-muted">Giờ hiện tại ở chỗ mình (GMT+7)</p>
          {/* Dải núi nhỏ trang trí */}
          <svg viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-12 w-full">
            <path d="M0 60 L0 38 C 30 22, 55 30, 80 20 S 130 8, 160 24 S 220 36, 250 18 S 290 26, 300 22 L300 60 Z" style={{ fill: 'rgb(var(--accent) / 0.08)' }} />
            <path d="M0 60 L0 48 C 40 36, 80 46, 120 38 S 200 30, 240 42 S 285 40, 300 44 L300 60 Z" style={{ fill: 'rgb(var(--accent) / 0.12)' }} />
          </svg>
        </Tile>

        {/* Đồ nghề */}
        <Tile className="lg:col-span-2">
          <h3 className="font-semibold">Đồ nghề</h3>
          <p className="mt-1 text-sm text-muted">Những công cụ mình dùng, xếp theo mức độ quen tay.</p>
          <div className="mt-5 space-y-4">
            {TOOLBOX.map((g, i) => (
              <div key={g.group} className="grid gap-2 sm:grid-cols-[11rem_1fr] sm:gap-4">
                <p className="flex items-center gap-2 pt-1 text-sm font-medium" title={g.note}>
                  <span aria-hidden="true" className="inline-flex gap-0.5">
                    {TOOLBOX.map((_, j) => (
                      <span key={j} className={`h-2.5 w-1 rounded-full ${j < TOOLBOX.length - i ? 'bg-accent' : 'bg-line'}`} />
                    ))}
                  </span>
                  {g.group}
                </p>
                <ul className="flex flex-wrap content-start items-start gap-1.5">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className={`rounded-md border px-2 py-1 text-xs ${
                        i === 0 ? 'border-accent/30 bg-accent/10 font-medium text-accent' : 'border-line bg-paper text-ink/80'
                      }`}
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Tile>

        {/* Lời mời liên hệ */}
        <a
          href={`#${SectionId.CONTACT}`}
          className="group flex flex-col justify-between rounded-3xl bg-accent p-6 text-surface transition-transform hover:-translate-y-0.5 sm:p-7"
        >
          <p className="text-2xl font-bold leading-snug tracking-tight">Có việc cần làm, hay muốn trao đổi chuyện nghề?</p>
          <p className="mt-8 inline-flex items-center gap-2 font-semibold">
            Nhắn cho mình <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </p>
        </a>
      </div>
    </Section>
  );
};

export default About;
