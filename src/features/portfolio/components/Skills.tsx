"use client";

import { motion } from "framer-motion";

interface SkillsProps {
    skills: { name: string; icon?: string | null }[];
}

export function Skills({ skills }: SkillsProps) {
    // Fallback skills if none are passed
    const displaySkills = skills.length > 0 ? skills : [
        { name: "JavaScript", icon: "SiJavascript" },
        { name: "TypeScript", icon: "SiTypescript" },
        { name: "React", icon: "SiReact" },
        { name: "Next.js", icon: "SiNextdotjs" },
        { name: "Node.js", icon: "SiNodedotjs" },
        { name: "PostgreSQL", icon: "SiPostgresql" },
        { name: "Prisma", icon: "SiPrisma" },
        { name: "Git", icon: "SiGit" },
        { name: "Tailwind CSS", icon: "SiTailwindcss" },
        { name: "Framer Motion", icon: "SiFramer" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring" as const, stiffness: 150, damping: 12 }
        }
    };

    return (
        <section id="skills" className="w-full py-16 md:py-24 relative overflow-hidden">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center space-y-4 mb-16"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">My Skills</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-secondary to-primary rounded-full"></div>
                    <p className="max-w-2xl text-lg text-muted-foreground mt-4">
                        Technologies and tools I work with to bring ideas to life.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                >
                    {displaySkills.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            variants={itemVariants}
                            whileHover={{
                                y: -10,
                                scale: 1.05,
                                transition: { type: "spring", stiffness: 300, damping: 15 }
                            }}
                            className="group relative flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-shadow hover:border-primary/50 overflow-hidden"
                        >
                            {/* Background Glow on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <motion.div
                                className="relative h-14 w-14 rounded-xl bg-muted group-hover:bg-primary/10 text-foreground group-hover:text-primary flex items-center justify-center mb-4 transition-colors duration-300 shadow-inner group-hover:shadow-primary/20"
                                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="font-bold text-2xl">{skill.name.charAt(0)}</span>
                            </motion.div>
                            <h3 className="font-semibold text-sm sm:text-base text-foreground/80 group-hover:text-foreground transition-colors text-center">
                                {skill.name}
                            </h3>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
