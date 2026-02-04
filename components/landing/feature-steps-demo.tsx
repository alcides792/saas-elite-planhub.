import { FeatureSteps } from "./ui/feature-section"

const features = [
    {
        step: 'Analysis',
        title: 'Instant Financial Clarity',
        content: 'Connect your accounts and let our AI categorize every transaction. See exactly where your money is going with crystal-clear analytics.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop'
    },
    {
        step: 'AI Chat',
        title: 'Chat with your Finances',
        content: 'Have a question? Just ask. "How much did I spend on Uber this month?" or "Find me cheaper insurance". Our AI Assistant answers instantly.',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2532&auto=format&fit=crop'
    },
    {
        step: 'Control',
        title: 'Manage Subscriptions',
        content: 'Track every recurring payment in one dashboard. Get alerts before renewals and cancel unwanted services with a single click.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'
    },
]

export function FeatureStepsDemo() {
    return (
        <section className="bg-black py-20">
            <FeatureSteps
                features={features}
                title="Complete Control in 3 Steps"
                autoPlayInterval={5000}
                imageHeight="h-[500px]"
            />
        </section>
    )
}
