import { prisma } from "@/lib/prisma";
import { Hero } from "@/features/portfolio/components/Hero";
import { About } from "@/features/portfolio/components/About";
import { Skills } from "@/features/portfolio/components/Skills";
import { Projects } from "@/features/portfolio/components/Projects";
import { Certificates } from "@/features/portfolio/components/Certificates";
import { Contact } from "@/features/portfolio/components/Contact";

export default async function Home() {
  const profile = (await prisma.profile.findFirst()) ?? undefined;
  
  const skills = await prisma.skill.findMany();
  
  const rawProjects = await prisma.project.findMany();
  const projects = rawProjects.map((p: any) => ({
    ...p,
    techStack: p.techStack ? p.techStack.split(',').map((s: string) => s.trim()) : []
  }));
  
  const certificates = await prisma.certificate.findMany();
  const socialLinks = await prisma.socialLink.findMany();

  return (
    <div className="flex flex-col items-center w-full">
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Certificates certificates={certificates} />
      <Contact socialLinks={socialLinks} />
    </div>
  );
}
