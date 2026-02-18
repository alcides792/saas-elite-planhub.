'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/utils/supabase/client';

/**
 * Component that updates the user's online status every 30 seconds.
 * It performs an upsert on the 'online_users' table with the current timestamp.
 */
export default function OnlineStatusTracker() {
    useEffect(() => {
        const supabase = createClient();

        const updateOnlineStatus = async (userId: string) => {
            try {
                const { error } = await (supabase as any)
                    .from('online_users')
                    .upsert(
                        {
                            user_id: userId,
                            last_seen: new Date().toISOString()
                        },
                        {
                            onConflict: 'user_id'
                        }
                    );

                if (error) {
                    // Silent fail in production, but log for debugging
                    if (process.env.NODE_ENV === 'development') {
                        console.warn('Signal of Life: Error updating online status. Ensure online_users table exists.', error);
                    }
                }
            } catch (err) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('Signal of Life: Unexpected error:', err);
                }
            }
        };

        // Initial check and update
        const checkAndUpdate = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) {
                    if (process.env.NODE_ENV === 'development') {
                        console.warn('Signal of Life: getUser error', error);
                    }
                    return;
                }

                if (user) {
                    await updateOnlineStatus(user.id);
                }
            } catch (err) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('Signal of Life: Failed to fetch user info', err);
                }
            }
        };

        checkAndUpdate();

        // Set interval for every 30 seconds
        const intervalId = setInterval(checkAndUpdate, 30000);

        return () => clearInterval(intervalId);
    }, []);

    return null;
}
