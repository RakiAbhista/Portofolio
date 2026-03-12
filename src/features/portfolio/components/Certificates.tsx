"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";
import { useState } from "react";

interface Certificate {
    id?: string;
    title?: string;
    issuer?: string;
    date?: Date | string;
    credentialUrl?: string;
    preview?: string;
}

interface CertificatesProps {
    certificates: Certificate[];
}

export function Certificates({ certificates }: CertificatesProps) {
    const [showAll, setShowAll] = useState(false);

    // Fallback certificates if none passed
    const displayCertificates = certificates.length > 0 ? certificates : [
        {
            id: "1",
            title: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            date: new Date("2023-05-15"),
            credentialUrl: "https://aws.amazon.com",
            preview: "https://images.unsplash.com/photo-1523289217630-0dd16184af8e?q=80&w=1374&auto=format&fit=crop",
        },
        {
            id: "2",
            title: "Full Stack Open",
            issuer: "University of Helsinki",
            date: new Date("2022-12-10"),
            credentialUrl: "https://fullstackopen.com",
            preview: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1470&auto=format&fit=crop",
        },
        {
            id: "3",
            title: "Google Cloud Professional Developer",
            issuer: "Google",
            date: new Date("2024-01-20"),
            credentialUrl: "https://cloud.google.com",
            preview: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1469&auto=format&fit=crop",
        },
        {
            id: "4",
            title: "Meta Front-End Developer",
            issuer: "Coursera",
            date: new Date("2023-08-05"),
            credentialUrl: "https://coursera.org",
            preview: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1374&auto=format&fit=crop",
        },
    ];

    const visibleCertificates = showAll ? displayCertificates : displayCertificates.slice(0, 4);

    return (
        <section id="certificates" className="w-full py-16 md:py-24 relative overflow-hidden">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center space-y-4 mb-16"
                >
                    <div className="inline-flex items-center rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary mb-2">
                        <Award className="h-4 w-4 mr-2" />
                        Achievements
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Certificates</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-accent to-secondary rounded-full"></div>
                    <p className="max-w-2xl text-lg text-muted-foreground mt-4">
                        Continuous learning and official validations of my expertise.
                    </p>
                </motion.div>

                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    <AnimatePresence>
                        {visibleCertificates.map((cert, index) => (
                            <motion.div
                                layout
                                key={cert.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
                                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                whileHover={{ y: -8 }}
                                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-xl hover:shadow-secondary/10 hover:border-secondary/40 relative"
                            >
                                {/* Glow behind card */}
                                <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                    {cert.preview ? (
                                        <motion.img
                                            src={cert.preview}
                                            alt={cert.title ?? "Certificate preview"}
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-secondary/10">
                                            <Award className="h-10 w-10 text-muted-foreground/50" />
                                        </div>
                                    )}
                                    {/* Subtle glare effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-y-full group-hover:animate-[sweep_1s_ease-in-out]" />
                                </div>

                                <div className="flex flex-1 flex-col p-5 relative z-10">
                                    <h3 className="font-bold mb-1 text-lg group-hover:text-secondary transition-colors line-clamp-2 min-h-[3.5rem]">{cert.title}</h3>
                                    <p className="text-sm text-foreground/70 font-medium mb-4">{cert.issuer}</p>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                                        <span className="text-xs text-muted-foreground font-medium">
                                            {cert.date ? new Date(cert.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'No date'}
                                        </span>
                                        {cert.credentialUrl && (
                                            <motion.a
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                whileTap={{ scale: 0.9 }}
                                                href={cert.credentialUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center justify-center rounded-full bg-secondary/10 p-2 text-secondary hover:bg-secondary hover:text-secondary-foreground transition-colors"
                                                title="View Credential"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                <span className="sr-only">View Credential</span>
                                            </motion.a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {displayCertificates.length > 4 && (
                    <motion.div
                        layout
                        className="mt-12 flex justify-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAll(!showAll)}
                            className="inline-flex h-11 items-center justify-center rounded-full border border-input bg-card px-8 text-sm font-medium shadow-sm transition-colors hover:bg-secondary hover:text-secondary-foreground hover:border-secondary"
                        >
                            {showAll ? "Show Less" : "View All Certificates"}
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
