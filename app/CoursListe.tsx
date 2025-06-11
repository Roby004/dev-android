import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Card, FAB, IconButton, Menu, Provider, Text } from 'react-native-paper';
import { fetchCours } from '../services/coursService'; // adjust path if needed

type RootStackParamList = {
  add_cours: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const classOptions = ['L1', 'L2', 'L3', 'M1', 'M2'];

const CoursListe = () => {
  const navigation = useNavigation<NavigationProp>();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedClasse, setSelectedClasse] = useState('M1');
  const [classeMenuVisible, setClasseMenuVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  useEffect(() => {
    fetchCours().then(setCourses).catch(console.error);
  }, []);

  const filteredCourses = courses.filter(course => course.niveau === selectedClasse);

  const renderCourse = ({ item }: { item: any }) => {
  const isSelected = selectedCardId === item.id;

  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedCardId(isSelected ? null : item.id);
      }}
      activeOpacity={0.8}
    >
      <Card style={[styles.card, { backgroundColor: '#fff' }]} elevation={3}>
        <View style={styles.cardContent}>
          {isSelected && (
            <View style={styles.actionButtons}>
              <IconButton icon="pencil" size={20} iconColor="white" style={styles.editButton} onPress={() => console.log('Edit', item.id)} />
              <IconButton icon="delete" size={20} iconColor="white" style={styles.deleteButton} onPress={() => console.log('Delete', item.id)} />
            </View>
          )}
          <View style={styles.courseInfo}>
            <Text style={styles.title}>{item.design}</Text>
            <Text style={styles.subtitle}>
              {item.niveau} {item.parcours} - {item.enseignantName}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

  return (
    <Provider>
         <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <Text style={styles.sectionLabel}>Filtrer par classe:</Text>
        <Menu
          visible={classeMenuVisible}
          onDismiss={() => setClasseMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setClasseMenuVisible(true)}
              style={styles.classeButton}
            >
              {selectedClasse}
            </Button>
          }
        >
          {classOptions.map(classe => (
            <Menu.Item
              key={classe}
              onPress={() => {
                setSelectedClasse(classe);
                setClasseMenuVisible(false);
              }}
              title={classe}
            />
          ))}
        </Menu>
      </View>

      <FlatList
        data={filteredCourses}
        renderItem={renderCourse}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Aucun cours trouvé pour {selectedClasse}</Text>}
      />

      <FAB icon="plus" style={styles.fab} onPress={() => navigation.navigate('add_cours')} />
    </View>
    </Provider>
   
  );
};

export default CoursListe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3fdf7',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    marginLeft: 8,
  },
  card: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionButtons: {
    marginRight: 12,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#673ab7',
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
  },
  courseInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 50,
    backgroundColor: '#00bfa5',
  },

  /* Dropdown styles */

  dropdownContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
  paddingHorizontal: 8,
},
classeButton: {
  borderRadius: 20,
  backgroundColor: '#fff',
  borderBottomWidth: 2,
  borderColor: '#07AFAF',
},
});
