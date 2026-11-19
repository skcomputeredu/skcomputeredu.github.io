import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/legal-links";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy · SK Computer and Education Center" },
      { name: "description", content: "Privacy Policy of SK Computer and Education Center, Bareilly. Last updated November 1, 2026." },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <PolicyPage title="Privacy Policy">
      <p className="font-semibold text-navy">SK Computer and Education Center</p>
      <p>Last Updated: November 1, 2026</p>
      <p>At SK Computer and Education Center, we value your trust and are committed to protecting your personal privacy. This Privacy Policy outlines how we collect, use, store, and safeguard your personal information when you visit our website, enroll in our programs, or make online payments.</p>
      <h2 className="pt-2 font-semibold text-navy">1. Information We Collect</h2>
      <p>When you interact with our website or register for our courses, we may collect the following types of information:</p>
      <ul className="list-disc space-y-1 pl-4">
        <li>Personal Identification Information: Full name, father's/mother's name, date of birth, gender, photograph, and government-issued ID details (for certification and registration purposes).</li>
        <li>Contact Information: Mobile number, email address, and residential address.</li>
        <li>Academic Information: Educational qualifications and previous academic records required for course eligibility.</li>
        <li>Payment Information: Transaction ID, payment mode, payment status, and billing details. We do not collect or store sensitive financial details such as Credit/Debit Card numbers, CVV, UPI PIN, or Net Banking passwords on our servers.</li>
        <li>Technical Data: IP address, browser type, device information, and cookies to improve website performance and user experience.</li>
      </ul>
      <h2 className="pt-2 font-semibold text-navy">2. How We Use Your Information</h2>
      <p>We use the collected information strictly for legitimate educational and administrative purposes, including:</p>
      <ul className="list-disc space-y-1 pl-4">
        <li>Processing course admissions, registrations, and student enrollments.</li>
        <li>Issuing fee receipts, admit cards, mark sheets, and course completion certificates.</li>
        <li>Processing online fee payments securely through our integrated payment gateway partners.</li>
        <li>Sending important academic updates, class schedules, exam notifications, and fee reminders via SMS, WhatsApp, phone calls, or email.</li>
        <li>Complying with legal, regulatory, and educational board/university requirements.</li>
      </ul>
      <h2 className="pt-2 font-semibold text-navy">3. Payment Security and Third-Party Gateways</h2>
      <ul className="list-disc space-y-1 pl-4">
        <li>All online transactions on our platform are processed through RBI-authorized, PCI-DSS compliant third-party payment gateways.</li>
        <li>Your payment details are encrypted using industry-standard SSL (Secure Socket Layer) technology during transmission.</li>
        <li>By making a payment, you also agree to the privacy policies and terms of the respective payment gateway provider.</li>
      </ul>
      <h2 className="pt-2 font-semibold text-navy">4. Sharing and Disclosure of Information</h2>
      <p>SK Computer and Education Center does not sell, rent, or trade your personal information to third parties for marketing purposes. We may share your information only in the following circumstances:</p>
      <ul className="list-disc space-y-1 pl-4">
        <li>Educational & Certification Bodies: With authorized universities, skill councils, or examination boards for student registration and certificate generation.</li>
        <li>Service Providers: With trusted payment gateway partners and IT service providers strictly to facilitate fee collection and website operations.</li>
        <li>Legal Compliance: When required by law, court order, or government authorities to comply with legal obligations.</li>
      </ul>
      <h2 className="pt-2 font-semibold text-navy">5. Data Retention and Security</h2>
      <ul className="list-disc space-y-1 pl-4">
        <li>We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</li>
        <li>Student records are retained for as long as necessary to fulfill educational, certification, and legal compliance requirements.</li>
      </ul>
      <h2 className="pt-2 font-semibold text-navy">6. Your Rights and Choices</h2>
      <ul className="list-disc space-y-1 pl-4">
        <li>Request access to the personal information we hold about you.</li>
        <li>Request corrections or updates to any inaccurate or incomplete personal data.</li>
        <li>Opt-out of promotional messages by contacting our administrative office.</li>
      </ul>
      <h2 className="pt-2 font-semibold text-navy">7. Changes to This Privacy Policy</h2>
      <p>SK Computer and Education Center reserves the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page with an updated “Last Updated” date.</p>
      <h2 className="pt-2 font-semibold text-navy">8. Contact Us</h2>
      <div className="leading-5">
        <p>Institute Name: SK Computer and Education Centre</p>
        <p>Address: Defence Colony, Air Force Gate, Izzatnagar, Bareilly, Uttar Pradesh - 243122</p>
        <p>Phone / WhatsApp: +91 8410932860</p>
        <p>Email: skcomputerbly@gmail.com</p>
      </div>
    </PolicyPage>
  );
}
