"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
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
        <section id="hero" className="relative w-full pt-24 pb-32 md:pt-32 md:pb-40 lg:pt-40 lg:pb-48 overflow-x-clip overflow-y-visible">
            {/* Animated Background Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] opacity-20 dark:opacity-30 pointer-events-none -z-10 blur-[80px] sm:blur-[120px]">
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
                    className="w-full h-full bg-gradient-to-tr from-primary via-secondary to-accent rounded-full"
                />
            </div>

            <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
                <motion.div
                    className="flex flex-col items-center text-center space-y-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Badge */}
                    <motion.div variants={itemVariants}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6 cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.15)] dark:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                            Available for new projects
                        </motion.div>
                    </motion.div>

                    {/* Heading */}
                    <motion.div variants={itemVariants} className="relative">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            Hi, I'm{" "}
                            <motion.span
                                variants={floatVariants}
                                animate="animate"
                                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent relative"
                            >
                                {profile?.name || "Raki Abhista Prakoso"}
                                {/* Subtle shine effect over the text */}
                                <motion.span
                                    animate={{
                                        backgroundPosition: ["200% center", "-200% center"]
                                    }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_auto] bg-clip-text text-transparent pointer-events-none"
                                />
                            </motion.span>
                        </h1>
                    </motion.div>

                    {/* Subheading */}
                    <motion.p
                        variants={itemVariants}
                        className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: profile?.description 
                                || 'A passionate <strong className="text-foreground">Fullstack Developer</strong> crafting elegant, modern, and high-performance digital experiences. Specialized in <span className="text-primary font-semibold relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:-z-10">React</span>, <span className="text-secondary font-semibold relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-secondary after:-z-10">Next.js</span>, and <span className="text-accent font-semibold relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-accent after:-z-10">Node.js</span>.'
                        }}
                    />

                    {/* CTA Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8 relative"
                    >
                        {/* Primary Button */}
                        <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="#projects"
                                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 dark:shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/50 relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center">
                                    View Projects
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </motion.div>
                                </span>
                                {/* Button hover sweep effect */}
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[sweep_1s_ease-in-out_infinite]" />
                            </Link>
                        </motion.div>

                        {/* Secondary Button */}
                        <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="#contact"
                                className="group inline-flex h-12 items-center justify-center rounded-md border border-input bg-background/50 backdrop-blur-sm px-8 text-sm font-medium shadow-sm transition-all hover:bg-accent hover:border-accent hover:text-accent-foreground"
                            >
                                Contact Me
                                <Mail className="ml-2 h-4 w-4 transition-transform group-hover:-rotate-12 group-hover:scale-110" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
