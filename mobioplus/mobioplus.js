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
})();
