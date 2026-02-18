export interface ServicePlan {
    name: string;
    price: number;
}

export interface Service {
    id: string;
    name: string;
    domain: string;
    color: string;
    category: 'Entertainment' | 'Music' | 'Productivity' | 'Gaming' | 'Social' | 'Security' | 'Utilities' | 'Health' | 'Education' | 'Dev' | 'Design' | 'News' | 'Shopping';
    plans: ServicePlan[];
}

export const POPULAR_SERVICES: Service[] = [
    // --- STREAMING (VIDEO) ---
    {
        id: 'netflix',
        name: 'Netflix',
        domain: 'netflix.com',
        color: '#E50914',
        category: 'Entertainment',
        plans: [
            { name: 'Standard with ads', price: 6.99 },
            { name: 'Standard', price: 15.49 },
            { name: 'Premium', price: 22.99 }
        ]
    },
    {
        id: 'disney-plus',
        name: 'Disney+',
        domain: 'disneyplus.com',
        color: '#0063E5',
        category: 'Entertainment',
        plans: [
            { name: 'Basic (with ads)', price: 7.99 },
            { name: 'Premium (no ads)', price: 13.99 }
        ]
    },
    {
        id: 'prime-video',
        name: 'Amazon Prime Video',
        domain: 'primevideo.com',
        color: '#00A8E1',
        category: 'Entertainment',
        plans: [
            { name: 'Prime Video Only', price: 8.99 },
            { name: 'Amazon Prime (Full)', price: 14.99 }
        ]
    },
    {
        id: 'max',
        name: 'Max',
        domain: 'max.com',
        color: '#0026ff',
        category: 'Entertainment',
        plans: [
            { name: 'With Ads', price: 9.99 },
            { name: 'Ad-Free', price: 15.99 },
            { name: 'Ultimate Ad-Free', price: 20.99 }
        ]
    },
    {
        id: 'hulu',
        name: 'Hulu',
        domain: 'hulu.com',
        color: '#1CE783',
        category: 'Entertainment',
        plans: [
            { name: 'With Ads', price: 7.99 },
            { name: 'No Ads', price: 17.99 }
        ]
    },
    {
        id: 'peacock',
        name: 'Peacock',
        domain: 'peacocktv.com',
        color: '#000000',
        category: 'Entertainment',
        plans: [
            { name: 'Premium', price: 5.99 },
            { name: 'Premium Plus', price: 11.99 }
        ]
    },
    {
        id: 'paramount-plus',
        name: 'Paramount+',
        domain: 'paramountplus.com',
        color: '#0064FF',
        category: 'Entertainment',
        plans: [
            { name: 'Essential', price: 5.99 },
            { name: 'SHOWTIME Bundle', price: 11.99 }
        ]
    },
    {
        id: 'apple-tv-plus',
        name: 'Apple TV+',
        domain: 'apple.com',
        color: '#000000',
        category: 'Entertainment',
        plans: [
            { name: 'Individual', price: 9.99 },
            { name: 'Apple One Bundle', price: 19.95 }
        ]
    },
    {
        id: 'youtube-premium',
        name: 'YouTube Premium',
        domain: 'youtube.com',
        color: '#FF0000',
        category: 'Entertainment',
        plans: [
            { name: 'Individual', price: 13.99 },
            { name: 'Family', price: 22.99 }
        ]
    },
    {
        id: 'crunchyroll',
        name: 'Crunchyroll',
        domain: 'crunchyroll.com',
        color: '#F47521',
        category: 'Entertainment',
        plans: [
            { name: 'Fan', price: 7.99 },
            { name: 'Mega Fan', price: 9.99 }
        ]
    },
    {
        id: 'globoplay',
        name: 'Globoplay',
        domain: 'globo.com',
        color: '#FF0000',
        category: 'Entertainment',
        plans: [
            { name: 'Standard', price: 5.00 },
            { name: 'Standard + Live Channels', price: 10.00 }
        ]
    },
    {
        id: 'rtp-play',
        name: 'RTP Play',
        domain: 'rtp.pt',
        color: '#1D1D1B',
        category: 'Entertainment',
        plans: [
            { name: 'Free', price: 0.00 },
            { name: 'Premium (Simulated)', price: 4.99 }
        ]
    },
    {
        id: 'mubi',
        name: 'Mubi',
        domain: 'mubi.com',
        color: '#000000',
        category: 'Entertainment',
        plans: [
            { name: 'Monthly Subscription', price: 12.99 },
            { name: 'Student', price: 7.99 }
        ]
    },
    {
        id: 'discovery-plus',
        name: 'Discovery+',
        domain: 'discoveryplus.com',
        color: '#003E70',
        category: 'Entertainment',
        plans: [
            { name: 'Basic', price: 4.99 },
            { name: 'Ad-Free', price: 6.99 }
        ]
    },
    {
        id: 'vimeo',
        name: 'Vimeo',
        domain: 'vimeo.com',
        color: '#1ab7ea',
        category: 'Entertainment',
        plans: [
            { name: 'Starter', price: 12.00 },
            { name: 'Standard', price: 20.00 }
        ]
    },
    {
        id: 'twitch-turbo',
        name: 'Twitch Turbo',
        domain: 'twitch.tv',
        color: '#9146FF',
        category: 'Entertainment',
        plans: [
            { name: 'Monthly', price: 8.99 },
            { name: 'Yearly', price: 89.99 }
        ]
    },

    // --- MÚSICA & ÁUDIO ---
    {
        id: 'spotify',
        name: 'Spotify',
        domain: 'spotify.com',
        color: '#1DB954',
        category: 'Music',
        plans: [
            { name: 'Premium Individual', price: 10.99 },
            { name: 'Premium Duo', price: 14.99 },
            { name: 'Premium Family', price: 16.99 }
        ]
    },
    {
        id: 'apple-music',
        name: 'Apple Music',
        domain: 'music.apple.com',
        color: '#000000',
        category: 'Music',
        plans: [
            { name: 'Individual', price: 10.99 },
            { name: 'Family', price: 16.99 }
        ]
    },
    {
        id: 'deezer',
        name: 'Deezer',
        domain: 'deezer.com',
        color: '#00C7F2',
        category: 'Music',
        plans: [
            { name: 'Premium', price: 10.99 },
            { name: 'Family', price: 17.99 }
        ]
    },
    {
        id: 'tidal',
        name: 'Tidal',
        domain: 'tidal.com',
        color: '#000000',
        category: 'Music',
        plans: [
            { name: 'HiFi', price: 10.99 },
            { name: 'HiFi Plus', price: 19.99 }
        ]
    },
    {
        id: 'amazon-music',
        name: 'Amazon Music Unlimited',
        domain: 'music.amazon.com',
        color: '#00A8E1',
        category: 'Music',
        plans: [
            { name: 'Individual', price: 10.99 },
            { name: 'Family', price: 16.99 }
        ]
    },
    {
        id: 'youtube-music',
        name: 'YouTube Music',
        domain: 'music.youtube.com',
        color: '#FF0000',
        category: 'Music',
        plans: [
            { name: 'Individual', price: 10.99 },
            { name: 'Family', price: 16.99 }
        ]
    },
    {
        id: 'soundcloud',
        name: 'SoundCloud Next Pro',
        domain: 'soundcloud.com',
        color: '#ff5500',
        category: 'Music',
        plans: [
            { name: 'Next Pro', price: 12.00 },
            { name: 'SoundCloud Go+', price: 9.99 }
        ]
    },
    {
        id: 'audible',
        name: 'Audible',
        domain: 'audible.com',
        color: '#f18d05',
        category: 'Music',
        plans: [
            { name: 'Premium Plus', price: 14.95 },
            { name: 'Audible Plus', price: 7.95 }
        ]
    },
    {
        id: 'storytel',
        name: 'Storytel',
        domain: 'storytel.com',
        color: '#ff4e00',
        category: 'Music',
        plans: [
            { name: 'Unlimited', price: 12.99 },
            { name: 'Family', price: 19.99 }
        ]
    },

    // --- GAMING ---
    {
        id: 'xbox-game-pass',
        name: 'Xbox Game Pass',
        domain: 'xbox.com',
        color: '#107C10',
        category: 'Gaming',
        plans: [
            { name: 'Core', price: 9.99 },
            { name: 'Ultimate', price: 16.99 }
        ]
    },
    {
        id: 'playstation-plus',
        name: 'PlayStation Plus',
        domain: 'playstation.com',
        color: '#003087',
        category: 'Gaming',
        plans: [
            { name: 'Essential', price: 9.99 },
            { name: 'Extra', price: 14.99 },
            { name: 'Deluxe', price: 17.99 }
        ]
    },
    {
        id: 'nintendo-switch-online',
        name: 'Nintendo Switch Online',
        domain: 'nintendo.com',
        color: '#E60012',
        category: 'Gaming',
        plans: [
            { name: 'Individual', price: 3.99 },
            { name: 'Expansion Pack', price: 49.99 }
        ]
    },
    {
        id: 'discord-nitro',
        name: 'Discord Nitro',
        domain: 'discord.com',
        color: '#5865F2',
        category: 'Gaming',
        plans: [
            { name: 'Nitro Basic', price: 2.99 },
            { name: 'Nitro Full', price: 9.99 }
        ]
    },
    {
        id: 'ubisoft-plus',
        name: 'Ubisoft+',
        domain: 'ubisoft.com',
        color: '#000000',
        category: 'Gaming',
        plans: [
            { name: 'PC Access', price: 14.99 },
            { name: 'Multi Access', price: 17.99 }
        ]
    },
    {
        id: 'ea-play',
        name: 'EA Play',
        domain: 'ea.com',
        color: '#ff4747',
        category: 'Gaming',
        plans: [
            { name: 'Basic', price: 4.99 },
            { name: 'Pro', price: 14.99 }
        ]
    },
    {
        id: 'geforce-now',
        name: 'GeForce Now',
        domain: 'nvidia.com',
        color: '#76B900',
        category: 'Gaming',
        plans: [
            { name: 'Priority', price: 9.99 },
            { name: 'Ultimate', price: 19.99 }
        ]
    },
    {
        id: 'roblox-premium',
        name: 'Roblox Premium',
        domain: 'roblox.com',
        color: '#000000',
        category: 'Gaming',
        plans: [
            { name: 'Premium 450', price: 4.99 },
            { name: 'Premium 1000', price: 9.99 }
        ]
    },
    {
        id: 'world-of-warcraft',
        name: 'World of Warcraft',
        domain: 'blizzard.com',
        color: '#0064ff',
        category: 'Gaming',
        plans: [
            { name: 'Monthly', price: 14.99 },
            { name: '6 Months', price: 77.94 }
        ]
    },

    // --- IA & PRODUTIVIDADE ---
    {
        id: 'chatgpt-plus',
        name: 'ChatGPT Plus',
        domain: 'openai.com',
        color: '#10A37F',
        category: 'Productivity',
        plans: [
            { name: 'Individual', price: 20.00 },
            { name: 'Team', price: 25.00 }
        ]
    },
    {
        id: 'claude-pro',
        name: 'Claude Pro',
        domain: 'anthropic.com',
        color: '#D97757',
        category: 'Productivity',
        plans: [
            { name: 'Individual', price: 20.00 },
            { name: 'Team', price: 30.00 }
        ]
    },
    {
        id: 'midjourney',
        name: 'Midjourney',
        domain: 'midjourney.com',
        color: '#000000',
        category: 'Productivity',
        plans: [
            { name: 'Basic Plan', price: 10.00 },
            { name: 'Standard Plan', price: 30.00 },
            { name: 'Pro Plan', price: 60.00 }
        ]
    },
    {
        id: 'github-copilot',
        name: 'GitHub Copilot',
        domain: 'github.com',
        color: '#24292F',
        category: 'Dev',
        plans: [
            { name: 'Individual', price: 10.00 },
            { name: 'Business', price: 19.00 }
        ]
    },
    {
        id: 'perplexity-pro',
        name: 'Perplexity Pro',
        domain: 'perplexity.ai',
        color: '#20B2AA',
        category: 'Productivity',
        plans: [
            { name: 'Monthly', price: 20.00 },
            { name: 'Yearly', price: 200.00 }
        ]
    },
    {
        id: 'notion',
        name: 'Notion',
        domain: 'notion.so',
        color: '#000000',
        category: 'Productivity',
        plans: [
            { name: 'Plus', price: 10.00 },
            { name: 'Business', price: 18.00 }
        ]
    },
    {
        id: 'evernote',
        name: 'Evernote',
        domain: 'evernote.com',
        color: '#00A82D',
        category: 'Productivity',
        plans: [
            { name: 'Personal', price: 14.99 },
            { name: 'Professional', price: 17.99 }
        ]
    },
    {
        id: 'todoist',
        name: 'Todoist',
        domain: 'todoist.com',
        color: '#E44332',
        category: 'Productivity',
        plans: [
            { name: 'Pro', price: 5.00 },
            { name: 'Business', price: 8.00 }
        ]
    },
    {
        id: 'slack',
        name: 'Slack',
        domain: 'slack.com',
        color: '#4A154B',
        category: 'Productivity',
        plans: [
            { name: 'Pro', price: 8.75 },
            { name: 'Business+', price: 15.00 }
        ]
    },
    {
        id: 'google-one',
        name: 'Google One',
        domain: 'google.com',
        color: '#4285F4',
        category: 'Productivity',
        plans: [
            { name: '100 GB', price: 1.99 },
            { name: '2 TB', price: 9.99 },
            { name: 'AI Premium', price: 19.99 }
        ]
    },
    {
        id: 'microsoft-365',
        name: 'Microsoft 365',
        domain: 'microsoft.com',
        color: '#D83B01',
        category: 'Productivity',
        plans: [
            { name: 'Personal', price: 6.99 },
            { name: 'Family', price: 9.99 }
        ]
    },
    {
        id: 'dropbox',
        name: 'Dropbox',
        domain: 'dropbox.com',
        color: '#0061FE',
        category: 'Productivity',
        plans: [
            { name: 'Plus', price: 11.99 },
            { name: 'Essentials', price: 19.99 }
        ]
    },
    {
        id: 'grammarly',
        name: 'Grammarly',
        domain: 'grammarly.com',
        color: '#15C39A',
        category: 'Productivity',
        plans: [
            { name: 'Premium', price: 30.00 },
            { name: 'Business', price: 15.00 }
        ]
    },

    // --- DESIGN & CRIAÇÃO ---
    {
        id: 'adobe-creative-cloud',
        name: 'Adobe Creative Cloud',
        domain: 'adobe.com',
        color: '#FF0000',
        category: 'Design',
        plans: [
            { name: 'All Apps', price: 59.99 },
            { name: 'Single App', price: 22.99 }
        ]
    },
    {
        id: 'figma',
        name: 'Figma',
        domain: 'figma.com',
        color: '#F24E1E',
        category: 'Design',
        plans: [
            { name: 'Professional', price: 15.00 },
            { name: 'Organization', price: 45.00 }
        ]
    },
    {
        id: 'canva-pro',
        name: 'Canva Pro',
        domain: 'canva.com',
        color: '#00C4CC',
        category: 'Design',
        plans: [
            { name: 'Individual', price: 12.99 },
            { name: 'Canva for Teams', price: 14.99 }
        ]
    },
    {
        id: 'framer',
        name: 'Framer',
        domain: 'framer.com',
        color: '#0055FF',
        category: 'Design',
        plans: [
            { name: 'Basic', price: 10.00 },
            { name: 'Pro', price: 20.00 }
        ]
    },
    {
        id: 'webflow',
        name: 'Webflow',
        domain: 'webflow.com',
        color: '#4353FF',
        category: 'Design',
        plans: [
            { name: 'Basic', price: 18.00 },
            { name: 'CMS', price: 29.00 }
        ]
    },
    {
        id: 'envato-elements',
        name: 'Envato Elements',
        domain: 'elements.envato.com',
        color: '#81b441',
        category: 'Design',
        plans: [
            { name: 'Individual', price: 16.50 },
            { name: 'Team', price: 10.75 }
        ]
    },
    {
        id: 'shutterstock',
        name: 'Shutterstock',
        domain: 'shutterstock.com',
        color: '#e81b1b',
        category: 'Design',
        plans: [
            { name: 'Essential', price: 29.00 },
            { name: 'Professional', price: 99.00 }
        ]
    },
    {
        id: 'sketch',
        name: 'Sketch',
        domain: 'sketch.com',
        color: '#f6b500',
        category: 'Design',
        plans: [
            { name: 'Standard', price: 12.00 },
            { name: 'Business', price: 20.00 }
        ]
    },

    // --- DEV & TECH ---
    {
        id: 'vercel',
        name: 'Vercel',
        domain: 'vercel.com',
        color: '#000000',
        category: 'Dev',
        plans: [
            { name: 'Pro', price: 20.00 },
            { name: 'Enterprise', price: 3000.00 }
        ]
    },
    {
        id: 'netlify',
        name: 'Netlify',
        domain: 'netlify.com',
        color: '#00C7B7',
        category: 'Dev',
        plans: [
            { name: 'Pro', price: 19.00 },
            { name: 'Business', price: 99.00 }
        ]
    },
    {
        id: 'heroku',
        name: 'Heroku',
        domain: 'heroku.com',
        color: '#430098',
        category: 'Dev',
        plans: [
            { name: 'Eco', price: 5.00 },
            { name: 'Basic', price: 7.00 }
        ]
    },
    {
        id: 'aws',
        name: 'AWS',
        domain: 'amazon.com',
        color: '#FF9900',
        category: 'Dev',
        plans: [
            { name: 'Free Tier', price: 0.00 },
            { name: 'Pay as you go', price: 50.00 }
        ]
    },
    {
        id: 'digitalocean',
        name: 'DigitalOcean',
        domain: 'digitalocean.com',
        color: '#0080FF',
        category: 'Dev',
        plans: [
            { name: 'Droplet Basic', price: 6.00 },
            { name: 'Professional', price: 24.00 }
        ]
    },
    {
        id: 'jetbrains',
        name: 'JetBrains Toolbox',
        domain: 'jetbrains.com',
        color: '#000000',
        category: 'Dev',
        plans: [
            { name: 'All Products', price: 28.90 },
            { name: 'IntelliJ IDEA', price: 16.90 }
        ]
    },
    {
        id: 'sentry',
        name: 'Sentry',
        domain: 'sentry.io',
        color: '#362D59',
        category: 'Dev',
        plans: [
            { name: 'Team', price: 26.00 },
            { name: 'Business', price: 80.00 }
        ]
    },
    {
        id: 'datadog',
        name: 'Datadog',
        domain: 'datadoghq.com',
        color: '#632CA6',
        category: 'Dev',
        plans: [
            { name: 'Pro', price: 15.00 },
            { name: 'Enterprise', price: 23.00 }
        ]
    },

    // --- SEGURANÇA & VPN ---
    {
        id: 'nordvpn',
        name: 'NordVPN',
        domain: 'nordvpn.com',
        color: '#0048A2',
        category: 'Security',
        plans: [
            { name: 'Standard', price: 12.99 },
            { name: 'Plus', price: 13.99 },
            { name: 'Complete', price: 14.99 }
        ]
    },
    {
        id: 'expressvpn',
        name: 'ExpressVPN',
        domain: 'expressvpn.com',
        color: '#FF1C1C',
        category: 'Security',
        plans: [
            { name: 'Monthly', price: 12.95 },
            { name: '6 Months', price: 9.99 }
        ]
    },
    {
        id: 'surfshark',
        name: 'Surfshark',
        domain: 'surfshark.com',
        color: '#00D1FF',
        category: 'Security',
        plans: [
            { name: 'Starter', price: 10.99 },
            { name: 'One', price: 14.99 }
        ]
    },
    {
        id: '1password',
        name: '1Password',
        domain: '1password.com',
        color: '#0094F5',
        category: 'Security',
        plans: [
            { name: 'Individual', price: 2.99 },
            { name: 'Families', price: 4.99 }
        ]
    },
    {
        id: 'lastpass',
        name: 'LastPass',
        domain: 'lastpass.com',
        color: '#D32D27',
        category: 'Security',
        plans: [
            { name: 'Premium', price: 3.00 },
            { name: 'Families', price: 4.00 }
        ]
    },
    {
        id: 'bitwarden',
        name: 'Bitwarden',
        domain: 'bitwarden.com',
        color: '#175DDC',
        category: 'Security',
        plans: [
            { name: 'Premium', price: 0.83 },
            { name: 'Families', price: 3.33 }
        ]
    },
    {
        id: 'proton-vpn',
        name: 'Proton VPN',
        domain: 'protonvpn.com',
        color: '#6D4AFF',
        category: 'Security',
        plans: [
            { name: 'VPN Plus', price: 9.99 },
            { name: 'Proton Unlimited', price: 12.99 }
        ]
    },
    {
        id: 'norton-360',
        name: 'Norton 360',
        domain: 'norton.com',
        color: '#ffc600',
        category: 'Security',
        plans: [
            { name: 'Standard', price: 7.99 },
            { name: 'Deluxe', price: 9.99 }
        ]
    },

    // --- SOCIAL & DATING ---
    {
        id: 'x-premium',
        name: 'X Premium',
        domain: 'x.com',
        color: '#000000',
        category: 'Social',
        plans: [
            { name: 'Basic', price: 3.00 },
            { name: 'Premium', price: 8.00 },
            { name: 'Premium+', price: 16.00 }
        ]
    },
    {
        id: 'linkedin-premium',
        name: 'LinkedIn Premium',
        domain: 'linkedin.com',
        color: '#0077B5',
        category: 'Social',
        plans: [
            { name: 'Career', price: 39.99 },
            { name: 'Business', price: 59.99 }
        ]
    },
    {
        id: 'tinder-gold',
        name: 'Tinder Gold',
        domain: 'tinder.com',
        color: '#FF4458',
        category: 'Social',
        plans: [
            { name: 'Gold', price: 24.99 },
            { name: 'Platinum', price: 29.99 }
        ]
    },
    {
        id: 'bumble-boost',
        name: 'Bumble Boost',
        domain: 'bumble.com',
        color: '#FFCB37',
        category: 'Social',
        plans: [
            { name: 'Boost', price: 16.99 },
            { name: 'Premium', price: 39.99 }
        ]
    },
    {
        id: 'telegram-premium',
        name: 'Telegram Premium',
        domain: 'telegram.org',
        color: '#24A1DE',
        category: 'Social',
        plans: [
            { name: 'Monthly', price: 4.99 },
            { name: 'Yearly', price: 35.99 }
        ]
    },
    {
        id: 'snapchat-plus',
        name: 'Snapchat+',
        domain: 'snapchat.com',
        color: '#FFFC00',
        category: 'Social',
        plans: [
            { name: 'Monthly', price: 3.99 },
            { name: 'Yearly', price: 29.99 }
        ]
    },
    {
        id: 'reddit-premium',
        name: 'Reddit Premium',
        domain: 'reddit.com',
        color: '#FF4500',
        category: 'Social',
        plans: [
            { name: 'Monthly', price: 5.99 },
            { name: 'Yearly', price: 49.99 }
        ]
    },
    {
        id: 'meta-verified',
        name: 'Meta Verified',
        domain: 'facebook.com',
        color: '#0668E1',
        category: 'Social',
        plans: [
            { name: 'Instagram', price: 14.99 },
            { name: 'Facebook', price: 14.99 }
        ]
    },

    // --- SAÚDE & FITNESS ---
    {
        id: 'strava',
        name: 'Strava',
        domain: 'strava.com',
        color: '#FC4C02',
        category: 'Health',
        plans: [
            { name: 'Monthly', price: 11.99 },
            { name: 'Yearly', price: 79.99 }
        ]
    },
    {
        id: 'peloton',
        name: 'Peloton',
        domain: 'onepeloton.com',
        color: '#df1c24',
        category: 'Health',
        plans: [
            { name: 'App One', price: 12.99 },
            { name: 'App+', price: 24.00 }
        ]
    },
    {
        id: 'calm',
        name: 'Calm',
        domain: 'calm.com',
        color: '#4e97ff',
        category: 'Health',
        plans: [
            { name: 'Premium', price: 14.99 },
            { name: 'LifeTime', price: 399.99 }
        ]
    },
    {
        id: 'headspace',
        name: 'Headspace',
        domain: 'headspace.com',
        color: '#FF8200',
        category: 'Health',
        plans: [
            { name: 'Monthly', price: 12.99 },
            { name: 'Yearly', price: 69.99 }
        ]
    },
    {
        id: 'myfitnesspal',
        name: 'MyFitnessPal',
        domain: 'myfitnesspal.com',
        color: '#0066EE',
        category: 'Health',
        plans: [
            { name: 'Premium', price: 19.99 },
            { name: 'Yearly', price: 79.99 }
        ]
    },
    {
        id: 'fitbit-premium',
        name: 'Fitbit Premium',
        domain: 'fitbit.com',
        color: '#00B0B9',
        category: 'Health',
        plans: [
            { name: 'Monthly', price: 9.99 },
            { name: 'Yearly', price: 79.99 }
        ]
    },

    // --- NOTÍCIAS & LEITURA ---
    {
        id: 'kindle-unlimited',
        name: 'Kindle Unlimited',
        domain: 'amazon.com',
        color: '#FF9900',
        category: 'Education',
        plans: [
            { name: 'Monthly', price: 9.99 },
            { name: 'Yearly', price: 119.88 }
        ]
    },
    {
        id: 'medium',
        name: 'Medium',
        domain: 'medium.com',
        color: '#000000',
        category: 'Education',
        plans: [
            { name: 'Member', price: 5.00 },
            { name: 'Friend', price: 15.00 }
        ]
    },
    {
        id: 'nytimes',
        name: 'New York Times',
        domain: 'nytimes.com',
        color: '#000000',
        category: 'News',
        plans: [
            { name: 'Digital Access', price: 4.00 },
            { name: 'All Access', price: 6.25 }
        ]
    },
    {
        id: 'the-guardian',
        name: 'The Guardian',
        domain: 'theguardian.com',
        color: '#052962',
        category: 'News',
        plans: [
            { name: 'Digital Subscription', price: 14.99 },
            { name: 'Support', price: 5.00 }
        ]
    },
    {
        id: 'duolingo-plus',
        name: 'Duolingo Super',
        domain: 'duolingo.com',
        color: '#58CC02',
        category: 'Education',
        plans: [
            { name: 'Super Duolingo', price: 6.99 },
            { name: 'Family Plan', price: 9.99 }
        ]
    },
    {
        id: 'coursera',
        name: 'Coursera Plus',
        domain: 'coursera.org',
        color: '#0056D2',
        category: 'Education',
        plans: [
            { name: 'Monthly', price: 59.00 },
            { name: 'Yearly', price: 399.00 }
        ]
    },
    {
        id: 'masterclass',
        name: 'MasterClass',
        domain: 'masterclass.com',
        color: '#000000',
        category: 'Education',
        plans: [
            { name: 'Individual', price: 15.00 },
            { name: 'Family', price: 23.00 }
        ]
    },
    {
        id: 'blinkist',
        name: 'Blinkist',
        domain: 'blinkist.com',
        color: '#2CE080',
        category: 'Education',
        plans: [
            { name: 'Monthly Premium', price: 14.99 },
            { name: 'Yearly Premium', price: 89.99 }
        ]
    },

    // --- SHOPPING & SERVIÇOS ---
    {
        id: 'amazon-prime',
        name: 'Amazon Prime',
        domain: 'amazon.com',
        color: '#FF9900',
        category: 'Shopping',
        plans: [
            { name: 'Monthly', price: 14.99 },
            { name: 'Yearly', price: 139.00 }
        ]
    },
    {
        id: 'uber-one',
        name: 'Uber One',
        domain: 'uber.com',
        color: '#000000',
        category: 'Utilities',
        plans: [
            { name: 'Monthly', price: 9.99 },
            { name: 'Yearly', price: 99.99 }
        ]
    },
    {
        id: 'rappi-prime',
        name: 'Rappi Prime',
        domain: 'rappi.com',
        color: '#ff441f',
        category: 'Utilities',
        plans: [
            { name: 'Basic', price: 5.00 },
            { name: 'Plus', price: 9.00 }
        ]
    },
    {
        id: 'ifood-clube',
        name: 'iFood Clube',
        domain: 'ifood.com.br',
        color: '#ea1d2c',
        category: 'Utilities',
        plans: [
            { name: 'Monthly Plan', price: 2.00 },
            { name: 'Loyalty Plan', price: 1.50 }
        ]
    },
    {
        id: 'mercado-livre-meli',
        name: 'Meli+ (Mercado Livre)',
        domain: 'mercadolivre.com.br',
        color: '#ffe600',
        category: 'Shopping',
        plans: [
            { name: 'Monthly', price: 17.99 },
            { name: 'Subscription', price: 14.99 }
        ]
    },
    {
        id: 'walmart-plus',
        name: 'Walmart+',
        domain: 'walmart.com',
        color: '#0071ce',
        category: 'Shopping',
        plans: [
            { name: 'Monthly', price: 12.95 },
            { name: 'Yearly', price: 98.00 }
        ]
    },
    {
        id: 'dashpass',
        name: 'DashPass (DoorDash)',
        domain: 'doordash.com',
        color: '#ff3008',
        category: 'Utilities',
        plans: [
            { name: 'Individual', price: 9.99 },
            { name: 'Student', price: 4.99 }
        ]
    },
    {
        id: 'wetransfer',
        name: 'WeTransfer',
        domain: 'wetransfer.com',
        color: '#409fff',
        category: 'Utilities',
        plans: [
            { name: 'Pro', price: 12.00 },
            { name: 'Premium', price: 23.00 }
        ]
    },

    // --- MAIS SERVIÇOS TÉCNICOS ---
    {
        id: 'docker',
        name: 'Docker',
        domain: 'docker.com',
        color: '#2496ed',
        category: 'Dev',
        plans: [
            { name: 'Pro', price: 5.00 },
            { name: 'Team', price: 9.00 }
        ]
    },
    {
        id: 'mongodb-atlas',
        name: 'MongoDB Atlas',
        domain: 'mongodb.com',
        color: '#00ed64',
        category: 'Dev',
        plans: [
            { name: 'Dedicated', price: 57.00 },
            { name: 'Shared', price: 0.00 }
        ]
    },
    {
        id: 'firebase',
        name: 'Firebase',
        domain: 'firebase.google.com',
        color: '#ffca28',
        category: 'Dev',
        plans: [
            { name: 'Blaze Plan', price: 25.00 },
            { name: 'Fixed (Simulated)', price: 10.00 }
        ]
    },
    {
        id: 'postman',
        name: 'Postman',
        domain: 'postman.com',
        color: '#ef5b25',
        category: 'Dev',
        plans: [
            { name: 'Basic', price: 12.00 },
            { name: 'Professional', price: 29.00 }
        ]
    },
    {
        id: 'zoom',
        name: 'Zoom',
        domain: 'zoom.us',
        color: '#2d8cff',
        category: 'Productivity',
        plans: [
            { name: 'Pro', price: 15.99 },
            { name: 'Business', price: 19.99 }
        ]
    },
    {
        id: 'calendly',
        name: 'Calendly',
        domain: 'calendly.com',
        color: '#006bff',
        category: 'Productivity',
        plans: [
            { name: 'Standard', price: 10.00 },
            { name: 'Teams', price: 16.00 }
        ]
    },
    {
        id: 'asana',
        name: 'Asana',
        domain: 'asana.com',
        color: '#f95d6a',
        category: 'Productivity',
        plans: [
            { name: 'Starter', price: 10.99 },
            { name: 'Advanced', price: 24.99 }
        ]
    },
    {
        id: 'monday-com',
        name: 'Monday.com',
        domain: 'monday.com',
        color: '#ff3d57',
        category: 'Productivity',
        plans: [
            { name: 'Basic', price: 8.00 },
            { name: 'Standard', price: 10.00 }
        ]
    },
    {
        id: 'clickup',
        name: 'ClickUp',
        domain: 'clickup.com',
        color: '#7b68ee',
        category: 'Productivity',
        plans: [
            { name: 'Unlimited', price: 7.00 },
            { name: 'Business', price: 12.00 }
        ]
    },
];
