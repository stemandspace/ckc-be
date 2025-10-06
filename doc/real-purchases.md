# Real Purchase Functionality Documentation

## Overview

The real purchase functionality in the application provides a complete payment processing system using Razorpay integration with comprehensive webhook handling for purchase validation and user account management.

## System Architecture

### Purchase Flow Overview

```
User -> Frontend -> Initiate Purchase -> Razorpay Payment -> Webhook Processing -> User Account Update
```

### Key Components

1. **Purchase Initiation**: `/real-purchases/initiate`
2. **Webhook Processing**: `/real-purchases/webhook`
3. **Service Layer**: Real purchase service methods
4. **Payment Integration**: Razorpay live/development keys

## API Endpoints

### 1. Purchase Initiation

**Endpoint**: `POST /real-purchases/initiate`

**Controller**: `src/api/real-purchase/controllers/custom-real-purchase.js`

**Process Flow**:

1. **Data Validation**: Validates required fields (type, amount, user_id, currency)
2. **User Verification**: Checks if user exists in database
3. **Testing Override**: For `@spacetopia.in` email users, sets amount to ₹1
4. **Purchase Record**: Creates pending purchase with unique ID `rt_${timestamp}_${random}`
5. **Razorpay Order**: Creates order with amount in paise (×100)

**Request Body**:

```json
{
  "data": {
    "type": "premium|credits|diamonds",
    "amount": "number",
    "user_id": "string",
    "currency": "string",
    "plan_id": "string" // optional
  }
}
```

**Response**:

```json
{
  "order_id": "razorpay_order_id",
  "amount": "amount_in_paise",
  "currency": "INR",
  "receipt": "receipt_id"
}
```

### 2. Webhook Processing

**Endpoint**: `POST /real-purchases/webhook`

**Trigger**: When Razorpay confirms payment capture

**Validation Steps**:

1. **Event Type**: Must be `payment.captured`
2. **Payment Status**: Must be `captured`
3. **Description**: Must contain `students.spacetopia`

**Processing Logic**:

1. **Extract Purchase Data**: From Razorpay payment notes
2. **Update Purchase Record**: Set status to `COMPLETED`
3. **User Account Updates**: Based on purchase type

**Purchase Type Handling**:

#### Premium Purchases

- Updates user premium status to 1 year from current date
- Sets user type from plan metadata
- Adds plan credits to user account

#### Credits Purchases

- Extracts credits from topup configuration
- Adds credits to user balance

## Database Schema

**Real Purchase Model** (`src/api/real-purchase/content-types/real-purchase/schema.json`):

```json
{
  "kind": "collectionType",
  "collectionName": "real_purchases",
  "attributes": {
    "user_id": "string",
    "purchase_id": "string",
    "amount": "decimal",
    "currency": "string",
    "status": "enumeration[paid|pending|unpaid|failed]",
    "label": "string",
    "type": "enumeration[credits|diamonds|premium]",
    "metadata": "json"
  }
}
```

## Service Layer

**Real Purchase Service** (`src/api/real-purchases/services/real-purchase.js`):

### Key Methods

#### `isPremiumValid(userId)`

Checks if user's premium subscription is still active

- Returns: `boolean`

#### `addCreditsToUser(userId, creditsToAdd)`

Safely adds credits to user account

- Returns: `{success: boolean, previousCredits: number, newCredits: number}`

#### `updateUserPremium(userId, durationMs, planId)`

Updates user premium status with plan type from metadata

- Returns: `boolean`

#### `getPlanCredits(planId)`

Retrieves credits from plan metadata

- Returns: `number`

#### `getTopupCredits(topupId)`

Retrieves credits from topup configuration

- Returns: `number`

## Payment Integration

**Razorpay Configuration** (`src/rz/index.js`):

```javascript
const razorpay = new Razorpay({
  key_id: "rzp_live_Xq9xzkZT8W5Jr3", // Live key
  key_secret: "ks2EMhvzRfAjZcG8pEgNsDzG",
});
```

## Security Features

1. **Webhook Validation**: Multiple security checkpoints

   - Payment origin verification
   - Event type validation
   - Status confirmation

2. **Transaction Safety**: Database transactions with rollback capability

3. **Account Verification**: Validates payment descriptions and metadata

4. **Type Safety**: Separate handling for different purchase types

## Testing Features

- **Special Pricing**: Users with `@spacetopia.in` email get ₹1 pricing
- **Comprehensive Logging**: Full audit trail of all transactions

## Error Handling

- **Validation Errors**: Proper field validation with descriptive messages
- **Transaction Rollbacks**: Automatic rollback on webhook processing errors
- **User Not Found**: Handles missing users gracefully
- **Logging**: Comprehensive error logging for debugging

## Related Controllers

The system also includes alternative purchase flows:

1. **Virtual Purchases** (`src/api/purchase/controllers/purchase.js`): Uses existing user credits
2. **Credit Purchases** (`src/api/credit/controllers/credit.js`): Direct credit addition
3. **User Add-ons** (`src/api/v1/controllers/user.js`): Manual addon processing

## Flow Example

### Premium Purchase Flow

1. User initiates ₹999 premium purchase
2. System creates pending record with `purchase_id: rt_1234567890_abc123`
3. Razorpay order created for ₹99,900 paise
4. User completes payment on Razorpay
5. Webhook receives `payment.captured` event
6. System validates payment authenticity
7. Updates purchase status to `COMPLETED`
8. Sets user premium for 1 year
9. Adds plan credits to user account
10. Returns success response

## Configuration

### Environment Setup

- Razorpay live credentials are hardcoded (consider environment variables for production)
- Special testing user domain: `@spacetopia.in`

### Required Models

- Users (with credits and premium fields)
- Plans (with metadata for credits and type)
- Top-ups (with credits configuration)
- Real Purchases (main tracking table)
