import { Link } from 'react-router-dom';
import { useState } from 'react';
import { savedLandService } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface LandCardProps {
  land: {
    _id: string;
    title: string;
    description: string;
    price: number;
    size: number;
    location: string;
    city: string;
    images: string[];
    status: string;
  };
  isSaved?: boolean;
  onSaveToggle?: () => void;
}

const LandCard = ({ land, isSaved = false, onSaveToggle }: LandCardProps) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(isSaved);
  const [loading, setLoading] = useState(false);

  const imageUrl = land.images && land.images.length > 0 
    ? land.images[0] 
    : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800';

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to save lands');
      return;
    }

    setLoading(true);
    try {
      if (saved) {
        await savedLandService.unsaveLand(land._id);
        setSaved(false);
      } else {
        await savedLandService.saveLand(land._id);
        setSaved(true);
      }
      if (onSaveToggle) onSaveToggle();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update saved status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/lands/${land._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
        {/* Save Button */}
        {user && (
          <button
            onClick={handleSaveToggle}
            disabled={loading}
            className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm transition-all ${
              saved 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saved ? '❤️' : '🤍'}
          </button>
        )}

        <img
          src={imageUrl}
          alt={land.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800';
          }}
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{land.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{land.description}</p>
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold text-green-600">
              ${land.price.toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm">{land.size} sq ft</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">
              📍 {land.city}, {land.location}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                land.status === 'available'
                  ? 'bg-green-100 text-green-800'
                  : land.status === 'sold'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {land.status}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LandCard;
