// Simulate online users
let userCount = Math.floor(Math.random() * 50) + 10;
const counter = document.getElementById('user-count');
counter.textContent = userCount;

setInterval(() => {
  userCount += Math.floor(Math.random() * 3 - 1);
  if (userCount < 0) userCount = 0;
  counter.textContent = userCount;
}, 3000);

// Setup login URL
const CLIENT_ID = '9049e4208b1c4f81a80a3b03948b30e9';
const REDIRECT_URI = 'https://spotify-unblocked.vercel.app/callback';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'user-top-read',
  'user-read-recently-played'
].join('%20');

const loginBtn = document.getElementById('login-btn');
loginBtn.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;
