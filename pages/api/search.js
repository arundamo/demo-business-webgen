/**
 * API Route: Search for businesses
 * Uses Google Places API with mock data fallback
 */

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

// Mock data for development/testing
const mockBusinesses = [
  {
    id: 'mock-1',
    name: 'Quick Fix Plumbing',
    address: '123 Main Street, Waterloo, ON N2L 3G1',
    phone: '(519) 555-0101',
    website: null,
    rating: 4.5,
    types: ['plumber', 'home_services'],
  },
  {
    id: 'mock-2',
    name: 'Waterloo Pro Plumbers',
    address: '456 King Street N, Waterloo, ON N2J 2Z3',
    phone: '(519) 555-0102',
    website: 'https://waterlooproplumbers.example.com',
    rating: 4.8,
    types: ['plumber', 'contractor'],
  },
  {
    id: 'mock-3',
    name: 'Emergency Drain Services',
    address: '789 University Ave, Waterloo, ON N2L 3C5',
    phone: '(519) 555-0103',
    website: null,
    rating: 4.2,
    types: ['plumber', 'emergency_service'],
  },
  {
    id: 'mock-4',
    name: 'Green Pipe Solutions',
    address: '321 Weber Street, Waterloo, ON N2H 4E7',
    phone: '(519) 555-0104',
    website: 'https://greenpipe.example.com',
    rating: 4.6,
    types: ['plumber', 'eco_friendly'],
  },
  {
    id: 'mock-5',
    name: 'Reliable Plumbing Co.',
    address: '555 Erb Street W, Waterloo, ON N2L 1W4',
    phone: '(519) 555-0105',
    website: null,
    rating: 4.0,
    types: ['plumber', 'residential'],
  },
];

/**
 * Search for businesses using Google Places API
 * @param {string} query - Search query (e.g., "plumber in Waterloo, Ontario")
 * @returns {Promise<Array>} Array of business objects
 */
async function searchGooglePlaces(query) {
  // First, use Text Search to find places
  const textSearchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  textSearchUrl.searchParams.append('query', query);
  textSearchUrl.searchParams.append('key', GOOGLE_PLACES_API_KEY);

  const response = await fetch(textSearchUrl.toString());
  const data = await response.json();

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(data.error_message || `Google Places API error: ${data.status}`);
  }

  if (!data.results || data.results.length === 0) {
    return [];
  }

  // Get details for each place to retrieve phone numbers and websites
  const businesses = await Promise.all(
    data.results.slice(0, 10).map(async (place) => {
      const details = await getPlaceDetails(place.place_id);
      return {
        id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        phone: details?.formatted_phone_number || null,
        website: details?.website || null,
        rating: place.rating || null,
        types: place.types || [],
      };
    })
  );

  return businesses;
}

/**
 * Get detailed information for a specific place
 * @param {string} placeId - Google Place ID
 * @returns {Promise<Object|null>} Place details or null
 */
async function getPlaceDetails(placeId) {
  const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  detailsUrl.searchParams.append('place_id', placeId);
  detailsUrl.searchParams.append('fields', 'formatted_phone_number,website');
  detailsUrl.searchParams.append('key', GOOGLE_PLACES_API_KEY);

  try {
    const response = await fetch(detailsUrl.toString());
    const data = await response.json();
    
    if (data.status === 'OK') {
      return data.result;
    }
  } catch (error) {
    console.error(`Error fetching details for ${placeId}:`, error);
  }
  
  return null;
}

/**
 * Search using mock data
 * @param {string} query - Search query
 * @returns {Array} Filtered mock businesses
 */
function searchMockData(query) {
  const queryLower = query.toLowerCase();
  
  // Simple filtering based on query
  return mockBusinesses.filter(business => {
    const nameMatch = business.name.toLowerCase().includes(queryLower);
    const addressMatch = business.address.toLowerCase().includes(queryLower);
    const typeMatch = business.types.some(type => queryLower.includes(type));
    
    // If query contains common business types, filter accordingly
    if (queryLower.includes('plumber') || queryLower.includes('plumbing')) {
      return business.types.includes('plumber');
    }
    
    return nameMatch || addressMatch || typeMatch;
  });
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    let businesses;

    if (USE_MOCK_DATA || !GOOGLE_PLACES_API_KEY) {
      // Use mock data
      businesses = searchMockData(query);
      
      return res.status(200).json({
        businesses,
        source: 'mock',
        message: !GOOGLE_PLACES_API_KEY 
          ? 'Using mock data - Google Places API key not configured' 
          : 'Using mock data as configured',
      });
    }

    // Use Google Places API
    businesses = await searchGooglePlaces(query);

    return res.status(200).json({
      businesses,
      source: 'google',
      message: 'Results from Google Places API',
    });
  } catch (error) {
    console.error('Search error:', error);
    
    // Fallback to mock data on error
    const businesses = searchMockData(query);
    
    return res.status(200).json({
      businesses,
      source: 'mock',
      message: `Fallback to mock data due to error: ${error.message}`,
    });
  }
}
