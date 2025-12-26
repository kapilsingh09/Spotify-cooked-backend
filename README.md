# Spotify Backend API

A Node.js/Express backend server that integrates with Spotify Web API and Google's Gemini AI to provide Spotify authentication, playlist management, and AI-powered playlist roasting features.

## Features

- **Spotify OAuth Authentication**: Secure user authentication using Spotify's OAuth 2.0 flow
- **Playlist Management**: Fetch and manage user playlists from Spotify
- **AI-Powered Roasting**: Get humorous AI-generated roasts of your playlists using Google's Gemini AI
- **CORS Support**: Configured for secure cross-origin requests
- **Environment-based Configuration**: Flexible configuration using environment variables

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **HTTP Client**: Axios
- **AI Integration**: Google Generative AI (Gemini)
- **Authentication**: Spotify OAuth 2.0
- **Utilities**: dotenv, cors, cookie-parser, querystring

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── spotifyConfig.js      # Spotify API configuration
│   ├── controllers/
│   │   ├── aiController.js       # AI roasting logic
│   │   ├── authController.js     # Authentication handlers
│   │   └── playlistController.js # Playlist management
│   ├── routes/
│   │   ├── aiRoutes.js          # AI endpoints
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── playlistRoutes.js    # Playlist endpoints
│   ├── services/
│   │   └── geminiService.js     # Gemini AI integration
│   └── utils/
│       └── helpers.js           # Utility functions
├── app.js                        # Main application entry
├── package.json
└── .env                         # Environment variables
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Spotify Developer Account
- Google Cloud Account (for Gemini API)

### Installation

1. Clone the repository:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
# Server Configuration
PORT=3000

# Spotify API Credentials
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/auth/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

### Setting up Spotify Developer Account

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Note your Client ID and Client Secret
4. Add `http://localhost:3000/auth/callback` to the Redirect URIs

### Setting up Google Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key for Gemini
3. Add the key to your `.env` file

### Running the Server

Development mode:
```bash
npm start
# or
node app.js
```

The server will start on `http://localhost:3000` (or the PORT specified in your `.env` file).

## API Endpoints

### Authentication

#### `GET /auth/login`
Initiates Spotify OAuth flow. Redirects user to Spotify login page.

**Response**: Redirects to Spotify authorization page

---

#### `GET /auth/callback`
Spotify OAuth callback endpoint. Handles the authorization code and exchanges it for access tokens.

**Query Parameters**:
- `code` - Authorization code from Spotify
- `error` - Error message (if authorization failed)

**Response**: Redirects to frontend dashboard with tokens

---

#### `GET /auth/logout`
Logs out the user by clearing session data.

**Response**: Redirects to frontend login page

---

### Playlists

#### `GET /api/playlists`
Fetches the authenticated user's playlists from Spotify.

**Headers**:
- `Authorization: Bearer <access_token>`

**Response**:
```json
{
  "items": [
    {
      "id": "playlist_id",
      "name": "Playlist Name",
      "description": "Playlist description",
      "images": [...],
      "tracks": {...}
    }
  ]
}
```

---

### AI Features

#### `POST /api/ai/roast`
Generates an AI-powered roast of a playlist using Google's Gemini AI.

**Request Body**:
```json
{
  "playlistName": "My Playlist",
  "tracks": [
    {
      "name": "Song Name",
      "artists": [{"name": "Artist Name"}]
    }
  ]
}
```

**Response**:
```json
{
  "roast": "AI-generated humorous roast of your playlist"
}
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | No (default: 3000) |
| `SPOTIFY_CLIENT_ID` | Spotify application client ID | Yes |
| `SPOTIFY_CLIENT_SECRET` | Spotify application client secret | Yes |
| `SPOTIFY_REDIRECT_URI` | OAuth callback URL | Yes |
| `FRONTEND_URL` | Frontend application URL | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes (for AI features) |

## Error Handling

The API includes error handling for:
- Invalid Spotify credentials
- Missing or expired access tokens
- Failed API requests
- Missing Gemini API key
- CORS policy violations

## Security Features

- **CORS Protection**: Configured to only allow requests from specified origins
- **Credential Handling**: Secure cookie-based authentication
- **Environment Variables**: Sensitive data stored in environment variables
- **OAuth 2.0**: Industry-standard authentication protocol

## Development Notes

- The server uses ES modules (`"type": "module"` in package.json)
- CORS is configured to allow requests from `http://localhost:5173` and `http://127.0.0.1:5173`
- Spotify access tokens are stored in cookies for session management

## Troubleshooting

### AI Roasting Not Working
- Verify that `GEMINI_API_KEY` is set in your `.env` file
- Check the console for warning messages about missing API key
- Ensure you have enabled the Gemini API in Google Cloud Console

### Authentication Issues
- Verify Spotify credentials in `.env`
- Ensure redirect URI matches exactly with Spotify Developer Dashboard
- Check that frontend URL is correctly configured

### CORS Errors
- Verify that `FRONTEND_URL` in `.env` matches your frontend's actual URL
- Check that the frontend is running on an allowed origin

## License

ISC

## Author

Karan Singh
