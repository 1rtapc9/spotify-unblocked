// Spotify App Info
const CLIENT_ID = '9049e4208b1c4f81a80a3b03948b30e9';
const REDIRECT_URI = window.location.origin + '/guest.html';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';
const SCOPES = ['user-read-private', 'user-read-email'].join('%20');

// Check for token in URL hash
let accessToken = null;
const hash = window.location.hash.substring(1);
const params = new URLSearchParams(hash);
if (params.get('access_token')) {
  accessToken = params.get('access_token');
  window.history.pushState("", document.title, window.location.pathname); // remove token from URL
}

// If no token, redirect to Spotify auth to get temporary token
if (!accessToken) {
  const authURL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;
  window.location.href = authURL;
}

// Handle Search
document.getElementById('search-btn').addEventListener('click', async () => {
  const query = document.getElementById('search-input').value;
  const type = document.getElementById('search-type').value;
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (!query) return;

  try {
    const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=10`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const data = await res.json();

    if (type === 'track' && data.tracks) {
      data.tracks.items.forEach(track => {
        const div = document.createElement('div');
        div.className = 'track';
        div.innerHTML = `<strong>${track.name}</strong> - ${track.artists[0].name}
        <iframe src="https://open.spotify.com/embed/track/${track.id}" width="300" height="80" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
        resultsDiv.appendChild(div);
      });
    }

    else if (type === 'playlist' && data.playlists) {
      data.playlists.items.forEach(pl => {
        const div = document.createElement('div');
        div.className = 'playlist';
        div.innerHTML = `<strong>${pl.name}</strong> - ${pl.tracks.total} tracks
        <iframe src="https://open.spotify.com/embed/playlist/${pl.id}" width="300" height="80" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
        resultsDiv.appendChild(div);
      });
    }

    else if (type === 'album' && data.albums) {
      data.albums.items.forEach(album => {
        const div = document.createElement('div');
        div.className = 'playlist';
        div.innerHTML = `<strong>${album.name}</strong> - ${album.artists[0].name}
        <iframe src="https://open.spotify.com/embed/album/${album.id}" width="300" height="80" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
        resultsDiv.appendChild(div);
      });
    }

    else if (type === 'artist' && data.artists) {
      data.artists.items.forEach(artist => {
        const div = document.createElement('div');
        div.className = 'artist flex';
        div.innerHTML = `<img src="${artist.images[0]?.url || ''}" alt="${artist.name}"><strong>${artist.name}</strong>`;
        resultsDiv.appendChild(div);
      });
    }

    else if (type === 'show' && data.shows) {
      data.shows.items.forEach(show => {
        const div = document.createElement('div');
        div.className = 'playlist';
        div.innerHTML = `<strong>${show.name}</strong>
        <iframe src="https://open.spotify.com/embed/show/${show.id}" width="300" height="80" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
        resultsDiv.appendChild(div);
      });
    }

  } catch (err) {
    console.error('Error fetching from Spotify API:', err);
    resultsDiv.innerHTML = `<p style="color:red;">Error fetching results. Try again.</p>`;
  }
});
