import React, { Component } from 'react';
import { AppRegistry, Dimensions,StyleSheet,Text, CheckBox, Image, ScrollView, TouchableHighlight,View,Alert,ActivityIndicator, BackAndroid, AsyncStorage } from 'react-native';
import Camera from 'react-native-camera';
import Guestlist from '../userDB/guestlist';
import renderElseIf from '../component/renderElseIf';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const guestData = [];
export default class AwesomeScanner extends Component {

    constructor(props) {
      super(props);
      this.state = {
        CAMERADATA: null,
        FulllGuestData: null,
        lastGuestData : null,
        _disable : true,

        guest_name : null,
        guest_email : null,
        guest_mobile : null,
        guest_id : null,
        guest_no_head: 0,
        _joining : false,
      }
    }



    getUserDetailList = () => {
      AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            // get at each store's key/value so you can work with it
            let key = store[i][0];
            let value = JSON.parse(store[i][1]);
            ///Alert.alert(key, value.name);
            this.setState({FulllGuestData : value.name});
          });
        });
      });
    }


    componentDidMount(){
      this.getUserDetailList();

    }
    render() {
      return (
        <View style={{alignItems: 'center', flex:1}}>
            <View style={{width: 350, height: 300, alignItems: 'center', padingLeft: 10, paddingTop: 15, paddingBottom: 5}}>
                <Camera
                    ref={(cam) => {
                    this.camera = cam;
                    }}
                    onBarCodeRead={this.onBarCodeRead.bind(this)}
                    flashMode={Camera.constants.FlashMode.auto}
                    torchMode={Camera.constants.TorchMode.auto}
                    style={styles.preview}
                    barCodeTypes={[Camera.constants.BarCodeType.qr]}
                    aspect={Camera.constants.Aspect.fill}>
                   {/*<Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>*/}
                </Camera>
            </View>
            <View style={{width: 300, height: 280, borderWidth: 1, borderColor: 'red', backgroundColor: '#fffaf4'}}>
              <View style={{textAlign: 'center'}}>
                  <Text style={{fontSize: 15, color: '#6b0b0b'}}>
                      Welcome Guest <Text style={{fontSize: 18, fontWeight: 'bold', color: '#6b0b0b'}}>{this.state.guest_name}</Text>
                  </Text>
                  <Image source={require('../userDB/checkmark.gif')} style={{width: 60, height: 60, alignItems: 'center'}}/>
                  
                  <View style={{paddingTop: 5, paddingBottom: 5, marginBottom: 10, borderTopWidth: 2, marginLeft: 10, marginRight: 10, borderTopColor: 'red', height: 190}}>
                    <ScrollView>
                      <GuestDataList Disable={this.state._disable} Check={this.state._joining}/>
                    </ScrollView>
                  </View> 
              </View>
            </View>
        </View>
      );
    }
  
    onBarCodeRead(e) {
      let camtype = e.type;
      let camdata = e.data;
      let Arr = new Array();
      if(camdata.indexOf('|') != -1) 
        Arr = camdata.split('|');

      this.setState({
        CAMERADATA: camdata, 
        lastGuestData: Arr.toString(),
        guest_name : Arr[0],
        guest_email : Arr[1],
        guest_mobile : Arr[2],
        guest_id : Arr[3],
        guest_no_head: Arr[4],
      });


    }
  
    takePicture() {
      const options = {};
      //options.location = ...
      this.camera.capture({metadata: options})
        .then((data) => console.log(data))
        .catch(err => console.error(err));
    }
  }


  function ListItem(props) {
      return (
        <View style={{flexDirection:'row', paddingBottom: 10}}>
          <View style={{flexDirection: 'column', width: 250}}>
            {renderElseIf(props.GuestData.name === 'Ranjan De', 
              <Text style={{fontSize: 12, fontWeight: 'bold', color: 'green'}}>{props.GuestData.name} (Host)</Text>
             ,
              <Text style={{fontSize: 12, fontWeight: 'bold', color: 'blue'}}>{props.GuestData.name}</Text>
            )}
            <Text>{props.GuestData.mobile}</Text>
            <Text>{props.GuestData.email}</Text>
            <Text>Guest ID: {props.GuestData.guest} | Heads : {props.GuestData.no_head}</Text>
          </View>
          <View style={{flexDirection: 'column'}}>
            <CheckBox value={props.check_chkd} disabled={props.check_dis} onValueChange={() => Alert.alert('Value changed')}/>
          </View>
      </View>
      );
  }
  
  function GuestDataList(props) {
    const dsbld = props.Disable;
    const chkd = props.Check;
    const listItems = Guestlist().map((usrDB) =>
      // Correct! Key should be specified inside the array.
      <ListItem key={usrDB.guest}
                GuestData={usrDB} check_dis={dsbld} check_chkd={chkd}/>
  
    );
    return (
      <View>
        {listItems}
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
      borderWidth: 5,
      borderColor: 'red'
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: 300,
      height: 320,
    },
    capture: {
      flex: 0,
      backgroundColor: '#fd9616',
      borderRadius: 5,
      fontWeight: 'bold',
      color: '#000',
      padding: 10,
      margin: 25,
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  });
  