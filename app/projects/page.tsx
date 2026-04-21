import { getProjects } from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";

export const metadata = {
  title: "Projects | reComputer AI Lab",
  description: "Community projects built with reComputer.",
};

export default async function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Community Projects</h1>
        <p className="mt-1 text-gray-600">
          See what the community is building with reComputer.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
