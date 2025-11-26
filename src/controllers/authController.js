import querrystring from 'querystring';
import axios from 'axios';
import {spotifyconfig} from '../config/spotifyconfig.js';

const loginWithSpotify = () =>{
    const scope = [
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-read-email",
    "user-read-private",
    ].join(" ");

    const redirectUrl = 'https://accounts.spotify.com/authorize?'+
        querrystring.stringify({
            response_type:'code',
            client_id:spotifyconfig.client_id,
            scope:scope,
            redirect_uri:spotifyconfig.redirectUri
        });

    res.redirect(redirectUrl);

};