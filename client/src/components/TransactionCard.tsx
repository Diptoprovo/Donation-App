
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, MessageSquare, XCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface TransactionCardProps {
  id: string;
  itemName: string;
  itemImage: string;
  date: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  userType: 'donor' | 'recipient';
  otherPartyName: string;
}

const TransactionCard = ({
  id,
  itemName,
  itemImage,
  date,
  status,
  userType,
  otherPartyName
}: TransactionCardProps) => {
  const { toast } = useToast();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAction = async (action: 'accept' | 'decline' | 'complete') => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (action === 'accept') {
        setCurrentStatus('accepted');
        toast({
          title: "Request accepted",
          description: "You've accepted the request for this item."
        });
      } else if (action === 'decline') {
        setCurrentStatus('declined');
        toast({
          title: "Request declined",
          description: "You've declined the request for this item."
        });
      } else if (action === 'complete') {
        setCurrentStatus('completed');
        toast({
          title: "Transaction completed",
          description: "This transaction has been marked as completed."
        });
      }
    } catch {
      toast({
        title: "Action failed",
        description: "There was an error performing this action. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusBadge = () => {
    switch (currentStatus) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Accepted</Badge>;
      case 'declined':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Declined</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="aspect-square md:aspect-auto relative">
          <img
            src={itemImage}
            alt={itemName}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="md:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{itemName}</CardTitle>
              {getStatusBadge()}
            </div>
          </CardHeader>
          
          <CardContent className="py-2">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar size={16} className="mr-2" />
                <span>{date}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <span className="text-muted-foreground mr-2">
                  {userType === 'donor' ? 'Requested by:' : 'Donated by:'}
                </span>
                <span className="font-medium">{otherPartyName}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="pt-2">
            <div className="flex flex-wrap gap-2 w-full">
              {userType === 'donor' && currentStatus === 'pending' && (
                <>
                  <Button 
                    variant="outline" 
                    className="flex items-center"
                    onClick={() => handleAction('decline')}
                    disabled={isLoading}
                  >
                    <XCircle size={16} className="mr-2" />
                    Decline
                  </Button>
                  <Button 
                    className="flex items-center ml-auto"
                    onClick={() => handleAction('accept')}
                    disabled={isLoading}
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Accept
                  </Button>
                </>
              )}
              
              {userType === 'donor' && currentStatus === 'accepted' && (
                <Button 
                  className="flex items-center ml-auto"
                  onClick={() => handleAction('complete')}
                  disabled={isLoading}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Mark as Completed
                </Button>
              )}
              
              {userType === 'recipient' && (currentStatus === 'pending' || currentStatus === 'accepted') && (
                <Button variant="outline" className="flex items-center">
                  <MessageSquare size={16} className="mr-2" />
                  Message Donor
                </Button>
              )}
              
              {currentStatus === 'completed' && (
                <div className="text-green-600 flex items-center ml-auto">
                  <CheckCircle size={16} className="mr-2" />
                  Transaction Complete
                </div>
              )}
              
              {currentStatus === 'declined' && (
                <div className="text-red-600 flex items-center ml-auto">
                  <XCircle size={16} className="mr-2" />
                  Request Declined
                </div>
              )}
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default TransactionCard;
