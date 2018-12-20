import { chunk } from 'lodash';

const apiKeyParam = 'api_key=7f5e61b6cef8643d2442344b45842192';

const groupInto3 = array =>
  chunk(array, 3).map((data, index) => ({
    key: index.toString(),
    data,
  }));

const normalize = (array, imagePath = 'backdrop_path') =>
  array.filter(asset => asset.original_language === 'en' && asset[imagePath])
    .slice(0, 15)
    .map(it => ({ ...it, key: it.id.toString() }));

export const tmdbDiscover = () => dispatch => {
  let movies = [];

  dispatch({
    type: 'TMDB_DISCOVER',
    payload: fetch(`http://api.themoviedb.org/3/discover/movie?${apiKeyParam}`)
      .then(response => response.json())
      .then(json => {
        movies = json.results.slice(0, 12);
        return fetch(`http://api.themoviedb.org/3/discover/tv?${apiKeyParam}`);
      })
      .then(response => response.json())
      .then(tv => movies.concat(tv.results.slice(0, 12)).sort(() => 0.5 - Math.random()))
      .then(json => groupInto3(normalize(json))),
  });
};

export const tmdbMovies = () => dispatch => dispatch({
  type: 'TMDB_MOVIES',
  payload: fetch(`http://api.themoviedb.org/3/movie/popular?${apiKeyParam}`)
    .then(response => response.json())
    .then(json => normalize(json.results, 'poster_path')),
});

export const tmdbTv = () => dispatch => dispatch({
  type: 'TMDB_TV',
  payload: fetch(`http://api.themoviedb.org/3/tv/popular?${apiKeyParam}`)
    .then(response => response.json())
    .then(json => normalize(json.results)),
});

export const tmdbDetails = (id, type, cacheOnly = false) => (dispatch, getState) => {
  const { tmdbReducer: { detailsCache, details: { fetching } } } = getState();
  if (fetching) return dispatch({ type: 'NONE' });
  const cachedPayload = detailsCache.find(it => it.id === id && it.type === type);
  if (cachedPayload) {
    return dispatch({
      type: 'TMDB_DETAILS',
      payload: Promise.resolve(cachedPayload),
      meta: {
        params: { type, id },
        cachehit: true,
        cacheOnly,
      },
    });
  }

  return dispatch({
    type: 'TMDB_DETAILS',
    meta: {
      params: { type, id },
      cachehit: false,
      cacheOnly,
      debounce: {
        time: 500,
        key: 'TMDB_DETAILS',
      },
    },
    payload: fetch(`http://api.themoviedb.org/3/${type}/${id}?append_to_response=similar,videos,credits&${apiKeyParam}`)
      .then(response => response.json())
      .then(json => {
        json.type = 'name' in json ? 'tv' : 'movie';
        json.youtubeId = json.videos.results.length ? json.videos.results[0].key : 'nO_DIwuGBnA';
        json.similar.results = json.similar.results.slice(0, 5).map(it => ({ ...it, key: it.id.toString() }));
        return json;
      }),
  });
};

export const tmdbClearDetails = () => dispatch => {
  dispatch({
    type: 'TMDB_DETAILS_CLEAR',
    payload: true,
  });
};

export const tmdbSearch = query => dispatch => dispatch({
  type: 'TMDB_SEARCH',
  meta: {
    debounce: {
      time: 500,
    },
  },
  payload: fetch(`http://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&${apiKeyParam}`)
    .then(response => response.json())
    .then(json => normalize(json.results)),
});

export const fetchPDPfromCache = id => dispatch => dispatch({
  type: 'FETCH_PDP_CACHE',
  payload: id,
});
