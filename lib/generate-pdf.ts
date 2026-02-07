import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function generatePdfBuffer(htmlContent: string): Promise<Buffer> {
    let browser;

    try {
        const isLocal = process.env.NODE_ENV === 'development';

        // Configurações base
        let options = {};

        if (isLocal) {
            // Local: Usa o puppeteer full instalado como devDependency
            try {
                // @ts-ignore
                const puppeteerLocal = await import('puppeteer');
                options = {
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                    executablePath: puppeteerLocal.default.executablePath(),
                    headless: true,
                };
            } catch (e) {
                console.warn('Puppeteer full não encontrado localmente. Tentando puppeteer-core.');
                options = {
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                    // Se estiver no Linux/Windows, pode tentar achar o Chrome
                    // Mas o ideal é ter o puppeteer instalado
                    headless: true,
                };
            }
        } else {
            // Produção (Vercel): Usa puppeteer-core + chromium binário

            // Nota: chromium.font() e chromium.defaultViewport não estão mais disponíveis no @sparticuz/chromium v143+
            // O pacote já inclui "Open Sans". 

            options = {
                args: (chromium as any).args,
                defaultViewport: { width: 1280, height: 720 },
                executablePath: await chromium.executablePath(),
                headless: (chromium as any).headless,
                ignoreHTTPSErrors: true,
            };
        }

        browser = await puppeteer.launch(options);

        const page = await browser.newPage();

        // Define o conteúdo e espera carregar
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0',
        });

        // Gera o PDF
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
