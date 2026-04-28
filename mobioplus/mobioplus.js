(function () {
  var cfg = window.MOBIOPLUS_CONFIG || {};

  function text(selector, value) {
    document.querySelectorAll('[data-config="' + selector + '"]').forEach(function (el) {
      el.textContent = value;
    });
  }

  function link(selector, value) {
    document.querySelectorAll('[data-config-link="' + selector + '"]').forEach(function (el) {
      el.setAttribute('href', value);
    });
  }

  var serviceName = cfg.serviceName || 'Mobioplus';
  var networkName = cfg.networkName || 'MTN';
  var price = cfg.price || 'R39.99';
  var billingPeriod = cfg.billingPeriod || 'week';
  var unsubscribeInstruction = cfg.unsubscribeInstruction || 'To unsubscribe dial *123#';
  var providerName = cfg.providerName || 'Mobioplus Digital Services';
  var providerAddress = cfg.providerAddress || 'South Africa';
  var helpPhone = cfg.helpPhone || '+27 800 000 000';
  var premiumDisclosureTemplate = cfg.premiumDisclosureTemplate || '{serviceName} Premium is a paid subscription service for {networkName} subscribers at {price}/{billingPeriod}. Free content is available on this page. You will see the price and terms before confirming. {unsubscribeInstruction}.';
  var providerDetailsPendingConfirmation = !!cfg.providerDetailsPendingConfirmation;
  var premiumDisclosure = premiumDisclosureTemplate
    .replace('{serviceName}', serviceName)
    .replace('{networkName}', networkName)
    .replace('{price}', price)
    .replace('{billingPeriod}', billingPeriod)
    .replace('{unsubscribeInstruction}', unsubscribeInstruction);

  text('serviceName', serviceName);
  text('networkName', networkName);
  text('pricePeriod', price + '/' + billingPeriod);
  text('priceFaq', 'For ' + networkName + ' subscribers: ' + price + '/' + billingPeriod + '.');
  text('networkPrice', 'For ' + networkName + ' subscribers: ' + price + '/' + billingPeriod + '.');
  text('unsubscribeInstruction', unsubscribeInstruction);
  text('provider', providerName + ' | ' + providerAddress);
  text('helpPhone', helpPhone);
  text('premiumDisclosure', premiumDisclosure);
  text('providerConfirmationNote', providerDetailsPendingConfirmation ? 'Final legal and provider details are subject to confirmation before production release.' : '');

  link('termsUrl', cfg.termsUrl || './terms.html');
  link('privacyUrl', cfg.privacyUrl || './privacy.html');
  link('helpUrl', cfg.helpUrl || './help.html');

  if (cfg.canonicalUrl) {
    var webpageSchema = document.getElementById('webpage-schema');
    if (webpageSchema) {
      var canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', cfg.canonicalUrl);
      }
      var ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) {
        ogUrl.setAttribute('content', cfg.canonicalUrl);
      }
      var parsed = JSON.parse(webpageSchema.textContent);
      parsed.url = cfg.canonicalUrl;
      webpageSchema.textContent = JSON.stringify(parsed);
    }
  }

  function renderFreeContent() {
    var items = window.MOBIOPLUS_FREE_CONTENT || [];
    var grid = document.getElementById('free-card-grid');
    if (!grid || !items.length) {
      return;
    }

    var firstAnchorByCategory = {};
    var categoriesToAnchors = {
      Games: 'games',
      Quizzes: 'quizzes',
      Learning: 'learn',
      Lifestyle: 'lifestyle',
      Videos: 'videos'
    };

    var html = items.map(function (item) {
      var anchorId = item.anchorId || categoriesToAnchors[item.category];
      var idAttr = '';
      if (anchorId && !firstAnchorByCategory[anchorId]) {
        firstAnchorByCategory[anchorId] = true;
        idAttr = ' id="' + anchorId + '"';
      }
      var metaParts = [item.category, item.type];
      if (item.timeLabel) {
        metaParts.push(item.timeLabel);
      }
      if (item.difficultyLabel) {
        metaParts.push(item.difficultyLabel);
      }
      return (
        '<article class="content-card"' + idAttr + '>' +
          '<span class="badge badge-free">' + (item.badge || 'Free') + '</span>' +
          '<h3>' + item.title + '</h3>' +
          '<p class="meta">' + metaParts.join(' · ') + '</p>' +
          '<p>' + item.description + '</p>' +
          '<button type="button" class="text-cta preview-trigger" data-item-id="' + item.id + '">' + item.ctaLabel + '</button>' +
        '</article>'
      );
    }).join('');

    grid.innerHTML = html;

    var previewMap = {};
    items.forEach(function (item) {
      previewMap[item.id] = item;
    });

    var previewTitle = document.getElementById('free-preview-item-title');
    var previewMeta = document.getElementById('free-preview-item-meta');
    var previewDesc = document.getElementById('free-preview-item-desc');
    var previewBody = document.getElementById('free-preview-item-body');
    var previewInteraction = document.getElementById('free-preview-interaction');

    function clearInteraction() {
      previewInteraction.innerHTML = '';
    }

    function attachReactionGame() {
      var startedAt = 0;
      var liveTimeout = null;
      previewInteraction.innerHTML =
        '<div class="mini-tool">' +
          '<button type="button" class="mini-btn" id="reaction-start">Start Reaction Test</button>' +
          '<button type="button" class="mini-btn" id="reaction-tap" disabled>Tap Now</button>' +
          '<p id="reaction-feedback" class="mini-feedback">Press start and wait for the tap button.</p>' +
        '</div>';
      var startBtn = document.getElementById('reaction-start');
      var tapBtn = document.getElementById('reaction-tap');
      var feedback = document.getElementById('reaction-feedback');

      startBtn.addEventListener('click', function () {
        tapBtn.disabled = true;
        feedback.textContent = 'Get ready...';
        var delay = 900 + Math.floor(Math.random() * 1400);
        if (liveTimeout) {
          clearTimeout(liveTimeout);
        }
        liveTimeout = setTimeout(function () {
          startedAt = Date.now();
          tapBtn.disabled = false;
          feedback.textContent = 'Tap now!';
        }, delay);
      });

      tapBtn.addEventListener('click', function () {
        if (!startedAt) {
          return;
        }
        var result = Date.now() - startedAt;
        tapBtn.disabled = true;
        startedAt = 0;
        feedback.textContent = 'Your reaction time: ' + result + ' ms.';
      });
    }

    function attachNumberGuess() {
      var target = 1 + Math.floor(Math.random() * 20);
      var attemptsLeft = 6;
      previewInteraction.innerHTML =
        '<div class="mini-tool">' +
          '<label for="guess-input">Guess a number (1-20)</label>' +
          '<div class="mini-row">' +
            '<input id="guess-input" class="mini-input" type="number" min="1" max="20">' +
            '<button type="button" class="mini-btn" id="guess-check">Check</button>' +
          '</div>' +
          '<p id="guess-feedback" class="mini-feedback">You have 6 attempts.</p>' +
        '</div>';
      var input = document.getElementById('guess-input');
      var check = document.getElementById('guess-check');
      var feedback = document.getElementById('guess-feedback');

      check.addEventListener('click', function () {
        var value = Number(input.value);
        if (!value || value < 1 || value > 20) {
          feedback.textContent = 'Enter a valid number from 1 to 20.';
          return;
        }
        attemptsLeft -= 1;
        if (value === target) {
          feedback.textContent = 'Great guess. You found it with ' + attemptsLeft + ' attempts remaining.';
          check.disabled = true;
          input.disabled = true;
          return;
        }
        if (attemptsLeft <= 0) {
          feedback.textContent = 'Challenge complete. The number was ' + target + '.';
          check.disabled = true;
          input.disabled = true;
          return;
        }
        feedback.textContent = (value < target ? 'Too low.' : 'Too high.') + ' Attempts left: ' + attemptsLeft + '.';
      });
    }

    function attachQuizReveal(item) {
      if (!item.quizQuestion || !item.quizAnswer) {
        return;
      }
      previewInteraction.innerHTML =
        '<div class="mini-tool">' +
          '<p><strong>Sample question:</strong> ' + item.quizQuestion + '</p>' +
          '<button type="button" class="mini-btn" id="quiz-reveal">Reveal Answer</button>' +
          '<p id="quiz-answer" class="mini-feedback" hidden><strong>Answer:</strong> ' + item.quizAnswer + '</p>' +
        '</div>';
      var reveal = document.getElementById('quiz-reveal');
      var answer = document.getElementById('quiz-answer');
      reveal.addEventListener('click', function () {
        answer.hidden = false;
      });
    }

    function showItem(itemId) {
      var item = previewMap[itemId];
      if (!item) {
        return;
      }
      previewTitle.textContent = item.title;
      previewMeta.textContent = item.category + ' · ' + item.type + ' · ' + (item.timeLabel || 'Quick preview');
      previewDesc.textContent = item.description;
      previewBody.textContent = item.previewContent;
      clearInteraction();

      if (item.id === 'reaction-tap-challenge') {
        attachReactionGame();
      } else if (item.id === 'number-guess-challenge') {
        attachNumberGuess();
      } else if (item.type === 'Quiz') {
        attachQuizReveal(item);
      }

      var freePreviews = document.getElementById('free-previews');
      if (freePreviews) {
        freePreviews.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    grid.addEventListener('click', function (event) {
      var btn = event.target.closest('.preview-trigger');
      if (!btn) {
        return;
      }
      showItem(btn.getAttribute('data-item-id'));
    });

    showItem(items[0].id);
  }

  renderFreeContent();
})();
