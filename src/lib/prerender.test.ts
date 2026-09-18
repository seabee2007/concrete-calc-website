import { describe, expect, it } from 'vitest'
import { MARKETING_ROUTE_PATHS, render } from '../entry-server'
import { normalizePathname } from './marketingRoutePaths'

const HOME_TITLE = 'Project OS | Construction Project Management Software for Contractors'

describe('marketing prerender (SEO Phase 2)', () => {
  it('renders every prerendered route with its own title, canonical and an H1', () => {
    const titles = new Map<string, string>()

    for (const route of MARKETING_ROUTE_PATHS) {
      const { head, html } = render(route)
      const title = head.match(/<title>([^<]*)<\/title>/)?.[1]
      const canonical = head.match(/<link rel="canonical" href="([^"]*)"/)?.[1]

      expect(title, `${route} title`).toBeTruthy()
      expect(head.match(/<title>/g), `${route} has one title`).toHaveLength(1)
      expect(head, `${route} description`).toMatch(/<meta name="description" content="[^"]+"/)
      expect(canonical, `${route} canonical`).toBe(`https://ardenprojectos.com${route === '/' ? '/' : route}`)
      expect(html, `${route} H1`).toMatch(/<h1[\s>]/)
      expect(html.startsWith('<title'), `${route} head tags moved out of the body`).toBe(false)
      titles.set(route, title!)
    }

    // A route that fell through to the home page would repeat the home title.
    const homeTitleCount = [...titles.values()].filter((title) => title === HOME_TITLE).length
    expect(homeTitleCount).toBe(1)
  })

  it('keeps the Organization JSON-LD and the legal footer in the static home page', () => {
    const { html } = render('/')
    // React separates adjacent text nodes with comment markers in server output.
    const text = html.replace(/<!--.*?-->/g, '')
    expect(html).toContain('"@type":"Organization"')
    expect(text).toContain('Arden Systems LLC')
    expect(html).toContain('href="/privacy"')
    expect(html).toContain('href="/terms"')
  })

  it('treats a trailing slash as the same route', () => {
    expect(normalizePathname('/pricing/')).toBe('/pricing')
    expect(normalizePathname('/')).toBe('/')
    expect(render('/pricing/').head).toContain('<title>Pricing | Project OS</title>')
  })
})
