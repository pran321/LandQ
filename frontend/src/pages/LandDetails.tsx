import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { landService, buyerLeadService, savedLandService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LandDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [land, setLand] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [savingLand, setSavingLand] = useState(false);

  useEffect(() => {
    fetchLandDetails();
    if (user) {
      checkIfSaved();
    }
  }, [id, user]);

  const fetchLandDetails = async () => {
    try {
      const response = await landService.getLandById(id!);
      setLand(response.data.land);
    } catch (error) {
      console.error('Error fetching land details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const response = await savedLandService.getSavedLands();
      const saved = response.data.savedLands.some(
        (saved: any) => saved.landId._id === id
      );
      setIsSaved(saved);
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSaveToggle = async () => {
    if (!user) {
      alert('Please login to save lands');
      return;
    }

    setSavingLand(true);
    try {
      if (isSaved) {
        await savedLandService.unsaveLand(id!);
        setIsSaved(false);
      } else {
        await savedLandService.saveLand(id!);
        setIsSaved(true);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update saved status');
    } finally {
      setSavingLand(false);
    }
  };

  const handleContactSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await buyerLeadService.createLead(id!, message);
      alert('Your inquiry has been sent to the seller!');
      setMessage('');
      setShowContactForm(false);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send inquiry');
    }
  };

  const nextImage = () => {
    if (land.images && land.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % land.images.length);
    }
  };

  const prevImage = () => {
    if (land.images && land.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + land.images.length) % land.images.length);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!land) {
    return <div className="text-center py-20">Land not found</div>;
  }

  const currentImage = land.images && land.images.length > 0 
    ? land.images[currentImageIndex] 
    : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images Gallery */}
        <div>
          <div className="relative">
            <img
              src={currentImage}
              alt={land.title}
              className="w-full h-96 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800';
              }}
            />
            {land.images && land.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2"
                >
                  →
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {land.images.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {land.images && land.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {land.images.slice(0, 4).map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt={`${land.title} ${index + 1}`}
                  className={`w-full h-20 object-cover rounded cursor-pointer ${
                    index === currentImageIndex ? 'ring-2 ring-green-600' : ''
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800';
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{land.title}</h1>
          <p className="text-2xl text-green-600 font-bold mb-4">
            ${land.price.toLocaleString()}
          </p>
          <p className="text-gray-700 mb-6">{land.description}</p>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Size:</span>
              <span className="font-semibold">{land.size} sq ft</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dimensions:</span>
              <span className="font-semibold">{land.length} x {land.breadth} ft</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-semibold">{land.city}, {land.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-semibold capitalize">{land.status}</span>
            </div>
          </div>

          {user && (
            <div className="space-y-3">
              <button
                onClick={handleSaveToggle}
                disabled={savingLand}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  isSaved
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } ${savingLand ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSaved ? '❤️ Saved' : '🤍 Save Land'}
              </button>
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
              >
                Contact Seller
              </button>
            </div>
          )}

          {showContactForm && (
            <form onSubmit={handleContactSeller} className="mt-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message to the seller..."
                className="w-full px-3 py-2 border rounded-md mb-2"
                rows={4}
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandDetails;
