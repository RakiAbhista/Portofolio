import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Raki Abhista Prakoso",
      title: "Fullstack Developer",
      description: "A passionate Fullstack Developer crafting elegant, modern, and high-performance digital experiences. Specialized in React, Next.js, and Node.js.",
      aboutText: "I'm a dedicated full-stack developer with a strong focus on creating beautiful, accessible, and performant user interfaces. My journey in software development started with a curiosity for how things work on the internet, which quickly evolved into a passion for building robust web applications."
    }
  })

  // Skills
  const skills = [
    { name: "JavaScript", icon: "SiJavascript" },
    { name: "TypeScript", icon: "SiTypescript" },
    { name: "React", icon: "SiReact" },
    { name: "Next.js", icon: "SiNextdotjs" },
    { name: "Node.js", icon: "SiNodedotjs" },
    { name: "PostgreSQL", icon: "SiPostgresql" },
    { name: "Prisma", icon: "SiPrisma" },
    { name: "Git", icon: "SiGit" },
    { name: "Tailwind CSS", icon: "SiTailwindcss" },
    { name: "Framer Motion", icon: "SiFramer" }
  ];

  for (const skill of skills) {
    await prisma.skill.create({
      data: skill
    });
  }

  // Projects
  const projects = [
    {
        title: "E-Commerce Platform",
        description: "A full-featured e-commerce platform with Stripe integration, admin dashboard, and user authentication.",
        preview: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop",
        techStack: "Next.js, Tailwind, Prisma, Stripe",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
    },
    {
        title: "Task Management App",
        description: "A collaborative task management tool with real-time updates and drag-drop functionality.",
        preview: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1339&auto=format&fit=crop",
        techStack: "React, Node.js, MongoDB, Socket.io",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
    },
    {
        title: "AI Chatbot Interface",
        description: "A sleek interface for interacting with various LLM models, featuring streaming responses and markdown support.",
        preview: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop",
        techStack: "React, TypeScript, Tailwind",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
    },
    {
        title: "Developer Blog",
        description: "A personal blog with MDX support, SEO optimization, and dark mode.",
        preview: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1472&auto=format&fit=crop",
        techStack: "Next.js, MDX, Tailwind",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        featured: true
    }
  ];

  for (const proj of projects) {
    await prisma.project.create({ data: proj });
  }

  // Certificates
  const certs = [
    {
        title: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: new Date("2023-05-15"),
        credentialUrl: "https://aws.amazon.com",
        preview: "https://images.unsplash.com/photo-1523289217630-0dd16184af8e?q=80&w=1374&auto=format&fit=crop",
    },
    {
        title: "Full Stack Open",
        issuer: "University of Helsinki",
        date: new Date("2022-12-10"),
        credentialUrl: "https://fullstackopen.com",
        preview: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1470&auto=format&fit=crop",
    },
    {
        title: "Google Cloud Professional Developer",
        issuer: "Google",
        date: new Date("2024-01-20"),
        credentialUrl: "https://cloud.google.com",
        preview: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1469&auto=format&fit=crop",
    },
    {
        title: "Meta Front-End Developer",
        issuer: "Coursera",
        date: new Date("2023-08-05"),
        credentialUrl: "https://coursera.org",
        preview: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1374&auto=format&fit=crop",
    }
  ]
  for (const cert of certs) {
    await prisma.certificate.create({ data: cert });
  }

  // Social Links
  const socials = [
    { name: "Email", icon: "Mail", url: "mailto:hello@example.com", color: "text-blue-500" },
    { name: "GitHub", icon: "Github", url: "https://github.com", color: "text-foreground" },
    { name: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com", color: "text-blue-600" },
    { name: "Instagram", icon: "Instagram", url: "https://instagram.com", color: "text-pink-500" }
  ]
  for (const link of socials) {
    await prisma.socialLink.create({ data: link });
  }

  console.log("Database seeded successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
