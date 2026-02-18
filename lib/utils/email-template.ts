/**
 * Generates the professional HTML template for subscription expiration alerts.
 * Optimized for Dark Mode and compatibility with Gmail/Outlook.
 */
export function getExpiringEmailHtml(
    userName: string,
    subscriptionName: string,
    renewUrl: string,
    deleteUrl: string,
    serviceWebsite: string | null
) {
    const domain = serviceWebsite
        ? serviceWebsite.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
        : null;

    const logoUrl = domain
        ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
        : 'https://cdn-icons-png.flaticon.com/512/10692/10692556.png';

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>KOVR Expiration Alert</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505;">
            <tr>
                <td align="center" style="padding: 40px 10px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0A0A0A; border: 1px solid #1A1A1A; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                        <!-- Header / Logo -->
                        <tr>
                            <td align="center" style="padding: 48px 40px 24px;">
                                <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1.5px; color: #7c3aed; text-transform: uppercase;">
                                    KOVR<span style="color: #ffffff;">.</span>
                                </h1>
                                <div style="margin-top: 8px; font-size: 12px; color: #4B5563; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">
                                    Smart Alerts
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 0 40px 48px;">
                                <div style="text-align: center; margin-bottom: 32px;">
                                    <h2 style="margin: 0 0 12px; font-size: 24px; font-weight: 700; color: #ffffff;">Hello, ${userName}!</h2>
                                    <p style="margin: 0; font-size: 16px; color: #9CA3AF; line-height: 1.6;">
                                        Identified that one of your subscriptions expires today. Keep your financial control up to date.
                                    </p>
                                </div>
                                
                                <!-- Highlight Box (The Subscription Card) -->
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #111111; border: 1px solid #1A1A1A; border-radius: 24px; margin-bottom: 40px;">
                                    <tr>
                                        <td align="center" style="padding: 32px;">
                                            <!-- Service Logo -->
                                            <div style="margin-bottom: 16px;">
                                                <img src="${logoUrl}" alt="${subscriptionName}" width="64" height="64" style="border-radius: 16px; background-color: #000; border: 1px solid #222;" />
                                            </div>
                                            
                                            <div style="font-size: 11px; font-weight: 800; color: #7c3aed; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 12px; opacity: 0.8;">
                                                Subscription expiring
                                            </div>
                                            <div style="font-size: 36px; font-weight: 900; color: #ffffff; letter-spacing: -1px; margin-bottom: 4px;">
                                                ${subscriptionName}
                                            </div>
                                            <div style="font-size: 14px; color: #6b7280; font-weight: 500;">
                                                Due: Today
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Buttons / Actions -->
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center">
                                            <a href="${renewUrl}" style="display: block; background-color: #7c3aed; color: #ffffff; padding: 20px 40px; border-radius: 18px; font-size: 16px; font-weight: 700; text-decoration: none; text-align: center;">
                                                Yes, keep active (Renew)
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding-top: 24px;">
                                            <a href="${deleteUrl}" style="display: inline-block; color: #4B5563; font-size: 14px; font-weight: 600; text-decoration: none; border-bottom: 1px solid #1A1A1A; padding-bottom: 2px;">
                                                No, I've already canceled this service
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                        <!-- Footer Area -->
                        <tr>
                            <td align="center" style="background-color: #0c0c0c; padding: 32px 40px; border-top: 1px solid #1A1A1A;">
                                <p style="margin: 0; font-size: 12px; color: #374151; line-height: 1.8;">
                                    This is an automatic alert generated by the KOVR system.<br>
                                    Do not reply to this email.
                                </p>
                                <div style="margin-top: 16px; font-size: 11px; color: #1f2937;">
                                    © 2024 KOVR SaaS. All rights reserved.
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `
}
