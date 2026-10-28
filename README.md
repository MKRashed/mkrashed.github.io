# Rashedul Islam — Astro portfolio

A static, typography-focused portfolio built with Astro 7, TypeScript, and plain CSS. Warm neutral colors, serif headings, understated dividers, and responsive layouts give the site its own identity. The reference at [ahmedshamim.com](https://ahmedshamim.com/) informed the text-first hierarchy; no source code, content, or assets were copied.

## Develop and validate

Use a Node version supported by the installed Astro release (validated here with Node 24).

```sh
npm install
npm run dev
npm run check
npm run format:check
npm run build
npm run preview
```

On Windows PowerShell with script execution disabled, use `npm.cmd` in place of `npm`. The dev server normally serves at `http://localhost:4321`.

## Routes

| Route              | Purpose                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `/`                | Introduction, selected work, technologies, experience, latest articles when available, contact |
| `/about`           | Biography, career timeline, technologies, education, approach                                  |
| `/projects`        | Project listing                                                                                |
| `/projects/[slug]` | Static case studies generated from project data                                                |
| `/blog`            | Published articles, or an honest empty state                                                   |
| `/blog/[...id]`    | Static Markdown article pages, including nested content paths                                  |
| `/blog/tags/[tag]` | Static tag archives generated from published articles                                          |
| `/contact`         | Email, LinkedIn, GitHub                                                                        |
| `/404.html`        | Custom not-found page; configure the static host to serve it for missing URLs                  |
| `/sitemap.xml`     | Generated only when the production origin is configured                                        |

## Update the content

`src/data/profile.ts` centralizes personal information, contact links, experience, education, and skills. The email and descriptions come from the original portfolio. The supplied brief takes precedence for the LinkedIn URL and career history. No separate profile document was present in this checkout; the original site's biography was retained. Reconfirm the current role before publishing future changes.

`src/data/projects.ts` is the only project data source. It contains the supplied IPMS, BPSC, MedCAT Academy, Lead Medical Academy, and Digi HRM projects, organized into Healthcare, Learning platforms, and HRM & workforce. Descriptions reflect their public sites. Digi HRM has both the eDigitalBio website and an HRM portal link. Set `featured: true` to include a project on the homepage. Add project-specific technologies, your contribution, and implementation challenges when confirmed; missing technical information is explicitly marked TODO on detail pages. Add `github` only when a public repository is available. TODO-status project pages use `noindex` and are omitted from the sitemap.

### Publish an article

1. Copy `src/content/blog/template.md` to a meaningful filename, such as `understanding-rest.md`.
2. Write your article and update its title, description, publication date, and tags.
3. Set `draft: false`, then run the check and build commands.

```yaml
---
title: 'Your actual article title'
description: 'An accurate summary for search and article listings.'
pubDate: 2026-10-28
tags: ['Laravel', 'Backend']
draft: true
---
```

Keep the template unpublished. Missing `draft` defaults to true. Drafts and future-dated entries are excluded from all public listings, article routes, tag pages, and the sitemap. This is a static site: rebuild to publish a scheduled article after its date. Dates display in UTC to avoid a day changing by build-machine timezone. Reading time is an approximate word count at 200 words per minute. Code fences use Astro's built-in Shiki highlighting. Markdown is supported without another dependency; MDX is intentionally not enabled because no article requires embedded components.

Use descriptive image alt text. For article images, prefer local Markdown image imports or Astro's `Image` component in an Astro component so Astro can optimize them; don't place large unoptimized source images directly in `public/`. The current design needs no photographic assets or external fonts.

## Production configuration

Set `SITE_URL` to your real production origin in the build environment. In PowerShell:

```powershell
$env:SITE_URL = 'https://your-actual-domain.com'
npm.cmd run build
```

The config also accepts a `.env` file using Astro's environment loading. The URL above is only an example: do not publish with a placeholder domain. Without `SITE_URL`, canonical URLs, absolute Open Graph URLs/images, and the sitemap are omitted. With it, those are generated automatically. Deploy the contents of `dist/` to a static host. No server adapter, account, or database is needed. This change does not deploy the site.

`public/social-card.png` is a 1200 × 630 social preview, with an editable SVG source alongside it. Update both when branding changes. Search metadata is unique per page; article pages additionally include publication metadata.

## How the Astro pieces fit together

- **Layouts:** `BaseLayout.astro` owns the HTML document, SEO metadata, global stylesheet, navigation, footer, and theme initialization. Its `<slot />` receives each page's content. `BlogLayout.astro` nests inside it and adds article metadata and a reading-width body.
- **Components:** Header, footer, hero, section titles, experience items, project listings, blog listings, skill lists, and the contact CTA are reusable `.astro` files. Astro renders them into HTML at build time; there is no React or Vue runtime.
- **Props:** Typed `Props` interfaces describe the data a component accepts. For example, `ProjectCard` receives a `project`, and `SectionTitle` receives an `eyebrow`, `title`, and optional `description`. Values come from `Astro.props`.
- **Scoped CSS:** Each component's `<style>` applies only to that component. `src/styles/global.css` provides shared tokens, typography, base behavior, grids, spacing utilities, and prose styling. Theme colors use CSS custom properties.
- **Routing:** Files under `src/pages` map to URLs. Bracketed filenames use `getStaticPaths()` to generate a finite set of HTML pages from the project data and article collection.
- **Content Collections:** `src/content.config.ts` declares the blog's Markdown loader and Zod schema. Astro validates frontmatter and generates types. `getPublishedPosts()` applies a shared visibility filter, while `render()` turns an article into a component for its detail page.
- **Browser behavior:** The appearance picker offers System, Morning (light), Afternoon (warm), Evening (sepia), and Night (slate blue). An early inline script restores saved preferences before the page renders, including older Light/Dark choices. System mode follows device changes. Native radio inputs support keyboard selection; Escape and clicking outside dismiss the picker. Without JavaScript, the site remains navigable and follows the system color preference. Storage failures are handled.

## Review and remaining content

The 800px content column keeps reading comfortable. The header and experience rows adapt on mobile, all navigation stays visible, and the appearance control is at least 44px tall. The site includes a skip link, visible keyboard focus, semantic landmarks, one main heading per page, reduced-motion handling, and high-contrast text tokens in all themes. Backgrounds use flat colors for a calm reading experience. System fonts avoid blocking font downloads. No UI framework or external asset requests are required.

### Ambient artwork

`src/components/AmbientScene.astro` contains four original inline SVG illustrations, displayed beside the homepage hero on wide screens and beside its links on smaller screens. Morning has a perched bird with occasional hops; Afternoon has a swaying plant and butterfly; Evening has tea with rising steam; Night has a lantern with a breathing glow and drifting fireflies. System mode selects Morning or Night to match the device preference.

Animation uses CSS transforms and opacity. A small observer script pauses motion when the scene leaves the viewport or the document is hidden. Visitors can pause or resume using the 44px control. With reduced motion enabled, all artwork stays still and the pause control is hidden. Without JavaScript, illustrations remain visible and still. The SVG is decorative and hidden from assistive technology; the pause control has an accessible label. Edit the SVG paths and scoped keyframes in the component to customize the art. No image downloads or animation libraries are needed.

Validation includes the production build, Astro type checking, and browser checks at 320, 390, 768, and 1440px. No Lighthouse scores are claimed. Project-specific implementation details and real articles remain content tasks; no contributions, stacks, or achievements have been invented.
