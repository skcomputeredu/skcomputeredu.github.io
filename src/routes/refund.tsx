import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/legal-links";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund & Cancellation Policy · SK Computer and Education Center" },
      { name: "description", content: "Refund and Cancellation Policy of SK Computer and Education Center. Failed or duplicate payments are refunded in 5 to 7 working days." },
    ],
  }),
  component: RefundPage,
});

export function RefundPolicyBody() {
  return (
    <>
      <p className="font-semibold text-navy">SK Computer and Education Center</p>
      <p>Last Updated: November 1, 2026</p>
      <p>At SK Computer and Education Center, we strive to maintain complete transparency in our fee structure, admissions, and online payment processes. Please read our Refund and Cancellation Policy carefully before making any online payment on our website.</p>
      <h2 className="pt-2 font-semibold text-navy">1. Online Registration / Admission Fee (₹500)</h2>
      <ul className="list-disc space-y-1 pl-4">
        <li>The Online Registration / Admission Fee of ₹500 paid to book a seat or initiate admission is strictly non-refundable and non-transferable.</li>
        <li>Once a student registers online, administrative resources and seat allocation are processed immediately, making the registration fee ineligible for refund under any personal circumstances.</li>
      </ul>
      <h2 className="pt-2 font-semibold text-navy">2. Course and Tuition Fees</h2>
      <ul className="list-disc space-y-1 pl-4">
        <li>Course fees, diploma fees, and examination fees once paid at the center or online are non-refundable and cannot be transferred to another student or adjusted against another course once classes have commenced.</li>
        <li>If a student voluntarily discontinues or drops out of a course midway, no partial or full refund of the paid fee will be provided.</li>
      </ul>
      <h2 className="pt-2 font-semibold text-navy">3. Cancellation by Student</h2>
      <p>If a student wishes to cancel their admission prior to the commencement of the batch, the ₹500 registration fee will be forfeited. Any additional advance tuition fee paid (if applicable) may be considered for refund only upon written application submitted at least 7 days before batch start, subject to management approval and deduction of administrative charges.</p>
      <h2 className="pt-2 font-semibold text-navy">4. Failed, Duplicate, or Erroneous Online Transactions</h2>
      <ul className="list-disc space-y-1 pl-4">
        <li>In the event that an amount is deducted from your bank account, credit/debit card, or UPI wallet due to a technical glitch, network failure, or server error, and the transaction fails on our system, the deducted amount will be automatically refunded to your original payment source.</li>
        <li>If a student accidentally makes a duplicate payment for the same registration or fee, the excess amount will be refunded after verification of bank settlement records.</li>
        <li>Refund Timeline: Approved refunds for failed or duplicate transactions are processed within 5 to 7 working days, subject to standard banking and payment gateway processing timelines.</li>
      </ul>
      <h2 className="pt-2 font-semibold text-navy">5. Course or Batch Cancellation by the Institute</h2>
      <ul className="list-disc space-y-1 pl-4">
        <li>In the rare event that SK Computer and Education Center cancels or postpones a scheduled batch or course indefinitely prior to commencement due to unavoidable administrative reasons, enrolled students will be eligible for a 100% refund of all fees paid (including the registration fee).</li>
        <li>Such refunds will be credited back to the student's original payment method or bank account within 7 to 10 working days.</li>
      </ul>
      <h2 className="pt-2 font-semibold text-navy">6. How to Request a Refund (For Technical / Duplicate Payments)</h2>
      <p>To report a failed or duplicate transaction, please contact our administrative support team within 48 hours of the transaction with the following details:</p>
      <ul className="list-disc space-y-1 pl-4">
        <li>Student's Full Name and Registered Mobile Number</li>
        <li>Transaction ID / UTR Reference Number</li>
        <li>Date and Amount of Payment (along with payment screenshot)</li>
      </ul>
      <h2 className="pt-2 font-semibold text-navy">7. Contact Information</h2>
      <div className="leading-5">
        <p>Institute Name: SK Computer and Education Centre</p>
        <p>Address: Defence Colony, Air Force Gate, Izzatnagar, Bareilly, Uttar Pradesh - 243122</p>
        <p>Phone / WhatsApp: +91 8410932860</p>
        <p>Email: skcomputerbly@gmail.com</p>
      </div>
    </>
  );
}

function RefundPage() {
  return (
    <PolicyPage title="Refund & Cancellation Policy">
      <RefundPolicyBody />
    </PolicyPage>
  );
}
