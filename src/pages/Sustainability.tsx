
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/ui-custom/Navbar';
import Footer from '@/components/ui-custom/Footer';
import { getTranslation } from '@/components/ui-custom/Navbar';

const Sustainability = () => {
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
        <title>{t("Sustainability")} | VintedMaghreb</title>
        <meta name="description" content={t("Learn about our commitment to sustainable fashion")} />
      </Helmet>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">{t("Sustainability")}</h1>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{t("Our Commitment to the Planet")}</h2>
            <p className="text-lg text-muted-foreground mb-6">
              {t("At VintedMaghreb, sustainability isn't just a buzzword—it's at the core of everything we do. The fashion industry is one of the world's largest polluters, and by choosing second-hand, our community is part of the solution.")}
            </p>
            
            <div className="bg-primary/5 p-6 rounded-lg my-8">
              <h3 className="text-xl font-medium mb-3">{t("The Impact of Second-Hand Fashion")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">82%</p>
                  <p className="text-muted-foreground">{t("Reduction in carbon footprint compared to buying new")}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">4,000L</p>
                  <p className="text-muted-foreground">{t("Water saved for every pre-loved item purchased")}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">1M+</p>
                  <p className="text-muted-foreground">{t("Items given a second life through our platform")}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{t("Our Sustainability Initiatives")}</h2>
            
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 bg-card p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-3">{t("Carbon-Neutral Shipping")}</h3>
                  <p className="text-muted-foreground">
                    {t("We offset the carbon emissions of every package shipped through our platform by investing in renewable energy projects.")}
                  </p>
                </div>
                
                <div className="md:w-1/3 bg-card p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-3">{t("Sustainable Packaging")}</h3>
                  <p className="text-muted-foreground">
                    {t("We encourage our sellers to use recycled packaging materials and provide guides on eco-friendly shipping practices.")}
                  </p>
                </div>
                
                <div className="md:w-1/3 bg-card p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-3">{t("Community Education")}</h3>
                  <p className="text-muted-foreground">
                    {t("We regularly share resources about sustainable fashion and the positive environmental impact of choosing second-hand.")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{t("Our Goals for the Future")}</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mr-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white">1</div>
                <div>
                  <h3 className="font-medium">{t("Zero Waste Operations by 2026")}</h3>
                  <p className="text-muted-foreground">{t("We're working toward eliminating all waste from our offices and operations.")}</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="mr-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white">2</div>
                <div>
                  <h3 className="font-medium">{t("Expanding Repair and Upcycling Programs")}</h3>
                  <p className="text-muted-foreground">{t("We'll be launching initiatives to help extend the life of garments through repair services and creative upcycling.")}</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="mr-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white">3</div>
                <div>
                  <h3 className="font-medium">{t("Textile Recycling Partnerships")}</h3>
                  <p className="text-muted-foreground">{t("For items that can no longer be worn, we're developing partnerships with textile recycling programs.")}</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">{t("Join Us on This Journey")}</h2>
            <p className="text-lg text-muted-foreground">
              {t("Every purchase, every sale, and every item shared on VintedMaghreb contributes to a more sustainable fashion ecosystem. Together, we're proving that style and sustainability can go hand in hand.")}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Sustainability;
