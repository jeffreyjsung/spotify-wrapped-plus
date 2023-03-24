import axios from 'axios';

const LOCALSTORAGE_KEYS = {
  accessToken: 'spotify_access_token',
  refreshToken: 'spotify_refresh_token',
  expireTime: 'spotify_token_expire_time',
  timestamp: 'spotify_token_timestamp',
}

const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
};

/**
 * Checks if the amount of time that has elapsed between the timestamp in localStorage
 * and now is greater than the expiration time of 3600 seconds (1 hour).
 * @returns {boolean} Whether or not the access token in localStorage has expired
 */
const hasTokenExpired = () => {
  const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
  if (!accessToken || !timestamp) {
    return false;
  }
  const millisecondsElapsed = Date.now() - Number(timestamp);
  return (millisecondsElapsed / 1000) > Number(expireTime);
};

/**
 * Use the refresh token in localStorage to hit the /refresh_token endpoint
 * in our Node app, then update values in localStorage with data from response.
 * @returns {void}
 */
const refreshToken = async () => {
  try {
    // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
    if (!LOCALSTORAGE_VALUES.refreshToken ||
      LOCALSTORAGE_VALUES.refreshToken === 'undefined' ||
      (Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000) < 1000
    ) {
      console.error('No refresh token available');
      logout();
    }

    const { data } = await axios.get(`/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`);

    window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token);
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
    window.location.reload();

  } catch (e) {
    console.error(e);
  }
};

/**
 * Clear out all localStorage items we've set and reload the page
 * @returns {void}
 */
export const logout = () => {
  for (const property in LOCALSTORAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
  }
  window.location = window.location.origin;
};

/**
 * Handles logic for retrieving the Spotify access token from localStorage
 * or URL query params
 * @returns {string} A Spotify access token
 */
const getAccessToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get('expires_in'),
  };
  const hasError = urlParams.get('error');

  if (hasError || hasTokenExpired() || LOCALSTORAGE_VALUES.accessToken === 'undefined') {
    refreshToken();
  }

  if (LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.accessToken !== 'undefined') {
    return LOCALSTORAGE_VALUES.accessToken;
  }

  // If there is a token in the URL query params, user is logging in for the first time
  // an we should store the query params in local storage
  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    for (const property in queryParams) {
      window.localStorage.setItem(property, queryParams[property]);
    }
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());

    return queryParams[LOCALSTORAGE_KEYS.accessToken];
  }

  return false;
};

export const accessToken = getAccessToken();

/**
 * Axios global request headers
 * https://github.com/axios/axios#global-axios-defaults
 */
axios.defaults.baseURL = 'https://api.spotify.com/v1';
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
axios.defaults.headers['Content-Type'] = 'application/json';

/**
 * Get current user's profile
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/endpoint-get-current-users-profile
 * @returns {Promise}
 */
export const getProfile = () => axios.get('/me');

/**
 * Get a list of current user's playlists
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-a-list-of-current-users-playlists
 * @returns {Promise}
 */
export const getPlaylists = (limit = 40) => {
  return axios.get(`/me/playlists?limit=${limit}`);
};

/**
 * Get current user's top artists
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks
 * @param {int} limit - number of items to fetch
 * @param {string} time_range - 'short_term' (last 4 weeks) 'medium_term' (last 6 months) or 'long_term' (calculated from several years of data and including all new data as it becomes available). Defaults to 'short_term'
 * @returns {Promise}
 */
export const getTopArtists = (limit = 40, time_range = 'short_term') => {
  return axios.get(`/me/top/artists?limit=${limit}&time_range=${time_range}`);
};

/**
 * Get current user's top tracks
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks
 * @param {int} limit - number of items to fetch
 * @param {string} time_range - 'short_term' (last 4 weeks) 'medium_term' (last 6 months) or 'long_term' (calculated from several years of data and including all new data as it becomes available). Defaults to 'short_term'
 * @returns {Promise}
 */
export const getTopTracks = (limit = 40, time_range = 'short_term') => {
  return axios.get(`/me/top/tracks?limit=${limit}&time_range=${time_range}`);
};

/**
 * Get a list of current user's recently played tracks
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recently-played
 * @returns {Promise}
 */
export const getRecentlyPlayedTracks = (limit = 40) => {
  return axios.get(`/me/player/recently-played?limit=${limit}`);
};

/**
 * Get a user's playlist
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlist
 * @param {string} playlist_id - The Spotify ID for the playlist.
 * @returns {Promise}
 */
export const getPlaylistById = playlist_id => {
  return axios.get(`/playlists/${playlist_id}`);
}

/**
 * Get audio features for several tracks
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-several-audio-features
 * @param {string} ids - A comma-separated list of the Spotify IDs for the tracks
 * @returns {Promise}
 */
export const getAudioFeaturesForTracks = ids => {
  return axios.get(`/audio-features?ids=${ids}`);
};