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
      var safeTitle = item.title || 'Free item';
      var safeCategory = item.category || 'General';
      var safeType = item.type || 'Preview';
      var safeDescription = item.description || 'Free preview content.';
      var safeCtaLabel = item.ctaLabel || 'View Free';
      var anchorId = item.anchorId || categoriesToAnchors[safeCategory];
      var idAttr = '';
      if (anchorId && !firstAnchorByCategory[anchorId]) {
        firstAnchorByCategory[anchorId] = true;
        idAttr = ' id="' + anchorId + '"';
      }

      var metaParts = [safeCategory, safeType];
      if (item.timeLabel) {
        metaParts.push(item.timeLabel);
      }
      if (item.difficultyLabel) {
        metaParts.push(item.difficultyLabel);
      }

      var ctaHtml = item.playUrl
        ? '<a class="text-cta" href="' + item.playUrl + '" aria-label="' + safeCtaLabel + ': ' + safeTitle + '">' + safeCtaLabel + '</a>'
        : '<button type="button" class="text-cta preview-trigger" data-item-id="' + item.id + '">' + safeCtaLabel + '</button>';

      return (
        '<article class="content-card"' + idAttr + '>' +
          '<span class="badge badge-free">' + (item.badge || 'Free') + '</span>' +
          '<h3>' + safeTitle + '</h3>' +
          '<p class="meta">' + metaParts.join(' - ') + '</p>' +
          '<p>' + safeDescription + '</p>' +
          ctaHtml +
        '</article>'
      );
    }).join('');

    grid.innerHTML = html;

    var previewMap = {};
    items.forEach(function (item) {
      if (item && item.id) {
        previewMap[item.id] = item;
      }
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
      previewTitle.textContent = item.title || 'Free item';
      previewMeta.textContent = (item.category || 'General') + ' - ' + (item.type || 'Preview') + ' - ' + (item.timeLabel || 'Quick preview');
      previewDesc.textContent = item.description || 'Free preview content.';
      previewBody.textContent = item.previewContent || '';
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

    if (items[0] && items[0].id) {
      showItem(items[0].id);
    }
  }

  function renderClassicMovies() {
    var movies = window.MOBIOPLUS_CLASSIC_MOVIES || [];
    var grid = document.getElementById('classic-movie-grid');
    if (!grid) {
      return;
    }

    var previewTitle = document.getElementById('movie-preview-title');
    var previewMeta = document.getElementById('movie-preview-meta');
    var frameWrap = document.getElementById('movie-preview-frame-wrap');
    var previewDescription = document.getElementById('movie-preview-description');
    var previewSource = document.getElementById('movie-preview-source');
    var previewRights = document.getElementById('movie-preview-rights');
    var previewStatus = document.getElementById('movie-preview-status');
    var sourceLink = document.getElementById('movie-preview-source-link');

    function setDefaultPanel(message) {
      if (previewTitle) previewTitle.textContent = 'Select a classic film';
      if (previewMeta) previewMeta.textContent = 'Free classic movie preview';
      if (frameWrap) frameWrap.innerHTML = '<p class="rights-line">' + message + '</p>';
      if (previewDescription) previewDescription.textContent = '';
      if (previewSource) previewSource.textContent = '';
      if (previewRights) previewRights.textContent = '';
      if (previewStatus) previewStatus.textContent = 'Status: Rights review pending before final commercial use.';
      if (sourceLink) {
        sourceLink.href = '#free-classic-movies';
        sourceLink.textContent = 'View Source Page';
      }
    }

    if (!movies.length) {
      setDefaultPanel('Classic movie data is currently unavailable. Please use source links when available.');
      return;
    }

    var approvedEmbedHosts = {
      'archive.org': true,
      'www.archive.org': true
    };

    function isSafeEmbedUrl(url) {
      try {
        var parsed = new URL(url);
        return !!approvedEmbedHosts[parsed.hostname];
      } catch (e) {
        return false;
      }
    }

    var map = {};
    var html = movies.map(function (movie) {
      if (!movie || !movie.id) {
        return '';
      }
      map[movie.id] = movie;
      var title = movie.title || 'Classic movie';
      var year = movie.year || 'Year unknown';
      var genre = movie.genre || 'Genre not specified';
      var runtime = movie.runtime || 'Runtime unknown';
      var description = movie.description || 'Classic movie preview details unavailable.';
      var sourceName = movie.sourceName || 'Archive source';
      var rightsLabel = movie.licenseLabel || 'Rights review required';
      var cta = (movie.watchMode === 'embed' && movie.embedAllowed) ? 'Watch Free' : 'View Classic';

      return (
        '<article class="content-card movie-card">' +
          '<span class="badge badge-free">Free</span>' +
          '<h3>' + title + '</h3>' +
          '<p class="meta">' + year + ' - ' + genre + ' - ' + runtime + '</p>' +
          '<p>' + description + '</p>' +
          '<p class="rights-line">Source: ' + sourceName + '. Rights: ' + rightsLabel + '.</p>' +
          '<p class="rights-pending">Rights review pending before final commercial use.</p>' +
          '<button type="button" class="text-cta movie-trigger" data-movie-id="' + movie.id + '">' + cta + '</button>' +
        '</article>'
      );
    }).join('');

    grid.innerHTML = html;

    function showMovie(movieId) {
      var movie = map[movieId];
      if (!movie) {
        setDefaultPanel('Classic movie details unavailable for this selection.');
        return;
      }

      var title = movie.title || 'Classic movie';
      var year = movie.year || 'Year unknown';
      var genre = movie.genre || 'Genre not specified';
      var runtime = movie.runtime || 'Runtime unknown';
      var description = movie.description || 'Classic movie preview details unavailable.';
      var sourceName = movie.sourceName || 'Archive source';
      var sourcePageUrl = movie.sourcePageUrl || '#free-classic-movies';
      var rightsStatus = movie.rightsStatus || 'Rights status pending verification';
      var licenseLabel = movie.licenseLabel || 'Rights review required';

      if (previewTitle) previewTitle.textContent = title;
      if (previewMeta) previewMeta.textContent = year + ' - ' + genre + ' - ' + runtime;
      if (previewDescription) previewDescription.textContent = description;
      if (previewSource) previewSource.textContent = 'Source: ' + sourceName;
      if (previewRights) previewRights.textContent = 'Rights: ' + licenseLabel + '. ' + rightsStatus;
      if (previewStatus) previewStatus.textContent = 'Status: Rights review pending before final commercial use.';
      if (sourceLink) {
        sourceLink.href = sourcePageUrl;
        sourceLink.textContent = 'View source page';
      }

      var shouldEmbed = movie.watchMode === 'embed' && movie.embedAllowed === true && !!movie.embedUrl && isSafeEmbedUrl(movie.embedUrl);
      if (shouldEmbed) {
        frameWrap.innerHTML = '<iframe class="movie-embed" src="' + movie.embedUrl + '" title="' + title + ' classic movie preview" loading="lazy" allowfullscreen></iframe>';
      } else {
        frameWrap.innerHTML = '<p class="rights-line">Embedded preview unavailable for this item. Use the source page link below.</p>';
      }

      var section = document.getElementById('free-classic-movies');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    grid.addEventListener('click', function (event) {
      var btn = event.target.closest('.movie-trigger');
      if (!btn) {
        return;
      }
      showMovie(btn.getAttribute('data-movie-id'));
    });

    var first = movies.find(function (movie) { return movie && movie.id; });
    if (first) {
      showMovie(first.id);
    } else {
      setDefaultPanel('Classic movie data is currently unavailable. Please use source links when available.');
    }
  }

  renderFreeContent();
  renderClassicMovies();
})();
