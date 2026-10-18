/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Applies to every route. Admin pages are also gated by
        // middleware.ts; these are defense-in-depth browser protections.
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            // Defense-in-depth. 'unsafe-inline'/'unsafe-eval' kept for Next.js
            // runtime; tighten further with nonces in a later pass if needed.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://lh3.googleusercontent.com https://*.public.blob.vercel-storage.com",
              "font-src 'self' data:",
              "connect-src 'self' https://pay.easebuzz.in https://testpay.easebuzz.in https://*.public.blob.vercel-storage.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self' https://pay.easebuzz.in https://testpay.easebuzz.in",
              "object-src 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        "**/node_modules/**",
        "**/_DELETE_ME_old_modules/**",
        "**/node_modules_old_trash/**",
      ],
    };
    return config;
  },
};

export default nextConfig;
