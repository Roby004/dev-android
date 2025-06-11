import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Menu, Provider, Text, TextInput } from 'react-native-paper';

import { useEffect } from 'react';
import { addCours } from '../services/coursService';
import { getEnseignants } from '../services/enseignantService';

export default function AddScreen() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [startTime, setStartTime] = useState(new Date());

  const [endTime, setEndTime] = useState(new Date());

  const [course, setCourse] = useState('');
  const [niveau, setNiveau] = useState('L1');
  const [parcours, setParcours] = useState('GID');

  const niveauOptions = ['L1', 'L2', 'L3', 'M1', 'M2'];
  const parcoursOptions = ['GID', 'IG', 'OCC', 'GB', 'ASR', 'MDI'];

  const [enseignants, setEnseignants] = useState<{ id: string; nom: string; prenom: string }[]>([]);
const [selectedEnseignant, setSelectedEnseignant] = useState<{ id: string; label: string } | null>(null);

  //const enseignants= ['RAVAOSOLO Jeande dieu', 'RAVALOMANANA Jean', 'RAZAFINDRAKOTO Jean'];

  const [niveauMenuVisible, setNiveauMenuVisible] = useState(false);
  const [parcoursMenuVisible, setParcoursMenuVisible] = useState(false);
  const [enseignantMenuVisible, setEnseignantMenuVisible] = useState(false);
    //const [selectedEnseignant, setSelectedEnseignant] = useState('RAVAOSOLO Jeande dieu');


    useEffect(() => {
  getEnseignants().then(data => {
    const parsed = data.map((ens: any) => ({
      id: ens.id,
      nom: ens.nom,
      prenom: ens.prenom,
    }));
    setEnseignants(parsed);
    if (parsed.length > 0) {
      setSelectedEnseignant({ id: parsed[0].id, label: `${parsed[0].prenom} ${parsed[0].nom}` });
    }
  });
}, []);

const handleSubmit = async () => {
  if (!selectedEnseignant) return alert('Sélectionnez un enseignant');
  try {
    await addCours({
      design: course,
      mention: 'Info',
      niveau : niveau,
      parcours : parcours,
      enseignant_id: selectedEnseignant.id,
    });
    alert('Cours ajouté avec succès');
  } catch (error) {
    console.error(error);
    alert('Erreur lors de l\'ajout du cours');
  }
};

  

  return (
    <Provider>
    <ScrollView contentContainerStyle={styles.container}>
      
      <View style={{marginHorizontal: 20}}>
     <Text style={styles.subtitle}>
        Veuillez remplir les informations concernant le cours que vous voulez aouter
      </Text>

         <TextInput
        label="Nom du Cours"
        value={course}
        mode='outlined'
        style={{borderWidth:0,borderBottomWidth : 2, borderColor: '#07AFAF'}}
      
        onChangeText={text => setCourse(text)}
       
      />
      
         <Menu
  visible={enseignantMenuVisible}
  onDismiss={() => setEnseignantMenuVisible(false)}
  anchor={
    <Button
      mode="outlined"
      onPress={() => setEnseignantMenuVisible(true)}
      style={{
        marginVertical: 20,
        borderRadius: 5,
        backgroundColor: '#fff',
        borderBottomWidth: 2,
        borderColor: '#07AFAF',
      }}
    >
      Enseignant: {selectedEnseignant?.label || 'Sélectionner'}
    </Button>
  }
>
  {enseignants.map(opt => (
    <Menu.Item
      key={opt.id}
      onPress={() => {
        setSelectedEnseignant({ id: opt.id, label: opt.prenom });
        setEnseignantMenuVisible(false);
      }}
      title={opt.prenom}
    />
  ))}
</Menu>

     

      <View style={styles.dropdownRow}>
        <Menu
          visible={niveauMenuVisible}
          onDismiss={() => setNiveauMenuVisible(false)}
          anchor={
            <Button mode="outlined" onPress={() => setNiveauMenuVisible(true)} style={{marginVertical: 10, borderRadius: 5,backgroundColor: '#fff',borderWidth:0,borderBottomWidth : 2, borderColor: '#07AFAF'}}>
              Niveau: {niveau}
            </Button>
          }>
          {niveauOptions.map(opt => (
            <Menu.Item key={opt} onPress={() => { setNiveau(opt); setNiveauMenuVisible(false); }} title={opt} />
          ))}
        </Menu>

        <Menu
          visible={parcoursMenuVisible}
          onDismiss={() => setParcoursMenuVisible(false)}
          anchor={
            <Button mode="outlined" onPress={() => setParcoursMenuVisible(true)} style={{marginVertical: 10, borderRadius: 5,backgroundColor: '#fff',borderWidth:0,borderBottomWidth : 2, borderColor: '#07AFAF'}}>
              Parcours: {parcours}
            </Button>
          }>
          {parcoursOptions.map(opt => (
            <Menu.Item key={opt} onPress={() => { setParcours(opt); setParcoursMenuVisible(false); }} title={opt} />
          ))}
        </Menu>
      </View>

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
    paddingHorizontal : 0,
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
 
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  submitButton: {
    marginTop: 30,
    borderRadius: 5,
    backgroundColor: '#07AFAF',
  },

  input:{
    borderWidth: 1,
    borderColor : '#07AFAF',
    marginVertical: 10,
    borderRadius: 10,
}
});
