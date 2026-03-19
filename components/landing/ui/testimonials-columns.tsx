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
                            <div key={i} className="p-8 rounded-none border-4 border-[#1a1a1a] bg-white shadow-[8px_8px_0px_#1a1a1a] max-w-xs w-full transition-transform hover:-translate-y-1">
                                <div className="text-[#1a1a1a] text-lg font-bold leading-tight italic">"{text}"</div>
                                <div className="flex items-center gap-4 mt-6 pt-6 border-t-4 border-[#1a1a1a]">
                                    <div className="relative h-12 w-12 shrink-0 border-2 border-[#1a1a1a] rounded-none overflow-hidden">
                                        <Image
                                            src={image}
                                            alt={name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="font-black text-[#1a1a1a] text-base uppercase tracking-tighter">{name}</div>
                                        <div className="text-sm text-[#1fe2c3] bg-[#1a1a1a] px-2 font-black uppercase inline-block w-fit">{role}</div>
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
        text: "The dashboard is addictive. Seeing all my monthly expenses in one place made me cancel 4 services I wasn't even using anymore.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        name: "Carlos Mendes",
        role: "Software Engineer",
    },
    {
        text: "The AI is unbelievable. I asked 'Where can I cut costs?' and it listed duplicate subscriptions I had on Spotify and Apple Music.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        name: "Ana Julia",
        role: "Digital Marketing",
    },
    {
        text: "Simple, straightforward and it pays for itself in the first month. Just by canceling a premium Tinder plan I forgot about, the annual subscription was already worth it.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
        name: "Pedro Henrique",
        role: "Student",
    },
    {
        text: "The best $27 I spent this year. The peace of mind of knowing I won't have surprise credit card charges is worth much more.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        name: "Sofia Lemos",
        role: "Product Manager",
    },
    {
        text: "The family sharing feature is great. Now I know exactly who owes what for Netflix and Disney+.",
        image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
        name: "Lucas Ferreira",
        role: "Father",
    },
];

export const TestimonialsSection = () => {
    const col1 = testimonials.slice(0, 2);
    const col2 = testimonials.slice(2, 4);
    const col3 = testimonials.slice(4, 6);

    return (
        <section className="relative py-24 overflow-hidden border-t-8 border-[#1a1a1a] bg-zinc-50">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <h2 className="text-5xl md:text-8xl font-black mb-6 text-[#1a1a1a] uppercase tracking-tighter leading-none">
                        LOVED BY <br /> <span className="text-white bg-[#1a1a1a] px-4">THOUSANDS.</span>
                    </h2>
                    <p className="text-[#1a1a1a] text-xl md:text-2xl font-bold uppercase italic opacity-80">
                        JOIN THOSE WHO STOPPED THROWING MONEY AWAY ON USELESS SUBSCRIPTIONS.
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
