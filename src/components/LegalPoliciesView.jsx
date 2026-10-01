import React, { useState, useEffect } from 'react';
import { 
  FileText, ShieldCheck, Search, Printer, ArrowLeft, 
  CheckCircle2, AlertCircle, Phone, Mail, MapPin, 
  ChevronRight, Sparkles, Lock, ShoppingBag
} from 'lucide-react';

export const TERMS_AND_CONDITIONS = [
  {
    id: 1,
    title: "Acceptance of Terms & Contractual Agreement",
    category: "Legal Agreement",
    content: "By accessing, browsing, or placing an order on GymMillets.com (the \"Platform\"), you acknowledge having read, understood, and agreed to be legally bound by these Terms and Conditions, our Privacy Policy, and all applicable statutory regulations of India. If you do not accept these terms in their entirety, you must discontinue using our services immediately."
  },
  {
    id: 2,
    title: "User Eligibility & Account Security",
    category: "Account & Eligibility",
    content: "You must be at least 18 years of age or accessing under the active supervision of a parent or legal guardian to transact on this site. You agree to provide accurate, true, and current contact and delivery details. You are solely responsible for safeguarding your login credentials and for all activities conducted under your registered account."
  },
  {
    id: 3,
    title: "Product Range & Natural Grain Formulation",
    category: "Product Science",
    content: "GymMillets manufactures and retails 100% natural, preservative-free millet nutrition products, including Ready Mixes, Freeze-Dried Powders, Instant Mixes, Millet Noodles, Herbal Soups, and Hot Meals. While crafted using traditional grains to support an active lifestyle, our products are dietary food preparations and not pharmaceutical medicines or synthetic supplements."
  },
  {
    id: 4,
    title: "Health Consultation & Medical Disclaimer",
    category: "Health Disclaimer",
    content: "Our products are not intended to diagnose, cure, mitigate, treat, or prevent any chronic disease or medical condition. Individuals with pre-existing metabolic disorders, severe diabetes, kidney conditions, celiac disease, or pregnant/lactating women should consult a certified physician or clinical dietitian before altering their regular dietary regimen."
  },
  {
    id: 5,
    title: "Allergen & Facility Processing Advisory",
    category: "Allergen Advisory",
    content: "While our formulations emphasize unpolished ancient grains and gluten-friendly millets, some products are processed in facilities that also handle cereals, nuts, seeds, soy, or dairy. Customers with severe food sensitivities or acute allergies must carefully review ingredient listings on the packaging prior to consumption."
  },
  {
    id: 6,
    title: "Pricing, Currency & Tax Inclusions",
    category: "Pricing & Billing",
    content: "All product prices displayed on GymMillets are quoted in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax (GST) unless explicitly indicated otherwise. GymMillets reserves the absolute right to modify product prices, promotional discounts, and delivery charges at any time without prior written notification."
  },
  {
    id: 7,
    title: "Order Placement, Verification & Acceptance",
    category: "Orders & Verification",
    content: "Submitting an order constitutes a binding offer to purchase. GymMillets reserves the right to accept, decline, or place quantity limits on any order due to inventory stock-outs, inaccurate delivery addresses, suspected fraudulent activity, or unverified payment authorizations."
  },
  {
    id: 8,
    title: "Secure Payment Methods & Gateway Processing",
    category: "Payments & Security",
    content: "Online payments are processed securely via certified, RBI-compliant payment gateways supporting UPI (Google Pay, PhonePe, Paytm), Net Banking, Major Debit/Credit Cards (Visa, MasterCard, RuPay), and Wallets. All transactions are encrypted with 256-bit SSL protocols. GymMillets does not store customer CVVs, complete card numbers, or banking passwords on its servers."
  },
  {
    id: 9,
    title: "Domestic Shipping Timelines & Logistics Handling",
    category: "Shipping & Fulfillment",
    content: "Verified orders are dispatched from our fulfillment center in Bangalore within 24 to 48 business hours (excluding Sundays and national holidays) via reputable courier partners (Delhivery, BlueDart, Shiprocket, India Post). Standard delivery typically spans 3 to 7 business days, subject to destination pincode accessibility and transit conditions."
  },
  {
    id: 10,
    title: "Delivery Charges & Free Shipping Threshold",
    category: "Shipping & Fulfillment",
    content: "Orders that meet or exceed our promotional free shipping threshold (as advertised on the website header or checkout page) qualify for complimentary domestic delivery. Orders falling below this threshold will have a standard shipping fee automatically calculated and displayed at checkout."
  },
  {
    id: 11,
    title: "Order Cancellation Guidelines",
    category: "Cancellations",
    content: "You may cancel an order free of charge strictly prior to its dispatch by contacting our support team via phone or email. Once the consignment is handed over to our courier partner and a tracking Air Waybill (AWB) is assigned, cancellations cannot be processed mid-transit."
  },
  {
    id: 12,
    title: "Perishable Food Returns & Damaged Goods Policy",
    category: "Returns & Exchanges",
    content: "Due to strict food hygiene standards and the consumable nature of grain powders, opened or delivered food items cannot be returned. However, if your package arrives physically damaged, tampered, expired, or with incorrect items, report it within 48 hours of delivery with clear photographic or unboxing video proof for an immediate replacement or resolution."
  },
  {
    id: 13,
    title: "Refund Initiation & Bank Settlement Timelines",
    category: "Refunds",
    content: "Approved refunds for verified damaged consignments or pre-dispatch cancellations will be processed to the customer's original payment method. The refund amount typically reflects in your bank or card account within 5 to 7 working business days, subject to the issuing bank's operational settlement timeline."
  },
  {
    id: 14,
    title: "Storage Conditions & Shelf-Life Guidelines",
    category: "Product Care & Storage",
    content: "Customers are advised to store GymMillets products in a cool, dry, and hygienic place away from direct sunlight, excess moisture, and heat. Once opened, transfer the contents into an airtight container and consume within the indicated \"Best Before\" period. GymMillets cannot be held responsible for product spoilage resulting from improper storage."
  },
  {
    id: 15,
    title: "Promotional Coupons, Discounts & Credits",
    category: "Discounts & Offers",
    content: "Discount coupons, referral credits, and promotional vouchers are subject to specific cart minimums, validity periods, and category restrictions. Only one coupon code may be redeemed per order. Coupons carry no liquid cash redemption value and cannot be transferred or applied retrospectively to previous purchases."
  },
  {
    id: 16,
    title: "Prohibited User Conduct & Fair Usage",
    category: "Platform Conduct",
    content: "Users agree not to engage in fraudulent chargebacks, automated web scraping, system attacks, posting defamatory reviews, or violating cyber law provisions. GymMillets reserves the right to suspend or permanently ban accounts suspected of malicious behavior, abuse, or unauthorized commercial reselling."
  },
  {
    id: 17,
    title: "Intellectual Property Rights & Trademarks",
    category: "Intellectual Property",
    content: "All trademarks, brand logos, product formulations, imagery, packaging artwork, copy, and digital assets on GymMillets are the exclusive intellectual property of GymMillets. Any unauthorized reproduction, commercial distribution, or copying without prior written consent is strictly prohibited and subject to legal prosecution."
  },
  {
    id: 18,
    title: "Third-Party Courier Services & External Links",
    category: "Third-Party Services",
    content: "Our website contains links and API integrations for third-party courier tracking and payment processors. GymMillets does not control and assumes no liability for external server downtimes, carrier tracking delays, or policies enforced by these independent external providers."
  },
  {
    id: 19,
    title: "Limitation of Liability & Indemnification",
    category: "Liability & Indemnity",
    content: "To the maximum extent permitted by applicable Indian laws, GymMillets and its directors shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from platform use or delivery disruptions. Users agree to indemnify GymMillets against third-party claims arising from their breach of these terms."
  },
  {
    id: 20,
    title: "Governing Law & Legal Dispute Jurisdiction",
    category: "Jurisdiction & Disputes",
    content: "These Terms and Conditions shall be governed by, construed, and enforced in accordance with the substantive laws of the Republic of India. Any legal dispute, arbitration, or proceedings arising out of or in connection with this platform shall be subject to the exclusive jurisdiction of the competent courts in Bangalore, Karnataka."
  }
];

export const PRIVACY_POLICY = [
  {
    id: 1,
    title: "Privacy Commitment & Regulatory Compliance",
    category: "Privacy Commitment",
    content: "GymMillets is deeply committed to safeguarding customer confidentiality and privacy rights. This Privacy Policy outlines our procedures for collecting, processing, storing, and securing personal data in strict compliance with India's Information Technology Act (2000), IT Rules (2011), and the Digital Personal Data Protection (DPDP) Act."
  },
  {
    id: 2,
    title: "Personal Information We Collect Directly",
    category: "Data Collection",
    content: "When you browse our catalog, register an account, subscribe to announcements, or complete a checkout, we collect essential personal information including your full name, email address, mobile phone number, delivery address, landmark, and postal pincode."
  },
  {
    id: 3,
    title: "Payment Security & Zero Card Storage",
    category: "Financial Security",
    content: "All financial transactions are conducted directly through RBI-authorized, PCI-DSS certified payment gateways utilizing 256-bit encryption. GymMillets does not capture, store, or have access to your full debit/credit card numbers, CVVs, net banking credentials, or UPI PINs."
  },
  {
    id: 4,
    title: "Purpose of Customer Data Processing",
    category: "Data Utilization",
    content: "Collected personal data is utilized strictly to: process and dispatch your millet orders, generate tax-compliant GST invoices, send real-time dispatch and delivery updates, provide responsive customer support, and personalize your shopping experience."
  },
  {
    id: 5,
    title: "Account Password & Credential Encryption",
    category: "Account Protection",
    content: "Customer account passwords and authentication tokens are secured using modern one-way cryptographic hashing algorithms. We will never request your account password via phone, email, or chat. You remain responsible for keeping your login credentials confidential."
  },
  {
    id: 6,
    title: "Automated Device Information & Log Files",
    category: "Technical Data",
    content: "Whenever you access GymMillets.com, our secure servers automatically log technical metadata including your Internet Protocol (IP) address, browser version, device operating system, referring URL, and session access timestamps for network diagnostics and security auditing."
  },
  {
    id: 7,
    title: "Cookies & Local Storage Policy",
    category: "Cookies & Sessions",
    content: "We use essential cookies and browser local storage to maintain your active cart items, keep your customer session authenticated, remember your dark/light theme preferences, and optimize site loading speed. You may adjust cookie preferences in your browser, though it may alter store functionality."
  },
  {
    id: 8,
    title: "Logistics & Courier Partner Data Sharing",
    category: "Third-Party Sharing",
    content: "To fulfill home deliveries, we share only necessary shipping details (recipient name, shipping address, pincode, and contact number) with verified third-party courier services (e.g., Delhivery, BlueDart, Shiprocket, India Post). These partners are legally bound not to use your information for external purposes."
  },
  {
    id: 9,
    title: "Transactional & Promotional Notifications",
    category: "Communications",
    content: "We communicate order confirmations, shipment tracking links, and delivery milestones via automated SMS, WhatsApp, and email messages. Optional promotional offers and seasonal millet harvest updates will only be sent if you choose to opt in, with an instant opt-out mechanism."
  },
  {
    id: 10,
    title: "Data Retention & Archival Standards",
    category: "Data Retention",
    content: "We retain your order histories, tax invoices, and account records only as long as necessary to satisfy ongoing customer service needs, resolve warranty claims, and comply with mandatory statutory accounting laws under Indian commercial jurisprudence."
  },
  {
    id: 11,
    title: "Zero Data Sale & Anti-Spam Guarantee",
    category: "Anti-Spam Guarantee",
    content: "GymMillets maintains an absolute zero-spam guarantee. We will never sell, lease, rent, trade, or distribute your email address, phone number, or personal details to third-party data brokers or marketing agencies under any circumstances."
  },
  {
    id: 12,
    title: "Protection of Minor's Personal Data",
    category: "Minor Protection",
    content: "GymMillets does not knowingly solicit or collect personal information from individuals under 18 years of age without parental supervision. If we discover that personal data of a minor has been gathered without verified parental consent, we will promptly purge it from our systems."
  },
  {
    id: 13,
    title: "Data Security Architecture & TLS Encryption",
    category: "Infrastructure Security",
    content: "We enforce multi-tiered administrative, technical, and physical safeguards. All data transmitted between your browser and our platform is encrypted using modern TLS (HTTPS) protocols, backed by firewalls, role-based access restrictions, and regular security vulnerability audits."
  },
  {
    id: 14,
    title: "Customer Rights to Access & Rectification",
    category: "User Rights",
    content: "You have the right to inspect, update, correct, or request the deletion of your personal account information and saved shipping addresses at any time directly through your User Account dashboard or by writing to support@gymmillets.com."
  },
  {
    id: 15,
    title: "Opt-Out of Marketing Broadcasts",
    category: "User Control",
    content: "You may opt out of promotional newsletters or promotional SMS blasts at any moment by clicking the \"Unsubscribe\" link contained within our emails, replying STOP to promotional SMS alerts, or contacting our customer care department."
  },
  {
    id: 16,
    title: "Aggregated Analytics & Site Optimization",
    category: "Analytics",
    content: "We utilize anonymized web analytics to assess platform performance, popular millet categories, and checkout funnel friction. This data is collected in aggregate form and does not personally identify any individual customer."
  },
  {
    id: 17,
    title: "Cloud Hosting & Encrypted Backups",
    category: "Cloud Infrastructure",
    content: "Our customer databases and infrastructure run on secure cloud data centers featuring ISO/IEC 27001 compliance, daily encrypted backups, continuous uptime monitoring, and stringent disaster recovery protocols."
  },
  {
    id: 18,
    title: "Statutory & Legal Disclosures",
    category: "Legal Disclosures",
    content: "We may disclose personal data if required in good faith under legal mandate, court order, or governmental warrant pursuant to Indian law to investigate cyber violations, prevent financial fraud, or protect the safety and legal rights of GymMillets and our users."
  },
  {
    id: 19,
    title: "Periodic Policy Updates & Revision Notices",
    category: "Policy Updates",
    content: "GymMillets reserves the right to amend this Privacy Policy periodically to reflect technological advances, service updates, or regulatory shifts. Any revised version will be published here with an updated effective date. Continued platform use implies acceptance."
  },
  {
    id: 20,
    title: "Grievance Officer & Data Protection Contact",
    category: "Grievance Redressal",
    content: "In compliance with the Information Technology Act (2000) and rules thereunder, for any queries, grievances, or requests regarding your personal data, you may reach our designated Grievance Officer: GymMillets Data Desk, 12A, Natural Complex, Indiranagar, Bangalore – 560038, Karnataka, India. Phone: +91 70326 53305 | Email: support@gymmillets.com."
  }
];

export default function LegalPoliciesView({ activeView, setActiveView }) {
  const [currentTab, setCurrentTab] = useState(() => {
    return activeView === 'privacy' ? 'privacy' : 'terms';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (activeView === 'privacy' || activeView === 'terms') {
      setCurrentTab(activeView);
    }
  }, [activeView]);

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setActiveView(tab);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentPoints = currentTab === 'terms' ? TERMS_AND_CONDITIONS : PRIVACY_POLICY;

  const filteredPoints = currentPoints.filter(point => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      point.title.toLowerCase().includes(query) ||
      point.content.toLowerCase().includes(query) ||
      point.category.toLowerCase().includes(query) ||
      String(point.id).includes(query)
    );
  });

  return (
    <div className="pt-40 sm:pt-48 pb-20 min-h-screen bg-[#FDFBF7] dark:bg-[#121212] transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => { setActiveView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-textLight dark:text-cream/60 hover:text-primary dark:hover:text-success-light transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-darkCard border border-accent/20 text-textDark dark:text-cream hover:bg-cream/50 transition-colors shadow-sm"
              title="Copy page link"
            >
              {copiedLink ? "✓ Link Copied!" : "Share Link"}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-darkCard border border-accent/20 text-textDark dark:text-cream hover:bg-cream/50 transition-colors shadow-sm"
              title="Print Policy"
            >
              <Printer size={13} />
              Print
            </button>
          </div>
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-primary/10 text-primary dark:bg-success/20 dark:text-success-light px-3.5 py-1.5 rounded-full mb-3">
            <ShieldCheck size={13} />
            Official Store Policies & Legal Guidelines
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-black text-textDark dark:text-cream">
            {currentTab === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
          </h1>
          <p className="text-sm sm:text-base text-textLight dark:text-cream/60 mt-3 font-semibold">
            {currentTab === 'terms'
              ? 'Complete guidelines governing your purchases, orders, deliveries, and dietary product use on GymMillets.'
              : 'Our detailed pledge and transparent standards regarding your personal data protection, cookies, and privacy rights.'}
          </p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs font-semibold text-textLight/70 dark:text-cream/40">
            <span>📅 Updated: October 2026</span>
            <span>•</span>
            <span>📍 HQ: Bangalore, India</span>
            <span>•</span>
            <span>🌾 20 Comprehensive Points</span>
          </div>
        </div>

        {/* Tab Switcher - 20 Points Separately */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 bg-[#EFECE6] dark:bg-[#1E1E1E] rounded-2xl border border-accent/20 shadow-inner w-full max-w-md">
            <button
              onClick={() => handleTabChange('terms')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 flex items-center justify-center gap-2 ${
                currentTab === 'terms'
                  ? 'bg-primary text-cream shadow-md scale-[1.02]'
                  : 'text-textDark/70 dark:text-cream/60 hover:text-textDark dark:hover:text-cream'
              }`}
            >
              <FileText size={16} />
              Terms & Conditions
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                currentTab === 'terms' ? 'bg-cream/20 text-cream' : 'bg-black/10 dark:bg-white/10'
              }`}>
                20 Pts
              </span>
            </button>
            <button
              onClick={() => handleTabChange('privacy')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 flex items-center justify-center gap-2 ${
                currentTab === 'privacy'
                  ? 'bg-primary text-cream shadow-md scale-[1.02]'
                  : 'text-textDark/70 dark:text-cream/60 hover:text-textDark dark:hover:text-cream'
              }`}
            >
              <Lock size={16} />
              Privacy Policy
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                currentTab === 'privacy' ? 'bg-cream/20 text-cream' : 'bg-black/10 dark:bg-white/10'
              }`}>
                20 Pts
              </span>
            </button>
          </div>
        </div>

        {/* Search & Jump Navigator */}
        <div className="bg-white dark:bg-darkCard border border-accent/15 rounded-2xl p-4 sm:p-5 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textLight dark:text-cream/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search within 20 points (e.g. shipping, refunds, allergens, cookies)...`}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F6F4EE] dark:bg-[#181818] border border-accent/10 dark:border-accent/5 text-xs sm:text-sm text-textDark dark:text-cream placeholder-textLight/50 focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-textLight dark:text-cream/60 hover:text-primary shrink-0 px-2"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Point Numbers Quick Navigator */}
          {!searchQuery && (
            <div className="mt-4 pt-3 border-t border-accent/10">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-textLight/70 dark:text-cream/40 mb-2">
                Quick Jump to Point:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {currentPoints.map(point => (
                  <a
                    key={point.id}
                    href={`#point-${point.id}`}
                    className="w-7 h-7 rounded-lg bg-[#F6F4EE] dark:bg-[#1E1E1E] hover:bg-primary hover:text-cream dark:hover:bg-success text-textDark dark:text-cream text-[11px] font-bold flex items-center justify-center transition-colors border border-accent/10"
                  >
                    {point.id}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 20 Points Container */}
        <div className="space-y-4">
          {filteredPoints.length === 0 ? (
            <div className="bg-white dark:bg-darkCard rounded-3xl p-12 text-center border border-accent/15">
              <AlertCircle size={36} className="mx-auto text-primary dark:text-success-light mb-3" />
              <h3 className="text-lg font-bold text-textDark dark:text-cream">No matching points found</h3>
              <p className="text-xs text-textLight dark:text-cream/60 mt-1">
                No policy items matched "{searchQuery}". Try searching for shipping, payment, returns, or security.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 rounded-xl bg-primary text-cream text-xs font-bold"
              >
                Show All 20 Points
              </button>
            </div>
          ) : (
            filteredPoints.map((point) => (
              <div
                key={point.id}
                id={`point-${point.id}`}
                className="scroll-mt-36 bg-white dark:bg-darkCard border border-accent/10 dark:border-accent/5 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Point Number Badge */}
                  <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 dark:bg-success/20 text-primary dark:text-success-light flex items-center justify-center font-outfit font-black text-sm sm:text-base border border-primary/20 dark:border-success/30 shadow-inner">
                    {point.id < 10 ? `0${point.id}` : point.id}
                  </div>

                  {/* Point Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-accent/10 dark:bg-accent/20 text-textDark dark:text-cream/80">
                        {point.category}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-outfit font-extrabold text-textDark dark:text-cream mb-2 leading-snug">
                      {point.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-textLight dark:text-cream/70 leading-relaxed font-medium">
                      {point.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Support & Verification Card */}
        <div className="mt-12 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-success/10 dark:via-success/5 rounded-3xl p-6 sm:p-8 border border-primary/20 dark:border-success/20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary dark:text-success-light">
                Questions or Policy Clarifications?
              </span>
              <h3 className="text-xl font-outfit font-black text-textDark dark:text-cream">
                We're Here to Support Your Healthy Journey
              </h3>
              <p className="text-xs sm:text-sm text-textLight dark:text-cream/70 leading-relaxed font-semibold">
                For order discrepancies, allergen queries, billing statements, or data privacy requests, connect directly with our Bangalore customer desk.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col gap-2.5 justify-center">
              <a
                href="mailto:support@gymmillets.com"
                className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-cream text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
              >
                <Mail size={14} />
                support@gymmillets.com
              </a>
              <a
                href="tel:+917032653305"
                className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-darkCard hover:bg-cream/50 text-textDark dark:text-cream border border-accent/20 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
              >
                <Phone size={14} />
                +91 70326 53305
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-accent/15 text-xs text-textLight dark:text-cream/50">
          <p>© 2026 GymMillets. All rights reserved. 12A, Natural Complex, Indiranagar, Bangalore – 560038.</p>
          <div className="flex gap-4">
            <button
              onClick={() => handleTabChange(currentTab === 'terms' ? 'privacy' : 'terms')}
              className="text-primary dark:text-success-light font-bold hover:underline"
            >
              Switch to {currentTab === 'terms' ? 'Privacy Policy' : 'Terms & Conditions'} →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
