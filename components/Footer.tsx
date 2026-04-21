"use client";

export default function Footer() {
  const fullYear = new Date().getFullYear();

  return (
    <footer className="relative z-[2] w-full bg-[#0f181f]">
      {/* Upper section: brand + 3 columns */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-start justify-between gap-10 border-b border-white/20 px-4 py-12 sm:px-6 lg:px-8">
        {/* Brand / tagline */}
        <div className="min-w-0 max-w-md shrink-0">
          <div className="text-xl font-semibold">
            <span className="text-primary">Sense</span>
            <span className="text-white">Craft</span>
          </div>
          <p className="mt-2 text-[13px] leading-[22px] text-[#a2b1b1]">
            Empower global developers with high performance edge computing and
            AI powered IoT solutions.
          </p>
        </div>

        {/* Products */}
        <div className="shrink-0">
          <div className="text-sm font-semibold text-white">Products</div>
          <ul className="mt-3 space-y-2 text-[13px] leading-[22px] text-[#a2b1b1]">
            <li>
              <a
                href="https://sensecraft.seeed.cc/ai/home"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                SenseCraft AI
              </a>
            </li>
            <li>
              <a
                href="https://sensecraft.seeed.cc/hmi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                SenseCraft HMI
              </a>
            </li>
            <li>
              <a
                href="https://sensecap-mate-download.seeed.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                SenseCraft App
              </a>
            </li>
            <li>
              <a
                href="https://www.sensecapmx.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                SenseCraft DePIN
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div className="shrink-0">
          <div className="text-sm font-semibold text-white">Resources</div>
          <ul className="mt-3 space-y-2 text-[13px] leading-[22px] text-[#a2b1b1]">
            <li>
              <a
                href="https://wiki.seeedstudio.com/Cloud/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                User Guides
              </a>
            </li>
            <li>
              <a
                href="https://wiki.seeedstudio.com/Cloud/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Wiki & Documentation
              </a>
            </li>
            <li>
              <a
                href="https://sensecraft.seeed.cc/download"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Downloads
              </a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div className="shrink-0">
          <div className="text-sm font-semibold text-white">Company</div>
          <ul className="mt-3 space-y-2 text-[13px] leading-[22px] text-[#a2b1b1]">
            <li>
              <a
                href="https://www.seeedstudio.com/about-us/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                About Seeed
              </a>
            </li>
            <li>
              <a
                href="https://www.seeedstudio.com/join-us/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Careers
              </a>
            </li>
            <li>
              <a
                href="https://www.seeedstudio.com/contacts"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="https://www.seeedstudio.com/blog/2020/04/22/seeed-in-the-news/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                News
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Lower section: copyright + Privacy Policy */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div className="text-[13px] text-[#a2b1b1]">
          © 2008-{fullYear} Seeed Studio & SenseCraft. All rights reserved.
        </div>
        <a
          href="https://www.seeedstudio.com/privacy_policy/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-[#a2b1b1] hover:underline"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
