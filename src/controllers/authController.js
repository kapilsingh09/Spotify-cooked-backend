import querystring from 'querystring';
import axios from 'axios';
import {spotifyConfig} from '../config/spotifyconfig.js';

export const loginWithSpotify = (req, res) =>{
    const scope = [
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-read-email",
    "user-read-private",
    ].join(" ");

    const redirectUrl = 'https://accounts.spotify.com/authorize?'+
        querystring.stringify({
            response_type:'code',
            client_id:spotifyConfig.client_id,
            scope:scope,
            redirect_uri:spotifyConfig.redirectUri
        });

    res.redirect(redirectUrl);

};

export const spotifyCallback = async (req, res) => {
  const code = req.query.code;  // Get code from query parameters

  try {
    // Request Spotify token API to exchange code for access token
    const tokenResponse = await axios({
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      data: querystring.stringify({
        grant_type: "authorization_code", // type of OAuth flow
        code: code,                       // code from query params
        redirect_uri: spotifyConfig.redirectUri, // must match earlier redirect URI
        client_id: spotifyConfig.clientId,       // your client id
        client_secret: spotifyConfig.clientSecret, // your client secret
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Extract tokens from Spotify response
    const { access_token, refresh_token } = tokenResponse.data;

    // Send tokens to frontend or client
    return res.json({
      success: true,
      access_token,
      refresh_token,
    });
  } catch (err) {
    console.error(err.response?.data || err);
    return res.status(500).json({ error: "Spotify auth failed" });
  }
};