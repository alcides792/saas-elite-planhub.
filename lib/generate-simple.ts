import PDFDocument from 'pdfkit';
import { format } from 'date-fns';

export interface Subscription {
    name: string;
    category: string | null;
    amount: number;
    currency: string;
    renewal_date: string | null;
    billing_type?: string;
    billing_cycle?: string;
}

/**
 * Generates a simple PDF using PDFKit (lightweight, no browser).
 */
export async function generateSimplePDF(data: Subscription[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const chunks: Buffer[] = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Header
            doc.fontSize(24)
                .fillColor('#7c3aed')
                .text('Kovr Report', { align: 'center' });

            doc.moveDown(0.5);
            doc.fontSize(10)
                .fillColor('#6b7280')
                .text(`Date: ${format(new Date(), 'MM/dd/yyyy')}`, { align: 'center' });

            doc.moveDown(2);

            // Lista de assinaturas
            doc.fontSize(12).fillColor('#111827');

            if (data.length === 0) {
                doc.text('No subscriptions found.', { align: 'center' });
            } else {
                data.forEach((sub, index) => {
                    const price = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: sub.currency || 'USD',
                    }).format(sub.amount || 0);

                    const renewalDate = sub.renewal_date
                        ? format(new Date(sub.renewal_date), 'MM/dd/yyyy')
                        : 'No date';

                    const category = sub.category || 'No category';

                    // Desenha cada linha
                    doc.fontSize(11)
                        .fillColor('#111827')
                        .text(`${index + 1}. [${sub.name}]`, { continued: true })
                        .fillColor('#6b7280')
                        .text(` - ${category}`, { continued: true });

                    doc.moveDown(0.3);
                    doc.fontSize(10)
                        .fillColor('#7c3aed')
                        .text(`   ${price}`, { continued: true })
                        .fillColor('#6b7280')
                        .text(` • Due: ${renewalDate}`);

                    doc.moveDown(0.8);
                });
            }

            // Footer
            doc.moveDown(2);
            doc.fontSize(8)
                .fillColor('#9ca3af')
                .text('Report generated automatically via Kovr • kovr.space', {
                    align: 'center',
                });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Generates a simple CSV using pure string manipulation.
 */
export function generateSimpleCSV(data: Subscription[]): Buffer {
    const header = 'Name,Category,Price,Currency,Due Date\n';

    const rows = data
        .map((sub) => {
            const name = `"${sub.name.replace(/"/g, '""')}"`;
            const category = sub.category ? `"${sub.category.replace(/"/g, '""')}"` : 'No category';
            const price = (sub.amount || 0).toFixed(2);
            const currency = sub.currency || 'USD';
            const renewalDate = sub.renewal_date
                ? format(new Date(sub.renewal_date), 'MM/dd/yyyy')
                : 'No date';

            return `${name},${category},${price},${currency},${renewalDate}`;
        })
        .join('\n');

    const csvContent = header + rows;
    return Buffer.from(csvContent, 'utf-8');
}
