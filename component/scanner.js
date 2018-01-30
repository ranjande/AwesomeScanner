import React, { Component } from 'react';
import { AppRegistry, Dimensions,StyleSheet,Text, CheckBox, Image, ScrollView, TouchableHighlight,View,Alert,ActivityIndicator, BackAndroid, AsyncStorage } from 'react-native';
import Camera from 'react-native-camera';
import Guestlist from '../userDB/guestlist';
import renderElseIf from '../component/renderElseIf';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

export default class AwesomeScanner extends Component {

    constructor(props) {
      super(props);
      this.state = {
        CAMERADATA: null,
        entrantGuest: null,
        lastGuestData : null,
        _disable : true,

        guest_name : null,
        guest_email : null,
        guest_mobile : null,
        guest_id : null,
        guest_no_head: 0,
        _guestCount: 0,
      }
    }



    getUserDetailList = (gst_ids) => {

      AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            // get at each store's key/value so you can work with it
            let key = store[i][0];
            let value = JSON.parse(store[i][1]);
            if(gst_ids === key){
              this.setState({entrantGuest : value});
              this.setState({
                entrantGuest: Object.assign({}, this.state.entrantGuest, {
                  joining: true,
                }),
              });
              console.log(gst_ids, JSON.stringify(this.state.entrantGuest));
              AsyncStorage.setItem(gst_ids, JSON.stringify(this.state.entrantGuest));
            }
          });
        });
      });
    }

    componentDidMount(){

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
                   {/*<Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
                   <Image source={require('../userDB/camera.png')} style={styles.capture} onPress={this.takePicture.bind(this)} />*/}
                </Camera>
            </View>
            <View style={{width: 300, height: 280, borderWidth: 1, borderColor: 'red', backgroundColor: '#fffaf4'}}>
              <View style={{alignItems: 'center'}}>
                  <VerifyGuest GuestName={this.state.guest_name} GuestID={this.state.guest_id} isVerified={this.state._guestCount} />
                  <View style={{paddingTop: 5, paddingBottom: 5, marginBottom: 10, borderTopWidth: 2, marginLeft: 10, marginRight: 10, borderTopColor: 'red', height: 190}}>
                    <ScrollView>
                      <GuestDataList isVerified={this.state._guestCount} GuestID={this.state.guest_id} />
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
        _guestCount : this.state._guestCount+1,
      });
      this.getUserDetailList(Arr[3]);
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
    let chkd_or_not = props.check_chkd;
    const usrDB = props.GuestData;
    const gst_ids = usrDB.guest;

      AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            // get at each store's key/value so you can work with it
            let key = store[i][0];
            let StoreDB = JSON.parse(store[i][1]);
            chkd_or_not = StoreDB.joining;
            if(key === gst_ids){
              chkd_or_not = StoreDB.joining;
              return;
            }
            console.log(key+' ~~~~~ '+ chkd_or_not+ '~~~~~~~~~~ '+ StoreDB.joining);
          });
        });
      });
      return (
        <View style={{flexDirection:'row', paddingBottom: 10}}>
          <View style={{flexDirection: 'column', width: 250}}>
            {renderElseIf(usrDB.name === 'Ranjan De', 
              <Text style={{fontSize: 14, fontWeight: 'bold', color: 'green'}}>{usrDB.name} (Host)</Text>
             ,
              <Text style={{fontSize: 14, fontWeight: 'bold', color: 'blue'}}>{usrDB.name}</Text>
            )}
            <Text>{usrDB.mobile}</Text>
            <Text>{usrDB.email}</Text>
            <Text>Guest ID: {usrDB.guest} | Heads : {usrDB.no_head}</Text>
          </View>
          <View style={{flexDirection: 'column'}}>
            {renderElseIf((usrDB.guest === props.Guest_ID), //&& usrDB.name === props.gst_DBs.name
            <CheckBox value={true} disabled={true} />
            ,
            <CheckBox value={chkd_or_not} disabled={true} />
            )}
            {/*<CheckBox value={chkd_or_not} disabled={true} />*/}
          </View>
      </View>
      );
  }
  
  function GuestDataList(props) {
    const gid = props.GuestID;
    //const chkd = props.Check;
    const isVerified = parseInt(props.isVerified);
    const listItems = Guestlist().map((usrDB) => 
        <ListItem key={usrDB.guest} GuestData={usrDB} Guest_ID={gid} check_chkd={usrDB.joining}/>   // collecting Data from JSON file
    );
    return (
      <View>
        {listItems}
      </View>
    );
  }

  function GenuineGuest(props) {
    const GuestName = props.GuestName;
    return (
      <View style={styles.verified}>
          <Text style={{fontSize: 15, color: '#6b0b0b'}}>
              Welcome Guest <Text style={{fontSize: 18, fontWeight: 'bold', color: '#6b0b0b'}}>{GuestName}</Text>
          </Text>
          <View style={{flexDirection: 'row'}}>
              <Image source={require('../userDB/checkmark.gif')} style={{width: 60, height: 60, alignItems: 'center'}}/>
              <Text style={{fontSize: 25, fontWeight: 'bold', color: 'red', alignItems: 'center', padding: 15}}>VERIFIED!</Text>
          </View>
      </View>
    );  
  }

  function BadGuest(props){
    const isValid = props.isValid;
    return (
      <View style={styles.verified} style={{height: 100}}>
          <Text style={{fontSize: 15, color: 'red', textAlign: 'center'}}>Scan QR code to verify ..</Text>
      </View>
    );
  }

  function VerifyGuest(props) {
    const GuestName = props.GuestName;
    const GuestID = props.GuestID;
    const isVerified = parseInt(props.isVerified);
    const valid = false;
    return (
      <View>
        {renderElseIf(isVerified > 0, 
          <GenuineGuest GuestName={GuestName} />
        ,
          <BadGuest isValid={valid} />
        )}
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
     /* backgroundColor: '#fd9616',*/
      borderRadius: 5,
      fontWeight: 'bold',
      color: '#000',
      padding: 5,
      margin: 10,
      width: 90, 
      height: 90, 
      alignItems: 'center'
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    verified: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  });
  