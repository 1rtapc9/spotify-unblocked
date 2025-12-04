document.getElementById('search-btn').addEventListener('click', async () => {
  const query = document.getElementById('search-input').value;
  const type = document.getElementById('search-type').value;
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (!query) return;

  // Using Spotify's public search API requires OAuth normally, for guest we simulate
  // For now we show a placeholder
  resultsDiv.innerHTML = `<p>Search results for "${query}" (${type}) would appear here.</p>`;
});
