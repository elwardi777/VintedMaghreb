
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/ui-custom/Navbar';
import Footer from '@/components/ui-custom/Footer';
import { getTranslation } from '@/components/ui-custom/Navbar';

const Shipping = () => {
  const [language, setLanguage] = useState<'en' | 'fr' | 'es' | 'ar'>('en');
  
  // Listen for language changes
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && ['en'].includes(savedLanguage)) {
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
        <title>{t("shipping")} | VintedMaghreb</title>
        <meta name="description" content={t("Learn about shipping options and policies")} />
      </Helmet>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">{t("shipping")}</h1>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{t("Shipping Options")}</h2>
            
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-3 text-left">{t("Service")}</th>
                    <th className="p-3 text-left">{t("Estimated Delivery")}</th>
                    <th className="p-3 text-left">{t("Price Range")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">{t("Standard Shipping")}</td>
                    <td className="p-3">{t("3-7 business days")}</td>
                    <td className="p-3">15-30 DH</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">{t("Express Shipping")}</td>
                    <td className="p-3">{t("1-3 business days")}</td>
                    <td className="p-3">40-60 DH</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">{t("Local Pickup")}</td>
                    <td className="p-3">{t("By arrangement")}</td>
                    <td className="p-3">{t("Free")}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">{t("International Shipping")}</td>
                    <td className="p-3">{t("7-14 business days")}</td>
                    <td className="p-3">{t("Varies by destination")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="text-muted-foreground mb-4">
              {t("Actual shipping costs will be calculated at checkout based on the seller's location, the shipping destination, and the size/weight of the items.")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">{t("For Buyers")}</h2>
              <div className="space-y-4">
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="font-medium mb-2">{t("Tracking Your Order")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("Once your order has been shipped, you'll receive a tracking number via email. You can also find tracking information in your account under 'Orders'.")}
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="font-medium mb-2">{t("Delivery Issues")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("If your package is delayed or lost, please contact us within 14 days of the expected delivery date. We'll work with the seller and the shipping carrier to resolve the issue.")}
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="font-medium mb-2">{t("International Orders")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("Please note that international orders may be subject to customs duties and taxes, which are the responsibility of the buyer. Delivery times may also be longer for international shipments.")}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">{t("For Sellers")}</h2>
              <div className="space-y-4">
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="font-medium mb-2">{t("Shipping Guidelines")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("You're responsible for arranging shipping for your sold items. We recommend using tracked shipping for all orders to protect both you and the buyer.")}
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="font-medium mb-2">{t("Packaging Requirements")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("All items should be securely packaged to prevent damage during transit. We encourage the use of recycled or eco-friendly packaging materials whenever possible.")}
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="font-medium mb-2">{t("Shipping Deadlines")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("Please ship sold items within 3 business days of receiving payment. Once shipped, update the order with tracking information so the buyer can monitor delivery progress.")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{t("Shipping Partners")}</h2>
            <p className="text-muted-foreground mb-6">
              {t("We partner with the following shipping carriers to provide reliable delivery services:")}
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 flex items-center justify-center">
                <span className="font-medium">Amana</span>
              </div>
              <div className="border rounded-lg p-4 flex items-center justify-center">
                <span className="font-medium">Poste Maroc</span>
              </div>
              <div className="border rounded-lg p-4 flex items-center justify-center">
                <span className="font-medium">DHL</span>
              </div>
              <div className="border rounded-lg p-4 flex items-center justify-center">
                <span className="font-medium">FedEx</span>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">{t("Need More Help?")}</h2>
            <p className="text-muted-foreground">
              {t("If you have questions about shipping that aren't answered here, please contact our support team at")} <a href="mailto:support@vintedmaghreb.com" className="text-primary">support@vintedmaghreb.com</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Shipping;
