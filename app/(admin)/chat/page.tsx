import KovrChat from '@/components/KovrChat';

export const metadata = {
    title: 'Kovr Assistant | AI Finance Advisor',
    description: 'Seu hub central para insights financeiros.',
};

export default function ChatPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-140px)] w-full transition-all duration-300">
            <KovrChat />
        </div>
    );
}
