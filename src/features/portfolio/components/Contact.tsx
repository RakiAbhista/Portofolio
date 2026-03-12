"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Instagram, Send } from "lucide-react";

export function Contact() {
    const socialLinks = [
        {
            name: "Email",
            icon: Mail,
            url: "mailto:hello@example.com",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "hover:border-blue-500/50"
        },
        {
            name: "GitHub",
            icon: Github,
            url: "https://github.com",
            color: "text-foreground",
            bg: "bg-foreground/10",
            border: "hover:border-foreground/50"
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            url: "https://linkedin.com",
            color: "text-blue-600",
            bg: "bg-blue-600/10",
            border: "hover:border-blue-600/50"
        },
        {
            name: "Instagram",
            icon: Instagram,
            url: "https://instagram.com",
            color: "text-pink-500",
            bg: "bg-pink-500/10",
            border: "hover:border-pink-500/50"
        },
    ];

    return (
        <section id="contact" className="w-full py-20 md:py-32 relative overflow-hidden bg-muted/50">
            {/* Decorative gradient blob */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.15, 0.1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-primary to-accent rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2 pointer-events-none"
            />

            <div className="container mx-auto max-w-4xl px-4 sm:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center space-y-6 mb-16"
                >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-2 shadow-sm"
                    >
                        <Send className="h-4 w-4 mr-2" />
                        Let's Connect
                    </motion.div>
                    <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">Get In Touch</h2>
                    <p className="max-w-2xl text-lg text-muted-foreground mt-4 leading-relaxed">
                        I'm always open to discussing product design work or partnership opportunities.
                        Feel free to reach out through any of the platforms below!
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                    }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
                >
                    {socialLinks.map((social) => {
                        const Icon = social.icon;
                        return (
                            <motion.div key={social.name} variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 10 } }
                            }}>
                                <motion.a
                                    whileHover={{ y: -5, scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={social.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`flex flex-col items-center justify-center p-8 rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-xl ${social.border} group`}
                                >
                                    <div className={`p-4 rounded-full ${social.bg} mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                                        <Icon className={`w-8 h-8 ${social.color}`} />
                                    </div>
                                    <span className="font-semibold text-foreground">{social.name}</span>
                                </motion.a>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
