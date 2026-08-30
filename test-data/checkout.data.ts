export const CHECKOUT_DATA = {
  card: {
    email: process.env['CARD_EMAIL'] ?? 'a.salem.iskander@gmail.com',
    number: process.env['CARD_NUMBER'] ?? '4242 4242 4242 4242',
    expiry: process.env['CARD_EXPIRY'] ?? '12/30',
    cvc: process.env['CARD_CVC'] ?? '123',
  },
} as const;

export type CardDetails = typeof CHECKOUT_DATA.card;
