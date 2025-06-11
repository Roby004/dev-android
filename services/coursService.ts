// services/coursService.ts
import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

type Cours = {
  design: string;
  mention: string;
  niveau: string;
  parcours: string;
  enseignant_id: string;
};

export async function addCours(cours: Cours) {
  try {
    const docRef = await addDoc(collection(db, 'cours'), cours);
    console.log('Cours added with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding cours: ', e);
    throw e;
  }
}


export async function fetchCours() {
  try {
    const coursSnapshot = await getDocs(collection(db, 'cours'));

    const coursData = await Promise.all(
      coursSnapshot.docs.map(async (coursDoc) => {
        const cours = coursDoc.data();
        let enseignantName = 'Inconnu';

        try {
          const enseignantRef = doc(db, 'enseignants', cours.enseignant_id);
          const enseignantSnap = await getDoc(enseignantRef);
          if (enseignantSnap.exists()) {
            const ens = enseignantSnap.data();
            enseignantName = ens.prenom;
          }
        } catch (e) {
          console.warn(`Enseignant ${cours.enseignant_id} introuvable`);
        }

        return {
          id: coursDoc.id,
          design: cours.design,
          mention: cours.mention,
          niveau: cours.niveau,
          parcours: cours.parcours,
          enseignantName, // Add full name here
        };
      })
    );

    return coursData;
  } catch (e) {
    console.error('Error fetching cours:', e);
    throw e;
  }
}
