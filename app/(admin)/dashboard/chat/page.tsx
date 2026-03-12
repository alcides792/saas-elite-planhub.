'use client';

import KovrChat from '@/components/KovrChat';
import { Bot, Settings, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function ChatPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-140px)] w-full transition-all duration-300">
            <KovrChat />
        </div>
    );
}
