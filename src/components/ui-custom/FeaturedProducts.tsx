
import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard';
import { products as defaultProducts } from '@/lib/data';
import { Product } from '@/lib/data';

const FeaturedProducts = () => {
  const [loaded, setLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [priceFilter, setPriceFilter] = useState<'all' | 'low-to-high' | 'high-to-low'>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'women', label: 'Women' },
    { id: 'men', label: 'Men' },
    { id: 'kids', label: 'Kids' },
  ];
  
  useEffect(() => {
    // Try to get products from localStorage first, fall back to default products
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        // Initialize localStorage with default products if empty
        localStorage.setItem('products', JSON.stringify(defaultProducts));
        setProducts(defaultProducts);
      }
      
      // Set window.mockProductData for search functionality
      window.mockProductData = products;
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts(defaultProducts);
    }
    
    setTimeout(() => setLoaded(true), 300);
  }, []);
  
  let filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);
  
  // Apply price sorting if selected
  if (priceFilter === 'low-to-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const aPrice = a.discountedPrice > 0 ? a.discountedPrice : a.price;
      const bPrice = b.discountedPrice > 0 ? b.discountedPrice : b.price;
      return aPrice - bPrice;
    });
  } else if (priceFilter === 'high-to-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const aPrice = a.discountedPrice > 0 ? a.discountedPrice : a.price;
      const bPrice = b.discountedPrice > 0 ? b.discountedPrice : b.price;
      return bPrice - aPrice;
    });
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <section id="featured-products" className="py-16 bg-white scroll-mt-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className={cn(
          "flex flex-col md:flex-row justify-between items-start md:items-center mb-12 transition-all duration-500",
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <div>
            <h2 className="text-3xl font-bold mb-2 text-secondary">Featured Products</h2>
            <p className="text-muted-foreground">Discover our most popular items this season</p>
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-2">
            <button 
              className="p-2 rounded-full border hover:bg-secondary/20 transition-colors"
              aria-label="Filters"
              title="filter par le prix" 
              onClick={toggleFilters}
            >
              <SlidersHorizontal className="w-5 h-5" />
              
            </button>
         
          
          </div>
        </div>
        
        <div className={cn(
          "flex flex-wrap gap-4 pb-4 mb-8 transition-all duration-500",
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  activeCategory === category.id
                    ? "bg-primary text-white" 
                    : "bg-secondary/20 hover:bg-secondary/40 text-secondary-foreground"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
          
          {showFilters && (
            <div className="w-full mt-4 flex flex-wrap gap-2 animate-fade-in">
              <span className="text-sm font-medium text-muted-foreground flex items-center">Price:</span>
              <button
                onClick={() => setPriceFilter('all')}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  priceFilter === 'all'
                    ? "bg-primary text-white" 
                    : "bg-secondary/20 hover:bg-secondary/40 text-secondary-foreground"
                )}
              >
                All Prices
              </button>
              <button
                onClick={() => setPriceFilter('low-to-high')}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  priceFilter === 'low-to-high'
                    ? "bg-primary text-white" 
                    : "bg-secondary/20 hover:bg-secondary/40 text-secondary-foreground"
                )}
              >
                Price: Low to High
              </button>
              <button
                onClick={() => setPriceFilter('high-to-low')}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  priceFilter === 'high-to-low'
                    ? "bg-primary text-white" 
                    : "bg-secondary/20 hover:bg-secondary/40 text-secondary-foreground"
                )}
              >
                Price: High to Low
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={cn(
                "transition-all duration-500",
                loaded 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-10",
                { "delay-100": index % 5 === 1 },
                { "delay-200": index % 5 === 2 },
                { "delay-300": index % 5 === 3 },
                { "delay-400": index % 5 === 4 }
              )}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
