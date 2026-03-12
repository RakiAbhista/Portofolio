import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.socialLink.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.profile.deleteMany();

  // Profile
  const profile = await prisma.profile.create({
    data: {
      name: "Raki Abhista Prakoso",
      title: "Fullstack Developer",
      description: "A passionate Fullstack Developer crafting elegant, modern, and high-performance digital experiences. Specialized in React, Next.js, and Node.js.",
      aboutText: "I'm a dedicated full-stack developer with a strong focus on creating beautiful, accessible, and performant user interfaces. My journey in software development started with a curiosity for how things work on the internet, which quickly evolved into a passion for building robust web applications. With expertise in modern web technologies and a keen eye for user experience, I transform ideas into functional and delightful digital products.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      aboutImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop"
    }
  });
  console.log("✓ Profile created");

  // Skills
  const skills = [
    { name: "JavaScript", icon: "SiJavascript", category: "Language" },
    { name: "TypeScript", icon: "SiTypescript", category: "Language" },
    { name: "React", icon: "SiReact", category: "Frontend" },
    { name: "Next.js", icon: "SiNextdotjs", category: "Frontend" },
    { name: "Node.js", icon: "SiNodedotjs", category: "Backend" },
    { name: "PostgreSQL", icon: "SiPostgresql", category: "Database" },
    { name: "SQLite", icon: "SiSqlite", category: "Database" },
    { name: "Prisma", icon: "SiPrisma", category: "ORM" },
    { name: "Git", icon: "SiGit", category: "Tools" },
    { name: "Docker", icon: "SiDocker", category: "Tools" },
    { name: "Tailwind CSS", icon: "SiTailwindcss", category: "Frontend" },
    { name: "Framer Motion", icon: "SiFramer", category: "Animation" },
    { name: "REST API", icon: null, category: "Backend" },
    { name: "GraphQL", icon: "SiGraphql", category: "Backend" },
  ];

  for (const skill of skills) {
    await prisma.skill.create({
      data: skill
    });
  }
  console.log(`✓ ${skills.length} skills created`);

  // Projects
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A full-featured e-commerce platform with Stripe integration, admin dashboard, and user authentication. Features include product catalog management, shopping cart, payment processing, and order tracking.",
      preview: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop",
      techStack: "Next.js, Tailwind CSS, Prisma, Stripe, PostgreSQL",
      liveUrl: "https://example-ecommerce.com",
      githubUrl: "https://github.com",
      featured: true,
      order: 1
    },
    {
      title: "Task Management App",
      description: "A collaborative task management tool with real-time updates and drag-drop functionality. Includes team collaboration, progress tracking, notifications, and role-based access control.",
      preview: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1339&auto=format&fit=crop",
      techStack: "React, Node.js, MongoDB, Socket.io, Express",
      liveUrl: "https://example-tasks.com",
      githubUrl: "https://github.com",
      featured: true,
      order: 2
    },
    {
      title: "AI Chatbot Interface",
      description: "A sleek interface for interacting with various LLM models, featuring streaming responses and markdown support. Includes conversation history, model switching, and customizable system prompts.",
      preview: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop",
      techStack: "React, TypeScript, Tailwind CSS, OpenAI API",
      liveUrl: "https://example-chatbot.com",
      githubUrl: "https://github.com",
      featured: true,
      order: 3
    },
    {
      title: "Developer Blog",
      description: "A personal blog with MDX support, SEO optimization, and dark mode. Features include blog post management, category filtering, search functionality, and automated sitemap generation.",
      preview: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1472&auto=format&fit=crop",
      techStack: "Next.js, MDX, Tailwind CSS, TypeScript",
      liveUrl: "https://example-blog.com",
      githubUrl: "https://github.com",
      featured: true,
      order: 4
    },
    {
      title: "Real-time Analytics Dashboard",
      description: "A comprehensive analytics dashboard for monitoring application metrics and user behavior. Includes data visualization, real-time updates, and customizable widgets.",
      preview: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop",
      techStack: "Next.js, Chart.js, Tailwind CSS, WebSocket",
      liveUrl: "https://example-analytics.com",
      githubUrl: "https://github.com",
      featured: false,
      order: 5
    }
  ];

  for (const proj of projects) {
    await prisma.project.create({ data: proj });
  }
  console.log(`✓ ${projects.length} projects created`);

  // Certificates
  const certificates = [
    {
      title: "AWS Certified Solutions Architect - Associate",
      issuer: "Amazon Web Services",
      date: new Date("2023-05-15"),
      credentialUrl: "https://aws.amazon.com/certification",
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
      issuer: "Google Cloud",
      date: new Date("2024-01-20"),
      credentialUrl: "https://cloud.google.com/certification",
      preview: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1469&auto=format&fit=crop",
    },
    {
      title: "Meta Front-End Developer Professional Certificate",
      issuer: "Coursera / Meta",
      date: new Date("2023-08-05"),
      credentialUrl: "https://coursera.org/professional-certificates",
      preview: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1374&auto=format&fit=crop",
    },
    {
      title: "The Complete JavaScript Course 2024",
      issuer: "Udemy",
      date: new Date("2023-03-12"),
      credentialUrl: "https://udemy.com",
      preview: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1470&auto=format&fit=crop",
    }
  ];

  for (const cert of certificates) {
    await prisma.certificate.create({ data: cert });
  }
  console.log(`✓ ${certificates.length} certificates created`);

  // Social Links
  const socialLinks = [
    { name: "Email", icon: "Mail", url: "mailto:hello@example.com", order: 1 },
    { name: "GitHub", icon: "Github", url: "https://github.com", order: 2 },
    { name: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com", order: 3 },
    { name: "Instagram", icon: "Instagram", url: "https://instagram.com", order: 4 },
    { name: "Twitter", icon: "Twitter", url: "https://twitter.com", order: 5 }
  ];

  for (const link of socialLinks) {
    await prisma.socialLink.create({ data: link });
  }
  console.log(`✓ ${socialLinks.length} social links created`);

  console.log("\n✅ Database seeded successfully!\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
