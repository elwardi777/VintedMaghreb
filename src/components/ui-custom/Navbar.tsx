
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, Menu, X, ShoppingBag, UserCircle, LogOut, Globe } from 'lucide-react';
import Button from './Button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const translations = {
  en: {
    women: 'Women',
    men: 'Men',
    kids: 'Kids',
    search: 'Search for items...',
    favorites: 'Favorites',
    cart: 'Cart',
    login: 'Login',
    register: 'Register',
    signOut: 'Sign out',
    sellNow: 'Sell Now',
    welcome: 'Welcome to VintedMaghreb',
    featuredProducts: 'Featured Products',
    viewAll: 'View All',
    shopNow: 'Shop Now',
    trending: 'Trending',
    newArrivals: 'New Arrivals',
    priceFilter: 'Filter by Price',
    sortBy: 'Sort by',
    category: 'Category',
    size: 'Size',
    condition: 'Condition',
    brand: 'Brand',
    color: 'Color',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    description: 'Description',
    details: 'Details',
    shipping: 'Shipping',
    returns: 'Returns',
    relatedProducts: 'Related Products',
    contactUs: 'Contact Us',
    aboutUs: 'About Us',
    helpCenter: 'Help Center',
    myAccount: 'My Account',
    orders: 'Orders',
    settings: 'Settings',
    language: 'Language',
    
    // Home page specific content
    sustainableFashion: 'Sustainable Fashion',
    findYourPerfect: 'Find Your Perfect',
    styleMatch: 'Style Match',
    discoverUnique: 'Discover unique pre-loved fashion, sell your own clothes, and join a community that values sustainability.',
    startShopping: 'Start Shopping',
    sellItems: 'Sell Items',
    fashionModel: 'Fashion Model',
    featuredCollection: 'Featured Collection',
    summerEssentials: 'Summer Essentials',
    refreshingStyles: 'Refreshing styles for the warm season',
    discoverPopular: 'Discover our most popular items this season',
    all: 'All',
    satisfactory: 'Satisfactory',
    good: 'Good',
    veryGood: 'Very good',
    likeNew: 'Like new',
    needHelp: 'Need help?',
    supportReady: 'Our support team is always ready to assist you with any questions or issues.',
    contactSupport: 'Contact Support',
    shop: 'Shop',
    company: 'Company',
    sustainability: 'Sustainability',
    help: 'Help',
    connect: 'Connect',
    allRightsReserved: 'All rights reserved',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    cookieSettings: 'Cookie Settings',
    backToShopping: 'Back to Shopping',
    oneSize: 'One size',
    age: 'Age'
  },
  fr: {
    women: 'Femmes',
    men: 'Hommes',
    kids: 'Enfants',
    search: 'Rechercher des articles...',
    favorites: 'Favoris',
    cart: 'Panier',
    login: 'Connexion',
    register: 'Inscription',
    signOut: 'Déconnexion',
    sellNow: ' Sell Now',
    welcome: 'Bienvenue sur VintedMaghreb',
    featuredProducts: 'Produits en vedette',
    viewAll: 'Voir tout',
    shopNow: 'Acheter maintenant',
    trending: 'Tendances',
    newArrivals: 'Nouveautés',
    priceFilter: 'Filtrer par prix',
    sortBy: 'Trier par',
    category: 'Catégorie',
    size: 'Taille',
    condition: 'État',
    brand: 'Marque',
    color: 'Couleur',
    addToCart: 'Ajouter au panier',
    buyNow: 'Acheter maintenant',
    description: 'Description',
    details: 'Détails',
    shipping: 'Livraison',
    returns: 'Retours',
    relatedProducts: 'Produits associés',
    contactUs: 'Contactez-nous',
    aboutUs: 'À propos de nous',
    helpCenter: 'Centre d\'aide',
    myAccount: 'Mon compte',
    orders: 'Commandes',
    settings: 'Paramètres',
    language: 'Langue',
    
    // Home page specific content
    sustainableFashion: 'Mode Durable',
    findYourPerfect: 'Trouvez Votre',
    styleMatch: 'Style Parfait',
    discoverUnique: 'Découvrez des vêtements uniques d\'occasion, vendez vos propres vêtements et rejoignez une communauté qui valorise la durabilité.',
    startShopping: 'Commencer à Magasiner',
    sellItems: ' sell Now des Articles',
    fashionModel: 'Modèle de Mode',
    featuredCollection: 'Collection en Vedette',
    summerEssentials: 'Essentiels d\'Été',
    refreshingStyles: 'Styles rafraîchissants pour la saison chaude',
    discoverPopular: 'Découvrez nos articles les plus populaires cette saison',
    all: 'Tout',
    satisfactory: 'Satisfaisant',
    good: 'Bon',
    veryGood: 'Très bon',
    likeNew: 'Comme neuf',
    needHelp: 'Besoin d\'aide?',
    supportReady: 'Notre équipe d\'assistance est toujours prête à vous aider pour toute question ou problème.',
    contactSupport: 'Contacter le Support',
    shop: 'Boutique',
    company: 'Entreprise',
    sustainability: 'Durabilité',
    help: 'Aide',
    connect: 'Connecter',
    allRightsReserved: 'Tous droits réservés',
    termsOfService: 'Conditions d\'utilisation',
    privacyPolicy: 'Politique de confidentialité',
    cookieSettings: 'Paramètres des cookies',
    backToShopping: 'Retour aux achats',
    oneSize: 'Taille unique',
    age: 'Âge'
  },
  es: {
    women: 'Mujeres',
    men: 'Hombres',
    kids: 'Niños',
    search: 'Buscar artículos...',
    favorites: 'Favoritos',
    cart: 'Carrito',
    login: 'Iniciar sesión',
    register: 'Registrarse',
    signOut: 'Cerrar sesión',
    sellNow: 'Vender ahora',
    welcome: 'Bienvenido a VintedMaghreb',
    featuredProducts: 'Productos destacados',
    viewAll: 'Ver todo',
    shopNow: 'Comprar ahora',
    trending: 'Tendencias',
    newArrivals: 'Nuevas llegadas',
    priceFilter: 'Filtrar por precio',
    sortBy: 'Ordenar por',
    category: 'Categoría',
    size: 'Talla',
    condition: 'Condición',
    brand: 'Marca',
    color: 'Color',
    addToCart: 'Añadir al carrito',
    buyNow: 'Comprar ahora',
    description: 'Descripción',
    details: 'Detalles',
    shipping: 'Envío',
    returns: 'Devoluciones',
    relatedProducts: 'Productos relacionados',
    contactUs: 'Contáctenos',
    aboutUs: 'Sobre nosotros',
    helpCenter: 'Centro de ayuda',
    myAccount: 'Mi cuenta',
    orders: 'Pedidos',
    settings: 'Configuración',
    language: 'Idioma',
    
    // Home page specific content
    sustainableFashion: 'Moda Sostenible',
    findYourPerfect: 'Encuentra Tu',
    styleMatch: 'Estilo Perfecto',
    discoverUnique: 'Descubre moda única de segunda mano, vende tu propia ropa y únete a una comunidad que valora la sostenibilidad.',
    startShopping: 'Empezar a Comprar',
    sellItems: 'Vender Artículos',
    fashionModel: 'Modelo de Moda',
    featuredCollection: 'Colección Destacada',
    summerEssentials: 'Esenciales de Verano',
    refreshingStyles: 'Estilos refrescantes para la temporada cálida',
    discoverPopular: 'Descubre nuestros artículos más populares esta temporada',
    all: 'Todo',
    satisfactory: 'Satisfactorio',
    good: 'Bueno',
    veryGood: 'Muy bueno',
    likeNew: 'Como nuevo',
    needHelp: '¿Necesitas ayuda?',
    supportReady: 'Nuestro equipo de soporte está siempre listo para ayudarte con cualquier pregunta o problema.',
    contactSupport: 'Contactar Soporte',
    shop: 'Tienda',
    company: 'Empresa',
    sustainability: 'Sostenibilidad',
    help: 'Ayuda',
    connect: 'Conectar',
    allRightsReserved: 'Todos los derechos reservados',
    termsOfService: 'Términos de Servicio',
    privacyPolicy: 'Política de Privacidad',
    cookieSettings: 'Configuración de Cookies',
    backToShopping: 'Volver a Comprar',
    oneSize: 'Talla única',
    age: 'Edad'
  },
  ar: {
    women: 'نساء',
    men: 'رجال',
    kids: 'أطفال',
    search: 'بحث عن منتجات...',
    favorites: 'المفضلة',
    cart: 'السلة',
    login: 'تسجيل الدخول',
    register: 'التسجيل',
    signOut: 'تسجيل الخروج',
    sellNow: 'بيع الآن',
    welcome: 'مرحبًا بك في فينتيد المغرب',
    featuredProducts: 'منتجات مميزة',
    viewAll: 'عرض الكل',
    shopNow: 'تسوق الآن',
    trending: 'الأكثر رواجًا',
    newArrivals: 'وصل حديثًا',
    priceFilter: 'تصفية حسب السعر',
    sortBy: 'ترتيب حسب',
    category: 'الفئة',
    size: 'الحجم',
    condition: 'الحالة',
    brand: 'الماركة',
    color: 'اللون',
    addToCart: 'أضف إلى السلة',
    buyNow: 'اشترِ الآن',
    description: 'الوصف',
    details: 'التفاصيل',
    shipping: 'الشحن',
    returns: 'الإرجاع',
    relatedProducts: 'منتجات ذات صلة',
    contactUs: 'اتصل بنا',
    aboutUs: 'من نحن',
    helpCenter: 'مركز المساعدة',
    myAccount: 'حسابي',
    orders: 'الطلبات',
    settings: 'الإعدادات',
    language: 'اللغة',
    
    // Home page specific content
    sustainableFashion: 'الأزياء المستدامة',
    findYourPerfect: 'اعثر على',
    styleMatch: 'أسلوبك المثالي',
    discoverUnique: 'اكتشف أزياء فريدة مستعملة، وبع ملابسك الخاصة، وانضم إلى مجتمع يقدر الاستدامة.',
    startShopping: 'ابدأ التسوق',
    sellItems: 'بيع العناصر',
    fashionModel: 'عارضة أزياء',
    featuredCollection: 'مجموعة مميزة',
    summerEssentials: 'أساسيات الصيف',
    refreshingStyles: 'أساليب منعشة لموسم الدفء',
    discoverPopular: 'اكتشف أكثر عناصرنا شعبية هذا الموسم',
    all: 'الكل',
    satisfactory: 'مرضي',
    good: 'جيد',
    veryGood: 'جيد جدا',
    likeNew: 'كالجديد',
    needHelp: 'بحاجة للمساعدة؟',
    supportReady: 'فريق الدعم لدينا جاهز دائمًا لمساعدتك في أي أسئلة أو مشاكل.',
    contactSupport: 'الاتصال بالدعم',
    shop: 'المتجر',
    company: 'الشركة',
    sustainability: 'الاستدامة',
    help: 'المساعدة',
    connect: 'تواصل',
    allRightsReserved: 'جميع الحقوق محفوظة',
    termsOfService: 'شروط الخدمة',
    privacyPolicy: 'سياسة الخصوصية',
    cookieSettings: 'إعدادات ملفات تعريف الارتباط',
    backToShopping: 'العودة إلى التسوق',
    oneSize: 'مقاس واحد',
    age: 'العمر'
  }
};

export const getTranslation = (key: string, lang: 'en' | 'fr' | 'es' | 'ar'): string => {
  return (translations[lang] as any)[key] || key;
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [logoHovered, setLogoHovered] = useState(false);
  const [logoLetterStates, setLogoLetterStates] = useState<boolean[]>([]);
  const [language, setLanguage] = useState<'en' | 'fr' | 'es' | 'ar'>('en'); 
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCartCount } = useCart();

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        setIsAuthenticated(true);
        setCurrentUser(JSON.parse(userData));
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    };
    
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && ['en', 'fr', 'es', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage as 'en' | 'fr' | 'es' | 'ar');
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
      window.dispatchEvent(new CustomEvent('languageChange', { detail: savedLanguage }));
    }
    
    checkAuth();
    
    window.addEventListener('storage', checkAuth);
    
    setLogoLetterStates(Array("VintedMaghreb".length).fill(false));
    
    const interval = setInterval(() => {
      setLogoLetterStates(prev => {
        const newStates = [...prev];
        const randomIndex = Math.floor(Math.random() * newStates.length);
        newStates[randomIndex] = !newStates[randomIndex];
        return newStates;
      });
    }, 300);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      closeMenu();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
    
    toast({
      title: getTranslation("signOut", language),
      description: getTranslation("You have been successfully logged out", language),
    });
    
    navigate('/');
  };

  const changeLanguage = (lang: 'en' | 'fr' | 'es' | 'ar') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
    
    toast({
      title: "Language changed",
      description: `The language has been changed to ${lang === 'en' ? 'English' : lang === 'fr' ? 'French' : lang === 'es' ? 'Spanish' : 'Arabic'}`,
    });
    
    window.location.reload();
  };
  
  const t = translations[language];
  const cartCount = getCartCount();

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-white shadow-md py-2" : "bg-white/80 backdrop-blur-md py-4"
    )}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center" 
            onClick={closeMenu}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
          <div className="flex items-center gap-2">
  <img src="/images/logog.png" alt="Logo"    style={{ width: '70px', height: '70px' }}/>
  <span className="text-xl font-bold overflow-hidden">
    {"VintedMaghreb".split('').map((letter, index) => (
      <span
        key={index}
        className={cn(
          "inline-block transition-all duration-300",
          logoHovered || logoLetterStates[index]
            ? "text-primary transform translate-y-[-2px]"
            : "text-secondary"
        )}
        style={{
          transitionDelay: `${index * 30}ms`
        }}
      >
        {letter}
      </span>
    ))}
  </span>
</div>

          </Link>
          
        
          
          <form 
            onSubmit={handleSearch} 
            className="hidden md:flex items-center relative max-w-md flex-1 mx-4"
          >
            <Input 
              type="search" 
              placeholder={t.search} 
              className="w-full pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </form>
          
          <div className="hidden md:flex items-center space-x-4">
        
            
            <Link to="/favorites" className="p-2 rounded-full hover:bg-accent transition-all duration-300 hover:scale-110">
              <Heart className="h-5 w-5" />
            </Link>
            
            {isAuthenticated && (
              <Link to="/cart" className="p-2 rounded-full hover:bg-accent transition-all duration-300 hover:scale-110 relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                <div className="flex items-center">
                  <div className="relative group">
                    <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-accent transition-colors">
                      <UserCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">{currentUser?.username}</span>
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t.signOut}
                      </button>
                    </div>
                  </div>
                </div>
                <Link to="/sell">
                  <Button className="btn-morocco hover:scale-105 transition-all duration-300">{t.sellNow}</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="outline" className="hover:scale-105 transition-all duration-300">{t.login}</Button>
                </Link>
                <Link to="/auth/register">
                  <Button className="btn-morocco hover:scale-105 transition-all duration-300">{t.register}</Button>
                </Link>
              </>
            )}
          </div>
          
          <button 
            className="md:hidden p-2 rounded-full hover:bg-accent transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      <div className={cn(
        "fixed inset-0 bg-white z-40 transition-transform duration-300 pt-20 pb-6 px-4 overflow-auto",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        
        
        {/*<nav className="flex flex-col space-y-4 mb-8">
          <Link 
            to="/women" 
            className="text-lg font-medium py-2 border-b hover:text-primary transition-colors"
            onClick={closeMenu}
          >


          
            {t.women}
          </Link>
          <Link 
            to="/men" 
            className="text-lg font-medium py-2 border-b hover:text-primary transition-colors"
            onClick={closeMenu}
          >
            {t.men}
          </Link>
          <Link 
            to="/kids" 
            className="text-lg font-medium py-2 border-b hover:text-primary transition-colors"
            onClick={closeMenu}
          >
            {t.kids}
          </Link>
        </nav>
        */}
        
        <form 
          onSubmit={handleSearch} 
          className="flex items-center relative mb-8"
        >
          <Input 
            type="search" 
            placeholder={t.search} 
            className="w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </form>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <div className="flex items-center space-x-2 py-2 mb-2">
            </div>
            <div className="grid grid-cols-2 gap-2">
            
             
            </div>
          </div>
          
          <Link 
            to="/favorites" 
            className="flex items-center space-x-2 py-2 hover:text-primary transition-colors"
            onClick={closeMenu}
          >
            <Heart className="h-5 w-5" />
            <span>{t.favorites}</span>
          </Link>
          
          {isAuthenticated && (
            <Link 
              to="/cart" 
              className="flex items-center space-x-2 py-2 hover:text-primary transition-colors"
              onClick={closeMenu}
            >
              <ShoppingBag className="h-5 w-5" />
              <span>{t.cart}</span>
              {cartCount > 0 && (
                <span className="ml-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2 py-2">
                <UserCircle className="h-5 w-5" />
                <span>{currentUser?.username}</span>
              </div>
              <button 
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="flex items-center space-x-2 py-2 text-red-500 hover:text-red-700 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>{t.signOut}</span>
              </button>
              <div className="pt-4">
                <Link to="/sell" onClick={closeMenu}>
                  <Button className="w-full btn-morocco">{t.sellNow}</Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="pt-4 flex flex-col space-y-3">
                <Link to="/auth/login" onClick={closeMenu}>
                  <Button variant="outline" className="w-full">{t.login}</Button>
                </Link>
                <Link to="/auth/register" onClick={closeMenu}>
                  <Button className="w-full btn-morocco">{t.register}</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

