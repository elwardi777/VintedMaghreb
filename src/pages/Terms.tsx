
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/ui-custom/Navbar';
import Footer from '@/components/ui-custom/Footer';
import { getTranslation } from '@/components/ui-custom/Navbar';

const Terms = () => {
  const [language, setLanguage] = useState<'en' | 'fr' | 'es' | 'ar'>('en');
  
  // Listen for language changes
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && ['en', 'fr', 'es', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage as 'en' | 'fr' | 'es' | 'ar');
    }
    
    const handleLanguageChange = (e: any) => {
      setLanguage(e.detail as 'en' | 'fr' | 'es' | 'ar');
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);
  
  const t = (key: string) => getTranslation(key, language);
  
  return (
    <>
      <Helmet>
        <title>{t("Terms of Service")} | VintedMaghreb</title>
        <meta name="description" content="VintedMaghreb terms of service and user agreement" />
      </Helmet>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">{t("Terms of Service")}</h1>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <p className="text-muted-foreground mb-4">
                {t("Last updated: June 1, 2025")}
              </p>
              <p className="text-muted-foreground mb-8">
                {t("Please read these Terms of Service carefully before using the VintedMaghreb platform.")}
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">1. {t("Acceptance of Terms")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("By accessing or using VintedMaghreb, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.")}
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">2. {t("User Accounts")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("When you create an account with us, you guarantee that the information you provide is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the platform.")}
              </p>
              <p className="text-muted-foreground mb-4">
                {t("You are responsible for maintaining the confidentiality of your account and password, including but not limited to restricting access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password.")}
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">3. {t("Buying and Selling")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("VintedMaghreb is a platform that allows users to buy and sell pre-owned fashion items. When listing items for sale, you agree to provide accurate descriptions and images of the items. As a buyer, you acknowledge that you are purchasing pre-owned items that may show signs of wear as described in the listing.")}
              </p>
              <p className="text-muted-foreground mb-4">
                {t("VintedMaghreb is not responsible for the quality, safety, or legality of items listed, the accuracy of listings, or the ability of sellers to sell items or buyers to pay for items.")}
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">4. {t("Prohibited Items")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("The following items are prohibited from being listed or sold on VintedMaghreb:")}
              </p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>{t("Counterfeit or replica items")}</li>
                <li>{t("Stolen goods")}</li>
                <li>{t("Hazardous or dangerous items")}</li>
                <li>{t("Items that infringe upon intellectual property rights")}</li>
                <li>{t("Adult content or explicit material")}</li>
                <li>{t("Weapons or illegal items")}</li>
                <li>{t("Any items prohibited by law")}</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                {t("VintedMaghreb reserves the right to remove any listing that violates these prohibitions.")}
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">5. {t("Fees and Payments")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("Listing items on VintedMaghreb is free. When a sale is made, VintedMaghreb charges a service fee, which is a percentage of the sale price plus a fixed fee. The exact fee structure is available on our website and may be updated from time to time.")}
              </p>
              <p className="text-muted-foreground mb-4">
                {t("Payments between buyers and sellers are processed through our secure payment system. Sellers receive payment once the buyer confirms receipt of the item or after a specified period if no issues are reported.")}
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">6. {t("Termination")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("VintedMaghreb reserves the right to terminate your account and access to the platform at our sole discretion, without notice, for any reason, including if you breach these Terms of Service.")}
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">7. {t("Limitation of Liability")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("In no event shall VintedMaghreb, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the platform.")}
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">8. {t("Changes to Terms")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("VintedMaghreb reserves the right to modify or replace these Terms of Service at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.")}
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">9. {t("Contact Us")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("If you have any questions about these Terms of Service, please contact us at")} <a href="mailto:legal@vintedmaghreb.com" className="text-primary">legal@vintedmaghreb.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Terms;
