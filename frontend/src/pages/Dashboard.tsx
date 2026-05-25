import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { landService, savedLandService, buyerLeadService, aadhaarService } from '../services/api';
import LandCard from '../components/LandCard';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myLands, setMyLands] = useState([]);
  const [savedLands, setSavedLands] = useState([]);
  const [myLeads, setMyLeads] = useState([]);
  const [receivedLeads, setReceivedLeads] = useState([]);
  const [activeTab, setActiveTab] = useState('saved');
  const [loading, setLoading] = useState(true);
  const [aadhaarStatus, setAadhaarStatus] = useState<any>(null);

  useEffect(() => {
    fetchData();
    fetchAadhaarStatus();
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
      } else if (activeTab === 'received' && user?.userType === 'seller') {
        const response = await buyerLeadService.getLeadsForMyLands();
        console.log('Received Leads Response:', response.data);
        setReceivedLeads(response.data.leads);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAadhaarStatus = async () => {
    try {
      const response = await aadhaarService.getStatus();
      setAadhaarStatus(response.data);
    } catch (error) {
      console.error('Error fetching Aadhaar status:', error);
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

  const handleUpdateLeadStatus = async (leadId: string, status: string) => {
    try {
      await buyerLeadService.updateLeadStatus(leadId, status);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update status');
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

      {/* Aadhaar Verification Alert */}
      {aadhaarStatus && !aadhaarStatus.aadhaarVerified && (
        <div className={`p-4 rounded-lg mb-6 ${
          !aadhaarStatus.hasAadhaar 
            ? 'bg-red-50 border-l-4 border-red-500' 
            : 'bg-yellow-50 border-l-4 border-yellow-500'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {!aadhaarStatus.hasAadhaar ? (
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3 flex-1">
              <h3 className={`text-sm font-medium ${
                !aadhaarStatus.hasAadhaar ? 'text-red-800' : 'text-yellow-800'
              }`}>
                {!aadhaarStatus.hasAadhaar 
                  ? 'Aadhaar Verification Required' 
                  : 'Aadhaar Verification Pending'}
              </h3>
              <p className={`mt-1 text-sm ${
                !aadhaarStatus.hasAadhaar ? 'text-red-700' : 'text-yellow-700'
              }`}>
                {!aadhaarStatus.hasAadhaar 
                  ? 'You need to verify your Aadhaar to buy or sell land. This is required for all transactions.' 
                  : 'Your Aadhaar is pending admin verification. You can browse lands but cannot make transactions yet.'}
              </p>
              <button
                onClick={() => navigate('/aadhaar-verification')}
                className={`mt-2 px-4 py-2 rounded-lg text-white text-sm font-medium ${
                  !aadhaarStatus.hasAadhaar 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {!aadhaarStatus.hasAadhaar ? 'Verify Aadhaar Now' : 'View Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {aadhaarStatus?.aadhaarVerified && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="ml-3 text-sm text-green-700 font-medium">
              ✓ Aadhaar Verified - You can now buy and sell land
            </p>
          </div>
        </div>
      )}

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
        {user?.userType === 'buyer' && (
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${
              activeTab === 'leads'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600'
            }`}
          >
            📧 My Inquiries ({myLeads.length})
          </button>
        )}
        {user?.userType === 'seller' && (
          <button
            onClick={() => setActiveTab('received')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${
              activeTab === 'received'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600'
            }`}
          >
            📬 Received Inquiries ({receivedLeads.length})
          </button>
        )}
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
            <div>
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => navigate('/add-land')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <span>➕</span> Add New Land
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {myLands.length > 0 ? (
                  myLands.map((land: any) => <LandCard key={land._id} land={land} />)
                ) : (
                  <div className="col-span-3 text-center py-20 bg-white rounded-lg">
                    <p className="text-6xl mb-4">🏞️</p>
                    <p className="text-gray-500 text-lg mb-4">No lands listed yet</p>
                    <button
                      onClick={() => navigate('/add-land')}
                      className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                    >
                      Add Your First Land
                    </button>
                  </div>
                )}
              </div>
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

          {/* Received Inquiries Tab (Sellers Only) */}
          {activeTab === 'received' && user?.userType === 'seller' && (
            <div className="space-y-4">
              {/* Debug Section */}
              <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg text-sm">
                <p>Total Inquiries: {receivedLeads.length}</p>
              </div>
              
              {receivedLeads.length > 0 ? (
                receivedLeads.map((lead: any) => (
                  <div key={lead._id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {lead.landId?.title}
                        </h3>
                        <p className="text-gray-600">
                          📍 {lead.landId?.city}, {lead.landId?.state}
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                          <img
                            src={lead.buyerId?.profilePicture || 'https://via.placeholder.com/40'}
                            alt={lead.buyerId?.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{lead.buyerId?.name}</p>
                            <p className="text-sm text-gray-600">{lead.buyerId?.email}</p>
                            {lead.buyerId?.phone && (
                              <p className="text-sm text-gray-600">📞 {lead.buyerId?.phone}</p>
                            )}
                          </div>
                        </div>
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
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <p className="text-gray-700">
                        <strong>Buyer's Message:</strong> {lead.message}
                      </p>
                    </div>
                    
                    {/* Contact Buyer Section */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Contact Buyer:</h4>
                      <div className="flex gap-2 flex-wrap">
                        {lead.buyerId?.email && (
                          <a
                            href={`mailto:${lead.buyerId.email}?subject=Regarding your inquiry for ${lead.landId?.title}&body=Hi ${lead.buyerId.name},%0D%0A%0D%0AThank you for your interest in my property "${lead.landId?.title}".%0D%0A%0D%0A`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
                          >
                            📧 Send Email
                          </a>
                        )}
                        {lead.buyerId?.phone && (
                          <>
                            <a
                              href={`tel:${lead.buyerId.phone}`}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
                            >
                              📞 Call
                            </a>
                            <a
                              href={`https://wa.me/${lead.buyerId.phone.replace(/[^0-9]/g, '')}?text=Hi ${lead.buyerId.name}, I'm the seller of "${lead.landId?.title}". Thank you for your interest!`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm flex items-center gap-2"
                            >
                              💬 WhatsApp
                            </a>
                          </>
                        )}
                        <button
                          onClick={() => {
                            const contactInfo = `
Buyer Contact Information:
━━━━━━━━━━━━━━━━━━━━━━
Name: ${lead.buyerId?.name}
Email: ${lead.buyerId?.email}
Phone: ${lead.buyerId?.phone || 'Not provided'}
Property: ${lead.landId?.title}
Location: ${lead.landId?.city}, ${lead.landId?.state}

Message: ${lead.message}
━━━━━━━━━━━━━━━━━━━━━━`;
                            navigator.clipboard.writeText(contactInfo);
                            alert('Contact information copied to clipboard!');
                          }}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm flex items-center gap-2"
                        >
                          📋 Copy Info
                        </button>
                      </div>
                    </div>
                    
                    {/* Status Update Buttons */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-800 mb-3 text-sm">Update Status:</h4>
                      <div className="flex gap-2 flex-wrap">
                        {lead.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateLeadStatus(lead._id, 'contacted')}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                            >
                              ✓ Mark as Contacted
                            </button>
                            <button
                              onClick={() => handleUpdateLeadStatus(lead._id, 'interested')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                            >
                              ⭐ Mark as Interested
                            </button>
                            <button
                              onClick={() => handleUpdateLeadStatus(lead._id, 'rejected')}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                            >
                              ✗ Reject
                            </button>
                          </>
                        )}
                        {lead.status === 'contacted' && (
                          <>
                            <button
                              onClick={() => handleUpdateLeadStatus(lead._id, 'interested')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                            >
                              ⭐ Mark as Interested
                            </button>
                            <button
                              onClick={() => handleUpdateLeadStatus(lead._id, 'rejected')}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                            >
                              ✗ Reject
                            </button>
                          </>
                        )}
                        {(lead.status === 'interested' || lead.status === 'rejected') && (
                          <p className="text-sm text-gray-600 italic">
                            {lead.status === 'interested' 
                              ? '✓ You marked this inquiry as interested' 
                              : '✗ This inquiry was rejected'}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      Received on {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-lg">
                  <p className="text-6xl mb-4">📬</p>
                  <p className="text-gray-500 text-lg">No inquiries received yet</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Buyers will be able to send inquiries about your land listings
                  </p>
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
