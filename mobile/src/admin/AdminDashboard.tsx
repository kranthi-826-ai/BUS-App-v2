import React, {useEffect,useState} from 'react';
import {Text,View} from 'react-native';
import { getAccessToken } from '../api/secure';

const API_URL=(process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080').replace(/\/$/,'');
export function AdminDashboard(){
 const [data,setData]=useState<Record<string,number>|null>(null);
 const [error,setError]=useState<string|null>(null);
 useEffect(()=>{(async()=>{try{const token=await getAccessToken();const response=await fetch(API_URL+'/api/v1/admin/dashboard',{headers:{Authorization:'Bearer '+token}});if(!response.ok) throw new Error('Unable to load admin dashboard');setData(await response.json() as Record<string,number>);}catch(e){setError(e instanceof Error?e.message:'Dashboard unavailable');}})();},[]);
 if(error) return <Text>{error}</Text>;
 if(!data) return <Text>Loading transport operations…</Text>;
 return <View>{Object.entries(data).map(([label,value])=><Text key={label}>{label}: {value}</Text>)}</View>;
}
