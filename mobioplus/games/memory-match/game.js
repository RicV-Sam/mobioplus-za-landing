(function () {
  var symbols = ['🍎', '🎯', '🎵', '🚀', '🌟', '⚽', '📘', '🎲'];
  var grid = document.getElementById('memory-grid');
  var movesEl = document.getElementById('moves');
  var statusEl = document.getElementById('status');
  var resetBtn = document.getElementById('reset-btn');

  var firstCard = null;
  var lockBoard = false;
  var moves = 0;
  var matches = 0;

  function shuffle(array) {
    for (var i = array.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  function createDeck() {
    return shuffle(symbols.concat(symbols));
  }

  function resetGame() {
    firstCard = null;
    lockBoard = false;
    moves = 0;
    matches = 0;
    movesEl.textContent = 'Moves: 0';
    statusEl.textContent = 'Find all matching pairs.';
    renderBoard(createDeck());
  }

  function checkWin() {
    if (matches === symbols.length) {
      statusEl.textContent = 'Great game. You matched all pairs in ' + moves + ' moves.';
    }
  }

  function hideCards(a, b) {
    setTimeout(function () {
      a.textContent = '?';
      b.textContent = '?';
      a.dataset.revealed = 'false';
      b.dataset.revealed = 'false';
      firstCard = null;
      lockBoard = false;
    }, 550);
  }

  function onCardClick(event) {
    var btn = event.currentTarget;
    if (lockBoard || btn.dataset.matched === 'true' || btn.dataset.revealed === 'true') {
      return;
    }

    btn.textContent = btn.dataset.symbol;
    btn.dataset.revealed = 'true';

    if (!firstCard) {
      firstCard = btn;
      return;
    }

    moves += 1;
    movesEl.textContent = 'Moves: ' + moves;

    if (firstCard.dataset.symbol === btn.dataset.symbol) {
      firstCard.dataset.matched = 'true';
      btn.dataset.matched = 'true';
      firstCard.disabled = true;
      btn.disabled = true;
      firstCard = null;
      matches += 1;
      checkWin();
      return;
    }

    lockBoard = true;
    hideCards(firstCard, btn);
  }

  function renderBoard(deck) {
    grid.innerHTML = '';
    deck.forEach(function (symbol) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'memory-card';
      card.textContent = '?';
      card.dataset.symbol = symbol;
      card.dataset.revealed = 'false';
      card.dataset.matched = 'false';
      card.setAttribute('aria-label', 'Memory card');
      card.addEventListener('click', onCardClick);
      grid.appendChild(card);
    });
  }

  resetBtn.addEventListener('click', resetGame);
  resetGame();
})();
