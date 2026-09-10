import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // canonical URL と sitemap の生成に必要
  site: 'https://detourne-site.vercel.app',
  output: 'static',
  adapter: vercel({ webAnalytics: { enabled: true } }),
  integrations: [
    react(),
    markdoc(),
    keystatic(),
    // 管理画面は検索結果に出さない
    sitemap({ filter: (page) => !page.includes('/keystatic') }),
  ],
});
