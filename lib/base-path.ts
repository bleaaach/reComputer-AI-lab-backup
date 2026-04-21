const RAW_BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH && process.env.NEXT_PUBLIC_BASE_PATH.trim() !== ""
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : "/ai-lab";

const BASE_PATH = (() => {
  let s = RAW_BASE_PATH.trim();
  if (!s || s === "/") return "";
  if (!s.startsWith("/")) s = `/${s}`;
  return s.replace(/\/+$/, "") === "/" ? "" : s.replace(/\/+$/, "");
})();

/**
 * Prefixes an internal path with basePath.
 * - Leaves external URLs, anchors, mailto/tel, and protocol-relative URLs untouched.
 * - Avoids double-prefixing if already prefixed.
 *
 * NOTE: BASE_PATH 在构建期确定（优先用 NEXT_PUBLIC_BASE_PATH，其次默认 "/ai-lab"），
 * 不再依赖浏览器环境探测，保证本地和线上行为一致。
 */
export function withBasePath(
  href: string | undefined | null
): string | undefined {
  if (!href) return href ?? undefined;
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return href;
  }
  if (!href.startsWith("/")) return href;
  if (!BASE_PATH) return href;
  if (href === BASE_PATH || href.startsWith(`${BASE_PATH}/`)) return href;
  return `${BASE_PATH}${href}`;
}

