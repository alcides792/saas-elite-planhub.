import LegalLayout from '@/components/legal-layout';

export const metadata = {
    title: 'Cookie Policy | Kovr',
};

export default function CookiePolicy() {
    return (
        <LegalLayout title="Cookie Policy">
            <h2>1. What Are Cookies</h2>
            <p>
                Cookies are small pieces of text sent by your web browser by a website you visit.
                A cookie file is stored in your web browser and allows the Service or a third-party
                to recognize you and make your next visit easier and the Service more useful to you.
            </p>

            <h2>2. How We Use Cookies</h2>
            <p>
                When you use and access the Service, we may place a number of cookies files in your web browser.
                We use cookies for the following purposes:
            </p>
            <ul>
                <li><strong>Essential Cookies:</strong> We use cookies to remember information that changes the way the Service behaves or looks, such as a user&apos;s language preference.</li>
                <li><strong>Account Cookies:</strong> We use cookies to authenticate users and prevent fraudulent use of user accounts.</li>
                <li><strong>Security Cookies:</strong> We use security cookies to authenticate users, prevent fraudulent use of login credentials, and protect user data from unauthorized parties.</li>
            </ul>

            <h2>3. Third-Party Cookies</h2>
            <p>
                In addition to our own cookies, we may also use various third-party cookies to report
                usage statistics of the Service, deliver advertisements on and through the Service, and so on.
            </p>

            <h2>4. Your Choices Regarding Cookies</h2>
            <p>
                If you&apos;d like to delete cookies or instruct your web browser to delete or refuse cookies,
                please visit the help pages of your web browser. Please note, however, that if you delete
                cookies or refuse to accept them, you might not be able to use all of the features we offer,
                you may not be able to store your preferences, and some of our pages might not display properly.
            </p>

            <h2>5. More Information</h2>
            <p>
                You can learn more about cookies at the following third-party websites:
                <strong>AllAboutCookies.org</strong>
            </p>
        </LegalLayout>
    );
}
