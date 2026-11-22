import React, { useState } from 'react';
import { Check, Copy, Mail, MapPin, Phone, Send } from 'lucide-react';
import { SectionId } from '../types';
import { PROFILE } from '../data/profile';
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

const Form: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = name.trim() && subject.trim() && message.trim() && /\S+@\S+\.\S+/.test(email);
    if (!valid) {
      setStatus('error');
      return;
    }

    // Mở ứng dụng mail của người gửi với nội dung đã điền sẵn
    const body = `${message}\n\n---\n${name} <${email}>`;
    window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('sent');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Gửi lời nhắn"
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Họ tên</label>
          <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="field" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">Chủ đề</label>
        <input id="subject" type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} className="field" />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">Nội dung</label>
        <textarea id="message" rows={4} required value={message} onChange={(e) => setMessage(e.target.value)} className="field resize-y" />
      </div>
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-surface hover:bg-accent/90 transition-colors"
        >
          Gửi lời nhắn <Send size={15} />
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {status === 'error' && <span className="text-red-500">Vui lòng điền đủ các ô và kiểm tra lại email.</span>}
          {status === 'sent' && <span className="text-emerald-600">Đã mở ứng dụng mail của bạn để gửi.</span>}
        </p>
      </div>
    </form>
  );
};

export default Contact;
