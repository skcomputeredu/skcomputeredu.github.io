import { createFileRoute, Link } from "@tanstack/react-router";
import { PolicyPage } from "@/components/legal-links";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions · SK Computer and Education Center" },
      { name: "description", content: "Terms and Conditions of SK Computer and Education Center, Bareilly. Last updated November 1, 2026." },
    ],
  }),
  component: TermsPage,
});

export function TermsPolicyBody() {
  return (
    <>
      <p className="font-semibold text-navy">SK Computer and Education Center</p>
      <p>Last Updated: November 1, 2026</p>
      <p>Welcome to SK Computer and Education Center. By accessing our website, enrolling in our courses, or making payments through our online payment gateway, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully before using our services.</p>
      <h2 className="pt-2 font-semibold text-navy">1. Definitions</h2>
      <ul className="list-disc space-y-1 pl-4">
        <li>“Institute,” “We,” “Us,” or “Our” refers to SK Computer and Education Centre, located at Defence Colony, Air Force Gate, Izzatnagar, Bareilly, Uttar Pradesh - 243122.</li>
        <li>“Student,” “User,” or “You” refers to any individual or entity accessing our website, enrolling in a course, or utilizing our educational services.</li>
      </ul>
      <h2 className="pt-2 font-semibold text-navy">2. Courses and Educational Services</h2>
      <ul className="list-disc space-y-1 pl-4">
        <li>SK Computer and Education Center offers computer education, skill development training, diploma programs, and certification courses (both online and offline).</li>
        <li>The institute reserves the right to modify, update, or discontinue any course syllabus, batch timing, faculty, or fee structure at its sole discretion without prior notice.</li>
      </ul>
      <h2 className="pt-2 font-semibold text-navy">3. Admission and Registration</h2>
      <ul className="list-disc space-y-1 pl-4">
        <li>Students must provide accurate, current, and complete personal and academic information during the registration process.</li>
        <li>Submission of false documents or misleading information may lead to immediate cancellation of admission without any fee refund.</li>
        <li>Admission is confirmed only after the verification of required documents and successful receipt of the prescribed registration or course fee.</li>
      </ul>
      <h2 className="pt-2 font-semibold text-navy">4. Fee Structure and Online Payments</h2>
      <ul className="list-disc space-y-1 pl-4">
        <li>All course fees, registration charges (including the ₹500 Online Registration / Admission Fee), and examination fees are listed in Indian Rupees (INR).</li>
        <li>Payments can be made online via our authorized third-party payment gateway (using UPI, Credit/Debit Cards, Net Banking, or Wallets) or through approved offline modes at the center.</li>
        <li>Upon successful online payment, a digital receipt will be generated. Students are advised to save this receipt for future reference.</li>
        <li>For students opting for installment plans, fees must be cleared on or before the specified due dates. Failure to pay on time may result in late payment penalties or temporary suspension from classes and examinations.</li>
      </ul>
      <h2 className="pt-2 font-semibold text-navy">5. Refund and Cancellation Summary</h2>
      <p>
        Registration fees (₹500) and course fees once paid are generally non-refundable and non-transferable, except in cases of technical transaction failures or batch cancellation by the institute. For complete details, please refer to our dedicated{" "}
        <Link to="/refund" className="font-semibold text-navy underline">Refund and Cancellation Policy</Link>.
      </p>
      <h2 className="pt-2 font-semibold text-navy">6. Student Code of Conduct</h2>
      <ul className="list-disc space-y-1 pl-4">
        <li>Students are expected to maintain strict discipline, punctuality, and decorum within the institute premises and online classes.</li>
        <li>Any form of misbehavior, harassment, damage to institute property, or violation of center rules will result in immediate disciplinary action, including termination of admission without any refund.</li>
      </ul>
      <h2 className="pt-2 font-semibold text-navy">7. Intellectual Property Rights</h2>
      <ul className="list-disc space-y-1 pl-4">
        <li>All study materials, printed notes, digital PDFs, video lectures, software tools, logos, and website content provided by SK Computer and Education Center are the exclusive intellectual property of the institute.</li>
        <li>Unauthorized copying, recording, reproduction, distribution, or commercial use of our content is strictly prohibited and may attract legal action.</li>
      </ul>
      <h2 className="pt-2 font-semibold text-navy">8. Limitation of Liability</h2>
      <p>While we strive to provide uninterrupted access to our online services and payment portals, SK Computer and Education Center shall not be liable for any direct, indirect, or incidental damages arising from payment gateway downtime, technical failures, bank server issues, or unauthorized transactions beyond our control.</p>
      <h2 className="pt-2 font-semibold text-navy">9. Governing Law and Jurisdiction</h2>
      <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these terms, fee payments, or our services shall be subject to the exclusive jurisdiction of the competent courts in Bareilly, Uttar Pradesh.</p>
      <h2 className="pt-2 font-semibold text-navy">10. Contact Information</h2>
      <div className="leading-5">
        <p>Institute Name: SK Computer and Education Centre</p>
        <p>Address: Defence Colony, Air Force Gate, Izzatnagar, Bareilly, Uttar Pradesh - 243122</p>
        <p>Phone / WhatsApp: +91 8410932860</p>
        <p>Email: skcomputerbly@gmail.com</p>
      </div>
    </>
  );
}

function TermsPage() {
  return (
    <PolicyPage title="Terms & Conditions">
      <TermsPolicyBody />
    </PolicyPage>
  );
}
