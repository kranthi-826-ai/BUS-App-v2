# Two-Android-phone release test plan

Use one physical Android phone as Driver and one as Student. Record device model, Android version, app build URL/version, backend commit, network, and start/end battery percentage.

## Preconditions

1. College-approved Route 8 stops are imported and the student's selected stop is visible.
2. Backend health is UP and both phones use the same reachable HTTPS API URL.
3. Driver and student test accounts can sign in.
4. Both phones allow notifications; the driver phone allows precise foreground and background location.
5. Disable battery optimization only when prompted by the test instructions and record both optimized and unrestricted results.

## Test cases

### T1 - Driver foreground GPS

1. Sign in on the driver phone and start Route 8.
2. Keep the app open and travel or walk at least 100 metres.
3. Export the debug log.

Expected: a point is sampled about every 10 seconds or 20 metres, accepted by the backend, ordered by timestamp, and shown on the student phone within 20 seconds.

### T2 - Background GPS

1. With the trip active, press Home and keep the screen locked for 10 minutes.
2. Reopen the app and export the debug log.

Expected: Android shows the foreground-service notification, queued points continue, and upload resumes after temporary network loss. No tracking continues after End Trip.

### T3 - ETA accuracy

1. Record actual arrival time at the selected stop.
2. Record displayed ETA at 10, 5, and 2 minutes before arrival.
3. Compute absolute error for each observation.

Expected: no ETA is shown for stale GPS; target median absolute error is at most 2 minutes during normal traffic. This target is a release gate, not a guaranteed claim.

### T4 - Alarm threshold

1. Select a verified stop and 10-minute lead time.
2. Start a new trip and approach the stop.

Expected: exactly one alarm is created for the student/stop/trip when ETA first becomes eligible; no duplicates appear after refresh/retry.

### T5 - Push notification

1. Put the student app in the background.
2. Trigger T4.

Expected: audible Expo push notification appears with the bus-approaching message; tapping it opens the app. Denied permission produces a clear recovery message.

### T6 - Offline queue

1. Disable driver mobile data for 3 minutes during an active trip.
2. Re-enable it and export the log.

Expected: points are kept locally, uploaded in order, and removed only after successful acknowledgement.

### T7 - Battery

1. Run a 60-minute trip with background tracking.
2. Record battery before/after, Android battery mode, GPS count, and upload count.

Expected: no thermal warning or crash. Record actual percentage drain; the college decides the acceptable threshold after testing.

## Results

| ID | Device/build | Expected result met? | Actual evidence/log | Defect |
|---|---|---:|---|---|
| T1 | | | | |
| T2 | | | | |
| T3 | | | | |
| T4 | | | | |
| T5 | | | | |
| T6 | | | | |
| T7 | | | | |
