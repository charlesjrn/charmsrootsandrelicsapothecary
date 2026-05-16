import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Instagram, Mail, MapPin, Phone, Loader2, Send, Heart, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import logo from "@/assets/logo.png";
import footerPattern from "@/assets/footer-pattern.jpg";
import { supabase } from "@/integrations/supabase/client";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Shop", href: "/shop" },
  { name: "Blog", href: "/blog" },
  { name: "Events", href: "/events" },
  { name: "Gallery", href: "/gallery" },
];

const resourcesLinks = [
  { name: "Herbal Wisdom", href: "/blog?category=herbal" },
  { name: "Spiritual Teachings", href: "/blog?category=spiritual" },
  { name: "Community Stories", href: "/blog?category=community" },
  { name: "Ancestral Archive", href: "/blog?category=archive" },
  { name: "Book Club", href: "/events" },
];

const supportLinks = [
  { name: "Contact Us", href: "/services" },
  { name: "Privacy Policy", href: "#", isModal: true, modalType: "privacy" },
  { name: "Terms of Service", href: "#", isModal: true, modalType: "terms" },
];

const socialLinks = [
  { 
    name: "Instagram", 
    icon: Instagram, 
    href: "https://www.instagram.com/charmsrootsandrelicsapothecary",
    color: "hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-600"
  },
  { 
    name: "TikTok", 
    icon: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.19 8.19 0 0 0 4.76 1.52V6.79a4.83 4.83 0 0 1-1-.1z"/>
      </svg>
    ), 
    href: "https://www.tiktok.com/@chrmsrtsrelcsapothecary",
    color: "hover:bg-black"
  },
];

// Privacy Policy Modal Component
function PrivacyPolicyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] h-[85vh] max-h-[85vh] overflow-y-auto font-serif">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
          <DialogTitle className="flex items-center justify-between text-2xl font-serif">
            <span className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-accent" />
              Privacy Policy
            </span>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <div className="prose prose-sm max-w-none mt-6 font-serif">
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-serif font-semibold mb-2">PRIVACY POLICY</h1>
              <p className="text-accent font-medium">Charms, Roots & Relics Apothecary</p>
              <p className="text-sm text-muted-foreground mt-1">Last Updated: May 2026</p>
            </div>

            <div>
              <p className="mb-4">Welcome to the website of Charms, Roots & Relics Apothecary ("we", "our", "us", or "the Apothecary"). This Privacy Policy explains how we collect, use, store, protect, and share information obtained through our website, services, consultations, educational offerings, spiritual work, and community engagement platforms.</p>
              <p className="mb-4">Charms, Roots & Relics Apothecary is rooted in Afro-Indigenous spiritual traditions, decolonial practice, Pan-African cultural preservation, and holistic wellness. We recognize that privacy, dignity, consent, and spiritual confidentiality are deeply interconnected. We therefore approach the handling of personal information not only as a legal responsibility, but also as an ethical and spiritual obligation.</p>
              <p className="mb-4">By accessing or using this website, you agree to the practices outlined in this Privacy Policy.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">1. Our Values & Ethical Framework</h2>
              <p className="mb-4">Our work is guided by principles of:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Decoloniality and cultural integrity</li>
                <li>Respect for Afro-Indigenous spiritual traditions</li>
                <li>Consent, autonomy, and bodily sovereignty</li>
                <li>Afro-feminist ethics of care and accountability</li>
                <li>Protection of sacred knowledge and personal vulnerability</li>
                <li>Community dignity and responsible stewardship</li>
              </ul>
              <p>We understand that many people engaging with spiritual, ancestral, or wellness work may be navigating deeply personal experiences. We are committed to handling all information shared with care, discretion, and respect.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">2. Information We Collect</h2>
              <h3 className="text-lg font-semibold mb-2">a) Personal Information</h3>
              <p className="mb-4">When you contact us, book a service, join a program, or subscribe to updates, we may collect: Full name, Email address, Phone number, Country or city of residence, Preferred communication method, Billing or payment information, Emergency contact information (where necessary for wellness programs).</p>
              
              <h3 className="text-lg font-semibold mb-2">b) Spiritual, Wellness & Consultation Information</h3>
              <p className="mb-4">Depending on the nature of the service requested, you may voluntarily share: Personal concerns or life circumstances, Spiritual or ancestral experiences, Wellness goals and emotional reflections, Ritual intentions or prayer requests, Information relevant to divination, coaching, altar consultations, or spiritual support. This information is considered highly sensitive within our practice and is treated with strict confidentiality.</p>
              
              <h3 className="text-lg font-semibold mb-2">c) Technical & Website Usage Information</h3>
              <p>When visiting the website, certain technical data may be collected automatically, including: IP address, Browser type, Device information, Operating system, Pages visited, Time spent on pages, Referral links, Cookies and similar tracking technologies. This information helps us improve website functionality, accessibility, and user experience.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">3. How We Use Your Information</h2>
              <p className="mb-4">We may use collected information to:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Provide requested services and consultations</li>
                <li>Process bookings and payments</li>
                <li>Respond to inquiries and support requests</li>
                <li>Deliver guided meditations, educational materials, or spiritual resources</li>
                <li>Maintain records of ongoing coaching or wellness programs</li>
                <li>Improve our website and offerings</li>
                <li>Send updates, newsletters, or announcements (only where consent is given)</li>
                <li>Protect the safety, integrity, and security of our community and digital platforms</li>
                <li>Fulfill legal or regulatory obligations where required</li>
              </ul>
              <p>We do not sell personal information to third parties.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">4. Confidentiality of Spiritual & Wellness Services</h2>
              <p className="mb-4">All spiritual consultations, readings, ritual discussions, altar consultations, coaching sessions, and wellness conversations are treated as private and confidential.</p>
              <p className="mb-4">We do not publicly disclose client identities, spiritual experiences, testimonies, or personal matters without explicit written permission.</p>
              <p>However, confidentiality may be limited where disclosure is legally required or where there is a credible concern regarding immediate harm to oneself or others.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">5. Cultural & Sacred Knowledge Protection</h2>
              <p className="mb-4">Charms, Roots & Relics Apothecary is committed to the respectful preservation and protection of Afro-Indigenous spiritual traditions, cultural practices, and ancestral knowledge systems.</p>
              <p className="mb-4">Materials shared through this website, consultations, teachings, workshops, rituals, written resources, or digital products may contain culturally sensitive or spiritually significant content.</p>
              <p className="mb-4">Users agree not to:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Misrepresent the origins of teachings</li>
                <li>Commercialize sacred practices without consent</li>
                <li>Reproduce proprietary educational materials without permission</li>
                <li>Extract or exploit cultural knowledge in harmful, racist, appropriative, or colonial ways</li>
              </ul>
              <p>We reserve the right to deny access to services, teachings, or community spaces where these values are violated.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">6. Payment Information</h2>
              <p className="mb-4">Payments for services may be processed through third-party payment providers, mobile money platforms, banks, or payment gateways.</p>
              <p>We do not store full payment card information on our servers unless specifically stated through a secure payment processor. Users are encouraged to review the privacy policies of third-party payment providers used during transactions.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">7. Cookies & Tracking Technologies</h2>
              <p className="mb-4">Our website may use cookies and related technologies to:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Improve site performance</li>
                <li>Remember user preferences</li>
                <li>Analyze website traffic</li>
                <li>Enhance accessibility and functionality</li>
              </ul>
              <p>Users may disable cookies through browser settings, though some website features may not function properly as a result.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">8. Communications & Marketing</h2>
              <p className="mb-4">Where consent is provided, we may send: Newsletters, Program updates, Service announcements, Community events, Educational resources, Spiritual or wellness content.</p>
              <p>You may unsubscribe or opt out of communications at any time using the unsubscribe link or by contacting us directly.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">9. Third-Party Services & External Links</h2>
              <p>Our website may contain links to external websites, platforms, social media pages, or third-party services. We are not responsible for the privacy practices, content, or security of third-party websites or applications. Users engage with external platforms at their own discretion.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">10. Data Storage & Security</h2>
              <p className="mb-4">We take reasonable administrative, digital, and procedural measures to protect personal information against: Unauthorized access, Disclosure, Loss, Misuse, Alteration, Destruction.</p>
              <p>However, no internet-based platform or electronic storage method can be guaranteed to be completely secure. Users share information at their own informed discretion.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">11. International Users</h2>
              <p className="mb-4">As a Pan-African and globally accessible platform, users may access this website from various countries and jurisdictions.</p>
              <p>By using the website, you understand that your information may be processed or stored in jurisdictions with different data protection laws than your own. We strive to uphold privacy standards grounded in dignity, consent, and ethical care regardless of geographical location.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">12. Children & Minors</h2>
              <p>This website and its services are not intended for children under the age of 18 without parental or guardian involvement. We do not knowingly collect personal information from minors without appropriate consent.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">13. Your Rights</h2>
              <p className="mb-4">Depending on your jurisdiction, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Access personal information we hold about you</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Withdraw consent to data processing</li>
                <li>Request limitation of certain processing activities</li>
                <li>Opt out of marketing communications</li>
              </ul>
              <p>To exercise these rights, please contact us using the information provided below.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">14. Changes to This Privacy Policy</h2>
              <p className="mb-4">This Privacy Policy may be updated periodically to reflect changes in services, legal obligations, technology, or community practices.</p>
              <p>Updated versions will be posted on this page with the revised effective date. Continued use of the website after updates constitutes acceptance of the revised policy.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">15. Disclaimer Regarding Spiritual Services</h2>
              <p className="mb-4">Services offered by Charms, Roots & Relics Apothecary - including divination, ritual support, spiritual consultations, coaching, guided meditations, and ancestral practices - are spiritual, educational, and wellness-oriented in nature.</p>
              <p className="mb-4">They are not substitutes for:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Licensed medical care</li>
                <li>Psychiatric or psychological treatment</li>
                <li>Legal advice</li>
                <li>Financial advice</li>
                <li>Emergency services</li>
              </ul>
              <p>Users remain responsible for their personal decisions, actions, and wellbeing.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">16. Contact Information</h2>
              <p className="mb-4">For questions, concerns, or requests related to this Privacy Policy, please contact:</p>
              <p className="font-semibold">Charms, Roots & Relics Apothecary</p>
              <p>Email: charmsrootsandrelicsapothecary@gmail.com</p>
              <p>Instagram: @charmsrootsandrelicsapothecary</p>
              <p>Phone number: +254714839693</p>
              <p>Location: Kilifi, Kenya</p>
            </div>

            <div className="mt-8 pt-4 border-t border-border text-center italic">
              <p>At Charms, Roots & Relics Apothecary, privacy is relational, spiritual, cultural, and political.</p>
              <p className="mt-2">We believe that people seeking healing, reconnection, remembrance, and ancestral grounding deserve spaces where their stories, vulnerabilities, and spiritual journeys are handled with integrity and care.</p>
              <p className="mt-4 font-semibold">Thank you for trusting us with your presence.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Terms of Service Modal Component
function TermsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] h-[85vh] max-h-[85vh] overflow-y-auto font-serif">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
          <DialogTitle className="flex items-center justify-between text-2xl font-serif">
            <span className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-accent" />
              Terms of Service
            </span>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <div className="prose prose-sm max-w-none mt-6 font-serif">
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-serif font-semibold mb-2">TERMS OF SERVICE</h1>
              <p className="text-accent font-medium">Charms, Roots & Relics Apothecary</p>
              <p className="text-sm text-muted-foreground mt-1">Last Updated: May 2026</p>
            </div>

            <div>
              <p className="mb-4">Welcome to the website and services of Charms, Roots & Relics Apothecary ("the Apothecary," "we," "our," or "us"). These Terms of Service govern your access to and use of our website, spiritual services, consultations, educational materials, wellness offerings, digital content, products, and community spaces.</p>
              <p className="mb-4">By accessing this website, booking a service, purchasing a product, participating in a program, or engaging with our platforms, you agree to be legally bound by these Terms.</p>
              <p>If you do not agree with these Terms, please refrain from using this website or our services.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">1. About Charms, Roots & Relics Apothecary</h2>
              <p className="mb-4">Charms, Roots & Relics Apothecary is an Afro-Indigenous spiritual and wellness practice rooted in:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Decolonial and Pan-African frameworks</li>
                <li>Afro-Indigenous spiritual revival and preservation</li>
                <li>Holistic wellness and ancestral reconnection</li>
                <li>Ritual arts, divination, and spiritual education</li>
                <li>Afro-feminist ethics of care, dignity, and community accountability</li>
              </ul>
              <p>Our offerings may include spiritual consultations, divination, ritual services, altar consultations, wellness coaching, educational content, guided meditations, spiritual products, and community programming.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">2. Eligibility & Use of Services</h2>
              <p className="mb-4">By using this website or engaging our services, you confirm that:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>You are at least 18 years old, or are participating with informed parental/guardian consent where legally permitted</li>
                <li>You are legally capable of entering into binding agreements</li>
                <li>You will not use our services for unlawful, exploitative, abusive, or harmful purposes</li>
                <li>You understand that spiritual services are participatory in nature and require personal discernment and responsibility</li>
              </ul>
              <p>We reserve the right to deny or discontinue services where necessary to protect the integrity, safety, or ethics of the practice and community.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">3. Nature of Spiritual & Wellness Services</h2>
              <p className="mb-4">All services provided by Charms, Roots & Relics Apothecary are offered for:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Spiritual support</li>
                <li>Cultural education</li>
                <li>Personal reflection</li>
                <li>Holistic wellness</li>
                <li>Ritual and ancestral engagement</li>
              </ul>
              <p className="mb-4">Our services are not intended to replace licensed: Medical care, Psychiatric or psychological treatment, Legal counsel, Financial advisory services, Crisis or emergency intervention services.</p>
              <p className="mb-4">Clients remain fully responsible for their personal choices, interpretations, actions, relationships, and decisions following any service.</p>
              <p>No specific spiritual, emotional, financial, legal, romantic, or material outcome is guaranteed.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">4. Consent & Personal Responsibility</h2>
              <p className="mb-4">By booking or participating in any service, you acknowledge that:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Spiritual work may involve emotionally or spiritually intense conversations</li>
                <li>Your participation is voluntary</li>
                <li>You retain autonomy over all decisions and actions</li>
                <li>You may discontinue participation at any time</li>
                <li>You are responsible for communicating personal boundaries, accessibility needs, and concerns</li>
              </ul>
              <p>Clients are encouraged to approach spiritual and wellness services with discernment, grounding, and personal accountability.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">5. Booking Policies</h2>
              <h3 className="text-lg font-semibold mb-2">a) Consultations</h3>
              <p className="mb-4">For in-person consultations - the consultation fee is paid before-hand to confirm the booking. For virtual consultations - the consultation fee is paid after the session via Mpesa, PayPal, Western Union or direct bank transfer.</p>
              
              <h3 className="text-lg font-semibold mb-2">b) Late Arrivals</h3>
              <p className="mb-4">Late arrivals may result in shortened sessions to preserve scheduling for other clients. Significant lateness may require rescheduling at our discretion.</p>
              
              <h3 className="text-lg font-semibold mb-2">c) Cancellations & Rescheduling</h3>
              <p className="mb-4">Clients are expected to provide reasonable notice for cancellations or rescheduling requests, especially for in-person sessions.</p>
              <p>Deposits or payments may be partially or fully non-refundable depending on: The nature of the service, Preparation already undertaken, Ritual materials already acquired, Time reserved for the booking. Emergency situations will be handled with reasonable compassion and discretion where possible.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">6. Payment Terms</h2>
              <p className="mb-4">All prices listed on the website or communicated directly are subject to review and change without prior notice.</p>
              <p className="mb-4">Payment may be requested: In full before service delivery, As a deposit, Through installment arrangements for long-term programs.</p>
              <p>Failure to complete agreed payments may result in delayed, suspended, or cancelled services. Clients are responsible for any transaction fees, currency conversion charges, or international transfer costs where applicable.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">7. Ritual Work & Spiritual Products</h2>
              <h3 className="text-lg font-semibold mb-2">a) Ritual Services</h3>
              <p className="mb-4">Rituals, spell work, cleansings, blessings, altar work, and related services are approached as sacred and intentional practices - not guaranteed mechanisms for controlling outcomes, people, or events.</p>
              <p className="mb-4">We do not guarantee: Immediate results, Specific manifestations, Permanent outcomes, Outcomes dependent on third-party behaviour.</p>
              <p className="mb-4">Spiritual work is influenced by multiple personal, relational, material, ancestral, and environmental factors.</p>
              
              <h3 className="text-lg font-semibold mb-2">b) Spiritual Products</h3>
              <p className="mb-4">Products such as mojo bags, nation sacks, spell jars, oils, powders, charms, and ritual tools are offered as spiritual and cultural items.</p>
              <p className="mb-4">Users assume responsibility for: Proper handling and storage, Allergic reactions or sensitivities, Safe use around children, pets, fire, or health conditions, Following any care instructions provided.</p>
              <p>Products are not intended to diagnose, treat, cure, or prevent medical conditions.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">8. Wellness Coaching Services</h2>
              <p className="mb-4">Holistic wellness coaching is collaborative and reflective in nature.</p>
              <p className="mb-4">Coaching services may include discussions relating to: Spiritual wellness, Emotional wellness, Lifestyle practices, Ritual structure, Ancestral connection, Self-reflection and accountability.</p>
              <p className="mb-4">Coaching does not constitute psychotherapy, clinical counseling, or medical treatment.</p>
              <p>Clients are responsible for seeking licensed healthcare support where appropriate.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">9. Intellectual Property & Cultural Protection</h2>
              <p className="mb-4">All content on this website - including but not limited to: Written teachings, Ritual frameworks, Educational materials, Guided meditations, Logos and branding, Audio and visual content, Workshop materials, Ritual structures and methodologies - is the intellectual and cultural property of Charms, Roots & Relics Apothecary unless otherwise stated.</p>
              <p className="mb-4">Users may not:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Reproduce materials without permission</li>
                <li>Commercialize teachings without consent</li>
                <li>Misrepresent teachings as their own</li>
                <li>Extract sacred knowledge for exploitative or appropriative purposes</li>
                <li>Use our work to perpetuate racism, colonialism, misogynoir, or cultural harm</li>
              </ul>
              <p>We reserve the right to pursue action against misuse, plagiarism, or harmful cultural exploitation.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">10. Community Conduct & Ethical Engagement</h2>
              <p className="mb-4">Users engaging our website, social platforms, educational spaces, or community offerings agree to engage respectfully.</p>
              <p className="mb-4">The following may result in removal, blocked access, or discontinued services:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Harassment or abuse</li>
                <li>Racism, anti-Blackness, or xenophobia</li>
                <li>Misogyny, queerphobia, transphobia, or ableism</li>
                <li>Spiritual manipulation or coercion</li>
                <li>Disrespect toward Afro-Indigenous traditions</li>
                <li>Hate speech or discriminatory conduct</li>
                <li>Boundary violations toward practitioners or community members</li>
              </ul>
              <p>We are committed to maintaining spaces rooted in dignity, accountability, and collective care.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">11. Testimonials & Public Sharing</h2>
              <p className="mb-4">Clients retain ownership over their personal experiences and stories.</p>
              <p className="mb-4">We will never publicly share identifying client information, testimonials, screenshots, ritual experiences, or session details without explicit permission.</p>
              <p>Likewise, clients agree not to record, distribute, or publicly share private sessions, teachings, or consultations without consent.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">12. Digital Products & Educational Materials</h2>
              <p className="mb-4">Digital content purchased or shared through the Apothecary is licensed for personal use only unless otherwise specified.</p>
              <p className="mb-4">Users may not: Redistribute paid materials, Upload materials to public sharing sites, Resell educational content, Share access credentials or private resources.</p>
              <p>Unauthorized distribution may result in revoked access and legal action where applicable.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">13. Limitation of Liability</h2>
              <p className="mb-4">To the fullest extent permitted by law, Charms, Roots & Relics Apothecary shall not be held liable for: Personal decisions made after services, Indirect or consequential losses, Emotional distress arising from interpretation of spiritual work, Delays beyond reasonable control, Misuse of spiritual products or ritual instructions, Technical interruptions to online services or digital delivery.</p>
              <p>Users engage all services voluntarily and at their own discretion.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">14. Website Use & Security</h2>
              <p className="mb-4">Users agree not to: Attempt unauthorized access to the website or systems, Interfere with website functionality, Upload malicious code or harmful material, Use the website for fraudulent activity, Scrape or reproduce website content without authorization.</p>
              <p>We reserve the right to restrict access where misuse is identified.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">15. Third-Party Services & Links</h2>
              <p className="mb-4">This website may reference or integrate third-party platforms, payment processors, social media services, or external websites.</p>
              <p>We are not responsible for: Third-party privacy practices, Service interruptions, External platform policies, Content hosted outside our website. Users engage third-party services at their own discretion.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">16. Refund Policy</h2>
              <p className="mb-4">Due to the energetic, preparatory, spiritual, and time-based nature of services, refunds may be limited or unavailable once work has commenced.</p>
              <p className="mb-4">Refund decisions are made at our discretion based on: The type of service booked, Time already invested, Materials used or acquired, Degree of service completion.</p>
              <p>Digital products are generally non-refundable once delivered.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">17. Modifications to Services & Terms</h2>
              <p className="mb-4">We reserve the right to: Modify or discontinue services, Update pricing, Change booking procedures, Amend these Terms at any time.</p>
              <p>Updated Terms will be published on this website with the revised effective date. Continued use of the website or services after updates constitutes acceptance of revised Terms.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">18. Governing Principles</h2>
              <p className="mb-4">While we may operate across multiple jurisdictions digitally, the ethical foundations of this practice are informed by: Afro-Indigenous frameworks of accountability, Community care ethics, Decolonial approaches to spiritual practice, Respect for ancestral traditions and sacred exchange.</p>
              <p>We aim to resolve concerns through integrity, dialogue, and mutual respect wherever possible.</p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold mb-3 text-accent">19. Contact Information</h2>
              <p className="mb-4">For questions regarding these Terms of Service, please contact:</p>
              <p className="font-semibold">Charms, Roots & Relics Apothecary</p>
              <p>Email: charmsrootsandrelicsapothecary@gmail.com</p>
              <p>Instagram: @charmsrootsandrelicsapothecary</p>
              <p>Phone number: +254724839693</p>
              <p>Location: Kilifi, Kenya</p>
            </div>

            <div className="mt-8 pt-4 border-t border-border text-center italic">
              <p>Charms, Roots & Relics Apothecary exists as both a spiritual practice and a cultural commitment.</p>
              <p className="mt-2">Our work is rooted in remembrance, restoration, ancestral continuity, and ethical care. By engaging this space, you enter into relationship not only with services and teachings, but with values grounded in dignity, reciprocity, responsibility, and respect for Afro-Indigenous traditions.</p>
              <p className="mt-4 font-semibold">We thank you for approaching this work with sincerity.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("subscribers").insert({ email: trimmed });

      if (error) {
        if (error.code === "23505") {
          toast.info("Already in our circle!", { 
            description: "This email is already subscribed." 
          });
        } else {
          throw error;
        }
      } else {
        toast.success("Welcome to the circle!", { 
          description: "You'll receive spiritual guidance and exclusive offerings." 
        });
      }
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalOpen = (type: "privacy" | "terms") => {
    if (type === "privacy") {
      setPrivacyModalOpen(true);
    } else {
      setTermsModalOpen(true);
    }
  };

  return (
    <>
      <footer className="relative bg-gradient-to-b from-primary/95 to-primary text-primary-foreground overflow-hidden">
        {/* African Geometric Pattern Border */}
        <div className="w-full h-16 md:h-20 overflow-hidden opacity-90">
          <img
            src={footerPattern}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
            loading="lazy"
          />
        </div>

        {/* Main Footer */}
        <div className="relative">
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 0L20 20L40 40L20 60L40 80L60 60L40 40L60 20Z' /%3E%3C/g%3E%3C/svg%3E")`
          }} />

          <div className="container mx-auto px-4 md:px-8 py-12 lg:py-16 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              
              {/* Brand Section */}
              <div className="lg:col-span-1">
                <Link to="/" className="flex items-center gap-3 mb-6 group">
                  <img
                    src={logo}
                    alt="Charms, Roots & Relics Apothecary"
                    className="w-12 h-12 object-contain transition-transform group-hover:scale-105 duration-300"
                  />
                  <div>
                    <span className="font-serif text-xl font-semibold tracking-tight">
                      Charms, Roots & Relics
                    </span>
                    <span className="block text-xs text-[hsl(var(--gold))] font-medium tracking-wider -mt-1">
                      APOTHECARY
                    </span>
                  </div>
                </Link>
                <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6 font-serif">
                  A cultural and educational initiative at the intersection of 
                  cultural preservation, decolonial education, and community-based 
                  knowledge sharing rooted in African epistemologies.
                </p>
                
                {/* Social Links */}
                <div className="space-y-4">
                  <h5 className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--gold))] font-serif">
                    Connect With Us
                  </h5>
                  <div className="flex items-center gap-3 flex-wrap">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[hsl(var(--gold))] hover:text-primary transition-all duration-300 text-[hsl(var(--gold))] ${social.color}`}
                        aria-label={social.name}
                      >
                        <social.icon />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-serif text-lg font-semibold mb-5 text-[hsl(var(--gold))] relative inline-block">
                  Quick Links
                  <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-[hsl(var(--gold))] mt-1"></div>
                </h4>
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-primary-foreground/70 hover:text-[hsl(var(--gold))] transition-all duration-300 text-sm flex items-center gap-2 group font-serif"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-[hsl(var(--gold))] transition-all duration-300"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources & Support */}
              <div>
                <h4 className="font-serif text-lg font-semibold mb-5 text-[hsl(var(--gold))] relative inline-block">
                  Resources
                  <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-[hsl(var(--gold))] mt-1"></div>
                </h4>
                <ul className="space-y-3 mb-8">
                  {resourcesLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-primary-foreground/70 hover:text-[hsl(var(--gold))] transition-all duration-300 text-sm flex items-center gap-2 group font-serif"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-[hsl(var(--gold))] transition-all duration-300"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <h4 className="font-serif text-lg font-semibold mb-5 text-[hsl(var(--gold))] relative inline-block">
                  Support
                  <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-[hsl(var(--gold))] mt-1"></div>
                </h4>
                <ul className="space-y-3">
                  {supportLinks.map((link) => (
                    <li key={link.name}>
                      {link.isModal ? (
                        <button
                          onClick={() => handleModalOpen(link.modalType as "privacy" | "terms")}
                          className="text-primary-foreground/70 hover:text-[hsl(var(--gold))] transition-all duration-300 text-sm flex items-center gap-2 group font-serif"
                        >
                          <span className="w-0 group-hover:w-2 h-0.5 bg-[hsl(var(--gold))] transition-all duration-300"></span>
                          {link.name}
                        </button>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-primary-foreground/70 hover:text-[hsl(var(--gold))] transition-all duration-300 text-sm flex items-center gap-2 group font-serif"
                        >
                          <span className="w-0 group-hover:w-2 h-0.5 bg-[hsl(var(--gold))] transition-all duration-300"></span>
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact & Newsletter */}
              <div>
                <h4 className="font-serif text-lg font-semibold mb-5 text-[hsl(var(--gold))] relative inline-block">
                  Contact
                  <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-[hsl(var(--gold))] mt-1"></div>
                </h4>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm group">
                    <Phone className="w-4 h-4 text-[hsl(var(--gold))] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <a
                      href="tel:+254714839693"
                      className="text-primary-foreground/70 hover:text-[hsl(var(--gold))] transition-colors font-serif"
                    >
                      +254 714 839693
                    </a>
                  </li>
                  <li className="flex items-start gap-3 text-sm group">
                    <Mail className="w-4 h-4 text-[hsl(var(--gold))] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <a
                      href="mailto:charmsrootsandrelicsapothecary@gmail.com"
                      className="text-primary-foreground/70 hover:text-[hsl(var(--gold))] transition-colors break-all text-sm font-serif"
                    >
                      charmsrootsandrelicsapothecary@gmail.com
                    </a>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-[hsl(var(--gold))] shrink-0 mt-0.5" />
                    <span className="text-primary-foreground/70 font-serif">
                      Kilifi, Kenya
                    </span>
                  </li>
                </ul>

                {/* Newsletter */}
                <div>
                  <h4 className="font-serif text-lg font-semibold mb-4 text-[hsl(var(--gold))] relative inline-block">
                    Newsletter
                    <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-[hsl(var(--gold))] mt-1"></div>
                  </h4>
                  <p className="text-primary-foreground/70 text-sm mb-4 font-serif">
                    Join our circle for spiritual guidance and exclusive offerings.
                  </p>
                  <form className="space-y-3" onSubmit={handleSubscribe}>
                    <div className="relative">
                      <Input
                        type="email"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        disabled={isSubmitting}
                        className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-[hsl(var(--gold))] focus:ring-[hsl(var(--gold))]/20 pr-12 font-serif"
                      />
                      <Send className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/40" />
                    </div>
                    <Button 
                      variant="gold" 
                      size="default" 
                      className="w-full group font-serif" 
                      type="submit" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          Subscribe
                          <Heart className="w-3 h-3 ml-2 group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/20">
          <div className="container mx-auto px-4 md:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
              <p className="text-primary-foreground/60 text-center md:text-left font-serif">
                © {new Date().getFullYear()} Charms, Roots & Relics Apothecary. 
                <span className="hidden md:inline"> All rights reserved.</span>
                <span className="block md:hidden text-xs mt-1">All rights reserved.</span>
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                <button
                  onClick={() => handleModalOpen("privacy")}
                  className="text-primary-foreground/60 hover:text-[hsl(var(--gold))] transition-colors text-xs uppercase tracking-wider font-serif"
                >
                  Privacy
                </button>
                <span className="text-primary-foreground/20 hidden md:inline">•</span>
                <button
                  onClick={() => handleModalOpen("terms")}
                  className="text-primary-foreground/60 hover:text-[hsl(var(--gold))] transition-colors text-xs uppercase tracking-wider font-serif"
                >
                  Terms
                </button>
                <span className="text-primary-foreground/20 hidden md:inline">•</span>
               
              </div>
            </div>
            
            {/* Made with love text */}
            <div className="text-center mt-4">
              <p className="text-primary-foreground/40 text-xs font-serif">
                Made with <Heart className="w-3 h-3 inline text-[hsl(var(--gold))]" /> in service to the ancestors
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PrivacyPolicyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
      <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
    </>
  );
}