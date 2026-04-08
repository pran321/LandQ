import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aadhaarService } from '../services/api';

const AadhaarVerification: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [formData, setFormData] = useState({
    aadhaarNumber: ''
  });
  const [document, setDocument] = useState<File | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await aadhaarService.getStatus();
      setStatus(response.data);
      if (response.data.aadhaarNumber) {
        setFormData({ aadhaarNumber: response.data.aadhaarNumber });
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 12);
    setFormData({ aadhaarNumber: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.aadhaarNumber.length !== 12) {
      alert('Aadhaar number must be exactly 12 digits');
      return;
    }

    if (!document) {
      alert('Please upload your Aadhaar document');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('aadhaarNumber', formData.aadhaarNumber);
      formDataToSend.append('aadhaarDocument', document);

      await aadhaarService.submitAadhaar(formDataToSend);
      alert('Aadhaar submitted successfully! Pending admin verification.');
      fetchStatus();
    } catch (error: any) {
      console.error('Error submitting Aadhaar:', error);
      alert(error.response?.data?.message || 'Failed to submit Aadhaar');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!status?.hasAadhaar) {
      return <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium">Not Submitted</span>;
    }
    if (status.aadhaarVerified) {
      return <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">✓ Verified</span>;
    }
    return <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">⏳ Pending Verification</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Aadhaar Verification</h1>
            {status && getStatusBadge()}
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Important:</strong> Aadhaar verification is required to buy or sell land. Your information is kept secure and will be verified by our admin team.
                </p>
              </div>
            </div>
          </div>

          {status?.aadhaarVerified ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Aadhaar Verified!</h2>
              <p className="text-gray-600 mb-6">Your Aadhaar has been successfully verified. You can now buy and sell land.</p>
              <div className="bg-gray-50 p-4 rounded-lg inline-block">
                <p className="text-sm text-gray-600">Aadhaar Number</p>
                <p className="text-lg font-mono font-bold">
                  {status.aadhaarNumber?.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')}
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : status?.hasAadhaar ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⏳</div>
              <h2 className="text-2xl font-bold text-yellow-600 mb-2">Verification Pending</h2>
              <p className="text-gray-600 mb-6">Your Aadhaar has been submitted and is awaiting admin verification.</p>
              <div className="bg-gray-50 p-4 rounded-lg inline-block">
                <p className="text-sm text-gray-600">Aadhaar Number</p>
                <p className="text-lg font-mono font-bold">
                  {status.aadhaarNumber?.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')}
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  placeholder="Enter 12-digit Aadhaar number"
                  required
                  maxLength={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono"
                />
                <p className="mt-1 text-sm text-gray-500">
                  {formData.aadhaarNumber.length}/12 digits
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Aadhaar Document <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Accepted formats: JPG, PNG, PDF (Max 5MB)
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Privacy & Security</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Your Aadhaar details are encrypted and stored securely</li>
                  <li>• Information is used only for verification purposes</li>
                  <li>• Admin will verify your details within 24-48 hours</li>
                  <li>• You'll be notified once verification is complete</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || formData.aadhaarNumber.length !== 12 || !document}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'Submitting...' : 'Submit for Verification'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AadhaarVerification;
