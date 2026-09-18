#!/usr/bin/env node
/**
 * SEO Phase 2: prerender the public marketing routes to static HTML.
 *
 * Runs after `vite build`. It builds src/entry-server.tsx for Node, renders
 * every route in MARKETING_ROUTE_PATHS, and writes dist/<route>.html
 * (dist/index.html for "/") with the route's title, meta, canonical, Open
 * Graph and JSON-LD tags in <head> and the rendered page inside #root. The
 * browser then hydrates instead of rendering from an empty shell.
 *
 * Flat files, not <route>/index.html: Netlify's pretty URLs serve
 * /pricing from pricing.html with a 200, whereas a directory index makes
 * /pricing a 301 to /pricing/, which contradicts the canonical and sitemap.
 *
 * Usage: node scripts/prerender.mjs   (or as part of `npm run build`)
 */

import { existsSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'dist')
const serverDir = join(root, 'dist-server')
const templatePath = join(distDir, 'index.html')

const ROOT_PLACEHOLDER = '<div id="root"></div>'
const FALLBACK_TITLE = /\s*<title>Project OS<\/title>/

if (!existsSync(templatePath)) {
  throw new Error('dist/index.html not found; run `vite build` before scripts/prerender.mjs')
}

// The client build already ran; this second build emits only the server entry.
await build({
  root,
  configFile: join(root, 'vite.config.ts'),
  logLevel: 'warn',
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: serverDir,
    emptyOutDir: true,
    copyPublicDir: false,
  },
})

try {
  const { MARKETING_ROUTE_PATHS, render } = await import(
    pathToFileURL(join(serverDir, 'entry-server.js')).href
  )
  const template = await readFile(templatePath, 'utf8')
  if (!template.includes(ROOT_PLACEHOLDER)) {
    throw new Error('dist/index.html has no empty #root to fill')
  }

  const written = []
  for (const route of MARKETING_ROUTE_PATHS) {
    const { html, head } = render(route)
    if (!head.includes('<title')) {
      throw new Error(`${route} rendered without a <title>; every route must use SeoHead`)
    }
    if (!/<h1[\s>]/.test(html)) {
      throw new Error(`${route} rendered without an <h1>`)
    }

    const page = template
      .replace(FALLBACK_TITLE, '')
      .replace('</head>', `    ${head}\n  </head>`)
      .replace(ROOT_PLACEHOLDER, `<div id="root">${html}</div>`)

    // Every asset URL the server render produced must exist in the client build.
    for (const [, asset] of page.matchAll(/["'(](\/assets\/[^"')\s]+)/g)) {
      if (!existsSync(join(distDir, asset))) {
        throw new Error(`${route} references ${asset}, which the client build did not emit`)
      }
    }

    const outFile = route === '/' ? templatePath : join(distDir, `${route.slice(1)}.html`)
    await mkdir(dirname(outFile), { recursive: true })
    await writeFile(outFile, page)
    written.push(outFile.slice(distDir.length + 1).replaceAll('\\', '/'))
  }

  console.log(`prerendered ${written.length} routes:\n  ${written.join('\n  ')}`)
} finally {
  await rm(serverDir, { recursive: true, force: true })
}
