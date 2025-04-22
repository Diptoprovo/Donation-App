import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import MapRender from '../components/MapRender';
import AllStatsMapRender from '../components/AllStatsMapRender';

const Index = () => {
    const { getItems, api } = useApp();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');
    const [stats, setStats] = useState({
        totalDonors: 0,
        totalReceivers: 0,
        totalDonations: 0
    });

    const categories = [
        { id: 'all', name: 'All Items' },
        { id: 'clothes', name: 'Clothes' },
        { id: 'shoes', name: 'Shoes' },
        { id: 'books', name: 'Books' },
        { id: 'electronics', name: 'Electronics' },
        { id: 'accessories', name: 'Accessories' },
        { id: 'other', name: 'Other' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch statistics
                const { data } = await api.get("/stats");
                // console.log(data);
                if (data.success) {
                    setStats({
                        totalDonors: data.totalDonors || 0,
                        totalReceivers: data.totalReceivers || 0,
                        totalDonations: data.completedTransactions || 0
                    });
                }
            } catch (err) {
                setError('Failed to load statistics');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [api]);

    // Filter items by category
    const filteredItems = activeCategory === 'all'
        ? items
        : (items || []).filter(item => item.category === activeCategory);

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-blue-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">
                        Give What You Don't Need, Get What You Need
                    </h1>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Join our community of donors and receivers, making the world a better place one donation at a time.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/signup" className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-bold transition-colors">
                            Get Started
                        </Link>
                        <Link to="/" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-md font-bold transition-colors">
                            View Dashboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* Impact Trackers Section */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-10">Our Impact</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Total Donors */}
                        <div className="bg-blue-50 p-8 rounded-lg shadow-md text-center">
                            <div className="text-blue-600 text-5xl font-bold mb-2">
                                {stats.totalDonors}
                            </div>
                            <div className="text-xl font-semibold text-gray-800">Generous Donors</div>
                            <p className="text-gray-600 mt-2">
                                People helping their community through giving
                            </p>
                        </div>

                        {/* Total Receivers */}
                        <div className="bg-green-50 p-8 rounded-lg shadow-md text-center">
                            <div className="text-green-600 text-5xl font-bold mb-2">
                                {stats.totalReceivers}
                            </div>
                            <div className="text-xl font-semibold text-gray-800">Community Members</div>
                            <p className="text-gray-600 mt-2">
                                People receiving support through donations
                            </p>
                        </div>

                        {/* Total Successful Donations */}
                        <div className="bg-purple-50 p-8 rounded-lg shadow-md text-center">
                            <div className="text-purple-600 text-5xl font-bold mb-2">
                                {stats.totalDonations}
                            </div>
                            <div className="text-xl font-semibold text-gray-800">Successful Donations</div>
                            <p className="text-gray-600 mt-2">
                                Items that found a new home and purpose
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10">People who have joined us on this journey</h2>
                <div className="rounded-lg shadow-lg text-center">

            <AllStatsMapRender/>
                </div>
                    </div>
                    </section>

            {/* Available Items Section */}
            {/* <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Available Donations</h2>

                 
                    <div className="flex overflow-x-auto pb-3 mb-6 gap-2 scrollbar-hide">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap ${activeCategory === category.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    
                    {error && (
                        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                   
                    {loading ? (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading donation items...</p>
                        </div>
                    ) : !filteredItems || filteredItems.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-600">No donations available in this category at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {Array.isArray(filteredItems) && filteredItems.map(item => (
                                <ItemCard key={item._id} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            </section> */}

            {/* How It Works Section */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* For Donors */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-blue-600 text-4xl mb-4 flex justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-center mb-3">For Donors</h3>
                            <ol className="list-decimal list-inside text-gray-700 space-y-2">
                                <li>Sign up as a donor</li>
                                <li>Upload items you want to donate</li>
                                <li>Receive requests from receivers</li>
                                <li>Approve requests and arrange delivery</li>
                            </ol>
                        </div>

                        {/* For Receivers */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-blue-600 text-4xl mb-4 flex justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-center mb-3">For Receivers</h3>
                            <ol className="list-decimal list-inside text-gray-700 space-y-2">
                                <li>Sign up as a receiver</li>
                                <li>Browse available donations</li>
                                <li>Send requests for items you need</li>
                                <li>Arrange to receive approved items</li>
                            </ol>
                        </div>

                        {/* Community Impact */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-blue-600 text-4xl mb-4 flex justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-center mb-3">Community Impact</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li>Reduce waste by reusing items</li>
                                <li>Help those in need in your community</li>
                                <li>Connect with others through giving</li>
                                <li>Build a more sustainable world</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Index;
