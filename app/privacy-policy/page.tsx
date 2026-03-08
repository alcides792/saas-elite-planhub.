import LegalLayout from '@/components/legal-layout';

export const metadata = {
    title: 'Privacy Policy | Kovr',
};

export default function PrivacyPolicy() {
    return (
        <LegalLayout title="Privacy Policy">
            <h2>1. Introduction</h2>
            <p>
                At Kovr, we respect your privacy and are committed to protecting your personal data.
                This privacy policy will inform you as to how we look after your personal data when you visit
                our website (regardless of where you visit it from) and tell you about your privacy rights
                and how the law protects you.
            </p>

            <h2>2. Data Collection</h2>
            <p>
                We may collect, use, store and transfer different kinds of personal data about you which
                we have grouped together as follows:
            </p>
            <ul>
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                <li><strong>Financial Data:</strong> includes bank account and payment card details (processed via secure providers).</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
            </ul>

            <h2>3. How We Use Your Data</h2>
            <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use
                your personal data in the following circumstances:
            </p>
            <p>
                Where we need to perform the contract we are about to enter into or have entered into with you.
                Where it is necessary for our legitimate interests (or those of a third party) and your interests
                and fundamental rights do not override those interests.
            </p>

            <h2>4. Data Security</h2>
            <p>
                We have put in place appropriate security measures to prevent your personal data from being
                accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition,
                we limit access to your personal data to those employees, agents, contractors and other third
                parties who have a business need to know.
            </p>

            <h2>5. Your Legal Rights</h2>
            <p>
                Under certain circumstances, you have rights under data protection laws in relation to your
                personal data, including the right to request access, correction, erasure, restriction,
                transfer, to object to processing, to portability of data and (where the lawful ground
                of processing is consent) to withdraw consent.
            </p>

            <h2>6. Contact Us</h2>
            <p>
                If you have any questions about this privacy policy or our privacy practices, please contact
                our data privacy manager at: <strong>privacy@planhub.io</strong>
            </p>
        </LegalLayout>
    );
}
