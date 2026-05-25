import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Privacy Policy | ApnaVakil",
  description: "Simple privacy policy for ApnaVakil.",
};

const sections = [
  {
    title: "1. Information We Collect",
    body: [
      "We may collect your name, email address, login details, questions, chat messages, uploaded documents, voice input, and other information you choose to share.",
      "We may also collect basic technical information such as device type, browser, IP address, usage logs, and error data to keep the service working and secure.",
    ],
  },
  {
    title: "2. How We Use Information",
    body: [
      "We use your information to provide AI responses, manage your account, improve the product, prevent misuse, fix errors, and protect ApnaVakil and its users.",
      "We may review usage patterns to improve safety, quality, speed, and reliability.",
    ],
  },
  {
    title: "3. AI Processing",
    body: [
      "Your questions, documents, and voice inputs may be processed by AI systems and related service providers so ApnaVakil can generate answers.",
      "Do not share information you do not want processed. AI responses may not be confidential like advice from your own lawyer.",
    ],
  },
  {
    title: "4. Sharing Information",
    body: [
      "We do not sell your personal information.",
      "We may share information with trusted service providers who help us run hosting, authentication, analytics, AI processing, security, and support.",
      "We may also share information if required by law, court order, legal process, safety concern, fraud prevention, or to protect our rights.",
    ],
  },
  {
    title: "5. Data Security",
    body: [
      "We use reasonable technical and organizational measures to protect information, but no online system is fully secure.",
      "You are responsible for using a secure device, keeping your password safe, and avoiding unnecessary sensitive uploads.",
    ],
  },
  {
    title: "6. Data Retention",
    body: [
      "We keep information for as long as needed to provide the service, meet legal requirements, resolve disputes, prevent abuse, and improve ApnaVakil.",
      "When information is no longer needed, we may delete, anonymize, or archive it according to our internal process.",
    ],
  },
  {
    title: "7. Your Choices",
    body: [
      "You may choose what information to share with ApnaVakil. You may stop using the service at any time.",
      "You can contact us to request access, correction, or deletion of your information, subject to legal, security, and operational limits.",
    ],
  },
  {
    title: "8. Updates",
    body: [
      "We may update this privacy policy as ApnaVakil changes. The latest version will be posted on this page.",
      "Your continued use of ApnaVakil after changes means you accept the updated policy.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5]">
      <Navbar eyebrow="Privacy Policy" />
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-10">
        <section className="mb-10">
          <p className="text-sm font-medium text-[#A1A1AA]">Last updated: May 22, 2026</p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#A1A1AA]">
            This policy explains what information ApnaVakil may collect and how it may be used.
          </p>
        </section>

        <div className="space-y-4">
          {sections.map((section) => (
            <section key={section.title} className="matte-card rounded-[1.5rem] p-6">
              <h2 className="font-display text-xl font-semibold tracking-tight">{section.title}</h2>
              <div className="mt-4 space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-7 text-[#A1A1AA]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
