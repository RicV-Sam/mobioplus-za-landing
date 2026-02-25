# MobioPlus ZA Landing Site

This is the Google Ads "acquisition landing page" for the MobioPlus ZA acquisition, optimized for mobile.

## Project Structure

- `index.html`: The main acquisition landing page.
- `terms.html`: Terms and Conditions.
- `privacy.html`: Privacy Policy.
- `contact.html`: Contact Us.
- `unsubscribe.html`: Unsubscribe instructions.
- `style.css`: Main stylesheet (mobile-first, dark/purple theme).
- `.nojekyll`: Bypasses Jekyll processing on GitHub Pages.

## Deployment Instructions

To deploy this site using GitHub Pages:

1. Go to the repository settings on GitHub.
2. Click on **Pages** in the left sidebar.
3. Under **Build and deployment**, ensure **Source** is set to "Deploy from a branch".
4. Under **Branch**, select `main` and the `/ (root)` folder.
5. Click **Save**.

The site will be available at `https://<your-username>.github.io/mobioplus-za-landing/`.

## Key Information

- **Billing Flow URL**: All CTA buttons redirect to the Vodacom billing flow.
- **Tracking Parameters**: The site automatically captures `gclid` and `gbraid` from the URL and appends them to the billing flow links.
- **Support Email**: Currently set to `support@mobioplus.online` (placeholder).
- **Compliance**: Contains all required Vodacom South Africa compliance text.

## Maintenance

To update the support email, search and replace `support@mobioplus.online` in all HTML files.
