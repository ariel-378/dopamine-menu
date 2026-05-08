import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dopamine Menu',
    short_name: 'Menu',
    description: 'A menu of low-pressure things to do instead of your phone.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1A1216',
    theme_color: '#1A1216',
    icons: [
      { src: '/icon', sizes: '64x64', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
