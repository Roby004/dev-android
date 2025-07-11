import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';
import { auth, db } from '../../services/firebaseConfig';


import TopRightBackground from '@/components/abstractBack';

import { addEnseignant } from '../../services/enseignantService';
import { addEtudiant } from '../../services/etudiantsService';



export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [role, setRole] = useState<'etudiant' | 'enseignant' | 'admin'>('etudiant');

  const [numMat, setNumMat] = useState('');
  const [niveau, setNiveau] = useState('');
  const [mention, setMention] = useState('');
  const [parcours, setParcours] = useState('');
  const [codeEns, setCodeEns] = useState('');

    const logo = require('../../assets/images/logoapp.png');


  const handleRegister = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, 'users', uid), {
        nom_user: nom,
        prenom_user: prenom,
        email,
        role,
      });

    if (role === 'etudiant') {
      await addEtudiant({
        user_id: uid,
        num_mat: numMat,
        niveau,
        mention,
        parcours,
      });
    }
     if (role === 'enseignant') {
        await addEnseignant({
          user_id: uid,
          code_ens: codeEns,
        });
      }


      alert("Enregistrement réussi !");
      router.replace('/');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleNext = () => {
    if (role === 'etudiant' || role === 'enseignant') {
      setStep(2);
    } else {
      handleRegister();
    }
  };

  return (
    <View style={styles.container}>
      <TopRightBackground />
            <View style={styles.logo}>
              <Image source={logo} style={{ width: 100, height: 100, resizeMode: 'contain',marginTop:20,marginBottom:2 }} />
              <Text style={{color:'#26838aff', fontSize:20, marginTop:1}}> PRESANTIKA</Text> 
            </View>
            <View style={styles.card }>
      <Text style={styles.title}>S'enregistrer</Text>

      {step === 1 && (
        <>
          <TextInput placeholder="Nom " onChangeText={setNom} style={styles.input} />
          <TextInput placeholder="Prénom" onChangeText={setPrenom} style={styles.input} />
          <TextInput placeholder="Email" onChangeText={setEmail} style={styles.input} />
          <TextInput placeholder="Mot de passe" onChangeText={setPassword} secureTextEntry style={styles.input} />

          <Text style={styles.label}>Sélectionner un rôle</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
            >
              <Picker.Item label="Étudiant" value="etudiant" />
              <Picker.Item label="Enseignant" value="enseignant" />
              <Picker.Item label="Admin" value="admin" />
            </Picker>
          </View>

         
           <Button mode="contained"  onPress={handleNext} style={styles.submitButton} >
                     <Text> Suivant</Text>
                    </Button>
        </>
      )}

      {step === 2 && role === 'etudiant' && (
        <>
        <View style={styles.btn_retour}>
         
            <Button mode="contained"  onPress={() => setStep(1)} style={{backgroundColor:'white'}} >
                     ret
                    </Button>

           
        </View>
          <TextInput placeholder="Num Matricule" onChangeText={setNumMat} style={styles.input} />
          <TextInput placeholder="Niveau" onChangeText={setNiveau} style={styles.input} />
          <TextInput placeholder="Mention" onChangeText={setMention} style={styles.input} />
          <TextInput placeholder="Parcours" onChangeText={setParcours} style={styles.input} />
          <Button mode="contained"  onPress={handleRegister} style={styles.submitButton} >
                      Valider
                    </Button>
        </>
      )}

      {step === 2 && role === 'enseignant' && (
        <>
          <TextInput placeholder="Code Enseignant" onChangeText={setCodeEns} style={styles.input} />
         
            <Button mode="contained"  onPress={handleRegister} style={styles.submitButton} >
                      Valider
                    </Button>
        </>
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
   container: { 
    marginTop: 60,
     padding: 20,
        backgroundColor: '#f4f6f8',
      
       
 },
  logo:{
  alignItems:'center',
  marginHorizontal:25,
  marginTop:25,

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
  label: { fontWeight: 'bold', marginBottom: 5 },
  pickerContainer: {
    borderWidth: 0,
   borderRightWidth: 0,
  borderBottomWidth: 2,
  borderBottomLeftRadius:0,
  borderBottomRightRadius:0,
   borderColor: '#769b9bff' ,
    marginBottom: 15,
    overflow: 'hidden',
    width: '100%',
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
  btn_retour :{
    marginBottom: 15,
    width: '20%',
    alignSelf: 'flex-start',
    borderRadius: 5,
   

    padding: 10,

  },
});
