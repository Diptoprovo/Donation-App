
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface ItemCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  condition: string;
  location: string;
  postedDate: string;
  donorName: string;
  status: 'available' | 'pending' | 'claimed';
}

const ItemCard = ({ 
  id, 
  title, 
  description, 
  imageUrl, 
  condition, 
  location, 
  postedDate, 
  donorName,
  status 
}: ItemCardProps) => {
  const { toast } = useToast();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRequest = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentStatus('pending');
      
      toast({
        title: "Request sent!",
        description: "Your request has been sent to the donor.",
      });
    } catch {
      toast({
        title: "Request failed",
        description: "There was an error sending your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" 
        />
        <Badge 
          variant="outline" 
          className={`absolute top-3 right-3 ${
            currentStatus === 'available' 
              ? 'bg-green-100 text-green-800 border-green-200'
              : currentStatus === 'pending'
              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
              : 'bg-gray-100 text-gray-800 border-gray-200'
          }`}
        >
          {currentStatus === 'available' 
            ? 'Available' 
            : currentStatus === 'pending' 
            ? 'Pending' 
            : 'Claimed'}
        </Badge>
      </div>
      
      <CardHeader className="py-4">
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <MapPin size={14} className="text-muted-foreground" />
          <span className="truncate">{location}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="py-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary">{condition}</Badge>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start pt-4 pb-5 space-y-4">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User size={14} />
            <span>{donorName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{postedDate}</span>
          </div>
        </div>
        
        {currentStatus === 'available' && (
          <Button 
            className="w-full"
            onClick={handleRequest}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : "Request Item"}
          </Button>
        )}
        
        {currentStatus === 'pending' && (
          <Button variant="outline" className="w-full" disabled>
            Requested
          </Button>
        )}
        
        {currentStatus === 'claimed' && (
          <Button variant="outline" className="w-full" disabled>
            Claimed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
