import { useState, useEffect } from 'react';
import { landService, savedLandService } from '../services/api';
import LandCard from '../components/LandCard';
import { useAuth } from '../context/AuthContext';

const LandListing = () => {
  const { user } = useAuth();
  const [lands, setLands] = useState([]);
  const [savedLandIds, setSavedLandIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    landType: '',
    minPrice: '',
    maxPrice: '',
    minSize: '',
    maxSize: '',
    sortBy: 'createdAt',
  });

  useEffect(() => {
    fetchLands();
    if (user) {
      fetchSavedLands();
    }
  }, [user, page]);

  const fetchLands = async () => {
    try {
      setLoading(true);
      const params = { ...filters, page, limit: 12 };
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });
      
      const response = await landService.getAllLands(params);
      setLands(response.data.lands);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      console.error('Error fetching lands:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedLands = async () => {
    try {
      const response = await savedLandService.getSavedLands();
      const savedIds = new Set(
        response.data.savedLands.map((saved: any) => saved.landId._id)
      );
      setSavedLandIds(savedIds);
    } catch (error) {
      console.error('Error fetching saved lands:', error);
    }
  };

  const handleSaveToggle = () => {
    fetchSavedLands();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setPage(1);
    fetchLands();
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      city: '',
      landType: '',
      minPrice: '',
      maxPrice: '',
      minSize: '',
      maxSize: '',
      sortBy: 'createdAt',
    });
    setPage(1);
    setTimeout(() => fetchLands(), 100);
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Land Listings</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button
            onClick={handleClearFilters}
            className="text-sm text-gray-600 hover:text-green-600"
          >
            Clear All
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by title, description, city, or state..."
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            placeholder="City"
            className="px-3 py-2 border rounded-md"
          />
          <select
            name="landType"
            value={filters.landType}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">All Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="agricultural">Agricultural</option>
            <option value="industrial">Industrial</option>
            <option value="mixed">Mixed Use</option>
          </select>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Min Price"
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Max Price"
            className="px-3 py-2 border rounded-md"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="number"
            name="minSize"
            value={filters.minSize}
            onChange={handleFilterChange}
            placeholder="Min Size (sq ft)"
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="number"
            name="maxSize"
            value={filters.maxSize}
            onChange={handleFilterChange}
            placeholder="Max Size (sq ft)"
            className="px-3 py-2 border rounded-md"
          />
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded-md"
          >
            <option value="createdAt">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="size_asc">Size: Small to Large</option>
            <option value="size_desc">Size: Large to Small</option>
            <option value="views">Most Viewed</option>
            <option value="featured">Featured</option>
          </select>
        </div>

        <button
          onClick={handleSearch}
          className="w-full mt-4 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-semibold"
        >
          🔍 Search
        </button>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        Found {lands.length} {lands.length === 1 ? 'property' : 'properties'}
      </div>

      {/* Land Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {lands.length > 0 ? (
          lands.map((land: any) => (
            <LandCard
              key={land._id}
              land={land}
              isSaved={savedLandIds.has(land._id)}
              onSaveToggle={handleSaveToggle}
            />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500 py-20">No lands found</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LandListing;
