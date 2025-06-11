// /src/services/enseignantService.ts
import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

type Enseignant = {
  user_id: string;
 
  prenom: string;
};

const COLLECTION_NAME = 'enseignants';

export async function addEnseignant(data: Enseignant) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
    console.log('Enseignant added with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding enseignant: ', e);
    throw e;
  }
}

export async function getEnseignants() {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as (Enseignant & { id: string })[];
}

export async function getEnseignantById(id: string) {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Enseignant & { id: string };
  } else {
    throw new Error('Enseignant not found');
  }
}
