"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Profile } from "@prisma/client";

export function About({ profile }: { profile?: Profile }) {
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
        <section id="about" className="relative w-full py-20 md:py-32 overflow-hidden">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

            <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
                <div className="grid gap-12 md:grid-cols-2 lg:gap-20 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ staggerChildren: 0.2 }}
                        className="space-y-8"
                    >
                        <motion.div variants={textVariants} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                >
                                    <span className="text-white font-bold text-lg">✨</span>
                                </motion.div>
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">About Me</h2>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                                Crafting Digital Experiences
                            </h3>
                        </motion.div>

                        <motion.p
                            variants={textVariants}
                            className="text-lg text-muted-foreground leading-relaxed max-w-xl"
                        >
                            {profile?.aboutText || "I'm a dedicated full-stack developer focused on creating beautiful, accessible, and performant user interfaces. My journey in software development started with curiosity, which evolved into a passion for building robust applications."}
                        </motion.p>

                        <motion.div variants={textVariants} className="pt-4">
                            <Link
                                href="#projects"
                                className="inline-flex items-center gap-3 text-lg font-medium text-primary hover:gap-5 transition-all duration-300 group"
                            >
                                Explore My Work
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </motion.div>
                            </Link>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            variants={textVariants}
                            className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50"
                        >
                            <div>
                                <div className="text-2xl font-bold text-primary">5+</div>
                                <p className="text-sm text-muted-foreground mt-1">Featured Projects</p>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-secondary">14+</div>
                                <p className="text-sm text-muted-foreground mt-1">Technologies</p>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-accent">5+</div>
                                <p className="text-sm text-muted-foreground mt-1">Certifications</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={imageVariants}
                        className="relative"
                    >
                        {/* Floating cards in background */}
                        <motion.div
                            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-2xl"
                        />

                        {/* Main Image Container */}
                        <motion.div
                            whileHover={{ scale: 1.02, y: -5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="relative w-full aspect-square rounded-3xl overflow-hidden border border-border/50 shadow-2xl group"
                        >
                            {/* Image with fallback */}
                            {profile?.aboutImage ? (
                                <Image
                                    src={profile.aboutImage}
                                    alt="About section"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">📸</div>
                                        <p className="text-muted-foreground text-sm">Upload image in Prisma Studio</p>
                                    </div>
                                </div>
                            )}

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Border glow */}
                            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
                        </motion.div>

                        {/* Floating elements */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-16 -right-16 w-40 h-40 bg-gradient-to-br from-accent/30 to-secondary/30 rounded-full blur-3xl"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
