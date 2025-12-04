import { useEffect, useState } from 'react';

const CLIENT_ID = '9049e4208b1c4f81a80a3b03948b30e9';
const REDIRECT_URI = 'https://spotify-unblocked-api.vercel.app';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'user-top-read',
  'user-read-recently-played'
].join('%20');

export default function Home() {
  const [token, setToken] = useState('');
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);

  // Check if token is in URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const tokenFromHash = hash
        .substring(1)
        .split('&')
        .find(elem => elem.startsWith('access_token'))
        .split('=')[1];
      setToken(tokenFromHash);
      window.location.hash = '';
    }
  }, []);

  const searchTracks = async () => {
    if (!query) return;
    const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setTracks(data.tracks.items || []);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Minimal Spotify Web Player</h1>
      {!token ? (
        <a
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}
        >
          Log in with Spotify
        </a>
      ) : (
        <>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for tracks..."
            style={{ padding: '8px', width: '60%', marginRight: '8px' }}
          />
          <button onClick={searchTracks} style={{ padding: '8px 12px' }}>Search</button>
          <div style={{ marginTop: '20px' }}>
            {tracks.map(track => (
              <div key={track.id} style={{ marginBottom: '10px' }}>
                <strong>{track.name}</strong> - {track.artists[0].name}
                <iframe
                  src={`https://open.spotify.com/embed/track/${track.id}`}
                  width="300"
                  height="80"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  style={{ display: 'block', marginTop: '5px' }}
                ></iframe>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
