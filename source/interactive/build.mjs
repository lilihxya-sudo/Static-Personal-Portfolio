import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const source = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(source, '../..');
const out = path.join(root, 'interactive');
const original = process.env.PORTFOLIO_SOURCE;
const require = createRequire(import.meta.url);
const compatibleVideos = {
  './media/hero-product.mp4': './portfolio-assets/product/videos/001.mp4',
  './media/culture-beijing.mp4': './portfolio-assets/culture/videos/003.mp4',
  './media/culture-ai-story.mp4': './portfolio-assets/culture/videos/004.mp4',
  './media/culture-ai-tool.mp4': './portfolio-assets/culture/videos/005.mp4'
};
function browserSource(file) {
  let text = fs.readFileSync(file, 'utf8').replaceAll('"/media/', '"./media/').replaceAll('"/portfolio-assets/', '"./portfolio-assets/');
  for (const [legacy, compatible] of Object.entries(compatibleVideos)) text = text.replaceAll(legacy, compatible);
  return text;
}
let esbuild;
try { esbuild = require('esbuild'); } catch {
  if (!original) throw new Error('Run npm install in source/interactive or set PORTFOLIO_SOURCE to the original checkout.');
  esbuild = require(path.join(original, 'node_modules/.pnpm/esbuild@0.25.12/node_modules/esbuild'));
}
fs.mkdirSync(out, { recursive: true });
await esbuild.build({
  absWorkingDir: root, tsconfigRaw: {},
  entryPoints: [path.join(source, 'entry.tsx')], bundle: true, minify: true,
  outfile: path.join(out, 'app.js'), format: 'esm', platform: 'browser', jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  nodePaths: original ? [path.join(original, 'node_modules')] : [],
  plugins: [{ name: 'explicit-project-files', setup(build) {
    // Resolve known files through Node; do not scan inaccessible ancestor folders.
    build.onResolve({ filter: /.*/ }, args => {
      if (args.kind === 'entry-point') return { path: args.path, namespace: 'project' };
      if (args.path.startsWith('.')) {
        const base = path.resolve(path.dirname(args.importer), args.path);
        const file = ['', '.tsx', '.ts', '.js', '.json'].map(ext => base + ext).find(f => fs.existsSync(f) && fs.statSync(f).isFile());
        if (file) return { path: file, namespace: 'project' };
      }
      let file;
      try { file = createRequire(args.importer).resolve(args.path); }
      catch { file = createRequire(path.join(original, 'package.json')).resolve(args.path); }
      return { path: file, namespace: 'project' };
    });
    build.onLoad({ filter: /.*/, namespace: 'project' }, args => ({
      contents: browserSource(args.path),
      loader: args.path.endsWith('.tsx') ? 'tsx' : args.path.endsWith('.json') ? 'json' : 'js'
    }));
  }}]
});
let css = fs.readFileSync(path.join(source, 'original-compiled.css'), 'utf8');
css = css.replaceAll('/portfolio-assets/', './portfolio-assets/').replaceAll('/media/', './media/');
css = css.replace(/(-?(?:\d*\.)?\d+)s?vh\b/g, (_, value) => `calc(var(--viewport-height, 100svh) * ${Number(value) / 100})`);
fs.writeFileSync(path.join(out, 'styles.css'), css);
fs.copyFileSync(path.join(source, 'index.html'), path.join(out, 'index.html'));
if (original) {
  fs.cpSync(path.join(original, 'public/portfolio-assets'), path.join(out, 'portfolio-assets'), { recursive: true });
  fs.mkdirSync(path.join(out, 'media'), { recursive: true });
  for (const name of ['mirai-cover.png', 'hero-product.mp4', 'culture-beijing.mp4', 'culture-ai-story.mp4', 'culture-ai-tool.mp4', 'game-hero.png', 'game-wide-01.png', 'game-wide-02.png', 'game-summer-wide.png', 'game-card-01.png', 'game-card-02.png']) {
    fs.copyFileSync(path.join(original, 'public/media', name), path.join(out, 'media', name));
  }
}
console.log('Built standalone interactive portfolio without visual changes.');
