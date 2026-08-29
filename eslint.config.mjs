import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['node_modules/', 'playwright-report/', 'test-results/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['tests/**/*.spec.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,

      /* Guard-rails that keep the suite honest. */
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-force-option': 'error',
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/no-skipped-test': 'warn',
      'playwright/no-conditional-in-test': 'warn',
      'playwright/expect-expect': [
        'error',
        // Assertions also live in page objects, so the rule is told which of
        // their methods count. Exact names only - the plugin does not glob.
        {
          assertFunctionNames: [
            'expectLoaded',
            'assertContainsExactly',
            'assertTotalEqualsSumOf',
            'assertPaymentSuccess',
          ],
        },
      ],
    },
  },
  prettier,
);
