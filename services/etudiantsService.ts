// services/etudiantService.ts
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebaseConfig';

type Etudiant = {
  user_id: string;
  num_mat: string;
  niveau: string;
  mention: string;
  parcours: string;
};

const COLLECTION_NAME = 'etudiants';

export async function addEtudiant(data: Etudiant) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
    console.log('Étudiant ajouté avec succès', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Erreur lors de l\'ajout de l\'étudiant:', e);
    throw e;
  }
}
