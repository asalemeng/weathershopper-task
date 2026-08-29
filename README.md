# Weather Shopper – Playwright/TypeScript tests

Automated tests for the [Weather Shopper](https://weathershopper.pythonanywhere.com/)
demo shop, written with Playwright and TypeScript.

## What it covers

- Reads the temperature on the home page and follows the app's rule:
  moisturizers below 19°C, sunscreens above 34°C
- Buys the cheapest aloe + almond moisturizers, or the cheapest
  SPF-50 + SPF-30 sunscreens
- Checks the cart holds exactly those products and that the total adds up
- Pays with the Stripe test card and verifies "Payment Success"

## Getting started

```bash
npm ci
npx playwright install --with-deps
npm test
```

Useful scripts:

- `npm run test:ui` – e2e tests only (Chromium)
- `npm run test:unit` – unit tests for the parsing/selection logic
- `npm run test:smoke` – just the main checkout journey
- `npm run report` – open the HTML report

## Structure

- `pages/` – page objects, one class per page, handed out by the PageObjectManager
- `tests/ui/` – the Playwright tests
- `tests/unit/` – unit tests for the pure logic (price parsing, cheapest-product
  selection, temperature rule)
- `test-data/` – purchase rules, card data, catalogues for the unit tests
- `utils/`, `models/` – shared helpers and types

## Notes and decisions

- Nothing is hard-coded to a temperature. The test reads the value on screen and
  applies the same rule the app states in its tooltip, so it works on both branches.
- Product selection is a pure function, so the tricky cases (SPF-500 vs SPF-50,
  mixed-case names, price ties) are unit tested without a browser.
- The site is inconsistent about prices ("Price: Rs. 215" vs "Price: 220"), so the
  parser anchors on the "Price" label every card has.
- Card details default to Stripe's 4242 test card; override with CARD_EMAIL,
  CARD_NUMBER, CARD_EXPIRY, CARD_CVC env vars if needed.
