import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface Styles {
  header: ViewStyle;
  headerText: TextStyle & { fontSize: number };
}

interface SAHeaderSectionProps {
  text: string;
  fontSize?: number;
}

const SAHeaderSection: React.FC<SAHeaderSectionProps> = ({ text, fontSize = 24 }) => {
  const dynamicStyles = StyleSheet.create<Styles>({
    header: {
      backgroundColor: '#FFE874',
      height: '35%',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
      paddingLeft: 25,
      paddingBottom: 15,
    },
    headerText: {
      fontSize,
      fontWeight: 'bold',
      color: 'black',
    },
  });

  return (
    <View style={dynamicStyles.header}>
      <Text style={dynamicStyles.headerText}>{text}</Text>
    </View>
  );
};

export default SAHeaderSection;
