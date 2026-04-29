(function () {
  var startBtn = document.getElementById('start-btn');
  var tapBtn = document.getElementById('tap-btn');
  var resetBtn = document.getElementById('reset-btn');
  var statusEl = document.getElementById('status');
  var bestEl = document.getElementById('best');

  var timerId = null;
  var startedAt = 0;
  var waitingForTap = false;
  var bestScore = null;

  function resetState() {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    startedAt = 0;
    waitingForTap = false;
    tapBtn.disabled = true;
    statusEl.textContent = 'Press Start Challenge when ready.';
  }

  function beginRound() {
    resetState();
    statusEl.textContent = 'Wait for the signal...';
    var delay = 1000 + Math.floor(Math.random() * 2500);
    timerId = setTimeout(function () {
      timerId = null;
      waitingForTap = true;
      startedAt = Date.now();
      tapBtn.disabled = false;
      statusEl.textContent = 'Tap now!';
    }, delay);
  }

  startBtn.addEventListener('click', beginRound);

  tapBtn.addEventListener('click', function () {
    if (!waitingForTap || !startedAt) {
      return;
    }
    var reaction = Date.now() - startedAt;
    waitingForTap = false;
    startedAt = 0;
    tapBtn.disabled = true;
    statusEl.textContent = 'Reaction time: ' + reaction + ' ms. Tap Start Challenge to play again.';

    if (bestScore === null || reaction < bestScore) {
      bestScore = reaction;
      bestEl.textContent = 'Best score this session: ' + bestScore + ' ms';
    }
  });

  resetBtn.addEventListener('click', function () {
    bestScore = null;
    bestEl.textContent = 'Best score this session: --';
    resetState();
  });
})();
