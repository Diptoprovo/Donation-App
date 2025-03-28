
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import TransactionCard, { TransactionCardProps } from '@/components/TransactionCard';
import { useToast } from '@/hooks/use-toast';

// Mock data generation
const generateMockTransactions = () => {
  const itemNames = [
    'Wooden Table', 'Winter Jacket', 'Office Chair', 
    'Desktop Computer', 'Blender', 'Children\'s Bicycle',
    'Bookshelf', 'Tennis Racket', 'Dining Set'
  ];
  
  const donorNames = ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emma Davis'];
  const recipientNames = ['David Wilson', 'Olivia Martinez', 'James Taylor', 'Sophia Anderson'];
  
  const donorTransactions: TransactionCardProps[] = [];
  const recipientTransactions: TransactionCardProps[] = [];
  
  // Create donor transactions
  for (let i = 1; i <= 5; i++) {
    const itemName = itemNames[Math.floor(Math.random() * itemNames.length)];
    const status = ['pending', 'accepted', 'declined', 'completed'][Math.floor(Math.random() * 4)] as TransactionCardProps['status'];
    const category = itemName.split(' ')[1]?.toLowerCase() || 'item';
    
    donorTransactions.push({
      id: `donor-${i}`,
      itemName,
      itemImage: `https://source.unsplash.com/random/600x400?${category},${i}`,
      date: `${Math.floor(Math.random() * 30) + 1} days ago`,
      status,
      userType: 'donor',
      otherPartyName: recipientNames[Math.floor(Math.random() * recipientNames.length)]
    });
  }
  
  // Create recipient transactions
  for (let i = 1; i <= 5; i++) {
    const itemName = itemNames[Math.floor(Math.random() * itemNames.length)];
    const status = ['pending', 'accepted', 'declined', 'completed'][Math.floor(Math.random() * 4)] as TransactionCardProps['status'];
    const category = itemName.split(' ')[1]?.toLowerCase() || 'item';
    
    recipientTransactions.push({
      id: `recipient-${i}`,
      itemName,
      itemImage: `https://source.unsplash.com/random/600x400?${category},${i + 5}`,
      date: `${Math.floor(Math.random() * 30) + 1} days ago`,
      status,
      userType: 'recipient',
      otherPartyName: donorNames[Math.floor(Math.random() * donorNames.length)]
    });
  }
  
  return { donorTransactions, recipientTransactions };
};

const Transactions = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('donated');
  const [isLoading, setIsLoading] = useState(true);
  const [donorTransactions, setDonorTransactions] = useState<TransactionCardProps[]>([]);
  const [recipientTransactions, setRecipientTransactions] = useState<TransactionCardProps[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { donorTransactions, recipientTransactions } = generateMockTransactions();
        
        setDonorTransactions(donorTransactions);
        setRecipientTransactions(recipientTransactions);
      } catch (error) {
        toast({
          title: "Error loading transactions",
          description: "There was a problem loading your transactions. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-20">
      <div className="container mx-auto px-4 md:px-6 pt-8">
        <h1 className="text-3xl font-bold mb-6">My Transactions</h1>
        
        <Tabs defaultValue="donated" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-96 grid-cols-2 mb-8">
            <TabsTrigger value="donated">Items I Donated</TabsTrigger>
            <TabsTrigger value="received">Items I Requested</TabsTrigger>
          </TabsList>
          
          <TabsContent value="donated" className="space-y-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/4 bg-gray-200 h-48 md:h-auto" />
                    <div className="p-4 w-full md:w-3/4">
                      <div className="h-6 bg-gray-200 rounded mb-4 w-1/2" />
                      <div className="h-4 bg-gray-200 rounded mb-3 w-1/3" />
                      <div className="h-4 bg-gray-200 rounded mb-3 w-2/3" />
                      <div className="h-8 bg-gray-200 rounded mt-4 w-1/4" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              donorTransactions.length > 0 ? (
                donorTransactions.map(transaction => (
                  <TransactionCard key={transaction.id} {...transaction} />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-2">No donated items yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't donated any items yet. Get started by donating an item.
                  </p>
                  <Button onClick={() => window.location.href = '/item-upload'}>
                    Donate an Item
                  </Button>
                </div>
              )
            )}
          </TabsContent>
          
          <TabsContent value="received" className="space-y-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/4 bg-gray-200 h-48 md:h-auto" />
                    <div className="p-4 w-full md:w-3/4">
                      <div className="h-6 bg-gray-200 rounded mb-4 w-1/2" />
                      <div className="h-4 bg-gray-200 rounded mb-3 w-1/3" />
                      <div className="h-4 bg-gray-200 rounded mb-3 w-2/3" />
                      <div className="h-8 bg-gray-200 rounded mt-4 w-1/4" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              recipientTransactions.length > 0 ? (
                recipientTransactions.map(transaction => (
                  <TransactionCard key={transaction.id} {...transaction} />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-2">No requested items yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't requested any items yet. Browse our available items to find what you need.
                  </p>
                  <Button onClick={() => window.location.href = '/dashboard'}>
                    Browse Items
                  </Button>
                </div>
              )
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Transactions;
