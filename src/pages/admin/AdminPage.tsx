
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Eye, Trash2, Search, LogOut, Users, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  image: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

interface Order {
  id: string;
  userId: string;
  username: string;
  items: Array<{id: string, name: string, price: number, quantity: number}>;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is admin (in a real app, this would verify admin rights)
    const userData = localStorage.getItem('currentUser');
    const isAdmin = userData ? true : false; // For demo, anyone logged in can access
    
    if (!isAdmin) {
      toast({
        title: "Access denied",
        description: "You need to be an administrator to access this page.",
        variant: "destructive",
      });
      navigate('/auth/login');
      return;
    }
    
    // Load data
    const loadData = async () => {
      try {
        // Load products
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
          const parsedProducts = JSON.parse(storedProducts);
          setProducts(parsedProducts);
          setFilteredProducts(parsedProducts);
        }
        
        // Load users (mock data for demo)
        // In a real app, this would come from a database
        const mockUsers: User[] = [
          {
            id: 'user1',
            username: 'DemoUser',
            email: 'user@example.com',
            avatar: 'https://i.pravatar.cc/150?img=3',
            createdAt: '2023-06-15'
          },
          {
            id: 'user2',
            username: 'JaneDoe',
            email: 'jane@example.com',
            avatar: 'https://i.pravatar.cc/150?img=5',
            createdAt: '2023-07-22'
          },
          {
            id: 'user3',
            username: 'JohnSmith',
            email: 'john@example.com',
            avatar: 'https://i.pravatar.cc/150?img=8',
            createdAt: '2023-08-10'
          }
        ];
        
        // Try to get registered users from localStorage
        const storedUsers = localStorage.getItem('registeredUsers');
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          // Combine mock users with any registered users
          setUsers([...mockUsers, ...parsedUsers]);
          setFilteredUsers([...mockUsers, ...parsedUsers]);
        } else {
          setUsers(mockUsers);
          setFilteredUsers(mockUsers);
        }
        
        // Load orders (mock data for demo)
        const mockOrders: Order[] = [
          {
            id: 'order1',
            userId: 'user1',
            username: 'DemoUser',
            items: [
              {id: 'p1', name: 'Summer Dress', price: 350, quantity: 1},
              {id: 'p2', name: 'Casual Shoes', price: 250, quantity: 1}
            ],
            total: 600,
            status: 'completed',
            createdAt: '2023-09-15'
          },
          {
            id: 'order2',
            userId: 'user2',
            username: 'JaneDoe',
            items: [
              {id: 'p3', name: 'Denim Jacket', price: 420, quantity: 1}
            ],
            total: 420,
            status: 'processing',
            createdAt: '2023-09-18'
          }
        ];
        
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [navigate]);
  
  useEffect(() => {
    // Filter products based on search query
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
      setFilteredUsers(users);
      setFilteredOrders(orders);
    } else {
      const query = searchQuery.toLowerCase();
      
      // Filter products
      const productResults = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
      setFilteredProducts(productResults);
      
      // Filter users
      const userResults = users.filter(user => 
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
      setFilteredUsers(userResults);
      
      // Filter orders
      const orderResults = orders.filter(order => 
        order.username.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query) ||
        order.status.toLowerCase().includes(query)
      );
      setFilteredOrders(orderResults);
    }
  }, [searchQuery, products, users, orders]);
  
  const handleDeleteProduct = async (productId: string) => {
    try {
      setIsDeleting(prev => ({ ...prev, [productId]: true }));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Remove product from state
      const updatedProducts = products.filter(product => product.id !== productId);
      setProducts(updatedProducts);
      
      // Save to localStorage
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      
      // Update window.mockProductData for the app
      window.mockProductData = updatedProducts;
      
      toast({
        title: "Product deleted",
        description: "The product has been removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(prev => ({ ...prev, [productId]: false }));
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    try {
      setIsDeleting(prev => ({ ...prev, [userId]: true }));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Remove user from state
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      
      toast({
        title: "User deleted",
        description: "The user has been removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete the user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  const handleLogout = () => {
    navigate('/');
  };
  
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | VintedMaghreb</title>
        <meta name="description" content="Admin dashboard for VintedMaghreb" />
      </Helmet>
      
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <div className="w-64 bg-secondary/10 border-r p-4 hidden md:block">
          <div className="mb-8">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              VintedMaghreb
            </Link>
            <p className="text-xs text-muted-foreground mt-1">Admin Dashboard</p>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab("products")} 
              className={`flex items-center px-3 py-2 rounded-md text-primary font-medium w-full text-left ${activeTab === "products" ? "bg-secondary/30" : "hover:bg-secondary/10"}`}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Products
            </button>
            {/*<button 
              onClick={() => setActiveTab("users")} 
              className={`flex items-center px-3 py-2 rounded-md text-primary font-medium w-full text-left ${activeTab === "users" ? "bg-secondary/30" : "hover:bg-secondary/10"}`}
            >
              <Users className="mr-2 h-4 w-4" />
              Users
            </button>
            */}
          </nav>
          
          <div className="absolute bottom-4 left-4">
            <Button variant="outline" className="w-56 justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Back to Site
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="bg-white border-b sticky top-0 z-10">
            <div className="flex justify-between items-center px-6 py-4">
              <h1 className="text-xl font-semibold">
                {activeTab === "products" && "Product Management"}
                {activeTab === "users" && "User Management"}
                {activeTab === "orders" && "Order Management"}
              </h1>
              
              <div className="flex items-center space-x-4">
                {/* Mobile tab selector */}
                <div className="md:hidden">
                  <select 
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="p-2 rounded border"
                  >
                    <option value="products">Products</option>
                    <option value="users">Users</option>
                    <option value="orders">Orders</option>
                  </select>
                </div>
                
                <Link 
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors md:hidden"
                >
                  Back to Site
                </Link>
              </div>
            </div>
          </header>
          
          {/* Content */}
          <main className="p-6">
            <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input 
                  type="search" 
                  placeholder={`Search ${activeTab}...`}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading data...</p>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="hidden">
                  <TabsTrigger value="products">Products</TabsTrigger>
             
                </TabsList>
                
                <TabsContent value="products">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-secondary/20">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                          <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">Category</th>
                          <th className="px-4 py-3 text-left text-sm font-medium hidden lg:table-cell">Brand</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Price</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                              {searchQuery ? "No products match your search" : "No products found"}
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-secondary/5">
                              <td className="px-4 py-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded overflow-hidden bg-secondary/20 flex-shrink-0">
                                    <img 
                                      src={product.image} 
                                      alt={product.name} 
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.src = "https://images.unsplash.com/photo-1578932750356-9652b4a27976";
                                      }}
                                    />
                                  </div>
                                  <div className="truncate max-w-[200px]">
                                    <p className="text-sm font-medium truncate">{product.name}</p>
                                    <p className="text-xs text-muted-foreground md:hidden">{product.category}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm hidden md:table-cell">{product.category}</td>
                              <td className="px-4 py-3 text-sm hidden lg:table-cell">{product.brand}</td>
                              <td className="px-4 py-3 text-sm text-right">{product.price.toFixed(2)} Dh</td>
                              <td className="px-4 py-3">
                                <div className="flex justify-end space-x-2">
                                  <Link
                                    to={`/product/${product.id}`}
                                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label="View product"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                  <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                                    aria-label="Delete product"
                                    disabled={isDeleting[product.id]}
                                  >
                                    {isDeleting[product.id] ? (
                                      <div className="w-4 h-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin"></div>
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="users">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-secondary/20">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                          <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-medium hidden lg:table-cell">Joined</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                              {searchQuery ? "No users match your search" : "No users found"}
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-secondary/5">
                              <td className="px-4 py-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary/20 flex-shrink-0">
                                    <img 
                                      src={user.avatar || "https://i.pravatar.cc/150?img=1"} 
                                      alt={user.username} 
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.src = "https://i.pravatar.cc/150?img=1";
                                      }}
                                    />
                                  </div>
                                  <div className="truncate max-w-[200px]">
                                    <p className="text-sm font-medium truncate">{user.username}</p>
                                    <p className="text-xs text-muted-foreground md:hidden">{user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm hidden md:table-cell">{user.email}</td>
                              <td className="px-4 py-3 text-sm hidden lg:table-cell">{user.createdAt || "N/A"}</td>
                              <td className="px-4 py-3">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                                    aria-label="Delete user"
                                    disabled={isDeleting[user.id]}
                                  >
                                    {isDeleting[user.id] ? (
                                      <div className="w-4 h-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin"></div>
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="orders">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-secondary/20">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">Order ID</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                          <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium hidden lg:table-cell">Status</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                              {searchQuery ? "No orders match your search" : "No orders found"}
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-secondary/5">
                              <td className="px-4 py-3 text-sm font-medium">{order.id}</td>
                              <td className="px-4 py-3 text-sm">{order.username}</td>
                              <td className="px-4 py-3 text-sm hidden md:table-cell">{order.createdAt}</td>
                              <td className="px-4 py-3 hidden lg:table-cell">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-right font-medium">{order.total.toFixed(2)} Dh</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
