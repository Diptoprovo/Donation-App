
import { useState, useEffect } from 'react';
import ItemCard, { ItemCardProps } from '@/components/ItemCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

// Mock data generation
const generateMockItems = (): Omit<ItemCardProps, 'id'>[] => {
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Worn'];
  const categories = ['Furniture', 'Clothing', 'Electronics', 'Kitchenware', 'Books', 'Toys'];
  const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
  const items = [];
  
  for (let i = 1; i <= 12; i++) {
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const daysAgo = Math.floor(Math.random() * 30) + 1;
    
    items.push({
      title: `${category} Item ${i}`,
      description: `This is a ${condition.toLowerCase()} condition ${category.toLowerCase()} item available for donation. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      imageUrl: `https://source.unsplash.com/random/600x400?${category.toLowerCase()},${i}`,
      condition,
      location,
      postedDate: `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`,
      donorName: `User${Math.floor(Math.random() * 1000)}`,
      status: 'available' as const
    });
  }
  
  return items;
};

const Dashboard = () => {
  const [items, setItems] = useState<ItemCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockItems = generateMockItems().map((item, index) => ({
        ...item,
        id: `item-${index}`
      }));
      
      setItems(mockItems);
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  const categories = ['All', 'Furniture', 'Clothing', 'Electronics', 'Kitchenware', 'Books', 'Toys'];
  
  const filteredItems = items.filter(item => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Category filter
    const matchesCategory = !categoryFilter || 
      categoryFilter === 'All' || 
      item.title.includes(categoryFilter);
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-20">
      <div className="container mx-auto px-4 md:px-6 pt-8">
        <h1 className="text-3xl font-bold mb-8">Browse Available Items</h1>
        
        {/* Search and Filter */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Button variant="outline" className="h-11 flex items-center gap-2">
              <Filter size={18} />
              <span>More Filters</span>
            </Button>
          </div>
          
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map(category => (
              <Badge
                key={category}
                variant={categoryFilter === category || (!categoryFilter && category === 'All') ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1"
                onClick={() => setCategoryFilter(category === 'All' ? null : category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
        
        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} {...item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No items found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter(null);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
        
      </div>
    </div>
  );
};

export default Dashboard;
