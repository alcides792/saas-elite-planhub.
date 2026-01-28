export interface PopularSubscription {
    name: string;
    category: string;
    price: number;
    domain: string;
}

export const POPULAR_SUBSCRIPTIONS: PopularSubscription[] = [
    // Entertainment - Streaming
    { name: 'Netflix', category: 'Entertainment', price: 15.49, domain: 'netflix.com' },
    { name: 'Spotify', category: 'Music', price: 10.99, domain: 'spotify.com' },
    { name: 'YouTube Premium', category: 'Entertainment', price: 13.99, domain: 'youtube.com' },
    { name: 'Disney+', category: 'Entertainment', price: 7.99, domain: 'disneyplus.com' },
    { name: 'HBO Max', category: 'Entertainment', price: 15.99, domain: 'hbomax.com' },
    { name: 'Hulu', category: 'Entertainment', price: 7.99, domain: 'hulu.com' },
    { name: 'Apple TV+', category: 'Entertainment', price: 6.99, domain: 'tv.apple.com' },
    { name: 'Paramount+', category: 'Entertainment', price: 5.99, domain: 'paramountplus.com' },
    { name: 'Peacock', category: 'Entertainment', price: 5.99, domain: 'peacocktv.com' },
    { name: 'Audible', category: 'Entertainment', price: 14.95, domain: 'audible.com' },
    { name: 'Scribd', category: 'Entertainment', price: 11.99, domain: 'scribd.com' },
    { name: 'Kindle Unlimited', category: 'Entertainment', price: 11.99, domain: 'amazon.com' },
    { name: 'Crunchyroll', category: 'Entertainment', price: 7.99, domain: 'crunchyroll.com' },
    { name: 'Funimation', category: 'Entertainment', price: 5.99, domain: 'funimation.com' },
    { name: 'Shudder', category: 'Entertainment', price: 5.99, domain: 'shudder.com' },
    { name: 'Mubi', category: 'Entertainment', price: 10.99, domain: 'mubi.com' },
    { name: 'Criterion Channel', category: 'Entertainment', price: 10.99, domain: 'criterionchannel.com' },

    // Music
    { name: 'Apple Music', category: 'Music', price: 10.99, domain: 'music.apple.com' },
    { name: 'Tidal', category: 'Music', price: 10.99, domain: 'tidal.com' },
    { name: 'Amazon Music Unlimited', category: 'Music', price: 8.99, domain: 'music.amazon.com' },
    { name: 'Pandora Premium', category: 'Music', price: 9.99, domain: 'pandora.com' },
    { name: 'Deezer', category: 'Music', price: 10.99, domain: 'deezer.com' },
    { name: 'Qobuz', category: 'Music', price: 10.83, domain: 'qobuz.com' },
    { name: 'SoundCloud Pro', category: 'Music', price: 6, domain: 'soundcloud.com' },

    // Shopping
    { name: 'Amazon Prime', category: 'Shopping', price: 14.99, domain: 'amazon.com' },
    { name: 'Shopify', category: 'Shopping', price: 29, domain: 'shopify.com' },
    { name: 'Costco', category: 'Shopping', price: 60, domain: 'costco.com' },
    { name: "Sam's Club", category: 'Shopping', price: 50, domain: 'samsclub.com' },
    { name: 'Walmart+', category: 'Shopping', price: 12.95, domain: 'walmart.com' },
    { name: 'Instacart', category: 'Shopping', price: 9.99, domain: 'instacart.com' },
    { name: 'Shipt', category: 'Shopping', price: 9.99, domain: 'shipt.com' },
    { name: 'DoorDash DashPass', category: 'Shopping', price: 9.99, domain: 'doordash.com' },
    { name: 'Uber Eats Pass', category: 'Shopping', price: 9.99, domain: 'ubereats.com' },
    { name: 'Grubhub+', category: 'Shopping', price: 9.99, domain: 'grubhub.com' },

    // Software & Tools
    { name: 'Adobe Creative Cloud', category: 'Software', price: 54.99, domain: 'adobe.com' },
    { name: 'Adobe Acrobat', category: 'Software', price: 22.99, domain: 'adobe.com' },
    { name: 'Adobe Lightroom', category: 'Software', price: 9.99, domain: 'adobe.com' },
    { name: 'Adobe Photoshop', category: 'Software', price: 22.99, domain: 'adobe.com' },
    { name: 'iCloud+', category: 'Software', price: 2.99, domain: 'icloud.com' },
    { name: 'Google One', category: 'Software', price: 2.99, domain: 'one.google.com' },
    { name: 'ChatGPT Plus', category: 'Software', price: 20, domain: 'chat.openai.com' },
    { name: 'Claude Pro', category: 'Software', price: 20, domain: 'claude.ai' },
    { name: 'Canva Pro', category: 'Software', price: 12.99, domain: 'canva.com' },
    { name: 'Figma', category: 'Software', price: 15, domain: 'figma.com' },
    { name: 'Figma Dev Mode', category: 'Software', price: 15, domain: 'figma.com' },
    { name: 'Sketch', category: 'Software', price: 9, domain: 'sketch.com' },
    { name: 'GitHub Pro', category: 'Software', price: 4, domain: 'github.com' },
    { name: 'GitHub Copilot', category: 'Software', price: 10, domain: 'github.com' },
    { name: 'GitHub Team', category: 'Software', price: 4, domain: 'github.com' },
    { name: 'GitHub Enterprise', category: 'Software', price: 21, domain: 'github.com' },
    { name: '1Password', category: 'Software', price: 2.99, domain: '1password.com' },
    { name: 'LastPass', category: 'Software', price: 3, domain: 'lastpass.com' },
    { name: 'Bitwarden', category: 'Software', price: 3, domain: 'bitwarden.com' },
    { name: 'Dashlane', category: 'Software', price: 4.99, domain: 'dashlane.com' },
    { name: 'NordVPN', category: 'Software', price: 12.99, domain: 'nordvpn.com' },
    { name: 'ExpressVPN', category: 'Software', price: 12.95, domain: 'expressvpn.com' },
    { name: 'Surfshark', category: 'Software', price: 12.95, domain: 'surfshark.com' },
    { name: 'ProtonVPN', category: 'Software', price: 9.99, domain: 'protonvpn.com' },
    { name: 'CyberGhost', category: 'Software', price: 12.99, domain: 'cyberghostvpn.com' },
    { name: 'Cursor', category: 'Software', price: 20, domain: 'cursor.sh' },
    { name: 'Replit', category: 'Software', price: 20, domain: 'replit.com' },
    { name: 'Vercel Pro', category: 'Software', price: 20, domain: 'vercel.com' },
    { name: 'Netlify Pro', category: 'Software', price: 19, domain: 'netlify.com' },
    { name: 'Supabase Pro', category: 'Software', price: 25, domain: 'supabase.com' },
    { name: 'MongoDB Atlas', category: 'Software', price: 9, domain: 'mongodb.com' },
    { name: 'PlanetScale', category: 'Software', price: 29, domain: 'planetscale.com' },
    { name: 'Sentry', category: 'Software', price: 26, domain: 'sentry.io' },
    { name: 'Cloudflare', category: 'Software', price: 20, domain: 'cloudflare.com' },
    { name: 'Framer', category: 'Software', price: 5, domain: 'framer.com' },
    { name: 'Webflow', category: 'Software', price: 16, domain: 'webflow.com' },
    { name: 'Bubble', category: 'Software', price: 25, domain: 'bubble.io' },

    // Productivity
    { name: 'Microsoft 365', category: 'Productivity', price: 9.99, domain: 'microsoft.com' },
    { name: 'Dropbox', category: 'Productivity', price: 11.99, domain: 'dropbox.com' },
    { name: 'Notion', category: 'Productivity', price: 10, domain: 'notion.so' },
    { name: 'Slack', category: 'Productivity', price: 8.75, domain: 'slack.com' },
    { name: 'Zoom', category: 'Productivity', price: 15.99, domain: 'zoom.us' },
    { name: 'Grammarly', category: 'Productivity', price: 12, domain: 'grammarly.com' },
    { name: 'LinkedIn Premium', category: 'Productivity', price: 29.99, domain: 'linkedin.com' },
    { name: 'Evernote', category: 'Productivity', price: 8.99, domain: 'evernote.com' },
    { name: 'Todoist', category: 'Productivity', price: 4, domain: 'todoist.com' },
    { name: 'Asana', category: 'Productivity', price: 10.99, domain: 'asana.com' },
    { name: 'Trello', category: 'Productivity', price: 5, domain: 'trello.com' },
    { name: 'Monday.com', category: 'Productivity', price: 8, domain: 'monday.com' },
    { name: 'Airtable', category: 'Productivity', price: 20, domain: 'airtable.com' },
    { name: 'ClickUp', category: 'Productivity', price: 7, domain: 'clickup.com' },
    { name: 'Basecamp', category: 'Productivity', price: 15, domain: 'basecamp.com' },
    { name: 'Linear', category: 'Productivity', price: 8, domain: 'linear.app' },
    { name: 'Roam Research', category: 'Productivity', price: 15, domain: 'roamresearch.com' },
    { name: 'Bear', category: 'Productivity', price: 2.99, domain: 'bear.app' },
    { name: 'Zapier', category: 'Productivity', price: 19.99, domain: 'zapier.com' },
    { name: 'Make', category: 'Productivity', price: 9, domain: 'make.com' },
    { name: 'Jira', category: 'Productivity', price: 7.75, domain: 'atlassian.com' },
    { name: 'Confluence', category: 'Productivity', price: 5.75, domain: 'atlassian.com' },

    // Gaming
    { name: 'PlayStation Plus', category: 'Gaming', price: 17.99, domain: 'playstation.com' },
    { name: 'Xbox Game Pass', category: 'Gaming', price: 16.99, domain: 'xbox.com' },
    { name: 'Nintendo Switch Online', category: 'Gaming', price: 3.99, domain: 'nintendo.com' },
    { name: 'Apple Arcade', category: 'Gaming', price: 4.99, domain: 'apple.com' },
    { name: 'Twitch Turbo', category: 'Gaming', price: 8.99, domain: 'twitch.tv' },
    { name: 'Discord Nitro', category: 'Gaming', price: 9.99, domain: 'discord.com' },

    // Health & Fitness
    { name: 'Peloton', category: 'Health & Fitness', price: 44, domain: 'onepeloton.com' },
    { name: 'Headspace', category: 'Health & Fitness', price: 12.99, domain: 'headspace.com' },
    { name: 'Calm', category: 'Health & Fitness', price: 14.99, domain: 'calm.com' },
    { name: 'Strava', category: 'Health & Fitness', price: 11.99, domain: 'strava.com' },
    { name: 'MyFitnessPal Premium', category: 'Health & Fitness', price: 9.99, domain: 'myfitnesspal.com' },
    { name: 'Noom', category: 'Health & Fitness', price: 60, domain: 'noom.com' },
    { name: 'WW (Weight Watchers)', category: 'Health & Fitness', price: 22.95, domain: 'weightwatchers.com' },
    { name: 'Fitbit Premium', category: 'Health & Fitness', price: 9.99, domain: 'fitbit.com' },
    { name: 'Apple Fitness+', category: 'Health & Fitness', price: 9.99, domain: 'apple.com' },

    // Education
    { name: 'Duolingo Plus', category: 'Education', price: 6.99, domain: 'duolingo.com' },
    { name: 'Skillshare', category: 'Education', price: 13.99, domain: 'skillshare.com' },
    { name: 'MasterClass', category: 'Education', price: 10, domain: 'masterclass.com' },
    { name: 'Coursera Plus', category: 'Education', price: 59, domain: 'coursera.org' },
    { name: 'Pluralsight', category: 'Education', price: 29, domain: 'pluralsight.com' },
    { name: 'Codecademy Pro', category: 'Education', price: 19.99, domain: 'codecademy.com' },
    { name: 'Treehouse', category: 'Education', price: 25, domain: 'teamtreehouse.com' },
    { name: 'Brilliant', category: 'Education', price: 24.99, domain: 'brilliant.org' },
    { name: 'Babbel', category: 'Education', price: 13.95, domain: 'babbel.com' },
    { name: 'Rosetta Stone', category: 'Education', price: 11.99, domain: 'rosettastone.com' },
    { name: 'Busuu', category: 'Education', price: 9.99, domain: 'busuu.com' },
    { name: 'Memrise', category: 'Education', price: 8.99, domain: 'memrise.com' },

    // News & Media
    { name: 'The New York Times', category: 'News', price: 4.25, domain: 'nytimes.com' },
    { name: 'The Washington Post', category: 'News', price: 10, domain: 'washingtonpost.com' },
    { name: 'The Wall Street Journal', category: 'News', price: 12.49, domain: 'wsj.com' },
    { name: 'Medium', category: 'News', price: 5, domain: 'medium.com' },
    { name: 'The Athletic', category: 'News', price: 7.99, domain: 'theathletic.com' },
    { name: 'ESPN+', category: 'News', price: 10.99, domain: 'espn.com' },
    { name: 'Bloomberg', category: 'News', price: 34.99, domain: 'bloomberg.com' },
    { name: 'Financial Times', category: 'News', price: 4.99, domain: 'ft.com' },
    { name: 'The Economist', category: 'News', price: 12.99, domain: 'economist.com' },

    // Finance
    { name: 'YNAB', category: 'Finance', price: 14.99, domain: 'youneedabudget.com' },
    { name: 'PocketGuard', category: 'Finance', price: 7.99, domain: 'pocketguard.com' },

    // Developer Tools
    { name: 'GitLab', category: 'Software', price: 19, domain: 'gitlab.com' },
    { name: 'Bitbucket', category: 'Software', price: 3, domain: 'bitbucket.org' },
    { name: 'JetBrains All Products', category: 'Software', price: 149, domain: 'jetbrains.com' },
    { name: 'Postman', category: 'Software', price: 12, domain: 'postman.com' },
    { name: 'CircleCI', category: 'Software', price: 15, domain: 'circleci.com' },
    { name: 'Docker', category: 'Software', price: 5, domain: 'docker.com' },
    { name: 'Retool', category: 'Software', price: 10, domain: 'retool.com' },
];

// Helper function to get subscription by name
export function getSubscriptionByName(name: string): PopularSubscription | undefined {
    return POPULAR_SUBSCRIPTIONS.find(sub => sub.name.toLowerCase() === name.toLowerCase());
}

// Helper function to get subscriptions by category
export function getSubscriptionsByCategory(category: string): PopularSubscription[] {
    return POPULAR_SUBSCRIPTIONS.filter(sub => sub.category === category);
}

// Helper function to search subscriptions
export function searchSubscriptions(query: string): PopularSubscription[] {
    const lowerQuery = query.toLowerCase();
    return POPULAR_SUBSCRIPTIONS.filter(sub =>
        sub.name.toLowerCase().includes(lowerQuery) ||
        sub.category.toLowerCase().includes(lowerQuery)
    );
}
