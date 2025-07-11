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

        try {
          // Récupérer document enseignant
          const enseignantRef = doc(db, 'enseignants', cours.enseignant_id);
          const enseignantSnap = await getDoc(enseignantRef);
          if (!enseignantSnap.exists()) return null;

          const enseignantData = enseignantSnap.data();

          // Vérifier présence user_id
          if (!enseignantData.user_id) return null;

          // Récupérer prénom depuis la collection users
          const userRef = doc(db, 'users', enseignantData.user_id);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) return null;

          const userData = userSnap.data();
          const enseignantPrenom = userData.prenom_user ?? 'Inconnu';

          return {
            id: coursDoc.id,
            design: cours.design,
            mention: cours.mention,
            niveau: cours.niveau,
            parcours: cours.parcours,
            enseignantName: enseignantPrenom,
          };
        } catch (e) {
          console.warn(`Erreur sur le cours ${coursDoc.id}:`, e);
          return null;
        }
      })
    );

    // Supprimer les entrées nulles (enseignants invalides ou sans user_id)
    return coursData.filter(item => item !== null);
  } catch (e) {
    console.error('Erreur lors de la récupération des cours :', e);
    return [];
  }
}
