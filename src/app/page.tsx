import { Hero } from "@/features/portfolio/components/Hero";
import { About } from "@/features/portfolio/components/About";
import { Skills } from "@/features/portfolio/components/Skills";
import { Projects } from "@/features/portfolio/components/Projects";
import { Certificates } from "@/features/portfolio/components/Certificates";
import { Contact } from "@/features/portfolio/components/Contact";

export default async function Home() {
  // In a real app we would fetch from Prisma here if connected
  // const skills = await prisma.skill.findMany();
  // const projects = await prisma.project.findMany({ take: 4 });
  // const certificates = await prisma.certificate.findMany({ take: 4 });
  const skills: any[] = [];
  const projects: any[] = [];
  const certificates: any[] = [];

  return (
    <div className="flex flex-col items-center w-full">
      <Hero />
      <About />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Certificates certificates={certificates} />
      <Contact />
    </div>
  );
}
