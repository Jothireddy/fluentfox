import React from "react";
import LegalLayout from "./LegalLayout";

const Section = ({ num, title, body, lead, items, note }) => (
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
      {note && (
        <div style={{ background: "#fff8f5", border: "0.5px solid rgba(255,75,0,0.15)", borderRadius: 10, padding: "14px 18px", fontSize: 13, color: "#666", lineHeight: 1.7 }}>
          {note}
        </div>
      )}
    </div>
  </div>
);

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your personal information."
      updated="April 13, 2026"
    >
      <Section
        num="01"
        title="Introduction"
        body="At Fluent Fox, we take your privacy seriously. This Privacy Policy describes how we gather, process, and protect your personal information when you use our AI-powered interview assistance platform. By using our Service, you agree to the data practices described in this document."
      />
      <Section
        num="02"
        title="Information We Collect"
        lead="Personal Information:"
        items={[
          "Your name and email address, collected during account registration.",
          "Payment information required to process subscription purchases.",
          "Resume content, when voluntarily uploaded for AI-assisted optimisation.",
          "Transcripts and recordings generated during interview sessions.",
          "Screen capture data processed during active sessions.",
          "Logs of AI interactions and usage analytics.",
          "Technical identifiers including IP address, browser type, and device information.",
        ]}
      />
      <Section
        num="03"
        title="How We Use Your Information"
        items={[
          "To deliver real-time AI assistance and generate intelligent, personalised interview responses.",
          "To continuously improve the quality and accuracy of our AI models.",
          "To process payments and administer your subscription or account.",
          "To respond to support inquiries and provide customer assistance.",
          "To communicate important service updates, announcements, and notifications.",
        ]}
      />
      <Section
        num="04"
        title="Data Security"
        body="We adopt industry-standard security practices to protect your personal information. All data is encrypted both during transmission and while stored on our systems. Access to your data is restricted to authorised personnel who require it strictly to deliver our services."
        note="No method of transmission or electronic storage over the internet is completely infallible, and we cannot make an absolute guarantee of security."
      />
      <Section
        num="05"
        title="User Responsibility & Ethical Use"
        lead="Fluent Fox is developed as an interview preparation and support tool. While we facilitate AI-powered assistance, we strongly encourage users to exercise personal judgment and ethical conduct during any interview process."
        items={[
          "Users bear sole responsibility for how they choose to use our platform in any interview setting.",
          "We encourage transparent and honest participation in all professional interactions.",
          "Users must comply with the expectations and codes of conduct of any prospective employer.",
          "Any consequences — professional, ethical, or otherwise — resulting from the use of Fluent Fox during interviews are the user's own responsibility.",
        ]}
        note="Disclaimer: Fluent Fox is not liable for any consequences, disputes, or ethical concerns arising from a user's decision to use our platform during a live interview."
      />
      <Section
        num="06"
        title="Data Retention"
        body="Personal information is retained only for as long as it is necessary to provide the Service and fulfil applicable legal obligations. Interview session data is typically stored for a period of 90 days, after which it is deleted, unless you request earlier removal. You may request deletion of your account and associated data at any time by contacting us at rahul@fluentfox.in."
      />
      <Section
        num="07"
        title="Third-Party Services"
        body="To deliver intelligent responses, Fluent Fox integrates with third-party AI and technology providers. These services operate under their own privacy policies and data handling practices, which we encourage you to review independently. We do not sell, rent, or otherwise transfer your personal data to third parties for marketing or commercial purposes."
      />
      <Section
        num="08"
        title="Your Rights"
        lead="As a user of our platform, you have the following rights regarding your personal data:"
        items={[
          "The right to access the personal information we hold about you.",
          "The right to request correction of any inaccurate or incomplete data.",
          "The right to request deletion of your personal information.",
          "The right to object to the processing of your data.",
          "The right to export your data in a portable format.",
        ]}
      />
      <Section
        num="09"
        title="Changes to This Policy"
        body='We may update this Privacy Policy periodically. Any material changes will be communicated by updating the "Last updated" date on this page. Your continued use of the Service following such changes will constitute your acceptance of the revised policy.'
      />

      {/* Contact box */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 14 }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, color: "#ff4b00", opacity: .7, minWidth: 28, paddingTop: 3 }}>10</span>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#111" }}>Contact & Governing Law</h2>
        </div>
        <div style={{ paddingLeft: 48 }}>
          <p style={{ fontSize: 15, color: "#444", lineHeight: 1.75, marginBottom: 16 }}>
            This Privacy Policy is governed by the laws of India. Any disputes arising from this policy shall be subject to the exclusive jurisdiction of the competent courts of India.
          </p>
          <div style={{ background: "#fff8f5", border: "0.5px solid rgba(255,75,0,0.15)", borderRadius: 12, padding: "20px 24px" }}>
            <p style={{ fontSize: 15, color: "#111", fontWeight: 600 }}>Email: <a href="mailto:rahul@fluentfox.in" style={{ color: "#ff4b00", textDecoration: "none" }}>rahul@fluentfox.in</a></p>
            <p style={{ fontSize: 15, color: "#111", fontWeight: 600, marginTop: 6 }}>Website: <a href="https://fluentfox.in" style={{ color: "#ff4b00", textDecoration: "none" }}>fluentfox.in</a></p>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
}