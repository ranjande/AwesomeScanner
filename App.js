/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, Dimensions, StyleSheet, Text, View, Alert, ActivityIndicator, BackAndroid, AsyncStorage, ScrollView } from 'react-native';

import AwesomeScanner from './component/scanner';
import Guestlist from './userDB/guestlist';


export default class App extends Component<{}> {

  componentDidMount(){

    setUserDB = () => {
        AsyncStorage.getAllKeys((err, keys) => {
          //alert('Test Database length: '+keys.length)
          if(keys.length == 0){
            const guest = Guestlist().map((usrDB) => {
                AsyncStorage.setItem(usrDB.guest, JSON.stringify(usrDB));
              });
          }
      });
    }
    setUserDB();
  }


  render() {
    return (
        <View style={styles.container}>
            <AwesomeScanner />
        </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderWidth: 15,
    borderColor: 'red'
  }
});
