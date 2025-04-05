
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Button from './Button';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  // Check if product is in favorites on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        const isProductFavorite = favorites.some((fav: Product) => fav.id === product.id);
        setIsLiked(isProductFavorite);
      }
    } catch (error) {
      console.error("Error checking favorites:", error);
    }
  }, [product.id]);
  
  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Get existing favorites
      const savedFavorites = localStorage.getItem('favorites') || '[]';
      const favorites = JSON.parse(savedFavorites);
      
      if (isLiked) {
        // Remove from favorites
        const updatedFavorites = favorites.filter((fav: Product) => fav.id !== product.id);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        toast({
          title: "Removed from favorites",
          description: `${product.name} has been removed from your favorites.`,
        });
      } else {
        // Add to favorites
        favorites.push(product);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        toast({
          title: "Added to favorites",
          description: `${product.name} has been added to your favorites.`,
        });
      }
      
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      setShowAuthDialog(true);
      return;
    }
    
    addToCart(product);
  };

  const handleGoToLogin = () => {
    setShowAuthDialog(false);
    navigate('/auth/login');
  };

  const handleGoToRegister = () => {
    setShowAuthDialog(false);
    navigate('/auth/register');
  };
  
  return (
    <>
      <Link 
        to={`/product/${product.id}`}
        className={cn(
          "group relative flex flex-col bg-white rounded-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary/30">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary/50 animate-pulse">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          )}
          
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "object-cover w-full h-full transition-all duration-500",
              imageLoaded ? "opacity-100" : "opacity-0",
              isHovered ? "scale-105" : "scale-100"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://images.unsplash.com/photo-1578932750356-9652b4a27976";
            }}
          />
          
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              className={cn(
                "p-2 rounded-full transition-all duration-300 z-10",
                isLiked ? "bg-red-50" : "bg-white/80 backdrop-blur-sm",
              )}
              onClick={toggleLike}
              aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                className={cn(
                  "w-5 h-5 transition-all", 
                  isLiked ? "fill-red-500 text-red-500" : "fill-transparent"
                )} 
              />
            </button>
            
            <button
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 z-10"
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
          
          {product.discount > 0 && (
            <div className="absolute top-3 left-3 bg-destructive text-white text-xs font-medium px-2 py-1 rounded">
              -{product.discount}%
            </div>
          )}
        </div>
        
        {/* Product info */}
        <div className="p-3 flex flex-col flex-grow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-base line-clamp-1">{product.name}</h3>
              <p className="text-xs text-muted-foreground">{product.brand}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-semibold">
                {product.discountedPrice > 0 ? product.discountedPrice.toFixed(2) : product.price.toFixed(2)}Dh
              </span>
              {product.discountedPrice > 0 && (
                <span className="text-xs text-muted-foreground line-through">
                  {product.price.toFixed(2)} Dh
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <span>{product.size}</span>
            <span className="mx-1">•</span>
            <span>{product.condition}</span>
          </div>
        </div>
      </Link>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="flex items-center">
            <AlertCircle className="w-5 h-5 text-destructive mr-2" />
            Registration Required
          </DialogTitle>
          <DialogDescription>
            You need to be registered and logged in to add items to your cart.
          </DialogDescription>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto" 
              onClick={handleGoToLogin}
            >
              Login
            </Button>
            <Button 
              className="w-full sm:w-auto btn-morocco" 
              onClick={handleGoToRegister}
            >
              Register Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
