import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { SectionId } from '../types';
import { PROFILE } from '../data/profile';
import { CONTACT_ENDPOINT, LIMITS, validateContact } from '../lib/contact';
import { Section } from './ui';

const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <Section id={SectionId.CONTACT} eyebrow="Liên hệ" title="trao đổi thêm tại:">
      <div className="grid gap-10 rounded-[2rem] border border-line bg-surface p-6 sm:p-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
        <div>
          <p className="text-lg leading-relaxed text-muted">
            Bạn đang tìm người cho đội, có một hệ thống cần làm, hay chỉ muốn trao đổi chuyện nghề? Cứ gửi email
            hoặc để lại lời nhắn, mình thường trả lời trong ngày.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${PROFILE.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper hover:bg-ink/85 transition-colors"
            >
              <Mail size={16} /> {PROFILE.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-sm text-muted hover:bg-raised hover:text-ink transition-colors"
            >
              {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
              {copied ? 'Đã sao chép' : 'Sao chép'}
            </button>
          </div>

          <ul className="mt-8 space-y-3 text-sm text-muted">
            <li>
              <a href={PROFILE.phoneHref} className="inline-flex items-center gap-2.5 hover:text-ink transition-colors">
                <Phone size={16} className="text-accent" /> {PROFILE.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin size={16} className="text-accent" /> {PROFILE.location}
            </li>
          </ul>
        </div>

        <Form />
      </div>
    </Section>
  );
};

/* ---------------- Chống spam: Cloudflare Turnstile (chỉ bật khi có VITE_TURNSTILE_SITE_KEY lúc build) ---------------- */

const TURNSTILE_SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) || '';

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

let turnstileScript: Promise<TurnstileApi> | null = null;
const loadTurnstile = () =>
  (turnstileScript ??= new Promise<TurnstileApi>((resolve, reject) => {
    const w = window as unknown as { turnstile?: TurnstileApi };
    if (w.turnstile) return resolve(w.turnstile);
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = () => (w.turnstile ? resolve(w.turnstile) : reject(new Error('turnstile')));
    s.onerror = () => {
      turnstileScript = null;
      reject(new Error('turnstile'));
    };
    document.head.appendChild(s);
  }));

/** Ô kiểm tra chống spam. Chỉ tải khi người xem bắt đầu điền form, thường tự qua mà không cần bấm gì. */
const useTurnstile = (container: React.RefObject<HTMLDivElement>, active: boolean) => {
  const [token, setToken] = useState('');
  const widget = useRef<string | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !active || !container.current) return;
    let cancelled = false;
    loadTurnstile()
      .then((ts) => {
        if (cancelled || !container.current) return;
        widget.current = ts.render(container.current, {
          sitekey: TURNSTILE_SITE_KEY,
          language: 'vi',
          appearance: 'interaction-only',
          callback: (t: string) => setToken(t),
          'expired-callback': () => setToken(''),
          'error-callback': () => setToken(''),
        });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
      const id = widget.current;
      widget.current = null;
      if (id) loadTurnstile().then((ts) => ts.remove(id)).catch(() => undefined);
    };
  }, [active, container]);

  const reset = () => {
    setToken('');
    const id = widget.current;
    if (id) loadTurnstile().then((ts) => ts.reset(id)).catch(() => undefined);
  };

  return { enabled: !!TURNSTILE_SITE_KEY, token, reset };
};

/* ---------------- Form ---------------- */

type Status = { kind: 'idle' | 'sending' | 'sent' } | { kind: 'error'; text: string; offerEmail?: boolean };

const Form: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // ô bẫy bot
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [started, setStarted] = useState(false);
  const turnstileBox = useRef<HTMLDivElement>(null);
  const turnstile = useTurnstile(turnstileBox, started);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status.kind === 'sending') return;

    const checked = validateContact({ name, email, subject, message });
    if ('error' in checked) return setStatus({ kind: 'error', text: checked.error });
    if (turnstile.enabled && !turnstile.token) {
      return setStatus({ kind: 'error', text: 'Đang kiểm tra chống spam, đợi vài giây rồi bấm gửi lại nhé.' });
    }

    setStatus({ kind: 'sending' });
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...checked, website, token: turnstile.token }),
        signal: ctrl.signal,
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus({ kind: 'sent' });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setStatus({ kind: 'error', text: data.error || 'Chưa gửi được lời nhắn.', offerEmail: res.status >= 500 || !data.error });
      }
    } catch {
      setStatus({ kind: 'error', text: 'Không kết nối được máy chủ.', offerEmail: true });
    } finally {
      window.clearTimeout(timer);
      // Mã chống spam chỉ dùng được một lần
      if (turnstile.enabled) turnstile.reset();
    }
  };

  const sending = status.kind === 'sending';

  return (
    <form onSubmit={handleSubmit} onFocus={() => setStarted(true)} aria-label="Gửi lời nhắn" className="relative space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Họ tên</label>
          <input id="name" type="text" autoComplete="name" required maxLength={LIMITS.name} value={name} onChange={(e) => setName(e.target.value)} className="field" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
          <input id="email" type="email" autoComplete="email" required maxLength={LIMITS.email} value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">Chủ đề</label>
        <input id="subject" type="text" required maxLength={LIMITS.subject} value={subject} onChange={(e) => setSubject(e.target.value)} className="field" />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">Nội dung</label>
        <textarea id="message" rows={4} required maxLength={LIMITS.message} value={message} onChange={(e) => setMessage(e.target.value)} className="field resize-y" />
      </div>

      {/* Ô bẫy: người thật không thấy, bot điền vào thì lời nhắn bị bỏ qua */}
      <div aria-hidden="true" className="absolute -left-[10000px] top-0 h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      {turnstile.enabled && <div ref={turnstileBox} />}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-surface hover:bg-accent/90 transition-colors disabled:cursor-wait disabled:opacity-70"
        >
          {sending ? (
            <>
              Đang gửi… <Loader2 size={15} className="animate-spin" />
            </>
          ) : (
            <>
              Gửi lời nhắn <Send size={15} />
            </>
          )}
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {status.kind === 'sent' && <span className="text-emerald-600">Đã gửi. Mình sẽ trả lời qua email của bạn sớm.</span>}
          {status.kind === 'error' && (
            <span className="text-red-500">
              {status.text}
              {status.offerEmail && (
                <>
                  {' '}Bạn có thể gửi email trực tiếp tới{' '}
                  <a href={`mailto:${PROFILE.email}`} className="font-medium underline underline-offset-2">
                    {PROFILE.email}
                  </a>
                  .
                </>
              )}
            </span>
          )}
        </p>
      </div>
    </form>
  );
};

export default Contact;
