import { Box, Typography } from '@mui/material';
import { Lightbulb } from 'lucide-react';

const AdviceSection = () => {
  const tips = [
    {
      title: 'Cách chọn điện thoại phù hợp',
      link: 'https://www.youtube.com/watch?v=53ZLAOVJrwQ&pp=ygUnQ8OhY2ggY2jhu41uIMSRaeG7h24gdGhv4bqhaSBwaMO5IGjhu6Nw',
    },
    {
      title: 'So sánh laptop gaming và laptop văn phòng',
      link: 'https://www.youtube.com/watch?v=6Dm1mAj_CGQ&pp=ygUkU28gc8OhbmggbGFwdG9wIGjhu41jIHZzIGzDoG0gdmnhu4dj',
    },
    {
      title: 'Laptop giá rẻ cho sinh viên',
      link: 'https://www.youtube.com/watch?v=HIeSj7xxUpc&pp=ygUdbGFwdG9wIHNpbmggdmnDqm4gZMawxqFuZyBkw6o%3D',
    },
  ];
  const getVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('v');
    } catch {
      return null;
    }
  };

  return (
    <Box className="my-14 px-4 md:px-10">
      <Typography
        variant="h5"
        style={{ color: 'red' }}
        className="text-red-600 mb-2 flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-gradient-x"
      >
        <Lightbulb size={20} className="text-yellow-900 animate-pulse" />
        Góc tư vấn
      </Typography>

      <Box className="mt-6 grid md:grid-cols-3 gap-6">
        {tips.map((tip, idx) => {
          const videoId = getVideoId(tip.link);
          const thumbnail = videoId
            ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            : null;

          return (
            <Box
              key={idx}
              className="group p-5 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-300"
            >
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt={tip.title}
                  className="w-full rounded-lg mb-4"
                />
              )}
              <Typography
                variant="subtitle1"
                className="font-semibold mb-2 group-hover:text-indigo-700 transition-colors"
              >
                {tip.title}
              </Typography>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={tip.link}
                className="text-sm text-blue-600 group-hover:underline transition"
              >
                Xem chi tiết →
              </a>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default AdviceSection;
