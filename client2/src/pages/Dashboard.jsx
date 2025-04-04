import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ItemCard from "../components/ItemCard";
import TransactionCard from "../components/TransactionCard";
import RequestCard from "../components/RequestCard";

const Dashboard = () => {
  const { user, api, getItems, getTransactions } = useApp();
  const [activeTab, setActiveTab] = useState("overview");
  const [myItems, setMyItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user's items
        if (user?.type === "donor") {
          const { data } = await api.get("/donor/items");
          setMyItems(data.items);
        }
        if (user?.type === "donor") {
          const { data } = await api.get("/request/get-all-requests");
          setRequests(data.requests);
        }

        if (user?.type === "receiver") {
          const { data } = await api.get("/item");
          console.log(data.items);
          setAllItems(data.items);
        }
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, api, getTransactions]);

  // Count items by status
  const itemCounts = {
    total: myItems.length,
    available: myItems.filter((item) => item.isAvailable).length,
    donated: myItems.filter((item) => !item.isAvailable).length,
  };

  // Count transactions by status
  const transactionCounts = {
    total: transactions.length,
    pending: transactions.filter((t) => t.status === "pending").length,
    accepted: transactions.filter((t) => t.status === "accepted").length,
    completed: transactions.filter((t) => t.status === "completed").length,
    rejected: transactions.filter((t) => t.status === "rejected").length,
  };

  return (
    <div>
      <div className="bg-white p-6 mb-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2">
          {user ? `Welcome, ${user.name}` : "Dashboard"}
        </h1>
        <p className="text-gray-600">
          {user?.type === "donor"
            ? "Manage your donations and requests"
            : "Browse and request available items"}
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === "overview"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Overview
          </button>

          {user?.type === "donor" && (
            <button
              onClick={() => setActiveTab("my-items")}
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === "my-items"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              My Items
            </button>
          )}
          {user?.type === "receiver" && (
            <button
              onClick={() => setActiveTab("all-items")}
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === "my-items"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              All Items
            </button>
          )}

          <button
            onClick={() => setActiveTab("transactions")}
            className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === "transactions"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Transactions
          </button>

          {user?.type === "donor" && (
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === "requests"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Requests
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      )}

      {/* Tab Content */}
      {!loading && (
        <div>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* User Info Card */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
                <div className="space-y-3">
                  <p>
                    <span className="font-medium">Name:</span> {user?.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {user?.email}
                  </p>
                  <p>
                    <span className="font-medium">Role:</span>{" "}
                    {user?.type === "donor" ? "Donor" : "Receiver"}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {user?.address}
                  </p>
                </div>
              </div>

              {/* Statistics Card */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">
                  {user?.type === "donor" ? "Donation Stats" : "Request Stats"}
                </h2>
                {user?.type === "donor" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Items</p>
                      <p className="text-2xl font-bold">{itemCounts.total}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Available</p>
                      <p className="text-2xl font-bold">
                        {itemCounts.available}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Donated</p>
                      <p className="text-2xl font-bold">{itemCounts.donated}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Pending Requests</p>
                      <p className="text-2xl font-bold">
                        {transactionCounts.pending}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Requests</p>
                      <p className="text-2xl font-bold">
                        {transactionCounts.total}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold">
                        {transactionCounts.pending}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Accepted</p>
                      <p className="text-2xl font-bold">
                        {transactionCounts.accepted}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold">
                        {transactionCounts.completed}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  {user?.type === "donor" ? (
                    <>
                      <Link
                        to="/upload"
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded transition-colors"
                      >
                        Donate New Item
                      </Link>
                      <button
                        onClick={() => setActiveTab("requests")}
                        className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-center py-2 px-4 rounded transition-colors"
                      >
                        Browse All Requests
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setActiveTab("all-items")}
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded transition-colors"
                      >
                        Browse Available Items
                      </button>
                      <Link
                        to="/transactions"
                        className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-center py-2 px-4 rounded transition-colors"
                      >
                        View My Requests
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* My Items Tab (Donor only) */}
          {activeTab === "my-items" && user?.type === "donor" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Donation Items</h2>
                <Link
                  to="/upload"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                >
                  Upload New Item
                </Link>
              </div>

              {myItems.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <p className="text-gray-600 mb-4">
                    You haven't uploaded any items yet.
                  </p>
                  <Link
                    to="/upload"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                  >
                    Upload Your First Item
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {myItems.map((item) => (
                    <ItemCard key={item._id} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}
          {/* Requests tab */}
          {activeTab === "requests" && user?.type === "donor" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Donation Items</h2>
              </div>

              {requests.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <p className="text-gray-600 mb-4">No requests.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {requests.map((item) => (
                    <RequestCard key={item._id} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* All Items tab */}
          {activeTab === "all-items" && user?.type === "receiver" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Listed Items</h2>
                <Link
                  to="/newreq"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                >
                  Make New Request
                </Link>
              </div>

              {allItems.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <p className="text-gray-600 mb-4">No items listed yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {allItems.map((item) => (
                    <ItemCard key={item._id} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === "transactions" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">
                {user?.type === "donor" ? "Donation Requests" : "My Requests"}
              </h2>

              {transactions.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <p className="text-gray-600 mb-4">
                    {user?.type === "donor"
                      ? "You don't have any requests for your items yet."
                      : "You haven't requested any items yet."}
                  </p>
                  <Link
                    to="/"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                  >
                    {user?.type === "donor"
                      ? "Upload More Items"
                      : "Browse Available Items"}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <TransactionCard
                      key={transaction._id}
                      transaction={transaction}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
