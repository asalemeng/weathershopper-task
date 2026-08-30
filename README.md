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

- pages/ :page objects, one class per page, controlled out by the PageObjectManager
- tests/ui/: the Playwright tests
- tests/unit/ : unit tests for the pure logic (price parsing, cheapest-product
  selection, temperature rule)
- test-data/ : purchase rules, card data, catalogues for the unit tests
- utils/, models/ :shared helpers and types

## Notes and decisions

- Nothing is hardcoded to a temperature. The test reads the value on screen and
  applies the same rule the app states in its tooltip, so it works on both branches.
- Product selection is a pure function, so the tricky cases (SPF-500 vs SPF-50,
  mixed-case names, price ties) are unit tested without a browser.
- The site is inconsistent about prices ("Price: Rs. 215" vs "Price: 220"), so the
  parser anchors on the "Price" label every card has.
- Card details default to Stripe's 4242 test card; override with CARD_EMAIL,
  CARD_NUMBER, CARD_EXPIRY, CARD_CVC env vars if needed.

## My observations

- The prices formatted not in the same way example Price: 'Rs. 215' on some cards and 'Price:220' on others.

- Add buttons are clickable for seconds before their handler exist
  i fix it by using 'ProductListPage.expectLoaded()' which wait for the load event.

- The cart page tooltip admits "the payment screen will error 5% of the time by design".
  I stress-tested the checkout journey with `--repeat-each=30` and the failure rate matched.
  The failure page heading is "PAYMENT FAILED" (not "payment failure"), so the
  confirmation locator matches both outcomes and the journey test has 2 scoped retries
  to absorb the designed randomness - a real bug would still fail all 3 attempts.

- Right after clicking Add, the cart button still says "Cart - Empty" for a moment
  while the app's JS catches up. Clicking it in that window does nothing and the test
  stays on the product page. `openCart()` now waits until the button stops saying
  "Empty" before clicking.

- In one run out of ~70 the sunscreen page listed no SPF-50 product at all. I could
  not reproduce it, so the "no match" assertion now prints every product name the
  page offered - if it happens again, the failure will explain itself.

- GET /confirmation returns 405: the confirmation page only exists as the response
  to the payment POST, which is why its page object has no open() method.
