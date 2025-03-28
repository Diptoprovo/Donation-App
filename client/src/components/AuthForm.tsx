
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';

interface AuthFormProps {
  type: 'signin' | 'signup';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    userType: 'donor' // 'donor' or 'recipient'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTypeChange = (userType: 'donor' | 'recipient') => {
    setFormData(prev => ({ ...prev, userType }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would normally call your authentication service
      // For now, we'll simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (type === 'signin') {
        toast({
          title: "Welcome back!",
          description: "You've been successfully signed in.",
        });
      } else {
        toast({
          title: "Account created!",
          description: "Your account has been created successfully.",
        });
      }
      
      // Navigate to dashboard after authentication
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-white shadow-sm border border-gray-100 animate-fade-in">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-2xl font-medium tracking-tight">
          {type === 'signin' ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="text-muted-foreground text-sm">
          {type === 'signin' 
            ? 'Enter your credentials to access your account' 
            : 'Fill in the form below to create your account'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {type === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
              value={formData.name}
              onChange={handleChange}
              className="h-11"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="hello@example.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="h-11"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {type === 'signin' && (
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            )}
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={handleChange}
            className="h-11"
          />
        </div>
        
        {type === 'signup' && (
          <div className="space-y-2">
            <Label>I am a</Label>
            <div className="grid grid-cols-2 gap-4 mt-1">
              <Button
                type="button"
                variant={formData.userType === 'donor' ? 'default' : 'outline'}
                onClick={() => handleTypeChange('donor')}
                className="h-11"
              >
                Donor
              </Button>
              <Button
                type="button"
                variant={formData.userType === 'recipient' ? 'default' : 'outline'}
                onClick={() => handleTypeChange('recipient')}
                className="h-11"
              >
                Recipient
              </Button>
            </div>
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full h-11"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : type === 'signin' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        {type === 'signin' ? (
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link to="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
