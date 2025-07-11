// services/UserService.ts
import { EmailAuthProvider, reauthenticateWithCredential, signOut, updatePassword } from 'firebase/auth';
import { auth } from './firebaseConfig';

export async function changeUserPassword(currentPassword: string, newPassword: string): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("Utilisateur non authentifié");

  const credential = EmailAuthProvider.credential(user.email, currentPassword);

  try {
    // Re-authentification obligatoire avant changement de mot de passe
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  } catch (error: any) {
    throw new Error(error.message || "Erreur lors du changement de mot de passe");
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error("Erreur lors de la déconnexion");
  }
}
