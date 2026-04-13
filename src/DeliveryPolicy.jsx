import React from "react";
import LegalLayout from "./LegalLayout";

const Section = ({ num, title, body, lead, items, cards }) => (
  <div style={{ marginBottom: 40 }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 14 }}>
      <span style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, color: "#ff4b00", opacity: .7, minWidth: 28, paddingTop: 3 }}>{num}</span>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#111", lineHeight: 1.2 }}>{title}</h2>
    </div>
    <div style={{ paddingLeft: 48 }}>
      {lead && <p style={{ fontSize: 15, color: "#444", lineHeight: 1.75, marginBottom: 14 }}>{lead}</p>}
      {body && <p style={{ fontSize: 15, color: "#444", lineHeight: 1.75 }}>{body}</p>}
      {items && (
        <ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((item, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 15, color: "#444", lineHeight: 1.7 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff4b00", flexShrink: 0, marginTop: 8 }} />
              {item}
            </li>
          ))}
        </ul>
      )}
      {cards && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {cards.map((c, i) => (
            <div key={i} style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "16px 18px" }}>
              <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "#ff4b00", marginBottom: 8 }}>{c.label}</p>
              <p style={{ fontSize: 14, color: "#333", lineHeight: 1.6 }}>{c.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default function DeliveryPolicy() {
  return (
    <LegalLayout
      title="Delivery Policy"
      subtitle="FluentFox is a fully digital service. Here's how access is delivered."
      updated="April 13, 2026"
    >
      {/* Digital service callout */}
      <div style={{ background: "#fff8f5", border: "0.5px solid rgba(255,75,0,0.2)", borderRadius: 14, padding: "20px 24px", marginBottom: 40, display: "flex", alignItems: "flex-start", gap: 16 }}>
        <span style={{ fontSize: 22 }}>📦</span>
        <div>
          <p style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 6 }}>Digital Service — No Physical Shipping</p>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>Fluent Fox is an entirely digital service. No physical products are manufactured, packaged, or shipped. All features and services are delivered electronically through our web platform at fluentfox.in.</p>
        </div>
      </div>

      <Section
        num="01"
        title="How Service is Delivered"
        items={[
          "All Fluent Fox services are delivered digitally and instantly.",
          "Upon successful payment or registration, access to the Service is granted immediately through your browser.",
          "No downloads, installations, or physical deliveries are involved.",
          "Your account and all associated features are accessible at https://fluentfox.in/ at any time.",
        ]}
      />
      <Section
        num="02"
        title="Account Activation Timelines"
        cards={[
          { label: "Free Plan", value: "Activated instantly upon sign-up." },
          { label: "Paid Plans", value: "Activated immediately upon successful payment confirmation." },
          { label: "Payment Verification", value: "Typically completed within 1–2 minutes via our payment gateway." },
          { label: "Maximum Delay", value: "In rare cases, up to 15 minutes due to payment processing." },
        ]}
      />
      <Section
        num="03"
        title="Geographic Availability"
        body="Fluent Fox is accessible globally to anyone with a stable internet connection. There are no geographic restrictions on usage. The Service functions across all time zones and is compatible with any modern device and browser."
      />
      <Section
        num="04"
        title="Technical Requirements"
        lead="To access and use Fluent Fox optimally, please ensure the following:"
        items={[
          "A stable internet connection (minimum 1 Mbps recommended).",
          "A modern web browser such as Chrome, Firefox, Safari, or Microsoft Edge.",
          "Microphone access enabled for voice transcription features.",
          "Screen sharing capability enabled for AI-assisted session features.",
        ]}
      />
      <Section
        num="05"
        title="Service Availability & Interruptions"
        body="We aim to maintain 99.9% uptime for the Fluent Fox platform. In the event of planned maintenance, we will provide at least 24 hours of advance notice. Emergency maintenance may occasionally occur with limited prior notice. In the event of a significant outage, affected users will be notified via email and may be eligible for service credits."
      />
      <Section
        num="06"
        title="Data Access & Session History"
        items={[
          "Transcripts and outputs from your sessions are available immediately after each session.",
          "Your session history and resume data are accessible anytime via your account dashboard.",
          "No physical copies of any documents or outputs are generated or sent.",
        ]}
      />
      <Section
        num="07"
        title="Device Portability"
        body="Your Fluent Fox account is fully portable and not tied to a single device. Simply sign in from any internet-enabled device to access your purchased credits, session history, and all platform features."
      />
      <Section
        num="08"
        title="International Access"
        body="As a digital service, Fluent Fox involves no customs clearance, import duties, or delivery delays. Access is instantaneous regardless of your location, and pricing displayed on our platform includes all applicable taxes."
      />
      <Section
        num="09"
        title="Support for Access Issues"
        lead="If you experience any difficulties accessing the Service after payment, please:"
        items={[
          "Verify your internet connection and try refreshing the page.",
          "Clear your browser cache and cookies, then sign in again.",
          "Contact us at rahul@fluentfox.in with your registered email and a brief description of the issue.",
        ]}
      />

      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 14 }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, color: "#ff4b00", opacity: .7, minWidth: 28, paddingTop: 3 }}>10</span>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#111" }}>Contact Information</h2>
        </div>
        <div style={{ paddingLeft: 48 }}>
          <div style={{ background: "#fff8f5", border: "0.5px solid rgba(255,75,0,0.15)", borderRadius: 12, padding: "20px 24px" }}>
            <p style={{ fontSize: 15, color: "#111", fontWeight: 600 }}>Email: <a href="mailto:rahul@fluentfox.in" style={{ color: "#ff4b00", textDecoration: "none" }}>rahul@fluentfox.in</a></p>
            <p style={{ fontSize: 15, color: "#111", fontWeight: 600, marginTop: 6 }}>Website: <a href="https://fluentfox.in" style={{ color: "#ff4b00", textDecoration: "none" }}>fluentfox.in</a></p>
            <p style={{ fontSize: 13, color: "#777", marginTop: 8 }}>Support hours: Mon–Fri, 9:00 AM–6:00 PM IST · Service available 24/7</p>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
}