/**
 * Tô màu cú pháp cho khối code trong bài viết (highlight.js, chỉ nạp các ngôn ngữ hay dùng).
 * File này được tải riêng khi mở bài viết, không làm nặng trang chủ.
 * Màu sắc: các lớp .hljs-* trong index.html.
 */
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import powershell from 'highlight.js/lib/languages/powershell';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('powershell', powershell);
hljs.registerLanguage('python', python);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('yaml', yaml);
hljs.registerAliases(['tsx', 'mts'], { languageName: 'typescript' });
hljs.registerAliases(['jsx', 'mjs', 'node'], { languageName: 'javascript' });
hljs.registerAliases(['tsql', 't-sql', 'mssql', 'plsql', 'mysql', 'postgresql'], { languageName: 'sql' });
hljs.registerAliases(['razor', 'cshtml', 'xaml', 'csproj'], { languageName: 'xml' });
hljs.registerAliases(['dotnet', 'net'], { languageName: 'csharp' });
hljs.registerAliases(['cmd', 'terminal', 'console'], { languageName: 'bash' });

/** Trả về HTML đã tô màu (đã escape an toàn), hoặc null nếu không nhận ra ngôn ngữ. */
export const highlight = (code: string, lang: string): string | null => {
  const name = lang.toLowerCase();
  if (!name || !hljs.getLanguage(name)) return null;
  try {
    return hljs.highlight(code, { language: name, ignoreIllegals: true }).value;
  } catch {
    return null;
  }
};
