import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Card, Menu, Provider } from 'react-native-paper';
import { fetchEdtWithCours } from '../../services/edtService';

const hours = [
  { start: '08:00', end: '10:00' },
  { start: '10:00', end: '12:00' },
  { start: '14:00', end: '16:00' },
  { start: '16:00', end: '18:00' },
];

const getWeekDates = () => {
  const week: Date[] = [];
  const today = new Date();
  const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
  for (let i = 0; i < 6; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d);
  }
  return week;
};

const CoursesScreen = () => {
  const [edt, setEdt] = useState<any[]>([]);
  const [classe, setClasse] = useState('M1');
  const [classeMenuVisible, setClasseMenuVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const days = getWeekDates();

  useEffect(() => {
    fetchEdtWithCours().then(setEdt).catch(console.error);
  }, []);

  const formattedSelectedDate = selectedDate.toISOString().split('T')[0];

  const filteredEdt = edt.filter(
    (e) => e.date === formattedSelectedDate && e.cours?.niveau === classe
  );

  const getCoursesForSlot = (start: string, end: string) =>
    filteredEdt.filter((e) => e.heure_deb === start && e.heure_fin === end);

  const getCurrentMonth = () =>
    selectedDate.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });

  return (
    <Provider>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Menu
            visible={classeMenuVisible}
            onDismiss={() => setClasseMenuVisible(false)}
            anchor={
              <Button
                onPress={() => setClasseMenuVisible(true)}
                style={styles.dropdownButton}
              >
                Classe: {classe}
              </Button>
            }
          >
            {['L1', 'L2', 'L3', 'M1', 'M2'].map((c) => (
              <Menu.Item
                key={c}
                title={c}
                onPress={() => {
                  setClasse(c);
                  setClasseMenuVisible(false);
                }}
              />
            ))}
          </Menu>

          <Text style={styles.headerText}>{getCurrentMonth()}</Text>
        </View>

        {/* Days Row */}
        <View style={styles.daysRow}>
          {days.map((d, i) => {
            const isSelected =
              d.toDateString() === selectedDate.toDateString();
            return (
              <TouchableOpacity key={i} onPress={() => setSelectedDate(d)}>
                <View
                  style={[
                    styles.dayCircle,
                    isSelected && styles.dayCircleSelected,
                  ]}
                >
                  <Text style={styles.dayText}>{d.getDate()}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Schedule Display */}
        <ScrollView>
          {hours.map(({ start, end }, idx) => {
            const items = getCoursesForSlot(start, end);
            return (
              <View key={idx} style={styles.courseBlock}>
                <Text style={styles.hour}>{`${start} - ${end}`}</Text>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <Card key={index} style={styles.card}>
                      <Card.Content>
                        <Text style={styles.courseTitle}>
                          {item.cours?.design} {item.cours?.niveau}{' '}
                          {item.cours?.parcours}
                        </Text>
                        <Text>Enseignant : {item.enseignant?.prenom}</Text>
                        <Text>Salle: {item.salle}</Text>
                      </Card.Content>
                    </Card>
                  ))
                ) : (
                  <Text style={styles.noCourse}>Aucun cours</Text>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Provider>
  );
};

export default CoursesScreen;

const styles = StyleSheet.create({
   container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 4,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  dropdownButton: {
    width: 140,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleSelected: {
    backgroundColor: '#007AFF',
  },
  dayText: {
    color: '#000',
    fontWeight: 'bold',
  },
  courseBlock: {
    marginBottom: 20,
  },
  hour: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  card: {
    backgroundColor: '#e8f0fe',
    marginVertical: 5,
  },
  courseTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  noCourse: {
    color: '#aaa',
    marginLeft: 10,
  },
});
