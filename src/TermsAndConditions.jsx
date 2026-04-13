import React from "react";
import LegalLayout from "./LegalLayout";

const sections = [
  {
    num: "01",
    title: "Acceptance of Terms",
    body: "By accessing or using Fluent Fox (the Service), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not accept these terms in their entirety, you must discontinue use of the Service immediately.",
  },
  {
    num: "02",
    title: "About the Service",
    body: "Fluent Fox is an AI-powered platform designed to assist users during job interviews by providing real-time guidance, transcription support, and intelligent response suggestions. The Service may also include features such as AI-generated feedback, resume tools, and interview practice sessions.",
  },
  {
    num: "03",
    title: "User Accounts",
    items: [
      "You are required to provide truthful, accurate, and complete information during account registration.",
      "You are fully responsible for safeguarding your account credentials and for all activity conducted under your account.",
      "Any suspected or confirmed unauthorised access to your account must be reported to us promptly.",
      "Each individual is permitted to maintain only one account.",
    ],
  },
  {
    num: "04",
    title: "Subscription & Pricing",
    body: "Fluent Fox offers a range of plans, including free and paid tiers. Pricing details, plan features, and available credits are listed on our Pricing page at fluentfox.in and are subject to change. Paid plans are activated upon successful payment and are valid for the duration and usage limits associated with the plan purchased, unless otherwise stated.",
  },
  {
    num: "05",
    title: "Acceptable Use",
    lead: "By using Fluent Fox, you agree not to engage in any of the following:",
    items: [
      "Using the Service for unlawful, fraudulent, or harmful activities.",
      "Harassing, threatening, or abusing other individuals through the platform.",
      "Violating any applicable laws, rules, or regulations.",
      "Sharing, transferring, or selling your account to any other person.",
      "Attempting to reverse-engineer, decompile, or otherwise compromise the integrity of the Service.",
      "Taking any action that could harm, discredit, or disrupt the Service or its underlying infrastructure.",
    ],
  },
  {
    num: "06",
    title: "Privacy",
    body: "Your use of Fluent Fox is also governed by our Privacy Policy, which outlines how we collect, store, and use your personal information. We encourage you to review the Privacy Policy carefully as it forms an integral part of these Terms.",
  },
  {
    num: "07",
    title: "Payments & Billing",
    items: [
      "All transactions are processed securely through our authorised payment partners (including Razorpay).",
      "Prices are denominated in Indian Rupees (INR). GST at the applicable rate will be added at the point of checkout.",
      "Payment must be completed before access to any paid plan or feature is granted.",
      "Fluent Fox reserves the right to revise its pricing at any time with or without prior notice.",
    ],
  },
  {
    num: "08",
    title: "Intellectual Property",
    body: "All content, branding, features, and technology constituting the Fluent Fox platform remain the exclusive intellectual property of Fluent Fox and its licensors. The Service is protected under applicable copyright, trademark, and other intellectual property laws. Unauthorised reproduction, modification, or distribution of any part of the Service is strictly prohibited.",
  },
  {
    num: "09",
    title: "Limitation of Liability",
    body: "To the maximum extent permitted by applicable law, Fluent Fox, along with its team members, affiliates, and service partners, shall not be liable for any indirect, incidental, consequential, or punitive damages of any nature — including but not limited to loss of earnings, loss of data, reputational harm, or other non-tangible losses — arising from your use of or inability to use the Service.",
  },
  {
    num: "10",
    title: "Account Termination",
    body: "Fluent Fox reserves the right to suspend or permanently terminate any account, with immediate effect and without prior notification, at its sole discretion. This includes, but is not limited to, situations where a user has violated these Terms and Conditions.",
  },
  {
    num: "11",
    title: "Disclaimer of Warranties",
    body: 'The Service is made available strictly on an "as is" and "as available" basis. To the fullest extent permitted by law, Fluent Fox expressly disclaims all representations, warranties, and conditions of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.',
  },
  {
    num: "12",
    title: "Governing Law",
    body: "These Terms and Conditions are governed by and shall be construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts of India.",
  },
  {
    num: "13",
    title: "Contact Us",
    contact: true,
  },
];

export default function TermsAndConditions() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using FluentFox."
      updated="April 13, 2026"
    >
      {sections.map((s) => (
        <div key={s.num} style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 14 }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, color: "#ff4b00", opacity: .7, minWidth: 28, paddingTop: 3 }}>{s.num}</span>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#111", lineHeight: 1.2 }}>{s.title}</h2>
          </div>
          <div style={{ paddingLeft: 48 }}>
            {s.lead && <p style={{ fontSize: 15, color: "#444", lineHeight: 1.75, marginBottom: 14 }}>{s.lead}</p>}
            {s.body && <p style={{ fontSize: 15, color: "#444", lineHeight: 1.75 }}>{s.body}</p>}
            {s.items && (
              <ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {s.items.map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 15, color: "#444", lineHeight: 1.7 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff4b00", flexShrink: 0, marginTop: 8 }} />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {s.contact && (
              <div style={{ background: "#fff8f5", border: "0.5px solid rgba(255,75,0,0.15)", borderRadius: 12, padding: "20px 24px" }}>
                <p style={{ fontSize: 15, color: "#444", lineHeight: 1.75 }}>For any queries related to these Terms and Conditions, please reach out:</p>
                <p style={{ fontSize: 15, color: "#111", fontWeight: 600, marginTop: 12 }}>Email: <a href="mailto:rahul@fluentfox.in" style={{ color: "#ff4b00", textDecoration: "none" }}>rahul@fluentfox.in</a></p>
                <p style={{ fontSize: 15, color: "#111", fontWeight: 600, marginTop: 6 }}>Website: <a href="https://fluentfox.in" style={{ color: "#ff4b00", textDecoration: "none" }}>fluentfox.in</a></p>
              </div>
            )}
          </div>
        </div>
      ))}
    </LegalLayout>
  );
}