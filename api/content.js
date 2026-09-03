import { kv } from '@vercel/kv';

const ADMIN_PASSWORD = '160511';
const CONTENT_KEY = 'trungthu:content';

const DEFAULT_CONTENT = {
  title: 'Bạn có muốn nhận quà trung thu từ _lkimlam không?',
  videoUrl: '/video.mp4',
  maintenance: {
    enabled: false,
    endTime: null, // ISO string, khi null = không giới hạn thời gian
  },
};

export default async function handler(req, res) {
  // Cho phép gọi từ trình duyệt, tắt cache để luôn lấy dữ liệu mới nhất
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    try {
      let stored = await kv.get(CONTENT_KEY);
      if (!stored) stored = DEFAULT_CONTENT;

      // Tự động tắt bảo trì nếu đã hết thời gian đếm ngược
      if (
        stored.maintenance &&
        stored.maintenance.enabled &&
        stored.maintenance.endTime &&
        new Date(stored.maintenance.endTime).getTime() <= Date.now()
      ) {
        stored = {
          ...stored,
          maintenance: { enabled: false, endTime: null },
        };
        await kv.set(CONTENT_KEY, stored);
      }

      return res.status(200).json(stored);
    } catch (err) {
      // Nếu chưa cấu hình KV, vẫn trả về mặc định để trang không bị lỗi
      return res.status(200).json(DEFAULT_CONTENT);
    }
  }

  if (req.method === 'POST') {
    try {
      const { password, title, videoUrl, maintenance } = req.body || {};

      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Sai mật khẩu' });
      }

      const current = (await kv.get(CONTENT_KEY)) || DEFAULT_CONTENT;

      const updated = {
        title: typeof title === 'string' && title.trim() !== '' ? title : current.title,
        videoUrl: typeof videoUrl === 'string' && videoUrl.trim() !== '' ? videoUrl : current.videoUrl,
        maintenance:
          maintenance && typeof maintenance === 'object'
            ? {
                enabled: !!maintenance.enabled,
                endTime: maintenance.endTime || null,
              }
            : current.maintenance || DEFAULT_CONTENT.maintenance,
      };

      await kv.set(CONTENT_KEY, updated);
      return res.status(200).json({ success: true, content: updated });
    } catch (err) {
      return res.status(500).json({
        error: 'Không lưu được: ' + (err && err.message ? err.message : 'Lỗi không xác định'),
      });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end('Method Not Allowed');
}
