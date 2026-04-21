import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { AnalyticsRoot } from "./analytics/AnalyticsRoot";

/* 本地字体：构建不依赖外网，部署后同源加载 */
const spaceGrotesk = localFont({
  src: [
    { path: "./fonts/space-grotesk-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/space-grotesk-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/space-grotesk-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/space-grotesk-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "reComputer AI Lab | Edge AI Models & Tools",
  description:
    "Explore AI models, tools, and tutorials for reComputer. Run locally at the edge.",
  icons: {
    icon:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAe1BMVEVHcEyIuScAOUmHuCg6az0AN0mHuCiHuCgAOUkAOUkAOUkAOUmHuCiHuCgAOUmHuCgAOUmHuCj///6CtwQALUkAKT2CthX1+PHf687W5b8AHDSNvyTByMuosrdccntEX2qOvDoAByGkyGm915bo7Op/jpXM36+RnqQpTFkVjjRVAAAAEHRSTlMA8doXCfHciZwcT7lIo4S+xy0eWwAAAXRJREFUOI2FU+1igjAMLEzky802pRRK+RTF93/CJaACCtv9uMTemYQSGJtx8s9Hxzme/RPbwMEXC3x/vesrmeCv9eO7LoSzKHL4lAmzY1ufHRv1H1125ls8zJ8NRDo1wQKplClSKlYkb+lYAvNO607mOpfpkm4ghcD7FUJC1zR51mSXNZHhNHa4gO40AGQj9WPWyYYM3+yM03TyluWZuKTZi7BCToYjXQL267s007lYEA6iJV2FUxSFlHKLkIuCeckDKpkz88oT5nKEMkYNynBuMG3LShs8SUjxWEy6Baih0omC1oLW1YABKoWSy37IAHVroAJl4NobtE6BSgQsIsO1x8MWTAtliVRNoUYpYow6lbUtoe5t2ddwtWi4Y9A4E8d3EWAYbKmqgVt7V5Ut0W4w0D9j2jfqoRRPFAaOAZl+0Yg8pH2gMXcQTCvl7unec6n3DOFzq8N/dKyx0cVb6FuTBh8fb7CU4/BdJ0RB7GFpN4gWh78tNj5UeUUEAgAAAABJRU5ErkJggg==",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={spaceGrotesk.variable} style={{ "--header-height": "64px" } as React.CSSProperties}>
      <body className="min-h-screen flex flex-col antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QKSP1JEZTY"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QKSP1JEZTY', { send_page_view: false });
            `,
          }}
        />
        <AnalyticsRoot />
        <header className="sticky top-0 z-50 flex flex-col w-full bg-white">
          <Nav />
        </header>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
