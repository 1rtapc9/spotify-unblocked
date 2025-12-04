// Spotify App Info
const clientId = '9049e4208b1c4f81a80a3b03948b30e9';
const redirectUri = 'https://spotify-unblocked-callback.vercel.app';
const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
].join(' ');

// Login with Spotify
document.getElementById('login-btn').addEventListener('click', () => {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=123`;
    window.location.href = authUrl;
});

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

    // Get guest token from serverless function
    const tokenRes = await fetch('/api/guest-token');
    const { access_token } = await tokenRes.json();

    const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=10`, {
        headers: { Authorization: `Bearer ${access_token}` }
    });
    const data = await res.json();

    // Display results
    if (type === 'track') {
        data.tracks.items.forEach(track => {
            const div = document.createElement('div');
            div.textContent = `${track.name} - ${track.artists[0].name}`;
            resultsDiv.appendChild(div);
        });
    } else if (type === 'playlist') {
        data.playlists.items.forEach(pl => {
            const div = document.createElement('div');
            div.textContent = `${pl.name} - ${pl.tracks.total} tracks`;
            resultsDiv.appendChild(div);
        });
    } else if (type === 'album') {
        data.albums.items.forEach(album => {
            const div = document.createElement('div');
            div.textContent = `${album.name} - ${album.artists[0].name}`;
            resultsDiv.appendChild(div);
        });
    } else if (type === 'artist') {
        data.artists.items.forEach(artist => {
            const div = document.createElement('div');
            div.textContent = artist.name;
            resultsDiv.appendChild(div);
        });
    } else if (type === 'show') {
        data.shows.items.forEach(show => {
            const div = document.createElement('div');
            div.textContent = show.name;
            resultsDiv.appendChild(div);
        });
    }
});
