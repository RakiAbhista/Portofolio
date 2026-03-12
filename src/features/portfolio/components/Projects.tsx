"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, FolderGit2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Project {
    id?: string | number;
    title?: string;
    description?: string;
    preview?: string | null;
    techStack?: string[];
    liveUrl?: string | null;
    githubUrl?: string | null;
    featured?: boolean;
}

interface ProjectsProps {
    projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
    const [showAll, setShowAll] = useState(false);

    // Fallback projects if none passed from prisma
    const displayProjects = projects.length > 0 ? projects : [
        {
            id: "1",
            title: "E-Commerce Platform",
            description: "A full-featured e-commerce platform with Stripe integration, admin dashboard, and user authentication.",
            preview: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop",
            techStack: ["Next.js", "Tailwind", "Prisma", "Stripe"],
            liveUrl: "https://example.com",
            githubUrl: "https://github.com",
        },
        {
            id: "2",
            title: "Task Management App",
            description: "A collaborative task management tool with real-time updates and drag-drop functionality.",
            preview: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1339&auto=format&fit=crop",
            techStack: ["React", "Node.js", "MongoDB", "Socket.io"],
            liveUrl: "https://example.com",
            githubUrl: "https://github.com",
        },
        {
            id: "3",
            title: "AI Chatbot Interface",
            description: "A sleek interface for interacting with various LLM models, featuring streaming responses and markdown support.",
            preview: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop",
            techStack: ["React", "TypeScript", "Tailwind"],
            liveUrl: "https://example.com",
            githubUrl: "https://github.com",
        },
        {
            id: "4",
            title: "Developer Blog",
            description: "A personal blog with MDX support, SEO optimization, and dark mode.",
            preview: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1472&auto=format&fit=crop",
            techStack: ["Next.js", "MDX", "Tailwind"],
            liveUrl: "https://example.com",
            githubUrl: "https://github.com",
        },
        {
            id: "5",
            title: "Hidden Project",
            description: "Project hidden behind the load more button.",
            preview: "",
            techStack: ["Vue", "Firebase"],
            liveUrl: "https://example.com",
            githubUrl: "https://github.com",
        }
    ];

    const visibleProjects = showAll ? displayProjects : displayProjects.slice(0, 4);

    return (
        <section id="projects" className="w-full py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center space-y-4 mb-16"
                >
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
                        <FolderGit2 className="h-4 w-4 mr-2" />
                        Portfolio
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Featured Projects</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                    <p className="max-w-2xl text-lg text-muted-foreground mt-4">
                        A selection of my recent work and personal projects.
                    </p>
                </motion.div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                    <AnimatePresence>
                        {visibleProjects.map((project, index) => (
                            <motion.div
                                layout
                                key={project.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: (index % 4) * 0.15 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                whileHover={{ y: -10 }}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40 relative z-10"
                            >
                                <div className="relative aspect-video overflow-hidden bg-muted">
                                    {project.preview ? (
                                        <motion.img
                                            src={project.preview}
                                            alt={project.title ?? "Project preview"}
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-secondary/10">
                                            <span className="text-muted-foreground">No image</span>
                                        </div>
                                    )}
                                    {/* Overlay shadow for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                <div className="flex flex-1 flex-col p-6 lg:p-8 bg-card relative">
                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                                    <p className="text-muted-foreground mb-6 flex-1 line-clamp-3 leading-relaxed">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {project.techStack?.map((tech: string, i: number) => (
                                            <motion.span
                                                key={tech}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.1 * i }}
                                                whileHover={{ scale: 1.1, backgroundColor: "rgba(59,130,246,0.2)" }}
                                                className="inline-flex cursor-default items-center rounded-md bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary-foreground ring-1 ring-inset ring-secondary/20 transition-colors"
                                            >
                                                {tech}
                                            </motion.span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-6 mt-auto pt-4 border-t border-border/50">
                                        {project.liveUrl && (
                                            <motion.a
                                                whileHover={{ x: 3, color: "var(--primary)" }}
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center text-sm font-semibold hover:text-primary transition-colors group/link"
                                            >
                                                <ExternalLink className="mr-2 h-4 w-4 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1" /> Live Website
                                            </motion.a>
                                        )}
                                        {project.githubUrl && (
                                            <motion.a
                                                whileHover={{ x: 3, color: "var(--secondary)" }}
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center text-sm font-semibold hover:text-secondary transition-colors"
                                            >
                                                <Github className="mr-2 h-4 w-4" /> Repository
                                            </motion.a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {displayProjects.length > 4 && (
                    <motion.div
                        layout
                        className="mt-16 flex justify-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAll(!showAll)}
                            className="inline-flex h-12 items-center justify-center rounded-full border-2 border-primary bg-transparent px-8 text-sm font-bold text-primary shadow-sm transition-all hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            {showAll ? "Show Less" : "View All Projects"}
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
