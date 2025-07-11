// /src/services/enseignantService.ts
import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

type Enseignant = {
  user_id: string;
 code_ens: string;
  //prenom: string;
};

const COLLECTION_NAME = 'enseignants';

export async function addEnseignant(data: Enseignant) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
    console.log(' Enseignant ajouté avec l\'ID:', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error(' Erreur lors de l\'ajout de l\'enseignant:', e);
    throw e;
  }
}

export async function getEnseignants() {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));

  const enseignants = await Promise.all(
    snapshot.docs.map(async (ensDoc) => {
      const data = ensDoc.data();

      if (!data.user_id) {
        console.warn(`Document enseignant ${ensDoc.id} n'a pas de user_id`);
        return null;
      }

      try {
        const userRef = doc(db, 'users', data.user_id);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          console.warn(`User non trouvé pour user_id: ${data.user_id}`);
          return null;
        }

        const userData = userSnap.data();

        return {
          id: ensDoc.id,
          user_id: data.user_id,
          code_ens: data.code_ens ?? '',
          nom: userData.nom_user ?? '',
          prenom: userData.prenom_user ?? '',
        };
      } catch (error) {
        console.error(`Erreur en récupérant l'utilisateur ${data.user_id}`, error);
        return null;
      }
    })
  );
  return enseignants.filter(e => e !== null);
}

export async function getEnseignantById(id: string) {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    throw new Error('Enseignant not found');
  }

  const data = snapshot.data();
  const userRef = doc(db, 'users', data.user_id);
  const userSnap = await getDoc(userRef);

  const nom = userSnap.exists() ? userSnap.data().nom_user : '';
  const prenom = userSnap.exists() ? userSnap.data().prenom_user : '';

  return {
    id: snapshot.id,
    user_id: data.user_id,
    code_ens: data.code_ens,
    nom,
    prenom,
  };
}
