import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CustomButtonProps {
  text: string;
  buttonColor: string;
  onPress: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, buttonColor, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: buttonColor }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '90%',
    height: '10%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center', 
    margin:'5%',
    marginBottom:0,
    marginTop: '5%',
    borderWidth:1,
    borderColor:'#D8D8D8',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold'
  },
});

export default CustomButton;
