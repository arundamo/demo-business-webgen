# Business Website Generator

A Next.js application that helps users search for local businesses using the Google Maps Places API (with mock data fallback), identifies businesses without websites, and generates AI-powered demo websites for them.

![Business Website Generator](https://img.shields.io/badge/Next.js-16-black)
![Node.js](https://img.shields.io/badge/Node.js-20+-green)

## Features

- 🔍 **Business Search**: Search for businesses by type and location (e.g., "plumber in Waterloo, Ontario")
- 📋 **Business Listings**: View business details including name, address, phone, and website status
- 🌐 **Website Detection**: Automatically identify businesses without websites
- ✨ **AI Website Generation**: Generate professional demo websites using OpenAI (or fallback template)
- 👁️ **Live Preview**: Preview generated websites in an iframe
- 📥 **Download HTML**: Download generated websites as HTML files
- 🔄 **Mock Data Mode**: Works without API keys using built-in mock data

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd demo-business-webgen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and configure your API keys (optional - app works with mock data).

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Visit [http://localhost:3000](http://localhost:3000)

## Configuration

### Environment Variables

Create a `.env.local` file based on `.env.local.example`:

```env
# Google Places API Key (optional - uses mock data if not set)
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# OpenAI API Key (optional - uses template if not set)
OPENAI_API_KEY=your_openai_api_key_here

# Set to "true" to force mock data mode
USE_MOCK_DATA=true
```

### Using Mock Data (Default)

By default, the app uses mock data, perfect for development and testing without API keys:

- **Mock Business Data**: 5 sample plumbing businesses in Waterloo, Ontario
- **Template Website Generation**: Professional HTML template without OpenAI

### Using Real APIs

To use real APIs:

1. **Google Places API**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "Places API"
   - Create an API key under Credentials
   - Add the key to `GOOGLE_PLACES_API_KEY`

2. **OpenAI API**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Create an account and API key
   - Add the key to `OPENAI_API_KEY`

3. **Disable Mock Mode**
   - Set `USE_MOCK_DATA=false` in `.env.local`

## Project Structure

```
demo-business-webgen/
├── pages/
│   ├── index.js              # Main UI with search functionality
│   └── api/
│       ├── search.js         # Google Places API / mock search
│       └── gen-website.js    # OpenAI / template website generation
├── components/
│   ├── SearchForm.js         # Search input component
│   ├── BusinessList.js       # Business cards display
│   └── WebsitePreview.js     # Generated website preview modal
├── utils/
│   └── openai.js             # OpenAI helper and template generator
├── styles/
│   └── Home.module.css       # Application styles
├── .env.local.example        # Environment variables template
└── README.md                 # This file
```

## API Endpoints

### GET /api/search

Search for businesses by query.

**Parameters:**
- `query` (required): Search query (e.g., "plumber in Waterloo, Ontario")

**Response:**
```json
{
  "businesses": [
    {
      "id": "place_id",
      "name": "Business Name",
      "address": "123 Main St, City, Province",
      "phone": "(555) 123-4567",
      "website": "https://example.com" | null,
      "rating": 4.5,
      "types": ["plumber", "home_services"]
    }
  ],
  "source": "google" | "mock",
  "message": "Status message"
}
```

### POST /api/gen-website

Generate a demo website for a business.

**Body:**
```json
{
  "business": {
    "name": "Business Name",
    "address": "123 Main St, City",
    "phone": "(555) 123-4567",
    "type": "plumber"
  }
}
```

**Response:**
```json
{
  "html": "<!DOCTYPE html>...",
  "source": "openai" | "template",
  "message": "Generation status"
}
```

## Usage Guide

1. **Search for Businesses**
   - Enter a search query like "plumber in Waterloo, Ontario"
   - Click "Search" to find matching businesses

2. **View Results**
   - Browse the list of businesses
   - Each card shows: name, address, phone, website status, rating

3. **Generate Demo Website**
   - For businesses without a website, click "✨ Generate Demo Website"
   - Wait for the AI to generate a professional website

4. **Preview & Download**
   - View the generated website in the preview modal
   - Switch between "Preview" and "HTML Code" tabs
   - Click "Open in New Tab" for full-screen preview
   - Click "Download HTML" to save the website file

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Technologies Used

- **Frontend**: Next.js, React
- **Styling**: CSS Modules
- **APIs**: Google Places API, OpenAI API
- **Runtime**: Node.js

## Fallback Behavior

The app gracefully handles missing API keys:

| Scenario | Search Behavior | Website Generation |
|----------|----------------|-------------------|
| No API keys | Mock data | Template |
| Google key only | Real search | Template |
| OpenAI key only | Mock data | AI-generated |
| Both keys | Real search | AI-generated |
| `USE_MOCK_DATA=true` | Mock data | Template |

## License

MIT License - feel free to use this project for learning or building your own business tools.
