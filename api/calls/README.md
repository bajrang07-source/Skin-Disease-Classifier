# Twilio Call Scheduler - Setup Guide

## Overview
This API endpoint allows you to make automated phone calls using Twilio's API.

## Features
- ✅ No Composer required (uses cURL)
- ✅ Automatic voice message delivery
- ✅ E.164 phone number validation
- ✅ CORS enabled for frontend
- ✅ Proper error handling

## Configuration

### 1. Twilio Credentials
Your `.env` file already contains:
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here

```

### 2. Phone Number Format
All phone numbers MUST be in E.164 format:
- ✅ Correct: `+1234567890` (with country code)
- ❌ Wrong: `1234567890` (missing +)
- ❌ Wrong: `(123) 456-7890` (has formatting)

## API Usage

### Endpoint
```
POST http://localhost/skin-health-hub/api/calls/callSchedule.php
```

### Request Body (JSON)
```json
{
  "phone": "+1234567890",
  "message": "Hello! This is your appointment reminder."
}
```

### Response (Success)
```json
{
  "status": "success",
  "message": "Call initiated successfully",
  "call_sid": "CAxxxxxxxxxxxxx",
  "call_status": "queued"
}
```

### Response (Error)
```json
{
  "status": "error",
  "message": "Invalid phone number format. Use E.164 format (e.g., +1234567890)"
}
```

## Testing

### Option 1: Using cURL
```bash
curl -X POST http://localhost/skin-health-hub/api/calls/callSchedule.php \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"+1234567890\",\"message\":\"Test call from Skin Health Hub\"}"
```

### Option 2: Using Postman
1. Method: POST
2. URL: `http://localhost/skin-health-hub/api/calls/callSchedule.php`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "phone": "+YOUR_PHONE_NUMBER",
  "message": "This is a test call"
}
```

### Option 3: From Frontend (JavaScript)
```javascript
const response = await fetch('http://localhost/skin-health-hub/api/calls/callSchedule.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    phone: '+1234567890',
    message: 'Your appointment is scheduled for tomorrow'
  })
});

const result = await response.json();
console.log(result);
```

## Integration with Project

### Update API Configuration
Add to `src/config/api.ts`:
```typescript
SCHEDULE_CALL: `${API_BASE_URL}/calls/callSchedule.php`,
```

### Use in Frontend
```typescript
import { API_ENDPOINTS } from "@/config/api";

const scheduleCall = async (phone: string, message: string) => {
  try {
    const response = await fetch(API_ENDPOINTS.SCHEDULE_CALL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, message })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Call scheduled!', data);
    } else {
      console.error('Failed:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Troubleshooting

### Error: "Twilio credentials not configured"
- Check if `.env` file exists in `api/calls/` folder
- Verify credentials are correct

### Error: "Invalid phone number format"
- Ensure phone number starts with `+`
- Include country code (e.g., +1 for USA)
- Remove any spaces, dashes, or parentheses

### Error: "cURL error"
- Check internet connection
- Verify cURL is enabled in PHP (`php.ini`)

### Twilio Trial Account Limitations
- Can only call verified phone numbers
- Need to verify numbers in Twilio console first
- Upgrade to paid account for unrestricted calling

## Important Notes

1. **Trial Account**: Your Twilio account appears to be a trial account. You can only call numbers you've verified in the Twilio console.

2. **Costs**: Each call costs money (check Twilio pricing). Monitor usage to avoid unexpected charges.

3. **Rate Limits**: Twilio has rate limits. Don't make too many calls too quickly.

4. **Voice**: Currently uses 'alice' voice. You can change this in the code to other Twilio voices (man, woman, alice, etc.)

## Next Steps

1. Test the endpoint with your verified phone number
2. Integrate into frontend UI
3. Add call scheduling to appointment booking flow
4. Consider adding call history tracking in database
