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
 * Gera um PDF simples usando PDFKit (leve, sem browser).
 */
export async function generateSimplePDF(data: Subscription[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const chunks: Buffer[] = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Cabeçalho
            doc.fontSize(24)
                .fillColor('#7c3aed')
                .text('Relatório Kovr', { align: 'center' });

            doc.moveDown(0.5);
            doc.fontSize(10)
                .fillColor('#6b7280')
                .text(`Data: ${format(new Date(), 'dd/MM/yyyy')}`, { align: 'center' });

            doc.moveDown(2);

            // Lista de assinaturas
            doc.fontSize(12).fillColor('#111827');

            if (data.length === 0) {
                doc.text('Nenhuma assinatura encontrada.', { align: 'center' });
            } else {
                data.forEach((sub, index) => {
                    const price = new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: sub.currency || 'BRL',
                    }).format(sub.amount || 0);

                    const renewalDate = sub.renewal_date
                        ? format(new Date(sub.renewal_date), 'dd/MM/yyyy')
                        : 'Sem data';

                    const category = sub.category || 'Sem categoria';

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
                        .text(` • Vence: ${renewalDate}`);

                    doc.moveDown(0.8);
                });
            }

            // Rodapé
            doc.moveDown(2);
            doc.fontSize(8)
                .fillColor('#9ca3af')
                .text('Relatório gerado automaticamente via Kovr • kovr.space', {
                    align: 'center',
                });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Gera um CSV simples usando manipulação de string pura.
 */
export function generateSimpleCSV(data: Subscription[]): Buffer {
    const header = 'Nome,Categoria,Preco,Moeda,Vencimento\n';

    const rows = data
        .map((sub) => {
            const name = `"${sub.name.replace(/"/g, '""')}"`;
            const category = sub.category ? `"${sub.category.replace(/"/g, '""')}"` : 'Sem categoria';
            const price = (sub.amount || 0).toFixed(2);
            const currency = sub.currency || 'BRL';
            const renewalDate = sub.renewal_date
                ? format(new Date(sub.renewal_date), 'dd/MM/yyyy')
                : 'Sem data';

            return `${name},${category},${price},${currency},${renewalDate}`;
        })
        .join('\n');

    const csvContent = header + rows;
    return Buffer.from(csvContent, 'utf-8');
}
