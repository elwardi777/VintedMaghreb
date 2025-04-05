
// API service for handling backend requests

export interface SearchResult {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: any[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export async function searchProducts(query: string): Promise<SearchResult[]> {
  // This is a frontend-only implementation that will be replaced with actual backend calls
  // when the backend is set up
  console.log("Searching for:", query);
  
  try {
    // Simulating an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock search results based on the query
    // In a real implementation, this would be a fetch call to your backend
    const mockResults = window.mockProductData || [];
    return mockResults.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

export interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
}

export async function registerUser(userData: UserRegistrationData): Promise<{ success: boolean; message: string; user?: any }> {
  // This is a frontend-only implementation that will be replaced with actual backend calls
  console.log("Registering user:", userData);
  
  try {
    // Simulating an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save the user to localStorage for admin to review
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      username: userData.username,
      email: userData.email,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    // In a real implementation, this would be a fetch call to your backend
    return { 
      success: true, 
      message: "User registered successfully! Awaiting admin approval.", 
      user: newUser
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { 
      success: false, 
      message: "Registration failed. Please try again." 
    };
  }
}

// Admin API functions
export async function getRegisteredUsers(): Promise<User[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    return registeredUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function approveUser(userId: string): Promise<boolean> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = registeredUsers.map((user: User) => {
      if (user.id === userId) {
        return { ...user, status: 'approved' };
      }
      return user;
    });
    
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    return true;
  } catch (error) {
    console.error("Error approving user:", error);
    return false;
  }
}

export async function rejectUser(userId: string): Promise<boolean> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = registeredUsers.map((user: User) => {
      if (user.id === userId) {
        return { ...user, status: 'rejected' };
      }
      return user;
    });
    
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    return true;
  } catch (error) {
    console.error("Error rejecting user:", error);
    return false;
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = registeredUsers.filter((user: User) => user.id !== userId);
    
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = orders.map((order: Order) => {
      if (order.id === orderId) {
        return { ...order, status };
      }
      return order;
    });
    
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
}
