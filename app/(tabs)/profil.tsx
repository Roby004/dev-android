import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Divider, Text } from 'react-native-paper';

export default function ProfilScreen() {
  const fullName = 'Mickael Rabe'; // Replace with dynamic user name later

  const handleLogout = () => {
    console.log('Logging out...');
    // TODO: implement logout logic
  };

  const handleChangePassword = () => {
    console.log('Changing password...');
    // TODO: navigate to password change screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button icon="arrow-left" mode="text" onPress={() => {}}>
          Retour
        </Button>
        <Text style={styles.title}>Profil</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Avatar.Image
          size={100}
          source={require('../../assets/images/avatar-placeholder.jpg')} 
        />
        <Text style={styles.fullName}>{fullName}</Text>
      </View>

      <Divider style={{ marginVertical: 20 }} />

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          icon="lock-reset"
          mode="outlined"
          style={styles.actionButton}
          onPress={handleChangePassword}
        >
          Modifier le mot de passe
        </Button>

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
});
