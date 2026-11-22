import danangFireworks from '../img/danang-fireworks.jpg';
import danangHanRiver from '../img/danang-han-river.jpg';

export type BackgroundCredit = {
  title: string;
  author: string;
  url: string;
  license: string;
  licenseUrl?: string;
  changes?: string;
};

type BackgroundPreset = {
  image: string;
  /** Vị trí lấy khung ảnh khi màn hình bị cắt (CSS object-position) */
  position: string;
  credit: BackgroundCredit | null;
};

/** Các ảnh nền có sẵn. Đổi ACTIVE_BACKGROUND bên dưới để chuyển ảnh. */
const BACKGROUNDS = {
  /** Pháo hoa trên cầu Rồng. Giấy phép CC BY-SA 4.0: BẮT BUỘC giữ ghi nguồn. */
  phaoHoa: {
    image: danangFireworks as string,
    position: '72% 50%',
    credit: {
      title: 'Da Nang International Fireworks Festival, Dragon Bridge',
      author: 'Vivu Vietnam',
      url: 'https://commons.wikimedia.org/wiki/File:Da_Nang_International_Fireworks_Festival_DIFF_Dragon_Bridge_Han_River_night_skyline_Vietnam.jpg',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      changes: 'đã thu nhỏ và làm mờ',
    },
  },
  /** Cầu sông Hàn về đêm. Giấy phép CC0: không bắt buộc ghi nguồn. */
  songHan: {
    image: danangHanRiver as string,
    position: '50% 55%',
    credit: {
      title: 'Han River Bridge at night',
      author: 'lumoplank',
      url: 'https://commons.wikimedia.org/wiki/File:Da_Nang_-_DaNang1492.jpg',
      license: 'CC0',
      licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
  },
} satisfies Record<string, BackgroundPreset>;

/**
 * Nền đang dùng:
 * - 'phongCanh'    : tranh phong cảnh núi – biển tự vẽ bằng SVG (bình minh / đêm trăng theo theme)
 * - 'songHan'      : ảnh cầu sông Hàn về đêm
 * - 'phaoHoa'      : ảnh pháo hoa cầu Rồng
 * - 'duongDongMuc' : các đường đồng mức kiểu bản đồ địa hình
 */
const ACTIVE_BACKGROUND: keyof typeof BACKGROUNDS | 'phongCanh' | 'duongDongMuc' = 'phongCanh';
const bg: BackgroundPreset | null =
  ACTIVE_BACKGROUND === 'phongCanh' || ACTIVE_BACKGROUND === 'duongDongMuc' ? null : BACKGROUNDS[ACTIVE_BACKGROUND];

/* =====================================================================
   THÔNG TIN CÁ NHÂN — sửa nội dung trang ở đây
   ===================================================================== */

export const PROFILE = {
  name: 'Nguyễn Xuân Tiến',
  shortName: 'Tiến',
  role: 'Full-stack Developer',
  tagline:
    'Mình làm phần mềm cho doanh nghiệp: những hệ thống mà nhân viên mở ra mỗi sáng để làm việc. Thích dữ liệu gọn gàng, truy vấn chạy nhanh và giao diện không bắt ai phải nghĩ nhiều.',
  status: 'Đang làm phần mềm nội bộ ở Công ty Bánh Đồng Tiến',
  avatar: 'https://res.cloudinary.com/dgejmagns/image/upload/0d323034-c750-479a-91f0-bdde8fae45f1.png',
  email: 'contact@springgo.xyz',
  phone: '034 609 2267',
  phoneHref: 'tel:+84346092267',
  location: 'Đà Nẵng, Việt Nam',
  // Nền: chọn ở ACTIVE_BACKGROUND phía trên
  backgroundStyle: (bg ? 'photo' : ACTIVE_BACKGROUND === 'phongCanh' ? 'scene' : 'contour') as
    | 'photo'
    | 'scene'
    | 'contour',
  backgroundImage: bg?.image ?? '',
  backgroundPosition: bg?.position ?? '50% 50%',
  backgroundCredit: bg?.credit ?? null,
};

/** Mục "Bây giờ": nhớ cập nhật ngày khi sửa. */
export const NOW = {
  updated: 'Tháng 11, 2026',
  items: [
    { label: 'Đang làm', text: 'Các module nội bộ ở Công ty Bánh Đồng Tiến, từ cơ sở dữ liệu tới giao diện.' },
    { label: 'Đang học', text: 'React, TypeScript và cách đưa AI vào sản phẩm (trang này có một trợ lý dùng Gemini).' },
    { label: 'Đang viết', text: 'Ghi chép về SQL Server và chuyện làm phần mềm nội bộ trên blog.' },
    { label: 'Đang ở', text: 'Đà Nẵng.' },
  ],
};

/** "Đồ nghề": công cụ chia theo mức độ dùng. */
export const TOOLBOX: { group: string; note: string; items: string[] }[] = [
  {
    group: 'Dùng hằng ngày',
    note: 'Phần lớn thời gian làm việc của mình nằm ở đây.',
    items: ['C#', 'ASP.NET Core', 'Entity Framework', 'SQL Server', 'Visual Studio', 'Git'],
  },
  {
    group: 'Đã từng làm việc với',
    note: 'Dùng thực tế ở các công ty trước.',
    items: ['VB.NET', 'ADO.NET', 'WinForms', 'Oracle', 'JavaScript', 'HTML/CSS', 'Bootstrap', 'SourceTree', 'Figma'],
  },
  {
    group: 'Cũng có thể làm tốt',
    note: 'Từ thời đại học.',
    items: ['Java', 'PHP', 'Node.js', 'MongoDB', 'Firebase', 'Flutter'],
  },
  {
    group: 'Thêm vào đó là',
    note: 'Học thêm ngoài giờ, trang này là nơi thử nghiệm.',
    items: ['React', 'TypeScript', 'Tailwind CSS', 'Gemini API'],
  },
];

/** "Hành trình": kể theo thứ tự thời gian, chi tiết công việc được thu gọn. */
export type Chapter = {
  when: string;
  title: string;
  place: string;
  story: string;
  details?: string[];
  tags?: string[];
  current?: boolean;
  kind: 'study' | 'work';
};

export const JOURNEY: Chapter[] = [
  {
    when: '2019 — 2023',
    title: 'Học Công nghệ Phần mềm',
    place: 'Đại học Công nghệ TP.HCM (HUTECH)',
    kind: 'study',
    story:
      'Bốn năm làm quen với đủ thứ: .NET và C#, Java, PHP, Node.js, cơ sở dữ liệu, lập trình di động với Flutter, và phân tích thiết kế hệ thống.',
  },
  {
    when: '04/2023 — 10/2023',
    title: 'Công việc đầu tiên',
    place: 'Fujinet Systems',
    kind: 'work',
    story:
      'Mình vào Fujinet qua ngày hội việc làm OpenDay của trường, bắt đầu là thực tập sinh rồi lên thử việc. Làm WinForms với Visual Basic và Oracle, sau đó tham gia dự án cho khách hàng Nhật Bản bằng C# và SQL Server. Hết giai đoạn thử việc, mình quyết định rẽ sang làm web.',
    details: [
      'Thực tập vị trí .NET Developer, phát triển ứng dụng WinForms với Visual Basic và Oracle.',
      'Thử việc .NET Developer trong dự án WinForms cho khách hàng Nhật Bản (C#, SQL Server).',
      'Xây dựng và tối ưu Stored Procedure, Function.',
    ],
    tags: ['C#', 'VB', 'WinForms', 'Oracle', 'SQL Server'],
  },
  {
    when: '12/2023 — 07/2025',
    title: 'Làm web nội bộ cho công ty tài chính',
    place: 'Chailease (Cho Thuê Tài Chính Quốc Tế)',
    kind: 'work',
    story:
      'Lần đầu làm hệ thống web nội bộ, làm việc trực tiếp với các phòng CSD, Kế toán và Tín dụng. Phần lớn thời gian mình ở backend: hợp đồng, nghiệp vụ cho thuê, và rất nhiều Stored Procedure.',
    details: [
      'Phát triển và bảo trì hệ thống website nội bộ theo yêu cầu các phòng ban.',
      'Xây dựng chức năng soạn thảo và quản lý hợp đồng cho phòng CSD.',
      'Phát triển nghiệp vụ quản lý cho thuê cho phòng Kế toán; tính năng hỗ trợ phòng Credit.',
      'Thiết kế CSDL, viết và tối ưu Stored Procedure, Function trên SQL Server.',
    ],
    tags: ['VB.NET', 'ADO.NET', 'SQL Server'],
  },
  {
    when: '09/2025 — nay',
    title: 'Tự tay làm từ đầu đến cuối',
    place: 'Công ty Bánh Đồng Tiến',
    kind: 'work',
    current: true,
    story:
      'Hiện tại mình phụ trách phần mềm nội bộ của công ty: ngồi nghe các bộ phận kể về công việc, thiết kế cơ sở dữ liệu, dựng giao diện, đưa vào dùng rồi sửa tiếp theo phản hồi thực tế.',
    details: [
      'Chịu trách nhiệm toàn bộ quá trình phát triển các phần mềm và module nội bộ.',
      'Phân tích yêu cầu, đề xuất giải pháp kỹ thuật và triển khai hoàn chỉnh.',
      'Thiết kế giao diện người dùng và phát triển backend.',
      'Xây dựng, tối ưu cơ sở dữ liệu; phối hợp kiểm thử và cải tiến chức năng.',
    ],
    tags: ['.NET', 'C#', 'SQL Server'],
  },
];

export type Work = {
  title: string;
  org: string;
  description: string;
  stack: string[];
  /** Kiểu hình minh hoạ trên thẻ dự án */
  cover: 'modules' | 'contract' | 'ledger' | 'desktop' | 'web';
  url?: string;
};

// Sửa / bổ sung dự án tại đây. Thêm `url` nếu có link demo hoặc mã nguồn.
export const WORKS: Work[] = [
  {
    title: 'Phần mềm nội bộ Đồng Tiến',
    org: 'Công ty Bánh Đồng Tiến · 2025 — nay',
    description:
      'Các module phục vụ vận hành hằng ngày của công ty. Mình làm từ khâu nghe yêu cầu, thiết kế dữ liệu, dựng giao diện đến triển khai.',
    stack: ['.NET', 'SQL Server'],
    cover: 'modules',
  },
  {
    title: 'Soạn thảo & quản lý hợp đồng',
    org: 'Chailease · Phòng CSD',
    description: 'Soạn thảo, lưu trữ và theo dõi hợp đồng cho thuê tài chính.',
    stack: ['VB.NET', 'ADO.NET', 'SQL Server'],
    cover: 'contract',
  },
  {
    title: 'Nghiệp vụ kế toán cho thuê',
    org: 'Chailease · Phòng Kế toán',
    description: 'Màn hình và Stored Procedure cho nghiệp vụ cho thuê, chạy ổn định trên dữ liệu lớn.',
    stack: ['VB.NET', 'SQL Server'],
    cover: 'ledger',
  },
  {
    title: 'Ứng dụng cho khách hàng Nhật',
    org: 'Fujinet Systems · 2023',
    description: 'Chức năng và Stored Procedure cho ứng dụng WinForms của khách hàng Nhật Bản.',
    stack: ['C#', 'WinForms', 'SQL Server'],
    cover: 'desktop',
  },
  {
    title: 'springgo.xyz',
    org: 'Dự án cá nhân',
    description: 'Trang web này: hồ sơ, blog, và một trợ lý trả lời câu hỏi về mình qua Gemini API.',
    stack: ['React', 'TypeScript', 'Vite'],
    cover: 'web',
    url: 'https://springgo.xyz',
  },
];

