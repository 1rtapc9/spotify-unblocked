// Extract access token from URL hash
window.addEventListener('load', () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');

  if (accessToken) {
    sessionStorage.setItem('spotifyToken', accessToken);
    window.location.href = 'guest.html';
  } else {
    alert('Error retrieving Spotify token.');
  }
});
