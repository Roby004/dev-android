import { Ionicons } from '@expo/vector-icons'; // add this import at the top
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Menu, Provider, Text, TextInput } from 'react-native-paper';
import { fetchCours } from '../../services/coursService'; // Adjust the import path as necessary
import { addEdt } from '../../services/edtService';


export default function AddScreen() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [courses, setCourses] = useState<{ id: string; design: string }[]>([]);
const [selectedCourse, setSelectedCourse] = useState<{ id: string; design: string } | null>(null);
const [coursMenuVisible, setCoursMenuVisible] = useState(false);


  const [salle, setSalle] = useState('');

  const debutTimeOptions = ['08:00', '10:00', '14:00', '16:00'];
  const endTimeOptions = ['10:00', '12:00', '16:00', '18:00'];

  const [debutMenuVisible, setDebutMenuVisible] = useState(false);
  const [finMenuVisible, setFinMenuVisible] = useState(false);

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const timeToDate = (timeStr: string): Date => {
    const [hour, minute] = timeStr.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hour, minute, 0, 0);
    return newDate;
  };

  const [niveau, setNiveau] = useState('M1');
const [parcours, setParcours] = useState('GID');
const [niveauMenuVisible, setNiveauMenuVisible] = useState(false);
const [parcoursMenuVisible, setParcoursMenuVisible] = useState(false);

const niveauOptions = ['L1', 'L2', 'L3', 'M1', 'M2'];
  const parcoursOptions = ['GID', 'IG', 'OCC', 'GB', 'ASR', 'MDI'];


  const [allCourses, setAllCourses] = useState<{ id: string; design: string; niveau: string; parcours: string }[]>([]);
const [filteredCourses, setFilteredCourses] = useState<typeof allCourses>([]);

useEffect(() => {
  fetchCours().then(data => {
    setAllCourses(data);
  });
}, []);

useEffect(() => {
  const filtered = allCourses.filter(
    c => c.niveau === niveau && c.parcours === parcours
  );
  setFilteredCourses(filtered);
  setSelectedCourse(filtered[0] || null);
}, [allCourses, niveau, parcours]);



 const handleSubmit = async () => {
  if (!selectedCourse) {
    alert('Veuillez sélectionner un cours');
    return;
  }

  try {
    const payload = {
      cours_id: selectedCourse.id,
      date: date.toISOString().split('T')[0], // yyyy-mm-dd
      heure_deb: startTime.toTimeString().slice(0, 5), // hh:mm
      heure_fin: endTime.toTimeString().slice(0, 5),
      salle,
    };
    await addEdt(payload);
    alert('EDT ajouté avec succès');
  } catch (err) {
    console.error('Erreur ajout EDT:', err);
    alert('Erreur lors de l’ajout');
  }
};


  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc', padding: 4, width: '100%', backgroundColor: '#fff' }}>
          <Button icon="arrow-left" mode="text" onPress={() => {}}>
            Retour
          </Button>
          <Text style={styles.title}>ajouter EDT</Text>
        </View>

        <View style={{ marginHorizontal: 20 }}>
          <Text style={styles.subtitle}>
            Veuillez remplir les informations concernant la fiche de présence que vous voulez chercher
          </Text>

           {/* Date Picker UI */}
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
              setShowDatePicker(false); // close after select
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}
      </View>
          {/* Début Time Select */}
          <Menu
            visible={debutMenuVisible}
            onDismiss={() => setDebutMenuVisible(false)}
            anchor={
              <Button onPress={() => setDebutMenuVisible(true)} style={styles.input}>
                Heure début: {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Button>
            }
          >
            {debutTimeOptions.map(time => (
              <Menu.Item key={time} title={time} onPress={() => {
                setStartTime(timeToDate(time));
                setDebutMenuVisible(false);
              }} />
            ))}
          </Menu>

          {/* Fin Time Select */}
          <Menu
            visible={finMenuVisible}
            onDismiss={() => setFinMenuVisible(false)}
            anchor={
              <Button onPress={() => setFinMenuVisible(true)} style={styles.input}>
                Heure fin: {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Button>
            }
          >
            {endTimeOptions.map(time => (
              <Menu.Item key={time} title={time} onPress={() => {
                setEndTime(timeToDate(time));
                setFinMenuVisible(false);
              }} />
            ))}
          </Menu>

          {/* Salle Input */}
          <TextInput
            label="Salle"
            value={salle}
            mode="outlined"
            onChangeText={text => setSalle(text)}
          />
          
          {/* Niveau Dropdown */}
          <View style={styles.dropdownRow}>
  <Menu
    visible={niveauMenuVisible}
    onDismiss={() => setNiveauMenuVisible(false)}
    anchor={
      <Button
        mode="outlined"
        onPress={() => setNiveauMenuVisible(true)}
        style={styles.input}
      >
        Niveau: {niveau}
      </Button>
    }
  >
    {niveauOptions.map(opt => (
      <Menu.Item
        key={opt}
        onPress={() => {
          setNiveau(opt);
          setNiveauMenuVisible(false);
        }}
        title={opt}
      />
    ))}
  </Menu>

  <Menu
    visible={parcoursMenuVisible}
    onDismiss={() => setParcoursMenuVisible(false)}
    anchor={
      <Button
        mode="outlined"
        onPress={() => setParcoursMenuVisible(true)}
        style={styles.input}
      >
        Parcours: {parcours}
      </Button>
    }
  >
    {parcoursOptions.map(opt => (
      <Menu.Item
        key={opt}
        onPress={() => {
          setParcours(opt);
          setParcoursMenuVisible(false);
        }}
        title={opt}
      />
    ))}
  </Menu>
</View>

          {/* Cours Dropdown */}
         <Menu
                      visible={coursMenuVisible}
                      onDismiss={() => setCoursMenuVisible(false)}
                      anchor={
                        <Button
                          mode="outlined"
                          onPress={() => setCoursMenuVisible(true)}
                          style={{
                            marginVertical: 10,
                            borderRadius: 5,
                            backgroundColor: '#fff',
                            borderBottomWidth: 2,
                            borderColor: '#07AFAF',
                          }}
                        >
                          Cours : {selectedCourse?.design || 'Sélectionner'}
                        </Button>
                      }
                    >
                      {filteredCourses.map(course => (
                        <Menu.Item
                          key={course.id}
                          onPress={() => {
                            setSelectedCourse(course);
                            setCoursMenuVisible(false);
                          }}
                          title={course.design}
                        />
                      ))}
                    </Menu>


          {/* Submit Button */}
          <Button mode="contained" onPress={handleSubmit} style={styles.submitButton} icon="check">
            Valider
          </Button>
        </View>
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
});
