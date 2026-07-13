// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://diegoos.com',
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Noto Sans',
      cssVariable: '--font-noto-sans',
      weights: [400, 500, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      optimizedFallbacks: false,
    },
  ],
});
