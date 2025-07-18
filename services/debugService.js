import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const debugService = {

    // liste tous les utilisateurs (documents de la collection users) en ne retournant que leurs données.

    listAllUsers: async () => {
        try {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            return usersSnapshot.docs.map(doc => doc.data());
        } catch (error) {
            console.error('Erreur lors de la liste:', error);
            return [];
        }
    },


    // liste tous les utilisateurs avec leurs id Firestore, affiche les utilisateurs dans la console.

    getAllUsers: async () => {
        try {
            const snapshot = await getDocs(collection(db, 'users'));
            const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('=== DEBUG: Utilisateurs ===');
            users.forEach(user => console.log(user));
            return users;
        } catch (error) {
            console.error('❌ Erreur récupération utilisateurs:', error);
            return [];
        }
    },


    //liste tous les étudiants depuis la collection etudiant.

    getAllEtudiants: async () => {
        try {
            const snapshot = await getDocs(collection(db, 'etudiant'));
            const etudiants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('=== DEBUG: Étudiants ===');
            etudiants.forEach(e => console.log(e));
            return etudiants;
        } catch (error) {
            console.error('❌ Erreur récupération étudiants:', error);
            return [];
        }
    },


    //liste tous les enseignants depuis la collection enseignants.

    getAllEnseignants: async () => {
        try {
            const snapshot = await getDocs(collection(db, 'enseignants')); // ✅ Correction ici
            const enseignants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('=== DEBUG: Enseignants ===');
            enseignants.forEach(e => console.log(e));
            return enseignants;
        } catch (error) {
            console.error('❌ Erreur récupération enseignants:', error);
            return [];
        }
    },

    //liste tous les cours depuis la collection cours.

    getAllCours: async () => {
        try {
            const snapshot = await getDocs(collection(db, 'cours'));
            const cours = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('=== DEBUG: Cours ===');
            cours.forEach(c => console.log(c));
            return cours;
        } catch (error) {
            console.error('❌ Erreur récupération cours:', error);
            return [];
        }
    },

    //récupère tous les documents edt (emploi du temps) et enrichit chaque item avec le nom du cours et de l’enseignant via des appels Firestore supplémentaires.

    getAllEdt: async () => {
        try {
            const edtSnapshot = await getDocs(collection(db, 'edt'));
            const edtDocs = edtSnapshot.docs;
            const result = [];

            for (const docEdt of edtDocs) {
                const edt = { id: docEdt.id, ...docEdt.data() };
                let nomCours = 'Inconnu';
                let nomEnseignant = 'Inconnu';

                try {
                    if (edt.cours_id) {
                        const coursRef = doc(db, 'cours', edt.cours_id);
                        const coursSnap = await getDoc(coursRef);

                        if (coursSnap.exists()) {
                            const coursData = coursSnap.data();
                            nomCours = coursData.design || 'Sans nom';

                            if (coursData.enseignant_id) {
                                const ensRef = doc(db, 'enseignants', coursData.enseignant_id); // ✅ Correction ici
                                const ensSnap = await getDoc(ensRef);

                                if (ensSnap.exists()) {
                                    const ensData = ensSnap.data();

                                    if (ensData.user_id) {
                                        const userRef = doc(db, 'users', ensData.user_id);
                                        const userSnap = await getDoc(userRef);

                                        if (userSnap.exists()) {
                                            nomEnseignant = userSnap.data().nom_user || 'Nom inconnu';
                                        } else {
                                            console.warn(`⚠️ Utilisateur non trouvé pour user_id = ${ensData.user_id}`);
                                        }
                                    } else {
                                        console.warn(`⚠️ user_id manquant dans enseignant ${coursData.enseignant_id}`);
                                    }
                                } else {
                                    console.warn(`⚠️ Enseignant non trouvé : ${coursData.enseignant_id}`);
                                }
                            } else {
                                console.warn(`⚠️ enseignant_id manquant dans cours ${edt.cours_id}`);
                            }
                        } else {
                            console.warn(`⚠️ Cours non trouvé : ${edt.cours_id}`);
                        }
                    } else {
                        console.warn(`⚠️ cours_id manquant dans edt ${docEdt.id}`);
                    }
                } catch (err) {
                    console.warn('⚠️ Erreur pendant enrichissement EDT :', err.message);
                }

                result.push({
                    ...edt,
                    nomCours,
                    enseignant: nomEnseignant,
                });
            }

            console.log('=== DEBUG: Emplois du temps enrichis ===');
            result.forEach(e => console.log(e));
            return result;

        } catch (error) {
            console.error('❌ Erreur récupération EDT:', error);
            return [];
        }
    },
};
