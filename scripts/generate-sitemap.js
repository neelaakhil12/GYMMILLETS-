import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS, PRODUCT_CATEGORIES } from '../src/data/products.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOMAIN = 'https://www.tenigymillets.com';
const today = new Date().toISOString().split('T')[0];

const staticPages = [
  { loc: `${DOMAIN}/`, priority: '1.0', changefreq: 'daily' },
  { loc: `${DOMAIN}/shop`, priority: '0.9', changefreq: 'daily' },
  { loc: `${DOMAIN}/about`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/contact`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/terms`, priority: '0.5', changefreq: 'monthly' },
  { loc: `${DOMAIN}/privacy`, priority: '0.5', changefreq: 'monthly' }
];

const categoryPages = PRODUCT_CATEGORIES.map(category => ({
  loc: `${DOMAIN}/shop?category=${encodeURIComponent(category)}`,
  priority: '0.8',
  changefreq: 'weekly'
}));

const productPages = PRODUCTS.map(product => ({
  loc: `${DOMAIN}/shop?product=${encodeURIComponent(product.id)}`,
  priority: '0.7',
  changefreq: 'weekly'
}));

const allUrls = [...staticPages, ...categoryPages, ...productPages];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml.trim());
console.log(`Successfully generated sitemap.xml in public/ with ${allUrls.length} URLs.`);

if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml.trim());
  console.log(`Successfully synced sitemap.xml to dist/.`);
}
