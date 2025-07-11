// edtService.ts
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export async function addEdt(edt: {
  cours_id: string;
  date: string;
  heure_deb: string;
  heure_fin: string;
  salle: string;
}) {
  return await addDoc(collection(db, 'edt'), edt);
}

export const deleteEdt = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'edt', id));
    return true;
  } catch (err) {
    console.error('Erreur suppression EDT:', err);
    throw err;
  }
};

export const getEdtById = async (id: string) => {
  if (!id) throw new Error("ID de l'EDT requis");

  try {
    const snap = await getDoc(doc(db, 'edt', id));
    let coursData = null;

    if (snap.exists()) {
      const edtData = snap.data();

      // Récupérer le document cours
      const coursRef = doc(db, 'cours', edtData.cours_id);
      const coursSnap = await getDoc(coursRef);

      if (!coursSnap.exists()) return null;
      coursData = coursSnap.data();

      // Retourner les données enrichies
      return {
        id: snap.id,
        ...edtData,
        cours: coursData,
      };
    }
    throw new Error("Document introuvable");
  } catch (err) {
    console.error('Erreur get EDT:', err);
    throw err;
  }
};

export const updateEdt = async (id: string, updatedData: any) => {
  try {
    const docRef = doc(db, 'edt', id);
    await updateDoc(docRef, updatedData);
    return true;
  } catch (err) {
    console.error('Erreur mise à jour EDT:', err);
    throw err;
  }
};

export async function fetchEdtWithCours() {
  const snapshot = await getDocs(collection(db, 'edt'));

  const edtWithCours = await Promise.all(
    snapshot.docs.map(async (edtDoc) => {
      const edtData = edtDoc.data();
      let coursData = null;
      let enseignantPrenom = null;

      try {
        // Récupérer le document cours
        const coursRef = doc(db, 'cours', edtData.cours_id);
        const coursSnap = await getDoc(coursRef);

        if (!coursSnap.exists()) return null;
        coursData = coursSnap.data();

        // Récupérer le document enseignant
        const ensRef = doc(db, 'enseignants', coursData.enseignant_id);
        const ensSnap = await getDoc(ensRef);
        if (!ensSnap.exists()) return null;

        const enseignantData = ensSnap.data();

        // Vérifier que user_id existe
        if (!enseignantData.user_id) return null;

        // Récupérer les infos utilisateur
        const userRef = doc(db, 'users', enseignantData.user_id);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return null;

        const userData = userSnap.data();
        enseignantPrenom = userData.prenom_user ?? null;

        // Retourner les données enrichies
        return {
          id: edtDoc.id,
          ...edtData,
          cours: coursData,
          enseignantPrenom: enseignantPrenom,
        };
      } catch (err) {
        console.warn('Erreur lors du fetch EDT avec cours:', err);
        return null;
      }
    })
  );

  // Retirer tous les nulls (cours sans user_id valide)
  return edtWithCours.filter(item => item !== null);
}
