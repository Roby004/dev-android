// app/login.tsx
import TopRightBackground from '@/components/abstractBack';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';

import { auth, db } from '../../services/firebaseConfig';
// import logo image correctly for React Native


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const logo = require('../../assets/images/logoapp.png');


  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        alert("User profile not found");
        return;
      }

      const { role } = docSnap.data();

      if (role === 'admin') router.replace('/(tabs)');
      else if (role === 'etudiant') router.replace('/PageStudent');
      else if (role === 'enseignant') router.replace('/PageEns');
      else alert('Unknown role');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
    
        <TopRightBackground />
      
      <View style={styles.logo}>
        <Image source={logo} style={{ width: 100, height: 100, resizeMode: 'contain',marginTop:10,marginBottom:2 }} />
        <Text style={{color:'#26838aff', fontSize:20, marginTop:1, marginBottom:10, fontFamily:'Fantasy'}}> Presantika</Text> 
      </View>
      <View style={styles.card }>
          <Text style={styles.title}>Connexion</Text>
          <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
          <TextInput placeholder="Mot de passe" style={styles.input} onChangeText={setPassword} secureTextEntry />
          
            <Button mode="contained"  onPress={handleLogin} style={styles.submitButton} >
            Se connecter
          </Button>
      </View>
      <Text onPress={() => router.push('/(auth)/register')} style={{ marginTop: 20 , color: '#404242ff', fontSize: 16, fontFamily:'Arial', textDecorationLine: 'underline'}}>
        Pas encore inscrit ? S'enregistrer
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginTop: 30,
     padding: 20,
        backgroundColor: '#f4f6f8',
      
       
 },
 logo:{
  alignItems:'center',
  marginHorizontal:25,
  marginTop:100,

 },
 card:{
    backgroundColor: '#fff',
     width: '100%',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

 
  title: { fontSize: 22, marginBottom: 20, fontWeight: 'bold' },
  input: { padding: 10, marginBottom: 15,width: '100%',
     backgroundColor: '#fafafaff',
    borderColor: '#769b9bff' ,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  borderBottomWidth: 2,
  borderBottomLeftRadius:0,
  borderBottomRightRadius:0,
  
},
   submitButton: {
    marginTop: 30,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#07AFAF',
    marginHorizontal:25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    fontFamily: 'Arial',
    fontWeight: 'bold',
  },
});
