
import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, ChevronLeft, ChevronRight, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/ui-custom/Navbar';
import Footer from '@/components/ui-custom/Footer';
import Button from '@/components/ui-custom/Button';
import { useCart } from '@/contexts/CartContext';
import { Product, products as defaultProducts } from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getTranslation } from '@/components/ui-custom/Navbar';

const ProductDetail = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [language, setLanguage] = useState<'en' | 'fr' | 'es' | 'ar'>('en');
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFavEffect, setShowFavEffect] = useState(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);
  
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

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        // Try to get product from localStorage first
        const storedProducts = localStorage.getItem('products');
        const productsSource = storedProducts 
          ? JSON.parse(storedProducts) 
          : defaultProducts;
        
        window.mockProductData = productsSource;
        
        const foundProduct = productsSource.find((p: Product) => p.id === productId);
        
        if (foundProduct) {
          // Ensure the product has an images array, defaulting to the main image if not
          if (!foundProduct.images || !Array.isArray(foundProduct.images) || foundProduct.images.length === 0) {
            foundProduct.images = [foundProduct.image];
          }
          setProduct(foundProduct);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Check authentication status
    const checkAuth = () => {
      const userData = localStorage.getItem('currentUser');
      setIsAuthenticated(!!userData);
    };

    // Check if product is in favorites
    const checkFavorite = () => {
      try {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const isInFavorites = favorites.some((fav: Product) => fav.id === productId);
        setIsFavorite(isInFavorites);
      } catch (error) {
        console.error("Error checking favorites:", error);
      }
    };

    fetchProduct();
    checkAuth();
    checkFavorite();
  }, [productId]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: t("Authentication required"),
        description: t("Please login or create an account to add items to your cart."),
        variant: "destructive",
      });
      return;
    }
    
    if (product) {
      addToCart(product);
      toast({
        title: t("Item added to cart"),
        description: `${product.name} ${t("has been added to your cart")}.`,
      });
    }
  };

  const toggleFavorite = () => {
    if (!product) return;

    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favorites.filter((fav: Product) => fav.id !== product.id);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsFavorite(false);
        
        toast({
          title: t("Removed from favorites"),
          description: `${product.name} ${t("has been removed from your favorites")}.`,
        });
      } else {
        // Add to favorites
        const updatedFavorites = [...favorites, product];
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsFavorite(true);
        
        // Show heart effect
        setShowFavEffect(true);
        setTimeout(() => setShowFavEffect(false), 1000);
        
        toast({
          title: t("Added to favorites"),
          description: `${product.name} ${t("has been added to your favorites")}.`,
        });
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast({
        title: t("Error"),
        description: t("Failed to update favorites. Please try again."),
        variant: "destructive",
      });
    }
  };

  const changeImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleNextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images!.length);
      scrollThumbnailIntoView((currentImageIndex + 1) % product.images!.length);
    }
  };

  const handlePrevImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images!.length) % product.images!.length);
      scrollThumbnailIntoView((currentImageIndex - 1 + product.images!.length) % product.images!.length);
    }
  };

  const scrollThumbnailIntoView = (index: number) => {
    if (thumbnailsRef.current) {
      const thumbnails = thumbnailsRef.current.querySelectorAll('button');
      if (thumbnails[index]) {
        thumbnails[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    setMousePosition({ x, y });
  };

  const handleImageMouseEnter = () => setIsZoomed(true);
  const handleImageMouseLeave = () => setIsZoomed(false);
  
  const handleGoBack = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.back();
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="pt-20 pb-16 min-h-screen flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-40 w-40 bg-gray-200 rounded-md mb-4"></div>
            <div className="h-6 w-40 bg-gray-200 rounded-md"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="pt-20 pb-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">{t('Product Not Found')}</h1>
            <p className="text-muted-foreground">{t('The product you\'re looking for doesn\'t exist.')}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} | VintedMaghreb</title>
        <meta name="description" content={product.description} />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-6 py-8">
          {/* Breadcrumb and Back */}
          <div className="mb-6 flex items-center text-sm text-muted-foreground">
            <Button 
              variant="ghost" 
              className="p-0 flex items-center text-muted-foreground hover:text-primary" 
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t('backToShopping')}
            </Button>
            <span className="mx-2">/</span>
            <span>{product.category}</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-foreground">{product.name}</span>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Product Image */}
              <div 
                className="relative aspect-square rounded-lg overflow-hidden border group"
                onMouseMove={handleImageMouseMove}
                onMouseEnter={handleImageMouseEnter}
                onMouseLeave={handleImageMouseLeave}
              >
                <div className={cn(
                  "absolute inset-0 transition-transform duration-300 ease-out",
                  isZoomed ? "scale-125" : "scale-100"
                )} 
                style={{
                  transformOrigin: isZoomed ? `${mousePosition.x * 100}% ${mousePosition.y * 100}%` : 'center'
                }}>
                  <img 
                    src={product.images && product.images[currentImageIndex] ? 
                      product.images[currentImageIndex] : product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Navigation buttons */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button 
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={handlePrevImage}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button 
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={handleNextImage}
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Product Image Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div 
                  ref={thumbnailsRef}
                  className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                >
                  {product.images.map((image, index) => (
                    <motion.button 
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                        currentImageIndex === index ? 'border-primary shadow-md' : 'border-transparent'
                      }`}
                      onClick={() => changeImage(index)}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <motion.span 
                  className="text-2xl font-bold mr-3"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {product.discountedPrice > 0 ? (
                    <>
                      {product.discountedPrice.toFixed(2)} Dh
                      <span className="text-sm line-through text-muted-foreground ml-2">
                        {product.price.toFixed(2)} Dh
                      </span>
                    </>
                  ) : (
                    `$${product.price.toFixed(2)}`
                  )}
                </motion.span>
                
                {product.discount > 0 && (
                  <motion.span 
                    className="bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                  >
                    {product.discount}% {t('OFF')}
                  </motion.span>
                )}
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex flex-wrap gap-4">
                  <div className="bg-secondary/10 px-3 py-2 rounded-md">
                    <span className="text-sm text-muted-foreground">{t('size')}</span>
                    <p className="font-medium">{product.size}</p>
                  </div>
                  
                  <div className="bg-secondary/10 px-3 py-2 rounded-md">
                    <span className="text-sm text-muted-foreground">{t('condition')}</span>
                    <p className="font-medium">
                      {product.condition === 'Satisfactory' ? t('satisfactory') : 
                       product.condition === 'Good' ? t('good') : 
                       product.condition === 'Very good' ? t('veryGood') : 
                       product.condition === 'Like new' ? t('likeNew') : product.condition}
                    </p>
                  </div>
                  
                  <div className="bg-secondary/10 px-3 py-2 rounded-md">
                    <span className="text-sm text-muted-foreground">{t('brand')}</span>
                    <p className="font-medium">{product.brand}</p>
                  </div>
                </div>
                
                <div className="bg-secondary/5 p-4 rounded-lg">
                  <span className="text-sm text-muted-foreground">{t('description')}</span>
                  <p className="mt-1">{product.description}</p>
                </div>
                
                <div className="bg-secondary/5 p-4 rounded-lg">
                  <span className="text-sm text-muted-foreground">{t('details')}</span>
                  <ul className="mt-1 space-y-1">
                    <li>{t('color')}: {product.details.color}</li>
                    <li>{t('Material')}: {product.details.material}</li>
                    {product.details.measurements && (
                      <li>{t('Measurements')}: {product.details.measurements}</li>
                    )}
                  </ul>
                </div>
                
                <div className="flex flex-col space-y-2 border-t border-b py-4">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{t('Free delivery within 2-5 days')}</span>
                  </div>
                  <div className="flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{t('Original product quality guarantee')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mb-8">
                <motion.div 
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    className="w-full btn-morocco" 
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    {t('addToCart')}
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <Button 
                    variant="outline" 
                    className={`w-12 h-12 flex items-center justify-center ${isFavorite ? 'text-red-500 border-red-200 bg-red-50' : ''}`}
                    onClick={toggleFavorite}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                  </Button>
                  
                  {/* Floating heart effect */}
                  <AnimatePresence>
                    {showFavEffect && (
                      <motion.div
                        initial={{ scale: 0.5, y: 0, opacity: 0 }}
                        animate={{ scale: 1.5, y: -40, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute top-0 left-0 right-0 pointer-events-none flex justify-center"
                      >
                        <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
              
              <div className="border-t pt-4">
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)", borderRadius: "0.5rem" }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex-shrink-0 relative overflow-hidden">
                    <img 
                      src={product.seller.avatar} 
                      alt={product.seller.name} 
                      className="h-12 w-12 rounded-full object-cover border-2 border-primary/30"
                    />
                    <motion.div 
                      className="absolute inset-0 border-2 border-primary rounded-full"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{product.seller.name}</h3>
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.seller.rating) 
                                ? "fill-yellow-400 text-yellow-400" 
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm ml-1">{product.seller.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ProductDetail;
