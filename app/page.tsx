import Link from "next/link";
import BannerCarousel from "@/components/BannerCarousel";
import ProjectCard from "@/components/ProjectCard";
import { getHomeBanners } from "@/lib/banners";
import { getFeaturedProjects } from "@/lib/projects";
import { getQuickAccess } from "@/lib/quickAccess";
import MingcuteIcon from "@/components/MingcuteIcon";

export default async function HomePage() {
  const homeBanners = getHomeBanners();
  const featuredProjects = getFeaturedProjects();
  const quickAccess = getQuickAccess();
  return (
    <div>
      {/* 首页顶端轮播 Banner，最大宽度与下方 section 一致，顶部留白 */}
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-6 sm:px-6 lg:px-8">
        <BannerCarousel items={homeBanners} />
      </div>

      {/* Quick access — 数据来自 content/home/quick-access.yaml */}
      <section className="border-t border-gray-200 bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {quickAccess.title}
          </h2>
          <p className="mt-1 text-gray-600">{quickAccess.description}</p>
          <div className="mt-8 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {quickAccess.cards.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className="group relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 transition hover:border-primary"
                data-analytics-id={`quick_access_${card.id}`}
              >
                <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-primary bg-primary/5 text-primary shadow-sm transition group-hover:bg-primary/15">
                  <MingcuteIcon
                    icon={card.icon ?? "mingcute:rocket-fill"}
                    className="h-5 w-5"
                    aria-hidden
                  />
                </span>
                <h3 className="pr-10 font-semibold text-gray-900">{card.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{card.description}</p>
                <span className="mt-auto inline-block pt-3 text-sm font-medium text-primary">
                  {card.buttonText}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Projects 预览 */}
      <section className="border-t border-gray-200 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Community Projects
            </h2>
            <Link
              href="/projects"
              className="text-sm font-medium text-primary hover:underline"
              data-analytics-id="home_view_all_projects"
            >
              View all projects
            </Link>
          </div>
          <p className="mt-1 text-gray-600">
            See what the community is building with reComputer
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} compact />
              ))
            ) : (
              <p className="col-span-full text-sm text-gray-500">
                No featured projects yet. View all on the Projects page.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
