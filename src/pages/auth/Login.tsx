import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '@/components/ui-custom/Navbar';
import Footer from '@/components/ui-custom/Footer';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui-custom/Button';
import { toast } from '@/hooks/use-toast';
import Cookies from 'js-cookie';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Retrieve users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

      // Check if the user exists and the password matches
      const user = storedUsers.find((u: any) => u.email === values.email && u.password === values.password);

      if (user) {
        // Store the user in localStorage (currentUser) for session management
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Optionally set the user session in cookies
        Cookies.set('user', JSON.stringify(user), { expires: 30 });

        toast({
          title: "Login successful",
          description: `Welcome back, ${user.username}!`,
        });

        navigate('/');
      } else {
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "We couldn't log you in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | VintedMaghreb</title>
        <meta name="description" content="Log in to your VintedMaghreb account" />
      </Helmet>

      <Navbar />

      <main className="pt-24 pb-16 flex items-center min-h-screen">
        <div className="container mx-auto px-4 md:px-6 max-w-md">
          <div className="bg-card rounded-lg shadow-sm border p-8">
            <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground mb-6">
              Please enter your details to sign in
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Password</FormLabel>
                        <Link
                          to="/auth/forgot-password"
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full btn-morocco"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mr-2">Signing in...</span>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm mt-6">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <Link
                    to="/auth/register"
                    className="text-primary hover:underline"
                  >
                    Create one
                  </Link>
                </div>
              </form>
            </Form>

            <div className="mt-6 text-center text-xs text-muted-foreground">
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Login;
