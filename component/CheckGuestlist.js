

      AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            // get at each store's key/value so you can work with it
            let key = store[i][0];
            let val = store[i][1];
           // Alert.alert('madhulika ::: '+key, key+'****'+val);
          });
        });
      });

      ListItem = (props) => {
        // Correct! There is no need to specify the key here:
        return <View><Text>{props.name}</Text></View>;
      }

      getUserDetails = (user) => {
        let gstDB = null;
        const guest = Guestlist().map((usrDB) => {
            return (usrDB.email === user.email || usrDB.altemail === user.email) ? usrDB : null
          });
          for(i=0;  i< guest.length; i++){
            if(guest[i] != null){
              gstDB = JSON.stringify(guest[i]);
              break;
            }
          }
        return gstDB;
      }


      storeSyncData = (db, value) => {
        AsyncStorage.setItem(db,value); // changed to object 
      }

      deleteDataonLogout = () => {
        AsyncStorage.getItem("calendarBlocked").then((value) => {
          if(value !== 'true'){
            AsyncStorage.getAllKeys((err, keys) => {
              AsyncStorage.multiRemove(keys, (err) => {
                console.log('Data removed'+ keys);
              });
            });
          }
        }).done();
      }


      componentDidMount(){
        AsyncStorage.getAllKeys((err, keys) => {
          AsyncStorage.multiGet(keys, (err, stores) => {
            stores.map((result, i, store) => {
              // get at each store's key/value so you can work with it
              let key = store[i][0];
              let value = store[i][1];
              if(key === 'GuestData')
                  this.setState({GuestData: JSON.parse(value)});
            });
          });
        });
      }