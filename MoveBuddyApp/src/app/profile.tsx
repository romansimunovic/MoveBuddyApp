import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { session, StoredUser } from '../services/api';

export default function ProfileScreen() {
  const router = useRouter();
  const [user,setUser]=useState<StoredUser|null>(null);
  useEffect(()=>{session.user().then(setUser)},[]);
  const logout=()=>Alert.alert('Odjava','Jeste li sigurni da se želite odjaviti?',[{text:'Odustani',style:'cancel'},{text:'Odjavi me',style:'destructive',onPress:async()=>{await session.clear();router.replace('/')}}]);
  const initial=user?.name?.charAt(0).toUpperCase()||'M';
  return <SafeAreaView style={styles.container}><View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Ionicons name="close" size={28} color="#12372A"/></TouchableOpacity></View><View style={styles.user}><View style={styles.avatar}><Text style={styles.avatarText}>{initial}</Text></View><Text style={styles.name}>{user?.name||'MoveBuddy korisnik'}</Text><Text style={styles.email}>{user?.email||'Tvoj račun'}</Text></View><View style={styles.menu}><View style={styles.item}><Ionicons name="shield-checkmark-outline" size={23} color="#1E7A5A"/><Text style={styles.itemText}>Tvoja sesija je sigurno spremljena</Text></View><TouchableOpacity style={styles.item} onPress={logout}><Ionicons name="log-out-outline" size={23} color="#D44D4D"/><Text style={[styles.itemText,{color:'#D44D4D'}]}>Odjavi se</Text></TouchableOpacity></View></SafeAreaView>;
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:'#F1F7F4'},header:{padding:22,alignItems:'flex-end'},user:{alignItems:'center',paddingTop:18,paddingBottom:38},avatar:{width:82,height:82,borderRadius:27,alignItems:'center',justifyContent:'center',backgroundColor:'#1E7A5A'},avatarText:{color:'#FFF',fontSize:34,fontWeight:'900'},name:{fontSize:23,fontWeight:'900',color:'#12372A',marginTop:15},email:{color:'#698278',marginTop:5},menu:{marginHorizontal:22,backgroundColor:'#FFF',borderRadius:19,paddingHorizontal:16},item:{paddingVertical:18,flexDirection:'row',alignItems:'center',gap:14,borderBottomColor:'#EAF1ED',borderBottomWidth:1},itemText:{fontSize:14,fontWeight:'700',color:'#46665A',flex:1}});
