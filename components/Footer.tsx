import React from 'react';
import { PROFILE } from '../data/profile';

const linkCls = 'underline decoration-line underline-offset-2 hover:text-ink hover:decoration-muted transition-colors';

const Footer: React.FC<{ className?: string }> = ({ className = '' }) => {
  const c = PROFILE.backgroundImage ? PROFILE.backgroundCredit : null;

  return (
    <footer className={`text-sm leading-relaxed text-muted ${className}`}>
      <p>
        Cảm ơn bạn đã ghé qua. © {new Date().getFullYear()} {PROFILE.name}, tự thiết kế và xây dựng bằng React,
        TypeScript và Tailwind CSS.
      </p>
      {c && (
        <p className="mt-1 text-xs">
          Ảnh nền:{' '}
          <a href={c.url} target="_blank" rel="noreferrer" className={linkCls}>
            {c.title}
          </a>
          , {c.author},{' '}
          {c.licenseUrl ? (
            <a href={c.licenseUrl} target="_blank" rel="noreferrer license" className={linkCls}>
              {c.license}
            </a>
          ) : (
            c.license
          )}
          {c.changes && ` (${c.changes})`}.
        </p>
      )}
    </footer>
  );
};

export default Footer;
