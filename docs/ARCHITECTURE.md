# Architecture

The backend is the only trusted application boundary. Phones and future provider APIs submit location data to Spring Boot; no client connects to MySQL. The backend validates timestamps, coordinates, bus/trip ownership, duplicate points, and stale state before ETA or alerts are evaluated.

The mobile app has two runtime roles: STUDENT and DRIVER. A driver phone is the prototype tracker. A future authorized provider adapter produces the same normalized location event. The alert engine inserts a unique notification record before sending a push, guaranteeing one alert per student, stop, trip, and alert type.
