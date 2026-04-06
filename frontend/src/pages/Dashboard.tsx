import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { landService, savedLandService, buyerLeadService } from '../services/api';
import LandCard from '../components/LandCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [myLands, setMyLands] = useState([]);
  const [savedLands, setSavedLands] = useState([]);
  const [myLeads, setMyLeads] = useState([]);
  const [activeTab, setActiveTab] = useState('saved');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'lands' && user?.userType === 'seller') {
        const response = await landService.getMyLands();
        setMyLands(response.data.lands);
      } else if (activeTab === 'saved') {
        const response = await savedLandService.getSavedLands();
        setSavedLands(response.data.savedLands);
      } else if (activeTab === 'leads') {
        const response = await buyerLeadService.getMyLeads();
        setMyLeads(response.data.leads);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (landId: string) => {
    try {
      await savedLandService.unsaveLand(landId);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to unsave land');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg mb-8">
        <h1 className="text-3xl font-bold">👋 Welcome, {user?.name}!</h1>
        <p className="mt-2">
          {user?.userType === 'buyer' ? '🏡 Browse and save your favorite lands' : '🏞️ Manage your land listings'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-6 py-3 font-medium whitespace-nowrap ${
            activeTab === 'saved'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600'
          }`}
        >
          ❤️ Saved Lands ({savedLands.length})
        </button>
        {user?.userType === 'seller' && (
          <button
            onClick={() => setActiveTab('lands')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${
              activeTab === 'lands'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600'
            }`}
          >
            🏞️ My Lands
          </button>
        )}
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-6 py-3 font-medium whitespace-nowrap ${
            activeTab === 'leads'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600'
          }`}
        >
          📧 My Inquiries
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div>
          {/* Saved Lands Tab */}
          {activeTab === 'saved' && (
            <div>
              {savedLands.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {savedLands.map((saved: any) => (
                    <div key={saved._id} className="relative">
                      <LandCard land={saved.landId} isSaved={true} onSaveToggle={fetchData} />
                      <button
                        onClick={() => handleUnsave(saved.landId._id)}
                        className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 z-20"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-lg">
                  <p className="text-6xl mb-4">💔</p>
                  <p className="text-gray-500 text-lg mb-4">No saved lands yet</p>
                  <a
                    href="/lands"
                    className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    Browse Lands
                  </a>
                </div>
              )}
            </div>
          )}

          {/* My Lands Tab */}
          {activeTab === 'lands' && (
            <div className="grid md:grid-cols-3 gap-6">
              {myLands.length > 0 ? (
                myLands.map((land: any) => <LandCard key={land._id} land={land} />)
              ) : (
                <p className="col-span-3 text-center text-gray-500">No lands listed yet</p>
              )}
            </div>
          )}

          {/* My Leads Tab */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              {myLeads.length > 0 ? (
                myLeads.map((lead: any) => (
                  <div key={lead._id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {lead.landId?.title}
                        </h3>
                        <p className="text-gray-600">
                          📍 {lead.landId?.city}, {lead.landId?.state}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          lead.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : lead.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : lead.status === 'interested'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">
                        <strong>Your Message:</strong> {lead.message}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Sent on {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-lg">
                  <p className="text-6xl mb-4">📭</p>
                  <p className="text-gray-500 text-lg">No inquiries sent yet</p>
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
