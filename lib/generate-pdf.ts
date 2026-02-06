import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function generatePdfBuffer(htmlContent: string): Promise<Buffer> {
    let browser;

    try {
        // Configuração Híbrida (Funciona Local e Vercel)
        const isLocal = process.env.NODE_ENV === 'development';

        if (isLocal) {
            // Local: Usa o puppeteer normal
            const puppeteerLocal = await import('puppeteer');
            browser = await puppeteerLocal.default.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                headless: true,
            });
        } else {
            // Vercel: Usa o Chromium otimizado
            browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: { width: 1280, height: 720 },
                executablePath: await chromium.executablePath(),
                headless: true,
            });
        }

        const page = await browser.newPage();

        // Carrega o HTML na página virtual
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0', // Espera carregar tudo (imagens, fontes)
        });

        // Gera o PDF (A4, com background impresso)
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
        });

        return Buffer.from(pdfBuffer);

    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
