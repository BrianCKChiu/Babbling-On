import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  body: TextStyle;
}

interface DescriptionSectionProps {
  bodyText: string;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ bodyText }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Description</Text>
      <Text style={styles.body}>{bodyText}</Text>
    </View>
  );
};

const styles = StyleSheet.create<Styles>({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingTop: 35,
    paddingRight: 20,
    textAlign: 'left',
  },
  body: {
    fontSize: 16,
    paddingTop: 20,
    paddingRight: 20,
    textAlign: 'left',
    marginBottom: '10%',
  },
});

export default DescriptionSection;
