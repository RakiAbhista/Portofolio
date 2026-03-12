"use client";

import { motion, Variants } from "framer-motion";
import { User, Code2, Coffee } from "lucide-react";

export function About() {
    const textVariants: Variants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const imageVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8, rotate: -5 },
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: { type: "spring" as const, stiffness: 100, damping: 15, duration: 0.8 }
        }
    };

    return (
        <section id="about" className="relative w-full py-16 md:py-24 bg-muted/30 overflow-hidden">
            {/* Decorative background circle */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-64 top-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 pointer-events-none"
            />

            <div className="container mx-auto max-w-6xl px-4 sm:px-6">
                <div className="grid gap-12 md:grid-cols-2 lg:gap-16 items-center">

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ staggerChildren: 0.2 }}
                        className="space-y-6"
                    >
                        <motion.div variants={textVariants}>
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl flex items-center gap-3">
                                <User className="w-8 h-8 text-primary" />
                                About Me
                            </h2>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "5rem" }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-4"
                            />
                        </motion.div>

                        <motion.p variants={textVariants} className="text-lg text-muted-foreground leading-relaxed relative">
                            <span className="absolute -left-4 top-0 text-4xl text-primary/20 font-serif">"</span>
                            I'm a dedicated full-stack developer with a strong focus on creating beautiful, accessible, and performant user interfaces.
                            My journey in software development started with a curiosity for how things work on the internet, which quickly evolved into a passion for building robust web applications.
                        </motion.p>

                        <motion.p variants={textVariants} className="text-lg text-muted-foreground leading-relaxed">
                            When I'm not writing code, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge with the developer community. I believe in continuous learning and always strive to stay updated with the latest industry trends.
                        </motion.p>

                        <motion.div variants={textVariants} className="flex gap-4 pt-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border shadow-sm">
                                <Code2 className="w-5 h-5 text-secondary" />
                                <span className="font-medium">Clean Code</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border shadow-sm">
                                <Coffee className="w-5 h-5 text-accent" />
                                <span className="font-medium">Coffee Powered</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={imageVariants}
                        className="relative"
                    >
                        {/* Morphing shape behind image */}
                        <motion.div
                            animate={{
                                borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 20% 80% / 25% 80% 20% 75%", "30% 70% 70% 30% / 30% 30% 70% 70%"]
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 scale-105 blur-lg -z-10"
                        />

                        <motion.div
                            whileHover={{ scale: 1.02, rotate: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="relative aspect-square md:aspect-[4/5] w-full rounded-2xl overflow-hidden border border-border bg-card shadow-xl flex items-center justify-center group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 transition-opacity duration-500 group-hover:opacity-50"></div>

                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="z-10 text-6xl font-black text-foreground/5 tracking-tighter mix-blend-overlay rotate-[-15deg]"
                            >
                                DEVELOPER
                            </motion.div>

                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 -translate-x-[150%] skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[sweep_1.5s_ease-in-out]" />

                            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-2xl" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
