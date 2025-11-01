import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface NextPageButtonProps {
  text: string;
  onPress: () => void;
}

const NextPageButton: React.FC<NextPageButtonProps> = ({ text, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "80%",
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center', 
    flexDirection: 'row',
    padding: "10%",
    paddingVertical: "5%",
    margin: '7%',
    marginBottom: '10%',
    marginTop: '10%',
    backgroundColor: '#FFED4B',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold'
  },
});

export default NextPageButton;
