import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query, where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { db } from '../services/firebaseConfig';

const { width } = Dimensions.get('window');

const EmploiDuTempsScreen = () => {
    const [loading, setLoading] = useState(false);
    const [edtData, setEdtData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [viewMode, setViewMode] = useState('month');

    const [mentionsDisponibles, setMentionsDisponibles] = useState([]);
    const [niveauxDisponibles, setNiveauxDisponibles] = useState([]);
    const [parcoursDisponibles, setParcoursDisponibles] = useState([]);

    const [mention, setMention] = useState('');
    const [niveau, setNiveau] = useState('');
    const [parcours, setParcours] = useState('');

    const [structure, setStructure] = useState({});

    const timeSlots = [
        { id: 'slot1', label: '08:00', start: '08:00', end: '10:00' },
        { id: 'slot2', label: '10:00', start: '10:00', end: '12:00' },
        { id: 'slot3', label: '14:00', start: '14:00', end: '16:00' },
        { id: 'slot4', label: '16:00', start: '16:00', end: '18:00' },
    ];

    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    const auth = getAuth();
  
 
  // Supprimer les états mentionsDisponibles, niveauxDisponibles, parcoursDisponibles et structure si plus utilisés

  // Au chargement du composant, récupérer l'étudiant connecté
 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log('Utilisateur connecté :', user.uid);
      try {
        const etudiantsRef = collection(db, 'etudiants');
        const q = query(etudiantsRef, where('user_id', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          Alert.alert('Erreur', 'Profil étudiant introuvable');
          return;
        }

        const etudiantDoc = querySnapshot.docs[0];
        const etudiantData = etudiantDoc.data();

        setMention(etudiantData.mention || '');
        setNiveau(etudiantData.niveau || '');
        setParcours(etudiantData.parcours || '');

        console.log('Étudiant récupéré :', etudiantData);

        // Charger l’emploi du temps pour ce profil
        fetchEmploiDuTemps(); // Si cette fonction utilise les états
      } catch (error) {
        console.error('Erreur récupération étudiant:', error);
        Alert.alert('Erreur', 'Impossible de récupérer le profil étudiant.');
      }
    } else {
      console.log('Aucun utilisateur connecté');
    }
  });

  // Nettoyage
  return () => unsubscribe();
}, []);


    // génère un tableau des objets Date pour tous les jours du mois 
    const getMonthDates = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const dates = [];

        for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d));
        }
        return dates;
    };


    //formate une date en YYYY-MM-DD (chaîne)

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    //renvoie le nom abrégé du jour (ex: 'Lun').

    const getDayName = (date) => {
        const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        return days[date.getDay()];
    };

    //indique si la date donnée est le jour actuel.

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    //change le mois affiché (direction = +1 ou -1)

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);

        if (mention && niveau && parcours) {
            fetchEmploiDuTemps(newDate);
        }
    };

    //vérifie si un cours tombe dans une plage horaire donnée (par exemple, 08:00-10:00).

    const isCourseInTimeSlot = (course, timeSlot) => {
        const courseStart = course.heure_deb;
        const courseEnd = course.heure_fin;

        const toMinutes = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const courseStartMin = toMinutes(courseStart);
        const courseEndMin = toMinutes(courseEnd);
        const slotStartMin = toMinutes(timeSlot.start);
        const slotEndMin = toMinutes(timeSlot.end);

        return (courseStartMin >= slotStartMin && courseStartMin < slotEndMin) ||
            (courseEndMin > slotStartMin && courseEndMin <= slotEndMin) ||
            (courseStartMin <= slotStartMin && courseEndMin >= slotEndMin);
    };



    //regroupe les cours par date dans le mois.


    const groupCoursesByMonth = (courses) => {
        const monthDates = getMonthDates(currentDate);
        const groupedData = {};

        monthDates.forEach(date => {
            const dateStr = formatDate(date);
            groupedData[dateStr] = {
                date: date,
                courses: []
            };
        });

        courses.forEach(course => {
            const courseDate = course.date;
            if (groupedData[courseDate]) {
                groupedData[courseDate].courses.push(course);
            }
        });

        return groupedData;
    };

    useEffect(() => {
        const loadStructure = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'cours'));
                const temp = {};

                snapshot.forEach(docSnap => {
                    const data = docSnap.data();
                    const m = data.mention;
                    const n = data.niveau;
                    const p = data.parcours;

                    if (!temp[m]) temp[m] = {};
                    if (!temp[m][n]) temp[m][n] = new Set();
                    temp[m][n].add(p);
                });

                const structureObj = {};
                for (const m in temp) {
                    structureObj[m] = {};
                    for (const n in temp[m]) {
                        structureObj[m][n] = Array.from(temp[m][n]).sort();
                    }
                }

                setStructure(structureObj);
                setMentionsDisponibles(Object.keys(structureObj));
            } catch (error) {
                console.error('Erreur chargement structure:', error);
                Alert.alert('Erreur', 'Impossible de charger les données.');
            }
        };

        loadStructure();
    }, []);

    


    //récupère les données d’emploi du temps dans Firestore 

    const fetchEmploiDuTemps = async (monthDate = currentDate) => {
        try {
            setLoading(true);

            const snapshot = await getDocs(collection(db, 'cours'));
            const coursMap = {};

            for (const docSnap of snapshot.docs) {
                const cours = docSnap.data();
                if (
                    
                    cours.niveau === niveau &&
                    cours.parcours === parcours
                ) {
                    let enseignantNom = 'Inconnu';

                    if (cours.enseignant_id) {
                        try {
                            const enseignantRef = doc(db, 'enseignants', cours.enseignant_id);
                            const enseignantSnap = await getDoc(enseignantRef);

                            if (enseignantSnap.exists()) {
                                const enseignantData = enseignantSnap.data();
                                if (enseignantData?.user_id) {
                                    const userRef = doc(db, 'users', enseignantData.user_id);
                                    const userSnap = await getDoc(userRef);

                                    if (userSnap.exists()) {
                                        const userData = userSnap.data();
                                        enseignantNom = userData?.nom_user || 'Inconnu';
                                    }
                                }
                            }
                        } catch (e) {
                            console.warn('Erreur récupération enseignant:', e);
                        }
                    }

                    coursMap[docSnap.id] = {
                        nomCours: cours.design || 'Sans nom',
                        enseignant: enseignantNom,
                    };
                }
            }

            const coursIds = Object.keys(coursMap);
            if (coursIds.length === 0) {
                setEdtData([]);
                return;
            }

            const monthDates = getMonthDates(monthDate);
            const monthDateStrings = monthDates.map(date => formatDate(date));

            const edtSnap = await getDocs(collection(db, 'edt'));
            const edt = edtSnap.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(item =>
                    coursIds.includes(item.cours_id) &&
                    monthDateStrings.includes(item.date)
                )
                .map(item => ({
                    ...item,
                    nomCours: coursMap[item.cours_id]?.nomCours || 'Inconnu',
                    enseignant: coursMap[item.cours_id]?.enseignant || 'Inconnu',
                }));

            setEdtData(edt);
        } catch (error) {
            console.error('Erreur EDT :', error);
            Alert.alert('Erreur', 'Impossible de récupérer les données.');
        } finally {
            setLoading(false);
        }
    };

    //affiche la vue détaillée jour par jour avec les cours par créneau horaire.
    const renderDayView = () => {
        const selectedDateStr = formatDate(selectedDay);
        const dayData = edtData.filter(course => course.date === selectedDateStr);

        return (
            <View style={styles.dayView}>
                <Text style={styles.dayTitle}>
                    {getDayName(selectedDay)} {selectedDay.getDate()} {months[selectedDay.getMonth()]}
                </Text>

                <ScrollView style={styles.daySchedule}>
                    {timeSlots.map(slot => {
                        const courses = dayData.filter(course => isCourseInTimeSlot(course, slot));

                        return (
                            <View key={slot.id} style={styles.timeSlotRow}>
                                <View style={styles.timeSlotHeader}>
                                    <Text style={styles.timeSlotTime}>{slot.label}</Text>
                                </View>
                                <View style={styles.timeSlotContent}>
                                    {courses.length > 0 ? (
                                        courses.map(course => (
                                            <View key={course.id} style={styles.courseCardDay}>
                                                <Text style={styles.courseNameDay}>{course.nomCours}</Text>
                                                <Text style={styles.courseTimeDay}>
                                                    {course.heure_deb} à {course.heure_fin}
                                                </Text>
                                                <Text style={styles.courseDetailsDay}>
                                                    Enseignant: {course.enseignant}
                                                </Text>
                                                <Text style={styles.courseDetailsDay}>
                                                    salle:  {course.salle}
                                                </Text>

                                            </View>
                                        ))
                                    ) : (
                                        <View style={styles.emptySlot}>
                                            <Text style={styles.emptyText}>Pas de cours </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
        );
    };

    //affiche la vue mois avec tous les jours et indication du nombre de cours par jour.

    const renderMonthView = () => {
        const groupedData = groupCoursesByMonth(edtData);
        const monthDates = getMonthDates(currentDate);

        return (
            <ScrollView style={styles.monthView}>
                <View style={styles.monthGrid}>
                    {monthDates.map(date => {
                        const dateStr = formatDate(date);
                        const dayData = groupedData[dateStr];
                        const hasCourses = dayData && dayData.courses.length > 0;

                        return (
                            <TouchableOpacity
                                key={dateStr}
                                style={[
                                    styles.monthDay,
                                    isToday(date) && styles.todayDay,
                                    hasCourses && styles.dayWithCourses
                                ]}
                                onPress={() => {
                                    setSelectedDay(date);
                                    setViewMode('day');
                                }}
                            >
                                <Text style={[
                                    styles.monthDayText,
                                    isToday(date) && styles.todayDayText,
                                    hasCourses && styles.dayWithCoursesText
                                ]}>
                                    {date.getDate()}
                                </Text>
                                {hasCourses && (
                                    <View style={styles.courseIndicator}>
                                        <Text style={styles.courseCount}>
                                            {dayData.courses.length}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}> Mention: {mention} | Niveau: {niveau} | Parcours: {parcours}</Text>
            </View>

  

            <View style={styles.navigation}>
                <TouchableOpacity style={styles.navButton} onPress={() => navigateMonth(-1)}>
                    <Text style={styles.navButtonText}>‹</Text>
                </TouchableOpacity>

                <View style={styles.monthSelector}>
                    <Text style={styles.monthText}>
                        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </Text>
                    <TouchableOpacity
                        style={styles.viewToggle}
                        onPress={() => setViewMode(viewMode === 'month' ? 'day' : 'month')}
                    >
                        <Text style={styles.viewToggleText}>
                            {viewMode === 'month' ? 'Vue Jour' : 'Vue Mois'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.navButton} onPress={() => navigateMonth(1)}>
                    <Text style={styles.navButtonText}>›</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3aa8f6ff" />
                    <Text style={styles.loadingText}>Chargement...</Text>
                </View>
            ) : (
                viewMode === 'month' ? renderMonthView() : renderDayView()
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        backgroundColor: '#fff',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: "-35",
        color: '#1e293b',
        textAlign: 'center',
    },
    selectorContainer: {
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    selectorRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    selectorGroup: {
        flex: 1,
        marginHorizontal: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 8,
    },
    pickerContainer: {
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    picker: {
        height: 45,
    },
    loadButton: {
        backgroundColor: '#3aa8f6ff',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    disabled: {
        backgroundColor: '#94a3b8',
    },
    loadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    navigation: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3aa8f6ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    monthSelector: {
        alignItems: 'center',
    },
    monthText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 8,
    },
    viewToggle: {
        backgroundColor: '#64748b',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
    },
    viewToggleText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    monthView: {
        flex: 1,
        margin: 16,
    },
    monthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    monthDay: {
        width: width / 7 - 20,
        height: 60,
        margin: 2,
        borderRadius: 8,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    todayDay: {
        backgroundColor: '#3aa8f6ff',
    },
    dayWithCourses: {
        backgroundColor: '#dbeafe',
    },
    monthDayText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#475569',
    },
    todayDayText: {
        color: '#fff',
    },
    dayWithCoursesText: {
        color: '#3aa8f6ff',
    },
    courseIndicator: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#3aa8f6ff',
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    courseCount: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    dayView: {
        flex: 1,
        margin: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dayTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: 20,
    },
    daySchedule: {
        flex: 1,
    },
    timeSlotRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    timeSlotHeader: {
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeSlotTime: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    timeSlotContent: {
        flex: 1,
        marginLeft: 16,
    },
    courseCardDay: {
        backgroundColor: '#3aa8f6ff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    courseNameDay: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    courseDetailsDay: {
        fontSize: 12,
        color: '#bfdbfe',
        marginBottom: 2,
    },
    courseTimeDay: {
        fontSize: 11,
        color: '#bfdbfe',
    },
    emptySlot: {
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    emptyText: {
        fontSize: 14,
        color: '#94a3b8',
        fontStyle: 'italic',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#64748b',
    },

});

export default EmploiDuTempsScreen;