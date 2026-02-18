import * as React from 'react';

interface ExpirationEmailProps {
    userName: string;
    serviceName: string;
    amount: string;
    currency: string;
    expirationDate: string;
}

export const ExpirationEmail: React.FC<ExpirationEmailProps> = ({
    userName,
    serviceName,
    amount,
    currency,
    expirationDate,
}) => {
    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                backgroundColor: '#f5f5f5',
                margin: 0,
                padding: 0,
            }}>
                <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
                    <tr>
                        <td align="center">
                            <table width="600" cellPadding="0" cellSpacing="0" style={{
                                backgroundColor: '#ffffff',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                overflow: 'hidden',
                            }}>
                                {/* Header */}
                                <tr>
                                    <td style={{
                                        background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                                        padding: '32px',
                                        textAlign: 'center',
                                    }}>
                                        <h1 style={{
                                            color: '#ffffff',
                                            fontSize: '28px',
                                            fontWeight: 'bold',
                                            margin: 0,
                                        }}>
                                            ⚠️ Expiration Alert
                                        </h1>
                                    </td>
                                </tr>

                                {/* Body */}
                                <tr>
                                    <td style={{ padding: '40px 32px' }}>
                                        <p style={{
                                            fontSize: '16px',
                                            color: '#374151',
                                            lineHeight: '1.6',
                                            margin: '0 0 20px 0',
                                        }}>
                                            Hello <strong>{userName}</strong>,
                                        </p>

                                        <p style={{
                                            fontSize: '16px',
                                            color: '#374151',
                                            lineHeight: '1.6',
                                            margin: '0 0 20px 0',
                                        }}>
                                            Your subscription <strong style={{ color: '#a855f7' }}>{serviceName}</strong> valued at{' '}
                                            <strong style={{ color: '#a855f7' }}>{amount} {currency}</strong> expires on{' '}
                                            <strong style={{ color: '#dc2626' }}>{expirationDate}</strong>.
                                        </p>

                                        <div style={{
                                            backgroundColor: '#fef3c7',
                                            border: '1px solid #fbbf24',
                                            borderRadius: '8px',
                                            padding: '16px',
                                            margin: '24px 0',
                                        }}>
                                            <p style={{
                                                fontSize: '14px',
                                                color: '#92400e',
                                                margin: 0,
                                                lineHeight: '1.5',
                                            }}>
                                                💡 <strong>Tip:</strong> Check your balance and avoid unexpected charges.
                                            </p>
                                        </div>

                                        {/* CTA Button */}
                                        <table width="100%" cellPadding="0" cellSpacing="0" style={{ margin: '32px 0' }}>
                                            <tr>
                                                <td align="center">
                                                    <a href="https://kovr.space/dashboard" style={{
                                                        display: 'inline-block',
                                                        backgroundColor: '#a855f7',
                                                        color: '#ffffff',
                                                        fontSize: '16px',
                                                        fontWeight: 'bold',
                                                        textDecoration: 'none',
                                                        padding: '14px 32px',
                                                        borderRadius: '8px',
                                                        boxShadow: '0 4px 6px rgba(168, 85, 247, 0.3)',
                                                    }}>
                                                        Go to Dashboard
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>

                                        <p style={{
                                            fontSize: '14px',
                                            color: '#6b7280',
                                            lineHeight: '1.5',
                                            margin: '24px 0 0 0',
                                        }}>
                                            This is an automatic Kovr alert. Manage all your subscriptions in one place.
                                        </p>
                                    </td>
                                </tr>

                                {/* Footer */}
                                <tr>
                                    <td style={{
                                        backgroundColor: '#f9fafb',
                                        padding: '24px 32px',
                                        borderTop: '1px solid #e5e7eb',
                                        textAlign: 'center',
                                    }}>
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#9ca3af',
                                            margin: 0,
                                        }}>
                                            © 2024 Kovr. All rights reserved.
                                        </p>
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#9ca3af',
                                            margin: '8px 0 0 0',
                                        }}>
                                            <a href="https://kovr.space" style={{ color: '#a855f7', textDecoration: 'none' }}>
                                                kovr.space
                                            </a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    );
};

export default ExpirationEmail;
