import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../features/auth/AuthContext';
import { api } from '../api';
import { getLatestLocation } from '../api/trip';

interface ActiveTrip {
  id: string;
  busId: string;
  routeId: string;
  status: string;
}

interface Enrollment {
  busId: string;
  selectedStopId: string;
  status: string;
}

interface LiveLocation {
  tripId: string;
  busId: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  capturedTime: string;
  stale: boolean;
}

interface RouteStop {
  id: string;
  sequenceNum: number;
  stop: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  };
}

const LOCATION_POLL_INTERVAL_MS = 10_000;
const STALE_AFTER_MS = 45_000;
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const DEFAULT_REGION: Region = {
  latitude: 17.545862,
  longitude: 78.404297,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export const DashboardScreen = () => {
  const { logout } = useAuth();
  const navigation = useNavigation<any>();
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [location, setLocation] = useState<LiveLocation | null>(null);
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  const refreshLiveTrip = useCallback(async () => {
    try {
      const [tripsResponse, enrollmentResponse] = await Promise.all([
        api.get<ActiveTrip[]>('/v1/trips/active'),
        api.get<Enrollment | null>('/transport/enrolments/me').catch((): { data: null } => ({ data: null })),
      ]);
      const enrolledBus = enrollmentResponse.data;
      setEnrollment(enrolledBus);
      const trip = tripsResponse.data.find((item) => item.status === 'ACTIVE'
        && (!enrolledBus || item.busId === enrolledBus.busId)) ?? null;
      setActiveTrip(trip);
      setErrorMessage(null);

      if (!trip) {
        setLocation(null);
        setStops([]);
        return;
      }

      const [latestLocation, routeStops] = await Promise.all([
        getLatestLocation(trip.id).catch((): null => null),
        api.get<RouteStop[]>(`/transport/routes/${trip.routeId}/stops`).then((response) => response.data),
      ]);
      setLocation(latestLocation);
      setStops(routeStops);
    } catch {
      setErrorMessage('Could not refresh bus status. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const refreshOnFocus = navigation.addListener('focus', () => void refreshLiveTrip());
    return refreshOnFocus;
  }, [navigation, refreshLiveTrip]);

  useEffect(() => {
    void refreshLiveTrip();
    const poll = setInterval(() => void refreshLiveTrip(), LOCATION_POLL_INTERVAL_MS);
    const clock = setInterval(() => setNow(Date.now()), 1_000);
    return () => {
      clearInterval(poll);
      clearInterval(clock);
    };
  }, [refreshLiveTrip]);

  const locationIsStale = location
    ? location.stale || now - new Date(location.capturedTime).getTime() > STALE_AFTER_MS
    : true;
  const updatedSecondsAgo = location
    ? Math.max(0, Math.floor((now - new Date(location.capturedTime).getTime()) / 1_000))
    : null;
  const mapRegion = location
    ? { ...DEFAULT_REGION, latitude: location.latitude, longitude: location.longitude }
    : DEFAULT_REGION;

  return (
    <View style={styles.container}>
      {GOOGLE_MAPS_API_KEY ? (
        <MapView
          style={styles.map}
          region={mapRegion}
          showsUserLocation={true}
          provider={PROVIDER_GOOGLE}
          showsCompass
          toolbarEnabled={false}
        >
          {location && !locationIsStale && (
            <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="Live bus location" description={activeTrip ? `Trip ${activeTrip.id}` : 'Active bus'} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.busMarker}><Ionicons name="bus" size={20} color="#fff" /></View>
            </Marker>
          )}
          {stops.map(({ id, sequenceNum, stop }) => (
            <Marker key={id} coordinate={{ latitude: stop.latitude, longitude: stop.longitude }} title={`${sequenceNum}. ${stop.name}`} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.stopMarker}><View style={styles.stopMarkerInner} /></View>
            </Marker>
          ))}
        </MapView>
      ) : (
        <View style={styles.mapUnavailable}>
          <Ionicons name="map-outline" size={48} color="#18864b" />
          <Text style={styles.mapUnavailableTitle}>Map preview unavailable</Text>
          <Text style={styles.mapUnavailableText}>Add EXPO_PUBLIC_GOOGLE_MAPS_API_KEY and rebuild the Android app to enable maps.</Text>
        </View>
      )}

      <View style={styles.topActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AlertSettings')}>
          <Ionicons name="notifications-outline" size={18} color="#142d2b" style={{marginRight: 6}} />
          <Text style={styles.actionText}>Alerts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => void refreshLiveTrip()} accessibilityLabel="Refresh bus location">
          <Ionicons name="refresh-outline" size={18} color="#142d2b" style={{marginRight: 6}} />
          <Text style={styles.actionText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet index={1} snapPoints={['24%', '48%']} style={styles.bottomSheet}>
        <BottomSheetView style={styles.sheetContent}>
          <Text style={styles.eyebrow}>SMART COLLEGE BUS</Text>
          <Text style={styles.sheetTitle}>{activeTrip ? 'Your bus trip' : 'Your bus, at a glance'}</Text>

          {loading ? (
            <View style={styles.inlineStatus}>
              <ActivityIndicator color="#18794e" />
              <Text style={styles.statusText}>Checking live bus status…</Text>
            </View>
          ) : errorMessage ? (
            <View style={styles.statusCard}>
              <Text style={styles.warningTitle}>Connection issue</Text>
              <Text style={styles.statusText}>{errorMessage}</Text>
            </View>
          ) : activeTrip ? (
            <View style={styles.statusCard}>
              <View style={styles.statusHeading}>
                <View style={[styles.statusDot, locationIsStale && styles.staleDot]} />
                <Text style={styles.statusTitle}>{locationIsStale ? 'Location is stale' : 'Bus is live'}</Text>
              </View>
              <Text style={styles.statusText}>
                {updatedSecondsAgo === null
                  ? 'Waiting for the in-charge to publish the first GPS update.'
                  : `Last update ${updatedSecondsAgo < 60 ? `${updatedSecondsAgo}s` : `${Math.floor(updatedSecondsAgo / 60)}m`} ago${locationIsStale ? ' · not current' : ''}`}
              </Text>
              {location?.accuracy != null && <Text style={styles.mutedText}>GPS accuracy ±{Math.round(location.accuracy)} m</Text>}
            </View>
          ) : (
            <View style={styles.statusCard}>
              <Text style={styles.statusTitle}>{enrollment ? 'Bus not on a trip' : 'Choose your bus'}</Text>
              <Text style={styles.statusText}>
                {enrollment
                  ? 'Your selected bus will appear here when the in-charge starts a trip.'
                  : 'Select an available route and boarding stop to join your college bus.'}
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('RouteSelection')}>
            <Text style={styles.primaryButtonText}>Choose or update my route</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={logout}>
            <Text style={styles.secondaryButtonText}>Sign out</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#edf2f3' },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  mapUnavailable: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e7efeb', paddingHorizontal: 36 },
  mapUnavailableTitle: { color: '#18332a', fontSize: 20, fontWeight: '800', marginTop: 14 },
  mapUnavailableText: { color: '#566661', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8 },
  topActions: {
    position: 'absolute',
    top: 54,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  actionText: { color: '#142d2b', fontSize: 15, fontWeight: '700' },
  bottomSheet: { elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.12 },
  sheetContent: { flex: 1, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 28 },
  eyebrow: { color: '#18794e', fontSize: 11, fontWeight: '800', letterSpacing: 1.3 },
  sheetTitle: { color: '#182b2a', fontSize: 23, fontWeight: '800', marginTop: 7, marginBottom: 14 },
  inlineStatus: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48 },
  statusCard: { backgroundColor: '#f2f6f4', borderRadius: 14, padding: 15, marginBottom: 12 },
  statusHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#18864b' },
  staleDot: { backgroundColor: '#bd6b16' },
  statusTitle: { color: '#18332a', fontSize: 16, fontWeight: '700' },
  warningTitle: { color: '#90500b', fontSize: 16, fontWeight: '700', marginBottom: 5 },
  statusText: { color: '#566661', fontSize: 14, lineHeight: 20, marginTop: 5 },
  mutedText: { color: '#75837e', fontSize: 12, marginTop: 7 },
  primaryButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: '#155e4b', borderRadius: 12, marginTop: 2 },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  secondaryButtonText: { color: '#687671', fontSize: 14, fontWeight: '600' },
  busMarker: { backgroundColor: '#18332a', padding: 8, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, borderWidth: 2, borderColor: '#fff' },
  stopMarker: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
  stopMarkerInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#18864b' },
});
