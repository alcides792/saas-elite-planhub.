"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface TestimonialData {
    text: string;
    image: string;
    name: string;
    role: string;
}

export const TestimonialsColumn = (props: {
    className?: string;
    testimonials: TestimonialData[];
    duration?: number;
}) => {
    return (
        <div className={props.className}>
            <motion.div
                animate={{ translateY: "-50%" }}
                transition={{
                    duration: props.duration || 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6"
            >
                {[...new Array(2)].map((_, index) => (
                    <React.Fragment key={index}>
                        {props.testimonials.map(({ text, image, name, role }, i) => (
                            <div key={i} className="p-6 rounded-3xl border border-white/5 bg-[#0F0F11] shadow-xl shadow-black/20 max-w-xs w-full hover:border-purple-500/30 transition-colors duration-300">
                                <div className="text-zinc-300 text-sm leading-relaxed">"{text}"</div>
                                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                                    <div className="relative h-10 w-10 shrink-0">
                                        <Image
                                            src={image}
                                            alt={name}
                                            fill
                                            className="rounded-full object-cover border border-white/10"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="font-bold text-white text-sm">{name}</div>
                                        <div className="text-xs text-purple-400 font-medium">{role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </motion.div>
        </div>
    );
};

const testimonials: TestimonialData[] = [
    {
        text: "I used to forget to cancel Adobe and LinkedIn trials every year. Kovr sent me an alert 3 days before and I saved $400 easily!",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        name: "Mariana Costa",
        role: "Freelance Designer",
    },
    {
        text: "The dashboard is addictive. Seeing all my monthly expenses in one place made me cancel 4 services I didn't even use anymore.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        name: "Carlos Mendes",
        role: "Software Engineer",
    },
    {
        text: "The AI is insane. I asked 'Where can I cut costs?' and it listed duplicate subscriptions I had on Spotify and Apple Music.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        name: "Ana Julia",
        role: "Digital Marketing",
    },
    {
        text: "Simple, direct, and pays for itself in the first month. Just by cancelling a premium Tinder plan I forgot about, the annual sub was already worth it.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
        name: "Pedro Henrique",
        role: "Student",
    },
    {
        text: "Best $27 I spent this year. The peace of mind knowing I won't have surprise charges on my card is worth much more.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        name: "Sofia Lemos",
        role: "Product Manager",
    },
    {
        text: "The family sharing feature is great. Now I know exactly who owes what for Netflix and Disney+.",
        image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
        name: "Lucas Ferreira",
        role: "Parent",
    },
];

export const TestimonialsSection = () => {
    const col1 = testimonials.slice(0, 2);
    const col2 = testimonials.slice(2, 4);
    const col3 = testimonials.slice(4, 6);

    return (
        <section className="relative py-24 overflow-hidden border-t border-white/5 bg-[#09090b]">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                        Loved by thousands.
                    </h2>
                    <p className="text-zinc-500">
                        Join thousands of people who stopped wasting money on useless subscriptions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[500px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
                    <TestimonialsColumn testimonials={col1} duration={15} />
                    <TestimonialsColumn testimonials={col2} duration={22} className="hidden md:block" />
                    <TestimonialsColumn testimonials={col3} duration={18} className="hidden lg:block" />
                </div>
            </div>
        </section>
    );
};
