// seed.ts
import { addEnseignant } from './services/enseignantService';

const sampleEnseignants = [
  { prenom: 'Mickael', nom: 'Rabe' },
  { prenom: 'Claire', nom: 'Andriamampionona' },
  { prenom: 'Jean', nom: 'Rakoto' },
  { prenom: 'Sophie', nom: 'Randria' },
  { prenom: 'Luc', nom: 'Ravelo' },
  { prenom: 'Hery', nom: 'Andria' },
  { prenom: 'Gustavine', nom: 'Raveloson' },
  { prenom: 'Eric', nom: 'Andrianarisoa' },
  { prenom: 'Laura', nom: 'Randrianarivelo' },
  { prenom: 'Alain', nom: 'Rakotomanga' },
];

async function insertSampleEnseignants() {
  for (let i = 0; i < sampleEnseignants.length; i++) {
    const ens = sampleEnseignants[i];
    await addEnseignant({
      user_id: `dummy-uid-${i + 1}`,
      prenom: ens.prenom,
    });
    console.log(`✅ Inserted: ${ens.prenom} ${ens.nom}`);
  }
  console.log('🎉 All enseignants inserted.');
}

insertSampleEnseignants();
