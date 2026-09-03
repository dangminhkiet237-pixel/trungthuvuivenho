import { put } from '@vercel/blob';

const ADMIN_PASSWORD = '160511';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Sai mật khẩu' });
  }

  const filename = req.headers['x-filename'] || `video-${Date.now()}.mp4`;

  try {
    const blob = await put(filename, req, {
      access: 'public',
      addRandomSuffix: true,
      contentType: req.headers['content-type'] || 'video/mp4',
    });

    return res.status(200).json({ url: blob.url });
  } catch (err) {
    return res.status(500).json({ error: 'Upload thất bại. Kiểm tra đã bật Vercel Blob chưa.' });
  }
}
