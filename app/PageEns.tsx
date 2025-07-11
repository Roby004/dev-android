

import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Avatar, Button, Divider, Text } from 'react-native-paper';
import { auth, db } from '../services/firebaseConfig';
import { changeUserPassword, logoutUser } from '../services/userService';

export default function ProfilScreen() {
  const [fullName, setFullName] = useState('');
  const router = useRouter();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
const [currentPassword, setCurrentPassword] = useState('');
const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const logout = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const nom = data.nom_user || '';
          const prenom = data.prenom_user || '';
          setFullName(`${prenom} ${nom}`);
        }
      } else {
        router.replace('/(auth)/login');
      }
    });
    return logout;
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace('/(auth)/login');
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    }
  };

 const handleChangePassword = async () => {
  try {
    await changeUserPassword(currentPassword, newPassword);
    Alert.alert("Succès", "Mot de passe modifié !");
    setShowPasswordForm(false);
    setCurrentPassword('');
    setNewPassword('');
  } catch (error: any) {
    Alert.alert("Erreur", error.message);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
    

      <View style={styles.profileSection}>
        <Avatar.Image
          size={100}
          source={require('../assets/images/avatar-placeholder.jpg')}
        />
        <Text style={styles.fullName}>{fullName}</Text>
      </View>

      <Divider style={{ marginVertical: 20 }} />

      <View style={styles.actions}>
                {!showPasswordForm ? (
            <Button
              icon="lock-reset"
              mode="outlined"
              style={styles.actionButton}
              onPress={() => setShowPasswordForm(true)}
            >
              Modifier le mot de passe
            </Button>
          ) : (
            <View style={styles.passwordForm}>
              <TextInput
                placeholder="Mot de passe actuel"
                secureTextEntry
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TextInput
                placeholder="Nouveau mot de passe"
                secureTextEntry
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <Button mode="contained" onPress={handleChangePassword} style={{ marginTop: 10 }}>
                Enregistrer
              </Button>
              <Button mode="text" onPress={() => setShowPasswordForm(false)} style={{ marginTop: 4 }}>
                Annuler
              </Button>
            </View>
          )}


        <Button
          icon="logout"
          mode="contained"
          style={styles.logoutButton}
          labelStyle={{ color: '#fff' }}
          onPress={handleLogout}
        >
          Se déconnecter
        </Button>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 2,
    paddingTop: 40,
    backgroundColor: '#f7f7f7',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 4,
    marginBottom: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  fullName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  actions: {
    marginTop: 20,
  },
  actionButton: {
    marginBottom: 16,
    borderRadius: 8,
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
  },
  input: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 6,
  padding: 10,
  marginBottom: 10,
  backgroundColor: '#fff',
},
passwordForm: {
  marginTop: 10,
  backgroundColor: '#f1f1f1',
  padding: 10,
  borderRadius: 8,
},

});
