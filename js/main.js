let userCount = Math.floor(Math.random() * 50) + 10; // simulate users online
const counter = document.getElementById('user-count');
counter.textContent = userCount;

setInterval(() => {
  // Random fluctuation for effect
  userCount += Math.floor(Math.random() * 3 - 1);
  if (userCount < 0) userCount = 0;
  counter.textContent = userCount;
}, 3000);
