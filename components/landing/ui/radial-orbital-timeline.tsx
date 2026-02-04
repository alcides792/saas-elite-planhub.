"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { LandingBadge as Badge } from "./landing-badge";
import {
    LandingCard as Card,
    LandingCardContent as CardContent,
    LandingCardHeader as CardHeader,
    LandingCardTitle as CardTitle
} from "./landing-card";

interface TimelineItem {
    id: number;
    title: string;
    date: string;
    content: string;
    category: string;
    icon: React.ElementType;
    relatedIds: number[];
    status: "completed" | "in-progress" | "pending";
    energy: number;
}

interface RadialOrbitalTimelineProps {
    timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
    timelineData,
}: RadialOrbitalTimelineProps) {
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
        {}
    );
    const [rotationAngle, setRotationAngle] = useState<number>(0);
    const [autoRotate, setAutoRotate] = useState<boolean>(true);
    const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
    const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const orbitRef = useRef<HTMLDivElement>(null);
    const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === containerRef.current || e.target === orbitRef.current) {
            setExpandedItems({});
            setActiveNodeId(null);
            setPulseEffect({});
            setAutoRotate(true);
        }
    };

    const toggleItem = (id: number) => {
        setExpandedItems((prev) => {
            const newState = { ...prev };
            // Close other items
            Object.keys(newState).forEach((key) => {
                if (parseInt(key) !== id) {
                    newState[parseInt(key)] = false;
                }
            });

            newState[id] = !prev[id];

            if (!prev[id]) {
                setActiveNodeId(id);
                setAutoRotate(false);

                const relatedItems = getRelatedItems(id);
                const newPulseEffect: Record<number, boolean> = {};
                relatedItems.forEach((relId) => {
                    newPulseEffect[relId] = true;
                });
                setPulseEffect(newPulseEffect);

                centerViewOnNode(id);
            } else {
                setActiveNodeId(null);
                setAutoRotate(true);
                setPulseEffect({});
            }

            return newState;
        });
    };

    useEffect(() => {
        let rotationTimer: NodeJS.Timeout;

        if (autoRotate) {
            rotationTimer = setInterval(() => {
                setRotationAngle((prev) => (prev + 0.2) % 360);
            }, 50);
        }

        return () => {
            if (rotationTimer) clearInterval(rotationTimer);
        };
    }, [autoRotate]);

    const centerViewOnNode = (nodeId: number) => {
        const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
        if (nodeIndex === -1) return;

        const totalNodes = timelineData.length;
        const targetAngle = (nodeIndex / totalNodes) * 360;

        // Center the node at the top (270 degrees in this coordinate system)
        setRotationAngle(270 - targetAngle);
    };

    const calculateNodePosition = (index: number, total: number) => {
        const angle = ((index / total) * 360 + rotationAngle) % 360;
        const radius = 220; // Radius of the orbit
        const radian = (angle * Math.PI) / 180;

        const x = radius * Math.cos(radian);
        const y = radius * Math.sin(radian);

        // Calculate z-index and opacity based on "depth" (y-position)
        const zIndex = Math.round(100 + 50 * Math.sin(radian));
        const opacity = Math.max(0.4, (Math.sin(radian) + 1) / 2 + 0.2);

        return { x, y, angle, zIndex, opacity };
    };

    const getRelatedItems = (itemId: number): number[] => {
        const currentItem = timelineData.find((item) => item.id === itemId);
        return currentItem ? currentItem.relatedIds : [];
    };

    const isRelatedToActive = (itemId: number): boolean => {
        if (!activeNodeId) return false;
        const relatedItems = getRelatedItems(activeNodeId);
        return relatedItems.includes(itemId);
    };

    const getStatusStyles = (status: TimelineItem["status"]): string => {
        switch (status) {
            case "completed":
                return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
            case "in-progress":
                return "bg-blue-500/20 text-blue-400 border-blue-500/50";
            case "pending":
                return "bg-zinc-500/20 text-zinc-400 border-zinc-500/50";
            default:
                return "bg-zinc-500/20 text-zinc-400 border-zinc-500/50";
        }
    };

    if (!mounted) return <div className="w-full h-[700px]" />;

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center overflow-hidden relative z-10"
            ref={containerRef}
            onClick={handleContainerClick}
        >
            <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
                {/* Orbital Rings with CSS animations from globals.css */}
                <div className="absolute w-[440px] h-[440px] rounded-full border border-white/5 animate-spin-slow"></div>
                <div className="absolute w-[460px] h-[460px] rounded-full border border-white/10 animate-reverse-spin"></div>

                <div
                    className="absolute w-full h-full flex items-center justify-center"
                    ref={orbitRef}
                    style={{ perspective: "1000px" }}
                >
                    {/* Center Point */}
                    <div className="absolute w-20 h-20 rounded-full bg-purple-600/20 flex items-center justify-center z-10 blur-xl"></div>
                    <div className="absolute w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] z-20"></div>

                    {timelineData.map((item, index) => {
                        const position = calculateNodePosition(index, timelineData.length);
                        const isExpanded = expandedItems[item.id];
                        const isRelated = isRelatedToActive(item.id);
                        const isPulsing = pulseEffect[item.id];
                        const Icon = item.icon;

                        const nodeStyle = {
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            zIndex: isExpanded ? 200 : position.zIndex,
                            opacity: isExpanded ? 1 : position.opacity,
                        };

                        return (
                            <div
                                key={item.id}
                                ref={(el) => { nodeRefs.current[item.id] = el; }}
                                className="absolute transition-all duration-700 cursor-pointer group"
                                style={nodeStyle}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(item.id);
                                }}
                            >
                                {/* Node Glow */}
                                <div
                                    className={`absolute rounded-full -inset-4 opacity-0 group-hover:opacity-100 transition-opacity ${isPulsing ? "animate-pulse opacity-100" : ""
                                        }`}
                                    style={{
                                        background: `radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)`,
                                    }}
                                ></div>

                                {/* Node Icon */}
                                <div
                                    className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${isExpanded ? "bg-purple-600 text-white" : "bg-zinc-900 text-zinc-400"}
                    border border-white/10 transition-all duration-500
                    ${isExpanded ? "scale-125 shadow-[0_0_30px_rgba(168,85,247,0.5)] border-purple-400" : "hover:border-purple-500/50"}
                    ${isRelated ? "border-purple-500 animate-pulse" : ""}
                  `}
                                >
                                    <Icon size={20} />
                                </div>

                                {/* Node Title */}
                                <div
                                    className={`
                    absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap
                    text-[10px] font-bold uppercase tracking-widest
                    transition-all duration-500
                    ${isExpanded ? "text-white opacity-100 scale-110" : "text-zinc-500 opacity-60"}
                  `}
                                >
                                    {item.title}
                                </div>

                                {/* Expandable Content Card */}
                                {isExpanded && (
                                    <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-72 bg-zinc-950/90 backdrop-blur-xl border-zinc-800 shadow-2xl z-[300]">
                                        <CardHeader className="p-4 pb-2">
                                            <div className="flex justify-between items-center mb-1">
                                                <Badge variant="outline" className={getStatusStyles(item.status)}>
                                                    {item.status.replace("-", " ")}
                                                </Badge>
                                                <span className="text-[10px] text-zinc-500 font-mono">
                                                    {item.date}
                                                </span>
                                            </div>
                                            <CardTitle className="text-sm font-bold text-white">
                                                {item.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0 text-xs text-zinc-400 leading-relaxed">
                                            <p>{item.content}</p>

                                            <div className="mt-4 pt-3 border-t border-zinc-800">
                                                <div className="flex justify-between items-center mb-1.5 text-[10px]">
                                                    <span className="flex items-center text-zinc-500">
                                                        <Zap size={10} className="mr-1 text-purple-500" />
                                                        Energy Level
                                                    </span>
                                                    <span className="font-mono text-white">{item.energy}%</span>
                                                </div>
                                                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 transition-all duration-1000"
                                                        style={{ width: `${item.energy}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {item.relatedIds.length > 0 && (
                                                <div className="mt-4 pt-3 border-t border-zinc-800">
                                                    <div className="flex items-center mb-2">
                                                        <Link size={10} className="text-purple-500 mr-1" />
                                                        <h4 className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">
                                                            Connected Steps
                                                        </h4>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.relatedIds.map((relatedId) => {
                                                            const relatedItem = timelineData.find(
                                                                (i) => i.id === relatedId
                                                            );
                                                            return (
                                                                <button
                                                                    key={relatedId}
                                                                    className="flex items-center text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-1 rounded hover:bg-zinc-800 transition-colors text-zinc-300"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleItem(relatedId);
                                                                    }}
                                                                >
                                                                    {relatedItem?.title}
                                                                    <ArrowRight size={10} className="ml-1 opacity-50" />
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
