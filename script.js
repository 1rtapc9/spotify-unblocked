// Spotify App Info
const clientId = '9049e4208b1c4f81a80a3b03948b30e9';
const redirectUri = 'https://spotify-unblocked-callback.vercel.app';
const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-playback-state',
    'user-modify-playback-state'
].join(' ');

// Login with Spotify
document.getElementById('login-btn').addEventListener('click', () => {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=123`;
    window.location.href = authUrl;
});

// On page load, check if returning from Spotify login
async function handleSpotifyCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
        // Exchange code for token
        const res = await fetch(`/api/spotify-token?code=${code}`);
        const data = await res.json();
        if (data.access_token) {
            localStorage.setItem('spotify_token', data.access_token);
            window.history.replaceState({}, '', '/'); // remove code from URL
            loadUserHub(data.access_token);
        }
    }
}

handleSpotifyCallback();

// Load user hub after login
async function loadUserHub(token) {
    // Example: fetch user profile
    const res = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` }
    });
    const profile = await res.json();

    const container = document.querySelector('.container');
    container.innerHTML = `
        <img src="${profile.images[0]?.url || '7df92ddb-75e3-404e-917c-ad35fb6c98f6.png'}" class="logo">
        <h1>Welcome, ${profile.display_name}</h1>
        <button id="logout-btn">Logout</button>
        <div id="user-playlists"></div>
    `;

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('spotify_token');
        window.location.reload();
    });

    // Fetch user playlists
    const playlistsRes = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: { Authorization: `Bearer ${token}` }
    });
    const playlistsData = await playlistsRes.json();
    const playlistsDiv = document.getElementById('user-playlists');
    playlistsData.items.forEach(pl => {
        const div = document.createElement('div');
        div.textContent = `${pl.name} - ${pl.tracks.total} tracks`;
        playlistsDiv.appendChild(div);
    });
}

// Guest Mode
const guestBtn = document.getElementById('guest-btn');
const guestSearchDiv = document.getElementById('guest-search');

guestBtn.addEventListener('click', () => {
    guestSearchDiv.style.display = 'block';
});

// Guest Mode Search
document.getElementById('search-btn').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value;
    const type = document.getElementById('search-type').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    if (!query) return;

    const tokenRes = await fetch('/api/guest-token');
    const { access_token } = await tokenRes.json();

    const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=10`, {
        headers: { Authorization: `Bearer ${access_token}` }
    });
    const data = await res.json();

    resultsDiv.innerHTML = '';
    if (type === 'track') {
        data.tracks.items.forEach(track => {
            const div = document.createElement('div');
            div.innerHTML = `${track.name} - ${track.artists[0].name}`;
            if (track.preview_url) {
                const audio = document.createElement('audio');
                audio.src = track.preview_url;
                audio.controls = true;
                div.appendChild(audio);
            } else {
                div.innerHTML += ' (Preview not available)';
            }
            resultsDiv.appendChild(div);
        });
    }
    // handle playlist, album, artist, show as before
});
