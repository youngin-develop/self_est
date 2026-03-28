document.addEventListener('DOMContentLoaded', () => {
  const fireworksBtn = document.getElementById('fireworks-btn');
  const meatPartyBtn = document.getElementById('meat-party-btn');
  const messageContainer = document.getElementById('message-container');
  const specialMessage = document.getElementById('special-message');

  // Fireworks Logic
  fireworksBtn.addEventListener('click', () => {
    // Launch fireworks!
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // One big burst in the middle
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  });

  // Special Message Logic
  meatPartyBtn.addEventListener('click', () => {
    const message = "생일축하해줘서 고마워 유빈아 사랑행";
    
    // Set text
    specialMessage.textContent = message;
    
    // Show container with animation
    messageContainer.classList.add('visible');
    
    // Add a little extra sparkle when revealing the message
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
    });
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
    });
  });
});
