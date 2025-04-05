
import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/ui-custom/Navbar';
import Footer from '@/components/ui-custom/Footer';
import Button from '@/components/ui-custom/Button';
import { Camera, ArrowRight, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const SellItemPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<{ file: File, preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    condition: '',
    price: '',
    brand: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('currentUser');
      if (!userData) {
        toast({
          title: "Authentication required",
          description: "You need to create an account or login to sell items",
          variant: "destructive",
        });
        navigate('/auth/login');
      } else {
        setIsAuthenticated(true);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = [...images];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file",
          description: `${file.name} is not an image file.`,
          variant: "destructive",
        });
        continue;
      }
      
      const preview = URL.createObjectURL(file);
      newImages.push({ file, preview });
    }
    
    setImages(newImages);
    toast({
      title: "Images uploaded",
      description: `${files.length} image(s) have been added.`,
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const userData = localStorage.getItem('currentUser');
      const currentUser = userData ? JSON.parse(userData) : {
        id: "user1",
        name: "Current User",
        avatar: "https://i.pravatar.cc/150?img=3",
        rating: 5.0
      };
      
      // Default image if none provided
      let imageUrl = "https://images.unsplash.com/photo-1578932750356-9652b4a27976";
      
      // If image is uploaded, convert it to base64
      if (images.length > 0) {
        try {
          imageUrl = await convertImageToBase64(images[0].file);
        } catch (error) {
          console.error("Error converting image:", error);
        }
      }
      
      const newProduct = {
        id: uuidv4(),
        name: formData.title,
        brand: formData.brand,
        price: parseFloat(formData.price),
        discountedPrice: 0,
        discount: 0,
        image: imageUrl,
        category: formData.category as 'women' | 'men' | 'kids',
        size: formData.size,
        condition: formData.condition,
        seller: {
          id: currentUser.id || "user1",
          name: currentUser.username || "Current User",
          avatar: currentUser.avatar || "https://i.pravatar.cc/150?img=3",
          rating: currentUser.rating || 5.0
        },
        description: formData.description,
        details: {
          color: "Not specified",
          material: "Not specified"
        }
      };
      
      const existingProductsJson = localStorage.getItem('products');
      const existingProducts = existingProductsJson 
        ? JSON.parse(existingProductsJson) 
        : window.mockProductData || [];
      
      existingProducts.unshift(newProduct);
      
      localStorage.setItem('products', JSON.stringify(existingProducts));
      
      window.mockProductData = existingProducts;
      
      toast({
        title: "Item listed successfully",
        description: "Your item has been added to the marketplace",
      });
      
      // Clean up object URLs
      images.forEach(img => URL.revokeObjectURL(img.preview));
      
      setTimeout(() => {
        navigate(`/product/${newProduct.id}`);
      }, 1500);
      
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "There was a problem listing your item. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="pt-20 pb-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Loading...</h1>
            <p className="text-muted-foreground">Checking your account...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sell Your Items | Vintique</title>
        <meta name="description" content="List your pre-loved fashion items for sale on Vintique" />
      </Helmet>
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Sell Your Items</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            List your pre-loved fashion items for sale and give them a new life with someone who will treasure them.
          </p>

          <div className="flex justify-between mb-8 border-b">
            <div className={`pb-4 px-4 ${step === 1 ? 'border-b-2 border-primary font-medium' : ''}`}>
              1. Upload Photos
            </div>
            <div className={`pb-4 px-4 ${step === 2 ? 'border-b-2 border-primary font-medium' : ''}`}>
              2. Item Details
            </div>
            <div className={`pb-4 px-4 ${step === 3 ? 'border-b-2 border-primary font-medium' : ''}`}>
              3. Pricing & Shipping
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                      <img src={img.preview} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-secondary rounded-lg p-4 hover:bg-secondary/10 transition-colors"
                  >
                    <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Add Photos</span>
                    <span className="text-xs text-muted-foreground mt-1">Click to select from your device</span>
                  </button>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                
                <div className="flex justify-between mt-8">
                  <div></div>
                  <Button type="button" onClick={nextStep}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="brand" className="block text-sm font-medium">
                      Brand
                    </label>
                    <input
                      type="text"
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="women">Women</option>
                      <option value="men">Men</option>
                      <option value="kids">Kids</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="size" className="block text-sm font-medium">
                      Size
                    </label>
                    <input
                      type="text"
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="condition" className="block text-sm font-medium">
                      Condition
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select condition</option>
                      <option value="New with tags">New with tags</option>
                      <option value="Like new">Like new</option>
                      <option value="Good">Good</option>
                      <option value="Satisfactory">Satisfactory</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md min-h-[100px]"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="price" className="block text-sm font-medium">
                      Price (Dh)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-secondary/30 rounded-lg">
                  <h3 className="font-medium mb-2">Listing Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Your price</span>
                      <span>{formData.price || '0.00'} Dh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VintedMaghreb fee (10%)</span>
                      <span>{formData.price ? (parseFloat(formData.price) * 0.1).toFixed(2) : '0.00'} Dh</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>You'll earn</span>
                      <span>{formData.price ? (parseFloat(formData.price) * 0.9).toFixed(2) : '0.00'} Dh</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn-morocco"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mr-2">Listing Item...</span>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </>
                    ) : (
                      "List Item"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SellItemPage;
