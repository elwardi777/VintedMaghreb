
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/ui-custom/Navbar';
import Footer from '@/components/ui-custom/Footer';
import ProductCard from '@/components/ui-custom/ProductCard';
import { searchProducts } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/lib/data';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        navigate('/');
        return;
      }

      setIsLoading(true);
      try {
        // First get all products from localStorage or fallback to window.mockProductData
        let allProducts = [];
        try {
          const storedProducts = localStorage.getItem('products');
          if (storedProducts) {
            allProducts = JSON.parse(storedProducts);
          } else if (window.mockProductData) {
            allProducts = window.mockProductData;
          }
        } catch (error) {
          console.error("Error loading products:", error);
          if (window.mockProductData) {
            allProducts = window.mockProductData;
          }
        }

        // Perform search locally instead of using API
        const searchTerm = query.toLowerCase();
        const searchResults = allProducts.filter((product: Product) => 
          product.name.toLowerCase().includes(searchTerm) || 
          product.brand.toLowerCase().includes(searchTerm) || 
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
        );
        
        setResults(searchResults);
      } catch (error) {
        console.error("Error fetching search results:", error);
        toast({
          title: "Error",
          description: "Failed to load search results. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, navigate, toast]);

  return (
    <>
      <Helmet>
        <title>Search: {query} | VintedMaghreb</title>
        <meta name="description" content={`Search results for ${query} on VintedMaghreb`} />
      </Helmet>
      <Navbar />
      <main className="pt-20">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <h1 className="text-3xl font-bold mb-4">Search Results for "{query}"</h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-6">No results found for "{query}"</p>
              <p>Try a different search term or browse our categories</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {results.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SearchResults;
