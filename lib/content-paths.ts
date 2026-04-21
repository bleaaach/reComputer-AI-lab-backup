import path from "path";

/**
 * Root directory for all editable content (YAML, Markdown).
 * All content loaders should resolve paths relative to this root (via getContentRoot).
 */
export const CONTENT_ROOT = path.join(process.cwd(), "content");

/**
 * Default locale. When multi-language is enabled, content for this locale
 * will live under content/<DEFAULT_LOCALE>/ (e.g. content/zh/).
 */
export const DEFAULT_LOCALE = "zh";

/**
 * Returns the filesystem path to the content root for a given locale.
 *
 * Current behavior: always returns CONTENT_ROOT (no locale segment), so existing
 * content layout is unchanged.
 *
 * Future (i18n): pass locale from route/request; return path.join(CONTENT_ROOT, locale)
 * with fallback to DEFAULT_LOCALE when the requested locale dir is missing. Then
 * move existing content under content/zh/ and add content/en/ etc.
 */
export function getContentRoot(locale?: string): string {
  if (locale == null || locale === "" || locale === DEFAULT_LOCALE) {
    return CONTENT_ROOT;
  }
  // When i18n is implemented: return path.join(CONTENT_ROOT, locale);
  return CONTENT_ROOT;
}
