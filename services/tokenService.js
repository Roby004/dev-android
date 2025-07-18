
import { auth } from './firebaseConfig';

export const fetchIdToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Utilisateur non connecté");
    return await user.getIdToken(true);
};
