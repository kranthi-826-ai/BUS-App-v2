# Human-provided inputs

- Verify Route 8 stop names and coordinates with the college.
- Replace `backend/seed/stops.route8.json` with college-verified data, set status to `VERIFIED_BY_COLLEGE`, then enable `ROUTE8_IMPORT_ENABLED=true`.
- Obtain an authorized tracking API URL/token/device ID if an existing bus tracker is used.
- Confirm the authorized provider response-field mapping before enabling `TRACKER_ENABLED=true`; the current adapter expects `latitude`, `longitude`, `timestamp`, `speed`, and `heading`.
- Choose Google Maps with an Android release key or approve an OpenStreetMap tile provider; the current student card safely presents live coordinates without exposing a map key.
- Provide Expo/EAS account only when building a distributable APK.
- Obtain college permission and driver consent for GPS tracking during active trips.
- Sign in to an Expo/EAS account and set EXPO_PUBLIC_EAS_PROJECT_ID before the configured internal APK build can register a real Expo token or produce a downloadable APK.

## Release checklist requiring a person

- Supply college-verified Route 8 stop names, ordered sequence, latitude, and longitude.
- Supply authorized tracker credentials and written permission to use the provider API, or keep `TRACKER_ENABLED=false`.
- Set `EXPO_TOKEN` and `EXPO_PUBLIC_EAS_PROJECT_ID`, then authorize the EAS Android build.
- Complete every row in `TEST_PLAN.md` using two physical Android phones.
- Obtain college approval for the deployment, privacy notice, data retention, and student access policy.
- Obtain each participating driver's voluntary consent before enabling background location.

## Short driver consent text

I consent to the Smart College Bus Alarm application collecting and transmitting the bus phone's location only while I intentionally run an active college bus trip. I understand that tracking must stop when the trip ends, that the data is used to show students bus arrival information, and that I may withdraw consent by notifying the college transport administrator.

Driver name/signature: ____________________  Date: __________

## Short college approval text

The college approves a limited pilot of Smart College Bus Alarm for the verified routes and authorized users listed by the transport department. The college confirms that route data and tracker access are authorized, drivers have consented, students receive a privacy notice, access is controlled, and retention/deletion responsibilities are assigned before production use.

Authorized name/signature: ____________________  Role: __________  Date: __________
