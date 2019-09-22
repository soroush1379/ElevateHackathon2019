import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Button, Text } from 'native-base';
import { Auth } from 'aws-amplify';

export default function LinksScreen() {
  let logout = (
    <Button onPress={() => {
      Auth.signOut().then(res => {
        console.log(res)
      })
    }}
    
    style={{margin:10}}>
      <Text>Sign out</Text>

    </Button>
  )

  return (
    <ScrollView style={styles.container}>
      {/**
       * Go ahead and delete ExpoLinksView and replace it with your content;
       * we just wanted to provide you with some helpful links.
       */}
      <ExpoLinksView />
      {logout}
    </ScrollView>
  );
}

LinksScreen.navigationOptions = {
  title: 'Links',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
