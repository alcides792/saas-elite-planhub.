import LegalLayout from '@/components/legal-layout';

export const metadata = {
    title: 'Terms of Service | Kovr',
};

export default function TermsOfService() {
    return (
        <LegalLayout title="Terms of Service">
            <h2>1. Agreement to Terms</h2>
            <p>
                By accessing or using the Kovr platform, you agree to be bound by these Terms of Service.
                If you disagree with any part of the terms, then you may not access the Service.
            </p>

            <h2>2. Use License</h2>
            <p>
                Permission is granted to temporarily download one copy of the materials (information or software)
                on Kovr website for personal, non-commercial transitory viewing only. This is the grant
                of a license, not a transfer of title.
            </p>

            <h2>3. Disclaimer</h2>
            <p>
                The materials on Kovr website are provided on an &apos;as is&apos; basis. Kovr makes
                no warranties, expressed or implied, and hereby disclaims and negates all other warranties
                including, without limitation, implied warranties or conditions of merchantability, fitness
                for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2>4. Limitations</h2>
            <p>
                In no event shall Kovr or its suppliers be liable for any damages (including, without
                limitation, damages for loss of data or profit, or due to business interruption) arising
                out of the use or inability to use the materials on Kovr website, even if Kovr
                or an authorized representative has been notified orally or in writing of the possibility
                of such damage.
            </p>

            <h2>5. Governing Law</h2>
            <p>
                These terms and conditions are governed by and construed in accordance with the laws of
                your jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts
                in that State or location.
            </p>

            <h2>6. Changes to Terms</h2>
            <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                By continuing to access or use our Service after those revisions become effective, you
                agree to be bound by the revised terms.
            </p>
        </LegalLayout>
    );
}
