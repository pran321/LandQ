import React, { useState, useEffect } from 'react';
import { aadhaarService } from '../services/api';

const AadhaarAdmin: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [verifiedUsers, setVerifiedUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'verified'>('pending');
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'pending') {
        const response = await aadhaarService.getPendingVerifications();
        setPendingUsers(response.data.users);
      } else {
        const response = await aadhaarService.getVerifiedUsers();
        setVerifiedUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId: string, verified: boolean) => {
    if (!confirm(`Are you sure you want to ${verified ? 'verify' : 'reject'} this Aadhaar?`)) {
      return;
    }

    try {
      await aadhaarService.verifyAadhaar(userId, verified);
      alert(`Aadhaar ${verified ? 'verified' : 'rejected'} successfully!`);
      fetchData();
    } catch (error: any) {
      console.error('Error updating verification:', error);
      alert(error.response?.data?.message || 'Failed to update verification');
    }
  };

  const viewDocument = (documentUrl: string) => {
    setSelectedDocument(`${import.meta.env.VITE_API_URL}${documentUrl}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Aadhaar Verification Management</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'pending'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            ⏳ Pending ({pendingUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('verified')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'verified'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600'
            }`}
          >
            ✓ Verified ({verifiedUsers.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'pending' && (
              <>
                {pendingUsers.length > 0 ? (
                  pendingUsers.map((user) => (
                    <div key={user._id} className="bg-white p-6 rounded-lg shadow-md">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
                          <p className="text-gray-600">{user.email}</p>
                          <p className="text-gray-600">{user.phone}</p>
                          <div className="mt-2">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              user.userType === 'seller' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.userType}
                            </span>
                          </div>
                          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Aadhaar Number</p>
                            <p className="text-lg font-mono font-bold">
                              {user.aadhaarNumber?.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Submitted on {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="ml-4 space-y-2">
                          {user.aadhaarDocument && (
                            <button
                              onClick={() => viewDocument(user.aadhaarDocument)}
                              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                            >
                              📄 View Document
                            </button>
                          )}
                          <button
                            onClick={() => handleVerify(user._id, true)}
                            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                          >
                            ✓ Verify
                          </button>
                          <button
                            onClick={() => handleVerify(user._id, false)}
                            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                          >
                            ✗ Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white rounded-lg">
                    <p className="text-6xl mb-4">✅</p>
                    <p className="text-gray-500 text-lg">No pending verifications</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'verified' && (
              <>
                {verifiedUsers.length > 0 ? (
                  verifiedUsers.map((user) => (
                    <div key={user._id} className="bg-white p-6 rounded-lg shadow-md">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
                            <span className="text-green-600">✓</span>
                          </div>
                          <p className="text-gray-600">{user.email}</p>
                          <p className="text-gray-600">{user.phone}</p>
                          <div className="mt-2">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              user.userType === 'seller' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.userType}
                            </span>
                          </div>
                          <div className="mt-4 bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Aadhaar Number</p>
                            <p className="text-lg font-mono font-bold">
                              {user.aadhaarNumber?.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Verified on {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white rounded-lg">
                    <p className="text-6xl mb-4">📋</p>
                    <p className="text-gray-500 text-lg">No verified users yet</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Document Modal */}
        {selectedDocument && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDocument(null)}
          >
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Aadhaar Document</h3>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-4">
                {selectedDocument.endsWith('.pdf') ? (
                  <iframe src={selectedDocument} className="w-full h-[70vh]" />
                ) : (
                  <img src={selectedDocument} alt="Aadhaar Document" className="max-w-full h-auto" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AadhaarAdmin;
