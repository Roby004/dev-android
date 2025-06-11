import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Menu, Provider } from 'react-native-paper';

const ClasseDropdown = () => {
  const [visible, setVisible] = useState(false);
  const [selectedClasse, setSelectedClasse] = useState('M1');

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (value: React.SetStateAction<string>) => {
    setSelectedClasse(value);
    closeMenu();
  };

  return (
    <Provider >
     
   
  <Menu
  visible={visible}
  onDismiss={closeMenu}
  anchor={
    <Button
      onPress={openMenu}
      style={{
        width: 140,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        backgroundColor: '#fff',
      }}
    >
      Classe: {selectedClasse}
    </Button>
  }
>
  {['M1', 'L1', 'L2', 'L3', 'M2'].map(value => (
    <Menu.Item key={value} onPress={() => handleSelect(value)} title={value} style={{zIndex:100}}/>
  ))}
</Menu>

  
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
   
    
  
   
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ClasseDropdown;
