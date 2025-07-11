// app/index.tsx
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { auth, db } from '../services/firebaseConfig';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            router.replace('/(auth)/login');
            return;
          }

          const { role } = docSnap.data();

          if (role === 'admin') router.replace('/(tabs)');
          else if (role === 'etudiant') router.replace('/PageStudent');
          else if (role === 'enseignant') router.replace('/PageEns');
          else router.replace('/(auth)/login');
        } catch (err) {
          console.error('Erreur récupération rôle :', err);
          router.replace('/(auth)/login');
        }
      } else {
        router.replace('/(auth)/login');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Chargement...</Text>
    </View>
  );
}
