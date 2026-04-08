import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { landService } from '../services/api';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('add');
  const [myLands, setMyLands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    size: '',
    length: '',
    breadth: '',
    location: '',
    city: '',
    state: '',
    landType: 'residential',
    amenities: '',
    lat: '',
    long: '',
    featured: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchMyLands();
    }
  }, [activeTab]);

  const fetchMyLands = async () => {
    try {
      setLoading(true);
      const response = await landService.getMyLands();
      setMyLands(response.data.lands);
    } catch (error) {
      console.error('Error fetching lands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 10);
      setImageFiles(files);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5);
      setDocumentFiles(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'amenities' && value) {
          // Split amenities by comma
          const amenitiesArray = (value as string).split(',').map(a => a.trim()).filter(a => a);
          formDataToSend.append(key, JSON.stringify(amenitiesArray));
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      // Add image files
      imageFiles.forEach((file) => {
        formDataToSend.append('images', file);
      });

      // Add document files
      documentFiles.forEach((file) => {
        formDataToSend.append('documents', file);
      });

      await landService.createLand(formDataToSend);
      setMessage('✅ Land listing created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        size: '',
        length: '',
        breadth: '',
        location: '',
        city: '',
        state: '',
        landType: 'residential',
        amenities: '',
        lat: '',
        long: '',
        featured: false,
      });
      setImageFiles([]);
      setDocumentFiles([]);
      
      // Clear file inputs
      const imageInput = document.getElementById('images') as HTMLInputElement;
      const docInput = document.getElementById('documents') as HTMLInputElement;
      if (imageInput) imageInput.value = '';
      if (docInput) docInput.value = '';
      
    } catch (error: any) {
      setMessage('❌ ' + (error.response?.data?.message || 'Failed to create listing'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this land?')) return;
    
    try {
      await landService.deleteLand(id);
      setMessage('Land deleted successfully!');
      fetchMyLands();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to delete land');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg mb-8">
        <h1 className="text-3xl font-bold">🏛️ Admin Panel</h1>
        <p className="mt-2">Manage land listings and view analytics</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('add')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'add'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          ➕ Add New Land
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'manage'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          📋 Manage Lands
        </button>
        <button
          onClick={() => navigate('/admin/aadhaar')}
          className="px-6 py-3 font-medium text-gray-600 hover:text-green-600"
        >
          🆔 Aadhaar Verification
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'}`}>
          {message}
        </div>
      )}

      {/* Add Land Tab */}
      {activeTab === 'add' && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Beautiful Farm Land"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 50000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe the land features, location benefits, etc."
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size (sq ft) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Length (ft) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="length"
                value={formData.length}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Breadth (ft) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="breadth"
                value={formData.breadth}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Main Street"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Chicago"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Illinois"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Land Type <span className="text-red-500">*</span>
              </label>
              <select
                name="landType"
                value={formData.landType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="agricultural">Agricultural</option>
                <option value="industrial">Industrial</option>
                <option value="mixed">Mixed Use</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities (comma-separated)
              </label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Water, Electricity, Road Access"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude (Optional)
              </label>
              <input
                type="number"
                step="any"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 41.8781"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude (Optional)
              </label>
              <input
                type="number"
                step="any"
                name="long"
                value={formData.long}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., -87.6298"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
              ⭐ Mark as Featured Listing
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📸 Upload Images (Max 10 images, 5MB each)
            </label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {imageFiles.length > 0 && (
              <p className="text-sm text-green-600 mt-2">
                ✓ {imageFiles.length} image(s) selected
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📄 Upload Documents (Max 5 files, 10MB each)
            </label>
            <input
              type="file"
              id="documents"
              accept=".pdf,.doc,.docx,image/*"
              multiple
              onChange={handleDocumentChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {documentFiles.length > 0 && (
              <p className="text-sm text-green-600 mt-2">
                ✓ {documentFiles.length} document(s) selected
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              💡 Accepted: PDF, DOC, DOCX, Images (deeds, surveys, permits, etc.)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '⏳ Creating...' : '✅ Create Land Listing'}
          </button>
        </form>
      )}

      {/* Manage Lands Tab */}
      {activeTab === 'manage' && (
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : myLands.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myLands.map((land: any) => (
                <div key={land._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={land.images[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'}
                    alt={land.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{land.title}</h3>
                    <p className="text-green-600 font-bold text-xl mb-2">
                      ${land.price.toLocaleString()}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">{land.city}, {land.state}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(land._id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg">
              <p className="text-gray-500 text-lg">No lands found</p>
              <button
                onClick={() => setActiveTab('add')}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Add Your First Land
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
