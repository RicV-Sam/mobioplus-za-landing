(function () {
  var guessInput = document.getElementById('guess-input');
  var guessBtn = document.getElementById('guess-btn');
  var resetBtn = document.getElementById('reset-btn');
  var attemptsEl = document.getElementById('attempts');
  var feedbackEl = document.getElementById('feedback');

  var target = 0;
  var attempts = 0;
  var complete = false;

  function startGame() {
    target = 1 + Math.floor(Math.random() * 20);
    attempts = 0;
    complete = false;
    attemptsEl.textContent = 'Attempts: 0';
    feedbackEl.textContent = 'Enter a number to begin.';
    guessInput.disabled = false;
    guessBtn.disabled = false;
    guessInput.value = '';
    guessInput.focus();
  }

  function checkGuess() {
    if (complete) {
      return;
    }
    var value = Number(guessInput.value);
    if (!Number.isInteger(value) || value < 1 || value > 20) {
      feedbackEl.textContent = 'Please enter a whole number between 1 and 20.';
      return;
    }

    attempts += 1;
    attemptsEl.textContent = 'Attempts: ' + attempts;

    if (value === target) {
      feedbackEl.textContent = 'Correct. You guessed the number in ' + attempts + ' attempts.';
      complete = true;
      guessInput.disabled = true;
      guessBtn.disabled = true;
      return;
    }

    feedbackEl.textContent = value < target ? 'Higher. Try again.' : 'Lower. Try again.';
    guessInput.focus();
  }

  guessBtn.addEventListener('click', checkGuess);
  guessInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      checkGuess();
    }
  });
  resetBtn.addEventListener('click', startGame);

  startGame();
})();
