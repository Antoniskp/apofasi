# Voting Security Guide

## Overview

This document explains how the Apofasi voting system prevents users from voting multiple times and ensures the integrity of polls.

## Voting Methods

### 1. Registered User Voting (Most Secure)

**When to use**: For important decisions, elections, or polls requiring accountability.

**How it works**:
- Users must be logged in to vote
- Each vote is tied to the user's account (by user ID)
- **One vote per account** - strictly enforced

**Security guarantees**:
- ✅ Users **CANNOT** vote multiple times by:
  - Switching devices (desktop → mobile → tablet)
  - Switching browsers (Chrome → Firefox → Safari)
  - Changing networks (home → office → mobile data)
  - Changing IP addresses (VPN, proxy, different location)
  - Clearing cookies or browser data
- ✅ Vote is permanently tied to the user account
- ✅ Poll creators and admins can see who voted for what (for audit purposes)
- ✅ Users can change their vote, but cannot vote multiple times

**What users can do**:
- Vote once per poll
- Change their vote anytime
- Cancel their vote
- Vote from any device (same account)

**Transparency**:
- Poll statistics show which users voted for which options
- Available to poll creator and administrators
- Gender-based statistics available

---

### 2. Anonymous Voting (Enhanced Security)

**When to use**: For sensitive topics where voter privacy is important.

**How it works**:
- No login required
- Votes tracked by **BOTH** session ID **AND** IP address
- **Dual-factor tracking** for enhanced security

**Security guarantees**:
- ✅ Users **CANNOT** vote multiple times by:
  - Just clearing cookies/session (session ID changes, but IP stays the same)
  - Just changing IP address (IP changes, but session stays the same)
  - Just switching browsers (creates new session, but IP is the same)
  - Just using incognito mode (new session, but IP is the same)
- ✅ Users **CAN** change their vote from the same device and network
- ✅ User agent (browser info) tracked for audit purposes

**How to vote multiple times (intentionally difficult)**:
To vote again, a user would need to do **ALL** of the following:
1. Clear browser cookies/session data
2. **AND** change their IP address (VPN, different network, etc.)

This dual-factor requirement significantly raises the bar for vote manipulation.

**What users can do**:
- Vote once per session+IP combination
- Change their vote from the same device/network
- Cancel their vote

**Privacy**:
- No personal information stored
- Only session ID, IP address, and user agent tracked
- Cannot be traced back to individuals

---

## Security Comparison

| Feature | Registered Voting | Anonymous Voting |
|---------|------------------|------------------|
| Login required | ✅ Yes | ❌ No |
| Privacy | Lower (votes tied to account) | Higher (no personal data) |
| Security level | **Highest** | **High** |
| Prevents multiple votes | ✅ Perfect (by account) | ✅ Very good (by session+IP) |
| Vote transparency | ✅ Full audit trail | ❌ Limited |
| Can vote from any device | ✅ Yes (same account) | ⚠️ No (requires same session+IP) |

---

## Technical Details

### Registered User Voting
```
Vote record: { userId, pollId, optionId, timestamp }
Prevention: Database unique constraint on (userId, pollId)
```

### Anonymous Voting
```
Vote record: { sessionId, ipAddress, pollId, optionId, userAgent, timestamp }
Prevention: Database unique constraint on (sessionId, ipAddress, pollId)
```

### Before vs After Enhancement

**Before** (INSECURE):
```javascript
// Found existing vote if session OR IP matched
vote = findOne({ 
  pollId: X, 
  $or: [
    { sessionId: "abc123" },
    { ipAddress: "192.168.1.1" }
  ]
})
```
→ User could vote again by changing **EITHER** session **OR** IP

**After** (SECURE):
```javascript
// Requires BOTH session AND IP to match
vote = findOne({ 
  pollId: X, 
  sessionId: "abc123",
  ipAddress: "192.168.1.1"
})
```
→ User must change **BOTH** session **AND** IP to vote again

---

## API Response

Every poll includes a `voteSecurity` field explaining the security method:

**For registered voting:**
```json
{
  "voteSecurity": {
    "method": "authenticated",
    "description": "Εγγεγραμμένοι χρήστες μπορούν να ψηφίσουν μία φορά ανά λογαριασμό, ανεξάρτητα από συσκευή ή IP.",
    "canVoteMultipleTimes": false
  }
}
```

**For anonymous voting:**
```json
{
  "voteSecurity": {
    "method": "anonymous",
    "description": "Ανώνυμες ψηφοφορίες απαιτούν session και IP για την αποτροπή πολλαπλών ψήφων από την ίδια συσκευή.",
    "canVoteMultipleTimes": false
  }
}
```

---

## Recommendations

### For Poll Creators

**Use Registered User Voting when**:
- Decision is important or binding
- You need accountability
- You need detailed statistics
- You want to know who voted

**Use Anonymous Voting when**:
- Privacy is important
- Topic is sensitive
- You want to encourage honest responses
- Lower barrier to participation is needed

### For Voters

**Trust the system because**:
- Vote integrity is enforced at the database level
- Multiple technical measures prevent manipulation
- Transparent security information provided
- Open source - code can be audited

---

## Future Enhancements

Possible additional security measures:
- Rate limiting (prevent rapid-fire voting attempts)
- CAPTCHA for anonymous votes
- Email verification for registered users
- SMS/phone verification for critical polls
- Blockchain-based vote recording
- End-to-end encrypted voting

---

## Questions?

For security-related questions or to report vulnerabilities, please see [SECURITY.md](./SECURITY.md).
