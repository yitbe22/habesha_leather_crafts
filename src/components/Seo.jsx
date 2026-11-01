import { site } from '@/config/site'

/**
 * Per-page title and meta tags. React 19 hoists these into <head>,
 * so any page can render <Seo> wherever it likes.
 */
export function Seo({ title, description = site.description, path = '', noindex = false }) {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name}: ${site.tagline}`
  const url = `${site.url}${path}`
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {/* pages kept out of search get no canonical, so they never point at another page */}
      {noindex ? (
        <meta name="robots" content="noindex" />
      ) : (
        <>
          <link rel="canonical" href={url} />
          <meta property="og:url" content={url} />
        </>
      )}
    </>
  )
}
