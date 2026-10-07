import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const languages = ['English', 'తెలుగు', 'हिन्दी'];

export default function App() {
  const [language, setLanguage] = useState('English');
  return <GestureHandlerRootView style={styles.root}>
    <StatusBar barStyle="dark-content" />
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <Text style={styles.kicker}>SMART COLLEGE BUS</Text>
        <Text style={styles.title}>Never miss your bus.</Text>
        <Text style={styles.subtitle}>Get a reliable arrival alarm for your boarding stop.</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Choose your language</Text>
          {languages.map(item => <TouchableOpacity key={item} accessibilityRole="button" onPress={() => setLanguage(item)} style={[styles.option, item === language && styles.selected]}><Text style={[styles.optionText, item === language && styles.selectedText]}>{item}</Text><Text style={styles.check}>{item === language ? '✓' : ''}</Text></TouchableOpacity>)}
        </View>
        <TouchableOpacity style={styles.primary} accessibilityRole="button"><Text style={styles.primaryText}>Continue</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  </GestureHandlerRootView>;
}

const styles = StyleSheet.create({root:{flex:1,backgroundColor:'#f5f8f7'},content:{flex:1,padding:24,justifyContent:'center'},kicker:{color:'#00a878',fontSize:12,fontWeight:'800',letterSpacing:2},title:{color:'#0b1714',fontSize:38,fontWeight:'900',marginTop:14,lineHeight:44},subtitle:{color:'#64736e',fontSize:16,lineHeight:24,marginTop:12,marginBottom:32},card:{backgroundColor:'#fff',borderRadius:24,padding:18,shadowColor:'#000',shadowOpacity:.06,shadowRadius:18,elevation:3},cardTitle:{fontSize:18,fontWeight:'800',color:'#15221f',marginBottom:12},option:{minHeight:54,borderRadius:14,borderWidth:1,borderColor:'#e0e8e4',paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:10},selected:{backgroundColor:'#e4f7ef',borderColor:'#00a878'},optionText:{fontSize:16,color:'#30413b',fontWeight:'600'},selectedText:{color:'#08764f'},check:{fontSize:20,color:'#00a878',fontWeight:'900'},primary:{height:56,borderRadius:16,backgroundColor:'#00a878',alignItems:'center',justifyContent:'center',marginTop:24},primaryText:{color:'#fff',fontSize:17,fontWeight:'800'}});
