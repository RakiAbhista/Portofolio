"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Profile } from "@prisma/client";

export function Hero({ profile }: { profile?: Profile }) {
    // Animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 10 },
        },
    };

    const floatVariants: Variants = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <section id="hero" className="relative w-full pt-32 pb-40 md:pt-40 md:pb-48 lg:pt-48 lg:pb-56 overflow-x-clip overflow-y-visible">
            {/* Animated gradient background */}
            <div className="absolute inset-0 overflow-hidden -z-10">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-primary via-secondary to-accent rounded-full blur-[100px] opacity-20 dark:opacity-30"
                />
            </div>

            <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
                <motion.div
                    className="flex flex-col items-center text-center space-y-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Status Button */}
                    <motion.div variants={itemVariants}>
                        <motion.a
                            href="mailto:rakiabhistaprakoso@gmail.com"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-linear-to-r from-blue-500/40 via-purple-500/40 to-red-500/40 backdrop-blur-md hover:border-white/40 hover:from-blue-500/50 hover:via-purple-500/50 hover:to-red-500/50 transition-all cursor-pointer text-base font-semibold text-white shadow-lg shadow-purple-500/20"
                        >
                            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
                            Open for collaborations
                        </motion.a>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.div variants={itemVariants} className="space-y-6 max-w-4xl">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                            Hey, I'm{" "}
                            <motion.span
                                variants={floatVariants}
                                animate="animate"
                                className="inline-block text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-accent"
                            >
                                {profile?.name || "Raki Abhista"}
                            </motion.span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed">
                            {profile?.title || "Fullstack Developer"} — Building modern, elegant digital experiences
                        </p>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        variants={itemVariants}
                        className="max-w-2xl text-lg text-muted-foreground leading-relaxed"
                    >
                        I create beautiful, performant web applications with a focus on user experience. Specializing in React, Next.js, and modern web technologies.
                    </motion.p>

                    {/* Scroll CTA - Subtle */}
                    <motion.div
                        variants={itemVariants}
                        className="pt-8"
                    >
                        <Link
                            href="#about"
                            className="inline-flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <span className="text-sm font-medium">Scroll to explore</span>
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="p-2 rounded-full border border-border group-hover:border-foreground/50 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </motion.div>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
