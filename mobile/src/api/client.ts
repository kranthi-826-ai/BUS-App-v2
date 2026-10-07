const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

export type LoginResult = { accessToken: string; userId: string; role: 'STUDENT'|'DRIVER'|'ADMIN'; displayName: string };

export async function login(email: string, password: string): Promise<LoginResult> {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email,password}) });
  if (!response.ok) throw new Error('Invalid credentials or backend unavailable');
  return response.json() as Promise<LoginResult>;
}

export async function getUniversities(token: string): Promise<Array<{id:string;name:string;code:string}>> {
  const response = await fetch(`${API_URL}/api/v1/universities`, {headers:{Authorization:`Bearer ${token}`}});
  if (!response.ok) throw new Error('Unable to load universities');
  return response.json() as Promise<Array<{id:string;name:string;code:string}>>;
}
