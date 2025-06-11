import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, IconButton, Text, Title } from 'react-native-paper';


type RootStackParamList = {
  Teachers: undefined;
  Students: undefined;
  Courses: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;




const Liste = () => {
 const router = useRouter();

 

  const cards = [
    {
      title: 'Liste des Enseignants',
      icon: 'account-tie',
      route: '/TeacherListe',
      color: '#4CAF50',
    },
    {
      title: 'Liste des Étudiants',
      icon: 'account-group',
      route: '/StudentsListe',
      color: '#2196F3',
    },
    {
      title: 'Liste des Cours',
      icon: 'book-open-page-variant',
      route: '/CoursListe',
      color: '#FF9800',
    },
  ];

  

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <TouchableOpacity key={index} onPress={() => router.push(card.route)}>
          <Card style={[styles.card, { borderLeftColor: card.color }]}>
            <View style={styles.cardContent}>
              <IconButton icon={card.icon} color={card.color} size={32} />
              <View style={styles.textContent}>
                <Title style={styles.cardTitle}>{card.title}</Title>
                <Text style={styles.cardSubtitle}>Voir les détails</Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    
    </View>
  );
};

export default Liste;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6f8',
    justifyContent: 'center',
  },
  card: {
    marginVertical: 10,
    borderLeftWidth: 5,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#fff',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  textContent: {
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#777',
  },
});
