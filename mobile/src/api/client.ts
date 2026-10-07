import { saveAccessToken } from './secure';
const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

export type LoginResult = { accessToken: string; userId: string; role: 'STUDENT'|'DRIVER'|'ADMIN'; displayName: string };

export async function login(email: string, password: string): Promise<LoginResult> {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email,password}) });
  if (!response.ok) throw new Error('Invalid credentials or backend unavailable');
  const result = await response.json() as LoginResult;
  await saveAccessToken(result.accessToken);
  return result;
}

export async function getUniversities(token: string): Promise<Array<{id:string;name:string;code:string}>> {
  const response = await fetch(`${API_URL}/api/v1/universities`, {headers:{Authorization:`Bearer ${token}`}});
  if (!response.ok) throw new Error('Unable to load universities');
  return response.json() as Promise<Array<{id:string;name:string;code:string}>>;
}
export async function getRoutes(token:string, universityId:string) {
  const response=await fetch(`${API_URL}/api/v1/universities/${universityId}/routes`,{headers:{Authorization:`Bearer ${token}`}});
  if(!response.ok) throw new Error('Unable to load routes'); return response.json() as Promise<Array<{id:string;name:string;code:string}>>;
}
export async function getStops(token:string, routeId:string) {
  const response=await fetch(`${API_URL}/api/v1/routes/${routeId}/stops`,{headers:{Authorization:`Bearer ${token}`}});
  if(!response.ok) throw new Error('Unable to load stops'); return response.json() as Promise<Array<{id:string;name:string;sequence:number;plannedArrival:string|null}>>;
}
export async function startTrip(token:string, routeId:string, driverId:string, busId:string) {
  const response=await fetch(API_URL + '/api/v1/trips/start',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer ' + token},body:JSON.stringify({busId,routeId,startedBy:driverId})});
  if(!response.ok) throw new Error('Unable to start trip'); const result=await response.json() as {id:string}; return {tripId:result.id};
}
export async function endTrip(token:string, tripId:string) { await fetch(`${API_URL}/api/v1/trips/${tripId}/end`,{method:'POST',headers:{Authorization:`Bearer ${token}`}}); }
export async function getLatestLocation(token:string, tripId:string) {
  const response=await fetch(API_URL + '/api/v1/trips/' + tripId + '/locations/latest',{headers:{Authorization:'Bearer ' + token}});
  if(!response.ok) throw new Error('Unable to load live location');
  return response.json() as Promise<{tripId:string;latitude?:number;longitude?:number;stale:boolean}>;
}
export async function saveSubscription(token:string, studentId:string, stopId:string, leadMinutes:number) {
  const response=await fetch(API_URL + '/api/v1/subscription',{method:'PUT',headers:{'Content-Type':'application/json',Authorization:'Bearer ' + token},body:JSON.stringify({studentId,stopId,leadMinutes})});
  if(!response.ok) throw new Error('Unable to save alarm');
  return response.json();
}
export async function getNotifications(token:string, studentId:string) {
  const response=await fetch(API_URL + '/api/v1/notifications?studentId=' + encodeURIComponent(studentId),{headers:{Authorization:'Bearer ' + token}});
  if(!response.ok) throw new Error('Unable to load notifications');
  return response.json() as Promise<Array<{id:string;message:string;read:boolean;createdAt:string}>>;
}
export async function registerPushToken(token:string, expoPushToken:string) {
  const response=await fetch(API_URL + '/api/v1/device-push-tokens',{method:'PUT',headers:{'Content-Type':'application/json',Authorization:'Bearer ' + token},body:JSON.stringify({expoPushToken,platform:'android'})});
  if(!response.ok) throw new Error('Unable to register device notifications');
}
