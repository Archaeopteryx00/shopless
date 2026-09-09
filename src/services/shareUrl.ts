/**
 * Helper to resolve the public production origin for Shopless.
 * Prevents sharing Vercel preview/deployment-specific URLs (e.g. shopless-git-main-xxx.vercel.app)
 * which trigger Vercel Deployment Protection auth screens for external users.
 */
export function getPublicProductionOrigin(): string {
  // 1. Explicit environment variable if configured in Vercel project settings
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL.trim();
    return envUrl.startsWith('http') ? envUrl : `https://${envUrl}`;
  }

  // 2. Vercel System Environment Variable for Production Domain
  if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
    const vercelProdUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL.trim();
    return vercelProdUrl.startsWith('http') ? vercelProdUrl : `https://${vercelProdUrl}`;
  }

  // 3. Browser runtime check: use window.location.origin if it is a custom production domain,
  // but catch Vercel preview/branch deployment subdomains.
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const isVercelPreview =
      host.endsWith('.vercel.app') &&
      host !== 'shopless.vercel.app' &&
      (host.includes('-git-') || /^shopless-[a-z0-9]+/i.test(host));

    if (!isVercelPreview && host !== 'localhost' && host !== '127.0.0.1') {
      return window.location.origin;
    }
  }

  // Fallback public production domain for Shopless
  return 'https://shopless.vercel.app';
}

/**
 * Returns the public production URL for a specific product detail route /shop/[id]
 */
export function getPublicProductShareUrl(productId: string): string {
  const origin = getPublicProductionOrigin();
  return `${origin}/shop/${encodeURIComponent(productId)}`;
}
