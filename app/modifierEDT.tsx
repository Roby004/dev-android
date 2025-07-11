import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Menu, Provider, TextInput } from 'react-native-paper';
import { fetchCours } from '../services/coursService'; // adapte si besoin
import { updateEdt } from '../services/edtService';

export default function ModifierEDT() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [date, setDate] = useState(new Date(params.date || ''));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date(`1970-01-01T${params.heure_deb}:00`));
  const [endTime, setEndTime] = useState(new Date(`1970-01-01T${params.heure_fin}:00`));
  const [salle, setSalle] = useState(params.salle || '');
  const [coursId, setCoursId] = useState(params.cours_id || '');

  const [niveau, setNiveau] = useState(
    typeof params.cours === 'object' && params.cours !== null && 'niveau' in params.cours
      ? (params.cours as any).niveau
      : 'M1'
  );
  const [parcours, setParcours] = useState(
    typeof params.cours === 'object' && params.cours !== null && 'parcours' in params.cours
      ? (params.cours as any).parcours
      : 'GID'
  );

  const [niveauMenuVisible, setNiveauMenuVisible] = useState(false);
  const [parcoursMenuVisible, setParcoursMenuVisible] = useState(false);
  const [coursMenuVisible, setCoursMenuVisible] = useState(false);

  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState<{ id: string, design: string } | null>(null);

  const niveauOptions = ['L1', 'L2', 'L3', 'M1', 'M2'];
  const parcoursOptions = ['GID', 'IG', 'OCC', 'GB', 'ASR', 'MDI'];
  const debutTimeOptions = ['08:00', '10:00', '14:00', '16:00'];
  const endTimeOptions = ['10:00', '12:00', '16:00', '18:00'];

  const timeToDate = (timeStr: string): Date => {
    const [hour, minute] = timeStr.split(':').map(Number);
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d;
  };

  useEffect(() => {
    fetchCours().then(coursList => {
      setAllCourses(coursList);
    });
  }, []);

  useEffect(() => {
    const filtered = allCourses.filter(c => c.niveau === niveau && c.parcours === parcours);
    setFilteredCourses(filtered);
    const defaultCourse = filtered.find(c => c.id === coursId);
    setSelectedCourse(defaultCourse || null);
  }, [allCourses, niveau, parcours]);

  const handleSubmit = async () => {
    if (!selectedCourse) {
      alert("Veuillez sélectionner un cours");
      return;
    }

    try {
      await updateEdt(params.id as string, {
        cours_id: selectedCourse.id,
        date: date.toISOString().split('T')[0],
        heure_deb: startTime.toTimeString().slice(0, 5),
        heure_fin: endTime.toTimeString().slice(0, 5),
        salle,
      });
      Alert.alert('Succès', 'EDT modifié avec succès', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification");
    }
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
       

        {/* Date Picker */}
        <View style={styles.datePickerWrapper}>
          <Button
            mode="outlined"
            icon={() => <Ionicons name="calendar-outline" size={20} color="#07AFAF" />}
            onPress={() => setShowDatePicker(true)}
            contentStyle={styles.dateButtonContent}
            labelStyle={styles.dateButtonLabel}
            style={styles.input}
          >
            {`${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
              .toString()
              .padStart(2, '0')}/${date.getFullYear()}`}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'android' ? 'spinner' : 'calendar'}
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </View>

        {/* Heure début */}
        <Menu
          visible={coursMenuVisible}
          onDismiss={() => setCoursMenuVisible(false)}
          anchor={
            <Button onPress={() => setCoursMenuVisible(true)} style={styles.input}>
              Heure début : {startTime.toTimeString().slice(0, 5)}
            </Button>
          }
        >
          {debutTimeOptions.map(t => (
            <Menu.Item key={t} title={t} onPress={() => {
              setStartTime(timeToDate(t));
              setCoursMenuVisible(false);
            }} />
          ))}
        </Menu>

        {/* Heure fin */}
        <Menu
          visible={niveauMenuVisible}
          onDismiss={() => setNiveauMenuVisible(false)}
          anchor={
            <Button onPress={() => setNiveauMenuVisible(true)} style={styles.input}>
              Heure fin : {endTime.toTimeString().slice(0, 5)}
            </Button>
          }
        >
          {endTimeOptions.map(t => (
            <Menu.Item key={t} title={t} onPress={() => {
              setEndTime(timeToDate(t));
              setNiveauMenuVisible(false);
            }} />
          ))}
        </Menu>

        <TextInput
          label="Salle"
          value={salle}
          mode="outlined"
          onChangeText={setSalle}
          style={styles.input}
        />

        {/* Niveau / Parcours */}
        <View style={styles.row}>
          <Menu
            visible={parcoursMenuVisible}
            onDismiss={() => setParcoursMenuVisible(false)}
            anchor={
              <Button onPress={() => setParcoursMenuVisible(true)} style={styles.input}>
                Niveau : {niveau}
              </Button>
            }
          >
            {niveauOptions.map(opt => (
              <Menu.Item key={opt} onPress={() => {
                setNiveau(opt);
                setParcoursMenuVisible(false);
              }} title={opt} />
            ))}
          </Menu>

          <Menu
            visible={coursMenuVisible}
            onDismiss={() => setCoursMenuVisible(false)}
            anchor={
              <Button onPress={() => setCoursMenuVisible(true)} style={styles.input}>
                Parcours : {parcours}
              </Button>
            }
          >
            {parcoursOptions.map(opt => (
              <Menu.Item key={opt} onPress={() => {
                setParcours(opt);
                setCoursMenuVisible(false);
              }} title={opt} />
            ))}
          </Menu>
        </View>

        {/* Choix cours */}
        <Menu
          visible={coursMenuVisible}
          onDismiss={() => setCoursMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setCoursMenuVisible(true)}
              style={styles.input}
            >
              Cours : {selectedCourse?.design || 'Sélectionner'}
            </Button>
          }
        >
          {filteredCourses.map(c => (
            <Menu.Item
              key={c.id}
              title={c.design}
              onPress={() => {
                setSelectedCourse(c);
                setCoursMenuVisible(false);
              }}
            />
          ))}
        </Menu>

        <Button mode="contained" onPress={handleSubmit} style={styles.submitButton} icon="content-save">
          Enregistrer
        </Button>
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingHorizontal: 0,
  },
  title: {
    alignSelf: 'center',
    marginBottom: 8,
    marginVertical: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 12,
    color: '#555',
  },
  input: {
    marginVertical: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: '#07AFAF',
  },
  submitButton: {
    marginTop: 30,
    borderRadius: 25,
    backgroundColor: '#07AFAF',
  },
   datePickerWrapper: {
    marginVertical: 20,
  },
  dateButtonContent: {
    flexDirection: 'row-reverse',
  },
  dateButtonLabel: {
    color: '#000',
    fontSize: 16,
  },

  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});

