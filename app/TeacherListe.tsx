import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, FAB, Menu, Provider, Text } from 'react-native-paper';

type Student = {
  id: string;
  matricule: string;
  nom: string;
};

const students: Student[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `${i + 1}`,
  matricule: '1243H-F',
  nom: 'RAVAOSOLO Jeande dieu',
}));

const TeacherListe = () => {
  const [visible, setVisible] = useState(false);
  const [selectedClasse, setSelectedClasse] = useState('M1');

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const handleSelect = (value: string) => {
    setSelectedClasse(value);
    closeMenu();
  };

  return (
    <Provider>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Liste des étudiants</Text>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Button mode="outlined" onPress={openMenu} style={styles.dropdown}>
                {selectedClasse}
              </Button>
            }
          >
            {['L1', 'L2', 'L3', 'M1', 'M2'].map(classe => (
              <Menu.Item key={classe} onPress={() => handleSelect(classe)} title={classe} />
            ))}
          </Menu>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.headerCell]}>matricule</Text>
          <Text style={[styles.cell, styles.headerCell]}>Noms</Text>
        </View>

        {/* Student Rows */}
        <ScrollView>
          {students.map(student => (
            <View key={student.id} style={styles.row}>
              <Text style={styles.cell}>{student.matricule}</Text>
              <Text style={styles.cell}>{student.nom}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Download FAB */}
        <FAB icon="download" style={styles.fab} onPress={() => {}} />
      </View>
    </Provider>
  );
};

export default TeacherListe;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdown: {
    borderRadius: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  cell: {
    flex: 1,
    fontSize: 14,
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#555',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    backgroundColor: '#00bfa5',
  },
});
