
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FileUpload from '@/components/FileUpload';
import { useToast } from '@/hooks/use-toast';

const ItemUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    location: '',
    image: null as File | null
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileSelect = (file: File) => {
    setFormData(prev => ({ ...prev, image: file }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate form
    if (!formData.title || !formData.description || !formData.category || !formData.condition || !formData.location || !formData.image) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and upload an image.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Item uploaded!",
        description: "Your item has been successfully listed for donation."
      });
      
      // Navigate to dashboard after successful upload
      navigate('/dashboard');
    } catch {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-2">Donate an Item</h1>
        <p className="text-muted-foreground mb-8">Share items you no longer need with someone who could use them.</p>
        
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Item Information</CardTitle>
                <CardDescription>Provide accurate information to help recipients find your item.</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image">Item Photo</Label>
                  <FileUpload onFileSelect={handleFileSelect} />
                </div>
                
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title"
                    name="title"
                    placeholder="e.g., 'Office Chair' or 'Winter Coat'"
                    value={formData.title}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    name="description"
                    placeholder="Describe the item in detail, including any defects or special features..."
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => handleSelectChange('category', value)}>
                      <SelectTrigger id="category" className="h-11">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="kitchenware">Kitchenware</SelectItem>
                        <SelectItem value="books">Books</SelectItem>
                        <SelectItem value="toys">Toys</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Condition */}
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select onValueChange={(value) => handleSelectChange('condition', value)}>
                      <SelectTrigger id="condition" className="h-11">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like_new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="worn">Worn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    name="location"
                    placeholder="e.g., 'Downtown Chicago' or 'Boston, MA'"
                    value={formData.location}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end space-x-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : "Upload Item"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItemUpload;
