import PlanHubChat from '@/components/plan-hub-chat';

export const metadata = {
    title: 'Kovr Assistant | AI Finance Advisor',
    description: 'Seu hub central para insights financeiros.',
};

export default function ChatPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-2">Kovr Assistant</h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">Seu hub central para insights financeiros.</p>
            </div>

            <div className="w-full">
                <PlanHubChat />
            </div>
        </div>
    );
}
