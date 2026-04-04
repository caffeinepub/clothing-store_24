# DS Trending Store — Checkout with Auth, Address & Payment

## Current State
- Store has Home, Shop, Cart, About, Success pages
- Cart page has Stripe-only checkout button (no auth gate)
- No delivery address collection
- No UPI or Cash on Delivery option
- Internet Identity is set up in useInternetIdentity.ts but not enforced at checkout
- Backend stores OrderRecord with items, user, totalAmount, status, timestamp

## Requested Changes (Diff)

### Add
- Auth gate: if user is not logged in and clicks Buy/Checkout, show Sign In / Sign Up modal with Internet Identity
- New `/checkout` page with:
  - Delivery address form (full name, phone, address line 1, address line 2, city, state, pincode)
  - Payment method selection: UPI (show QR / UPI ID 9928988190@axl) or Cash on Delivery
  - Order summary showing cart items and total
  - Place Order button that creates order in backend
- Backend: extend OrderRecord to store deliveryAddress (text fields) and paymentMethod (#upi or #cod)
- New query hook: useCreateOrderWithDetails (passes address + payment method)
- Success page updated to confirm order with payment method info

### Modify
- CartPage: replace Stripe checkout button with "Proceed to Checkout" button that:
  1. Checks if user is authenticated (via useInternetIdentity)
  2. If not logged in → shows login modal
  3. If logged in → navigates to /checkout
- routeTree.ts: add /checkout route
- Backend OrderRecord type: add deliveryAddress and paymentMethod fields
- createOrder backend function: accept address and payment method params

### Remove
- Stripe checkout from CartPage (replace with custom checkout flow)
- useCreateCheckoutSession hook usage from CartPage (Stripe still available for admin but not shown to customers)

## Implementation Plan
1. Update backend main.mo: extend OrderRecord with deliveryAddress and paymentMethod, update createOrder signature
2. Re-generate frontend bindings
3. Create CheckoutPage.tsx with address form + UPI/COD payment selection
4. Update CartPage.tsx to check auth before proceeding, replace checkout button
5. Add /checkout to routeTree.ts
6. Update useQueries.ts with new createOrder hook
7. Update SuccessPage.tsx to show payment method confirmation
8. Add login modal/prompt component
