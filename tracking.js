/**
 * Tracking Persistence Script
 * Captures all query parameters from the landing URL and persists them
 * to all subscription CTA links via sessionStorage.
 */
(function() {
    function initTracking() {
        // 1. Capture and Store
        const currentQuery = window.location.search;
        if (currentQuery) {
            const urlParams = new URLSearchParams(currentQuery);
            let storedParamsString = sessionStorage.getItem('landing_params');
            let combinedParams = new URLSearchParams(storedParamsString || "");

            // Merge current URL params into stored params
            urlParams.forEach((value, key) => {
                combinedParams.set(key, value);
            });

            sessionStorage.setItem('landing_params', combinedParams.toString());
        }

        const finalParamsString = sessionStorage.getItem('landing_params');
        const finalParams = new URLSearchParams(finalParamsString || "");

        // 2. Function to update links
        function updateLinks() {
            // Selectors for "join/subscribe" buttons and billing links
            const selectors = [
                'a[href*="t2.mobioplus.link"]',
                '.cta-subscribe',
                '[data-subscribe]',
                '.main-cta',
                '.secondary-cta'
            ];

            const links = document.querySelectorAll(selectors.join(','));

            links.forEach(link => {
                try {
                    // Skip if not a valid link
                    if (!link.href || link.href.indexOf('javascript:') === 0 || link.href.indexOf('#') === 0) return;

                    const url = new URL(link.href, window.location.origin);

                    // Apply all stored parameters
                    finalParams.forEach((value, key) => {
                        url.searchParams.set(key, value);
                    });

                    // Maintain position tracking from original implementation
                    if (link.classList.contains('main-cta')) {
                        url.searchParams.set('pos', 'hero');
                    } else if (link.classList.contains('secondary-cta')) {
                        url.searchParams.set('pos', 'footer');
                    }

                    link.href = url.toString();
                } catch (e) {
                    // Silently fail for malformed URLs
                }
            });
        }

        // Run immediately
        updateLinks();

        // Also run when the DOM is fully loaded to catch any other elements
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', updateLinks);
        } else {
            updateLinks();
        }

        // Mutation observer to handle dynamically added content
        try {
            const observer = new MutationObserver(updateLinks);
            observer.observe(document.body, { childList: true, subtree: true });
        } catch (e) {
            // MutationObserver not supported or failed
        }
    }

    // Initialize
    initTracking();
})();
