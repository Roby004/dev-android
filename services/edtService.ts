// edtService.ts
import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore';
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


export async function fetchEdtWithCours() {
  const snapshot = await getDocs(collection(db, 'edt'));

  const edtWithCours = await Promise.all(
    snapshot.docs.map(async (edtDoc) => {
      const edtData = edtDoc.data();
      let coursData = null;
      let enseignantData = null;

      try {
        // Fetch cours data
        const coursRef = doc(db, 'cours', edtData.cours_id);
        const coursSnap = await getDoc(coursRef);
        if (coursSnap.exists()) {
          coursData = coursSnap.data();

          // Fetch enseignant from cours.enseignant_id
          const ensRef = doc(db, 'enseignants', coursData.enseignant_id);
          const ensSnap = await getDoc(ensRef);
          if (ensSnap.exists()) {
            enseignantData = ensSnap.data();
          }
        }
      } catch (err) {
        console.warn('Error resolving cours or enseignant for EDT:', err);
      }

      return {
        id: edtDoc.id,
        ...edtData,
        cours: coursData,
        enseignant: enseignantData // ✅ attached here
      };
    })
  );

  return edtWithCours;
}
