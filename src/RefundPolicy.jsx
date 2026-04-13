import React from "react";
import LegalLayout from "./LegalLayout";

const Section = ({ num, title, body, lead, items, table, note }) => (
  <div style={{ marginBottom: 40 }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 14 }}>
      <span style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, color: "#ff4b00", opacity: .7, minWidth: 28, paddingTop: 3 }}>{num}</span>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#111", lineHeight: 1.2 }}>{title}</h2>
    </div>
    <div style={{ paddingLeft: 48 }}>
      {lead && <p style={{ fontSize: 15, color: "#444", lineHeight: 1.75, marginBottom: 14 }}>{lead}</p>}
      {body && <p style={{ fontSize: 15, color: "#444", lineHeight: 1.75, marginBottom: note ? 16 : 0 }}>{body}</p>}
      {items && (
        <ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: note ? 16 : 0 }}>
          {items.map((item, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 15, color: "#444", lineHeight: 1.7 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff4b00", flexShrink: 0, marginTop: 8 }} />
              {item}
            </li>
          ))}
        </ul>
      )}
      {table && (
        <div style={{ border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 12, overflow: "hidden", marginBottom: note ? 16 : 0 }}>
          {table.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", borderBottom: i < table.length - 1 ? "0.5px solid rgba(0,0,0,0.08)" : "none", background: i % 2 === 0 ? "#fff" : "#fdf8f0" }}>
              <div style={{ padding: "14px 18px", fontSize: 13, fontWeight: 700, color: "#333", borderRight: "0.5px solid rgba(0,0,0,0.08)" }}>{row[0]}</div>
              <div style={{ padding: "14px 18px", fontSize: 13, color: "#555", lineHeight: 1.6 }}>{row[1]}</div>
            </div>
          ))}
        </div>
      )}
      {note && (
        <div style={{ background: "#fff8f5", border: "0.5px solid rgba(255,75,0,0.15)", borderRadius: 10, padding: "14px 18px", fontSize: 13, color: "#666", lineHeight: 1.7 }}>
          {note}
        </div>
      )}
    </div>
  </div>
);

export default function RefundPolicy() {
  return (
    <LegalLayout
      title="Refund & Cancellation Policy"
      subtitle="Our commitment to fair, transparent refunds and cancellations."
      updated="April 13, 2026"
    >
      <Section
        num="01"
        title="Refund Eligibility"
        lead="A refund may be considered under the following circumstances:"
        items={[
          "Verified technical failures that prevented you from accessing or using the Service.",
          "The Service demonstrably did not function as described on our platform.",
          "Confirmed accidental duplicate payments for the same plan.",
          "Billing errors attributable to Fluent Fox.",
        ]}
      />
      <Section
        num="02"
        title="Refund Window"
        lead="All refund requests must be submitted within 7 days of the original purchase date. Requests beyond this window will generally not be considered, except in cases of documented technical failures."
        table={[
          ["Within 24 hours (no usage)", "Full refund applicable"],
          ["Day 1 to Day 3", "Partial refund — minimum 50% of purchase value"],
          ["Day 4 to Day 7", "Reviewed case-by-case — typically 25–50% of purchase value"],
          ["After 7 days", "Not available, except for verified technical issues on our end"],
        ]}
      />
      <Section
        num="03"
        title="Non-Refundable Situations"
        lead="We are unable to process refunds in the following cases:"
        items={[
          "Change of mind after the Service has been accessed or used.",
          "Failure to achieve a specific interview outcome or employment result.",
          "Misunderstanding of Service features or incorrect usage by the user.",
          "Connectivity or internet issues on the user's end.",
          "Device or hardware incompatibility issues that were disclosed in our system requirements.",
          "Violation of our Terms and Conditions.",
        ]}
      />
      <Section
        num="04"
        title="Usage-Based Partial Refunds"
        body="Where a partial refund is applicable, the refund amount will be calculated by deducting charges for the time and sessions consumed, based on the per-minute and per-session rate of your purchased plan. The minimum refund amount in any eligible case shall not be less than 25% of the original purchase price."
        note="GST paid at checkout is non-refundable."
      />

      {/* How to Request — numbered list */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 14 }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, color: "#ff4b00", opacity: .7, minWidth: 28, paddingTop: 3 }}>05</span>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#111" }}>How to Request a Refund</h2>
        </div>
        <div style={{ paddingLeft: 48 }}>
          <ol style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              'Email us at rahul@fluentfox.in with the subject line: "Refund Request".',
              "Include your registered email address, purchase date, transaction ID, and a clear reason for the request.",
              "Attach any supporting documentation that may assist in our review.",
              "Our team will evaluate your request and respond within 2–3 business days.",
              "If approved, refunds will be processed within 5–7 business days.",
            ].map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, fontSize: 15, color: "#444", lineHeight: 1.7 }}>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, color: "#ff4b00", minWidth: 22, paddingTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <Section
        num="06"
        title="Refund Methods"
        items={[
          "Refunds are returned to the original payment method used at checkout.",
          "Bank transfers may take 5–7 business days to reflect in your account.",
          "Credit or debit card refunds typically appear within 3–5 business days.",
          "Digital wallet refunds are generally processed within 1 business day.",
        ]}
      />

      {/* Cancellation */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 14 }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, color: "#ff4b00", opacity: .7, minWidth: 28, paddingTop: 3 }}>07</span>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#111" }}>Cancellation Policy</h2>
        </div>
        <div style={{ paddingLeft: 48, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "18px 20px" }}>
            <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "#ff4b00", marginBottom: 8 }}>Cancellation of Access</p>
            <p style={{ fontSize: 15, color: "#444", lineHeight: 1.75 }}>You may cancel your plan at any time. Cancellation takes effect immediately and no further charges will be applied. Any unused credits or time remaining in your plan will continue to be available until fully consumed.</p>
          </div>
          <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "18px 20px" }}>
            <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "#ff4b00", marginBottom: 8 }}>Account Deletion</p>
            <p style={{ fontSize: 15, color: "#444", lineHeight: 1.75 }}>If you wish to permanently close your account, you may request complete deletion of your data. All information associated with your account will be removed within 30 days of the request. This action is irreversible.</p>
          </div>
        </div>
      </div>

      <Section
        num="08"
        title="Dispute Resolution"
        lead="If you are dissatisfied with the outcome of your refund request, you may:"
        items={[
          "Escalate the matter to our team by emailing rahul@fluentfox.in.",
          "Raise a dispute through your bank or payment provider.",
          "Approach the appropriate consumer protection authority.",
        ]}
      />
      <Section
        num="09"
        title="Free Plan Users"
        body="Since our free tier does not involve a financial transaction, refunds are not applicable. However, if you experience any technical issues while on the free plan, please contact us and we will do our best to resolve them or offer additional free credits where appropriate."
      />
      <Section
        num="10"
        title="Policy Updates"
        body="Fluent Fox reserves the right to revise this Refund & Cancellation Policy at any time. Updates will be communicated via email and reflected on our website. Continued use of the Service following any changes constitutes your acceptance of the revised policy."
      />

      {/* Contact */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 14 }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, color: "#ff4b00", opacity: .7, minWidth: 28, paddingTop: 3 }}>11</span>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#111" }}>Contact Information</h2>
        </div>
        <div style={{ paddingLeft: 48 }}>
          <div style={{ background: "#fff8f5", border: "0.5px solid rgba(255,75,0,0.15)", borderRadius: 12, padding: "20px 24px" }}>
            <p style={{ fontSize: 15, color: "#111", fontWeight: 600 }}>Email: <a href="mailto:rahul@fluentfox.in" style={{ color: "#ff4b00", textDecoration: "none" }}>rahul@fluentfox.in</a></p>
            <p style={{ fontSize: 13, color: "#777", marginTop: 8 }}>Use subject line: "Refund Request" or "Cancellation Request"</p>
            <p style={{ fontSize: 13, color: "#777", marginTop: 4 }}>Response time: 24–48 hours · Support hours: Mon–Fri, 9:00 AM–6:00 PM IST</p>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
}