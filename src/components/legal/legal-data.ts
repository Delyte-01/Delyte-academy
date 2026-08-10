export interface LegalSection {
  id: string;
  number: number;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface LegalDoc {
  title: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export const privacyPolicy: LegalDoc = {
  title: "Privacy Policy",
  intro:
    "Your privacy matters to us. This policy explains what information Delyte Academy collects, how we use it, and the choices you have.",
  lastUpdated: "August 9, 2026",
  sections: [
    {
      id: "introduction",
      number: 1,
      title: "Introduction",
      paragraphs: [
        'Delyte Academy ("we", "us", or "our") operates an online learning platform that provides courses, quizzes, progress tracking, and student accounts. We are committed to protecting your privacy and being transparent about how we handle your personal information.',
        "This Privacy Policy applies to all users of our website and platform. By creating an account or using our services, you acknowledge that you have read and understood the practices described here.",
      ],
    },
    {
      id: "information-we-collect",
      number: 2,
      title: "Information We Collect",
      paragraphs: [
        "We collect information that allows us to provide and improve our educational services. The categories of data we may collect include:",
      ],
      bullets: [
        "Account information: your name, email address, username, and password.",
        "Profile data: phone number, country, profile photo, and optional bio.",
        "Learning data: course enrollments, quiz results, study progress, and activity history.",
        "Device and usage data: IP address, browser type, device information, and how you interact with the platform.",
        "Communication data: support requests, feedback, and messages you send to our team.",
      ],
    },
    {
      id: "how-we-use",
      number: 3,
      title: "How We Use Your Information",
      paragraphs: [
        "We use the information we collect to deliver a personalized learning experience and to keep our platform running smoothly. Specifically, we use your data to:",
      ],
      bullets: [
        "Create and manage your account and verify your identity.",
        "Deliver course content, track your progress, and generate performance insights.",
        "Send notifications about courses, quizzes, deadlines, and platform updates.",
        "Respond to your support requests and improve our customer service.",
        "Analyze usage patterns to improve courses, features, and overall platform quality.",
        "Detect, prevent, and address fraud, abuse, and technical or security issues.",
      ],
    },
    {
      id: "cookies",
      number: 4,
      title: "Cookies and Tracking Technologies",
      paragraphs: [
        "We use cookies and similar tracking technologies to operate and enhance our platform. Cookies help us keep you signed in, remember your preferences, and understand how you use our services.",
        "You can control cookies through your browser settings. Disabling cookies may affect certain features, such as staying logged in or receiving personalized content.",
      ],
      bullets: [
        "Essential cookies: required for core platform functionality.",
        "Preference cookies: remember your settings and choices.",
        "Analytics cookies: help us understand usage patterns and improve the platform.",
      ],
    },
    {
      id: "sharing",
      number: 5,
      title: "Sharing of Information",
      paragraphs: [
        "We do not sell your personal information. We may share your data only in the following limited circumstances:",
      ],
      bullets: [
        "With service providers who help us operate the platform, under strict contractual obligations.",
        "When required by law, court order, or government regulation.",
        "To protect the rights, property, or safety of Delyte Academy, our users, or others.",
        "In connection with a merger, acquisition, or sale of our business assets, subject to confidentiality protections.",
      ],
    },
    {
      id: "third-party",
      number: 6,
      title: "Third-Party Services",
      paragraphs: [
        "We rely on trusted third-party providers to deliver certain features of our platform. These providers may process limited data on our behalf to support authentication, analytics, payments, and communications.",
      ],
      bullets: [
        "Authentication providers for secure sign-in.",
        "Analytics tools to understand platform usage.",
        "Email delivery services for notifications and support.",
        "Cloud infrastructure for data storage and processing.",
      ],
    },
    {
      id: "data-security",
      number: 7,
      title: "Data Security",
      paragraphs: [
        "We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure. These measures include encryption in transit and at rest, regular security audits, and strict access controls.",
        "While we strive to protect your data, no method of transmission over the internet is completely secure. We cannot guarantee absolute security but are committed to safeguarding your information to the best of our ability.",
      ],
    },
    {
      id: "data-retention",
      number: 8,
      title: "Data Retention",
      paragraphs: [
        "We retain your personal information for as long as your account is active or as needed to provide our services. When you close your account, we will delete or anonymize your data within 30 days, except where retention is required by law.",
      ],
    },
    {
      id: "your-rights",
      number: 9,
      title: "Your Rights",
      paragraphs: [
        "You have several rights regarding your personal data. You can exercise any of these rights at any time by contacting our support team.",
      ],
      bullets: [
        "Access: request a copy of the personal data we hold about you.",
        "Correction: update or correct inaccurate information.",
        "Deletion: request that we delete your personal data.",
        "Portability: receive your data in a structured, machine-readable format.",
        "Opt-out: unsubscribe from marketing communications.",
        "Restriction: request that we limit how we use your data.",
      ],
    },
    {
      id: "childrens-privacy",
      number: 10,
      title: "Children\u2019s Privacy",
      paragraphs: [
        "Our platform is designed for students, including those under 18. For users under 16, we require parental or guardian consent before creating an account. We do not knowingly collect personal information from children without verified consent.",
        "If you believe a child has provided us with personal data without consent, please contact us and we will promptly delete it.",
      ],
    },
    {
      id: "changes",
      number: 11,
      title: "Changes to This Privacy Policy",
      paragraphs: [
        'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting the updated policy on this page and updating the "Last updated" date.',
        "We encourage you to review this page periodically to stay informed about how we protect your data.",
      ],
    },
    {
      id: "contact",
      number: 12,
      title: "Contact Us",
      paragraphs: [
        "If you have any questions about this Privacy Policy or how we handle your data, our team is here to help. Reach out to us at privacy@delyteacademy.com or through our support center.",
      ],
    },
  ],
};

export const termsOfService: LegalDoc = {
  title: "Terms of Service",
  intro:
    "These terms govern your use of Delyte Academy. Please read them carefully before creating an account or accessing our courses.",
  lastUpdated: "August 9, 2026",
  sections: [
    {
      id: "acceptance",
      number: 1,
      title: "Acceptance of Terms",
      paragraphs: [
        "By creating an account or using Delyte Academy, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access or use the platform.",
        "These terms form a legally binding agreement between you and Delyte Academy regarding your use of all our services and content.",
      ],
    },
    {
      id: "eligibility",
      number: 2,
      title: "Eligibility",
      paragraphs: [
        "You must be at least 13 years old to create an account. Users under 16 must obtain parental or guardian consent before registering. By registering, you confirm that you meet these requirements and have the legal capacity to enter into this agreement.",
      ],
    },
    {
      id: "account-registration",
      number: 3,
      title: "Account Registration",
      paragraphs: [
        "To access most features, you must create an account. You agree to provide accurate, current, and complete information during registration and to keep your account details updated.",
      ],
      bullets: [
        "You are responsible for safeguarding your password.",
        "You are responsible for all activity that occurs under your account.",
        "You must notify us immediately of any unauthorized use of your account.",
        "One person or entity may not maintain multiple accounts for the purpose of circumventing platform rules.",
      ],
    },
    {
      id: "use-of-platform",
      number: 4,
      title: "Use of the Platform",
      paragraphs: [
        "You agree to use Delyte Academy only for lawful purposes. You are prohibited from engaging in any activity that could harm the platform, other users, or third parties.",
      ],
      bullets: [
        "Do not share your login credentials with others.",
        "Do not attempt to access data or systems you are not authorized to use.",
        "Do not upload viruses, malware, or any harmful code.",
        "Do not scrape, copy, or redistribute platform content without permission.",
        "Do not harass, abuse, or impersonate other users.",
      ],
    },
    {
      id: "course-content",
      number: 5,
      title: "Course Content",
      paragraphs: [
        "All course materials, quizzes, and educational resources on Delyte Academy are provided for learning purposes. While we strive for accuracy, we do not guarantee that all content is error-free or complete.",
        "Course availability may change. We reserve the right to modify, suspend, or discontinue any course or content at any time without prior notice.",
      ],
    },
    {
      id: "payments-refunds",
      number: 6,
      title: "Payments and Refunds",
      paragraphs: [
        "Some courses or features may require payment. By purchasing a paid feature, you agree to the pricing and billing terms presented at checkout. All fees are non-refundable unless stated otherwise.",
      ],
      bullets: [
        "Payments are processed securely through our payment partners.",
        "Subscriptions renew automatically unless cancelled before the renewal date.",
        "Refund requests must be submitted within 14 days of purchase.",
        "Refunds are issued at our discretion based on the circumstances of each request.",
      ],
    },
    {
      id: "user-responsibilities",
      number: 7,
      title: "User Responsibilities",
      paragraphs: [
        "You are responsible for your conduct on the platform and for any content you submit. You agree to interact respectfully with other users and to follow all applicable laws and regulations.",
        "You must not use the platform to cheat on examinations, plagiarize content, or violate academic integrity policies of any institution.",
      ],
    },
    {
      id: "intellectual-property",
      number: 8,
      title: "Intellectual Property",
      paragraphs: [
        "All content on Delyte Academy, including courses, quizzes, text, graphics, and software, is owned by us or our licensors and is protected by intellectual property laws.",
        "You may not copy, reproduce, distribute, or create derivative works from our content without our prior written consent. Limited personal use for learning purposes is permitted.",
      ],
    },
    {
      id: "suspension-termination",
      number: 9,
      title: "Suspension and Termination",
      paragraphs: [
        "We may suspend or terminate your account if you violate these Terms or engage in conduct that we believe is harmful to the platform or other users. You may close your account at any time through your settings.",
        "Upon termination, your right to use the platform ceases immediately. Sections of these Terms that by their nature should survive termination will remain in effect.",
      ],
    },
    {
      id: "limitation-of-liability",
      number: 10,
      title: "Limitation of Liability",
      paragraphs: [
        'Delyte Academy is provided on an "as is" and "as available" basis. To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.',
        "We do not guarantee uninterrupted, error-free, or secure access to the platform. Your use is at your own risk.",
      ],
    },
    {
      id: "governing-law",
      number: 11,
      title: "Governing Law",
      paragraphs: [
        "These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising from these Terms or your use of the platform shall be resolved in the courts of Nigeria.",
      ],
    },
    {
      id: "changes-to-terms",
      number: 12,
      title: "Changes to These Terms",
      paragraphs: [
        "We may update these Terms from time to time. When we make material changes, we will notify you through the platform or by email. Continued use of Delyte Academy after changes take effect constitutes acceptance of the updated Terms.",
      ],
    },
    {
      id: "contact-info",
      number: 13,
      title: "Contact Information",
      paragraphs: [
        "If you have questions about these Terms of Service, please contact us at legal@delyteacademy.com. Our support team is available to help with any concerns about your account or use of the platform.",
      ],
    },
  ],
};
