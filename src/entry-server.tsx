/* eslint-disable react-refresh/only-export-components -- server entry, never hot-reloaded */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { MARKETING_ROUTE_PATHS } from './lib/marketingRoutePaths'

export { MARKETING_ROUTE_PATHS }

export interface RenderedRoute {
  /** Markup for the inside of `<div id="root">`. */
  html: string
  /** Title, meta and link tags for the inside of `<head>`. */
  head: string
}

// React 19 hoists <title>, <meta> and <link> rendered anywhere in the tree
// (SeoHead, image preloads) to the front of the renderToString output. The
// prerender moves that run into <head>; JSON-LD <script> tags stay in the body,
// where structured-data parsers read them too.
const HOISTED_HEAD_RUN = /^(?:<(?:title|meta|link)\b[^>]*>(?:[^<]*<\/title>)?)+/

function splitHoistedHead(markup: string): RenderedRoute {
  const match = markup.match(HOISTED_HEAD_RUN)
  if (!match) return { html: markup, head: '' }
  return { head: match[0], html: markup.slice(match[0].length) }
}

/** Renders one marketing route the way scripts/prerender.mjs writes it to dist/. */
export function render(pathname: string): RenderedRoute {
  const markup = renderToString(
    <StrictMode>
      <HelmetProvider>
        <App initialPathname={pathname} />
      </HelmetProvider>
    </StrictMode>,
  )
  return splitHoistedHead(markup)
}
