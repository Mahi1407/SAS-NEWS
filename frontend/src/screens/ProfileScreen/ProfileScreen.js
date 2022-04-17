import React, {useState, useEffect, useContext} from 'react';
import 'react-native-gesture-handler';
import { ApplicationProvider } from '@ui-kitten/components';
import { NativeBaseProvider,  Box ,Input,Icon,Button,Center } from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";
import * as eva from '@eva-design/eva';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  TextInput,
  Alert,
  ToastAndroid
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { useIsFocused } from '@react-navigation/native';

import TextAvatar from "react-native-text-avatar";
import {
  Avatar,
  Title,
  Caption,
  TouchableRipple,
} from 'react-native-paper';
import axios from 'axios';
import url from '../url.js';




function ProfileScreen(props){
    const isFocused=useIsFocused();
    
  const [abc,setabc] = React.useState({booo: false ,})
  const [tempUser, setTempUser] = React.useState(props.user.username);
  const [user,setuser]=React.useState(props.user.username);
  const [email,setemail]=React.useState("");
  const [show,setshow]=React.useState(false);
  const [show1,setshow1]=React.useState(false);
  const [show2,setshow2]=React.useState(true);
  const [newpass,setnewpass]=React.useState({np: ""});
  const [confirmpass,setconfirmpass]=React.useState({cp: ""});
  const [mahi,setmahi]=React.useState({b : false})
  const onPressHandler =() =>{
      if(newpass.np==confirmpass.cp && newpass.np!=""){


        axios.post('http://'+url+'/changepasswordfrominside', {
            username:props.user.username,
            password:newpass.np,
          })
          .then(function (response) {
            if(response.data.message==="success"){
                ToastAndroid.showWithGravity("Password updated successfully",4000,ToastAndroid.BOTTOM);
                setshow(false)
                setmahi({b: true})  
            }
            else{
                ToastAndroid.showWithGravity("Something went wrong ... Try Again",4000,ToastAndroid.BOTTOM); 
            }
          })
          .catch(function (error) {
            ToastAndroid.showWithGravity("Something went wrong ... Try Again",4000,ToastAndroid.BOTTOM); 
          });
      




       
      }else if(newpass.np!=""){
        ToastAndroid.showWithGravity("Passwords doesn't match",4000,ToastAndroid.BOTTOM);  
      }
  }

  function getmail(){
    axios.get('http://'+url+'/getuseremail/'+props.user.username)
    .then(function (response) {
        if(response.data.message=="success"){
            setemail(response.data.email);
        }
        else{
         getmail();
        }
    })
    .catch(function (error) {
        getmail();
    });
  }
  function setfirst(){
    setabc({booo:false});
    setTempUser(user);
    setshow(false);setnewpass({np:""});setconfirmpass({cp:""});setmahi({b:false});
  }
  useEffect(()=>{
      if(isFocused){
   getmail();
        setfirst();
      }
  
  },[isFocused]);

  function logout(){
         props.save("isLoggedIn","false");
       props.save("user","");
         props.logout();
       }
    


    function changeusername(){
        if(user!=tempUser|| mahi.b){
            axios.post('http://'+url+'/changeusername', {
            prev_username:user,
            new_username:tempUser,
          })
          .then(function (response) {
            if(response.data.message==="success"){
                ToastAndroid.showWithGravity("Profile updated successfully",4000,ToastAndroid.BOTTOM);
                props.exec({isSignedIn:true,username:tempUser});
                setuser(tempUser);
      
               
                
            }
            else{
                if(response.data.message==="taken"){
                    ToastAndroid.showWithGravity("Username already taken",4000,ToastAndroid.BOTTOM); 
                }
                else{
                ToastAndroid.showWithGravity("Something went wrong ... Try Again",4000,ToastAndroid.BOTTOM); 
                }
            }
          })
          .catch(function (error) {
            ToastAndroid.showWithGravity("Something went wrong ... Try Again",4000,ToastAndroid.BOTTOM); 
          });
           
          }
    }


  return(

    <ScrollView style={{ backgroundColor: '#fff',}}>
        
      <SafeAreaView style={show1?[styles.body,{marginTop:100}]:[styles.body,{marginTop:200}]}>
       
        <TextAvatar
        backgroundColor={'#0000ff'}
        textColor={'#fff'}
        size={80}
        type={'circle'} // optional
        >{user}</TextAvatar>
        <Text style={styles.userName}>{user}</Text>
        <Text style={styles.aboutUser}>{email}</Text>
        <View style={styles.userBtnWrapper}>
                <TouchableOpacity
                      style={styles.userBtn}
                      onPress={() => {
                            setshow1(true);

                      }}>
                    <Text style={styles.userBtnTxt}>EditProfile</Text>
                </TouchableOpacity>
                <TouchableOpacity 
				style={styles.userBtn}
				onPress={() => {
                            Alert.alert('','Are you sure you want to logout?',[{text: 'Yes',onPress: () => {logout()}},{text: 'No'}])

                      }}
				>
                  <Text style={styles.userBtnTxt}>Logout</Text>
                </TouchableOpacity>
        </View>

      </SafeAreaView>
    
      {show1==true ?
      <>
    <View style={[styles.aaaa,{backgroundColor:"white"}]}>
          <View style={styles.container}>
                <View style={{flex:3}}>
                <Input  w={{
                  base: "95%",
                  md: "25%"
                }} editable={abc.booo}  InputLeftElement={<Icon as={<MaterialIcons name="person" />}  size={5} ml="2" color="blue.700" />} value={tempUser} onChangeText={nextValue => setTempUser(nextValue)} />
            </View>

            <View style={{flex:1}}>
              <Box style={{width:"100%",marginTop:3.5, height: 40}}>
                  <Button  onPress={() => { 
                    setabc({booo: true})
                  }
                }>Edit</Button>
              </Box>
            </View>
        </View>
          <View style={styles.container}>
            <View style={{flex:1}}>
                <Input  w={{
                  base: "100%",
                  md: "25%"
                }} editable={false}  value={email} />
            </View>
          </View>
          {show==true?
          <>
              <View style={styles.container}>
                <View style={{flex:1}}>
                    <Input  w={{
                      base: "100%",
                      md: "25%"
                    }} editable={true} placeholder="New Password" value={newpass.np} onChangeText={nextValue => setnewpass({np: nextValue})} />
                </View>
              </View>
              <View style={styles.container}>
                <View style={{flex:1}}>
                    <Input  w={{
                      base: "100%",
                      md: "25%"
                    }} editable={true} placeholder="Confirm Pasword" value={confirmpass.cp} onChangeText={nextValue => setconfirmpass({cp: nextValue})}/>
                </View>
              </View>
              <View style={styles.aaab}>
                        <View style={{flex:1,marginLeft:10}}>
                            <Box style={{width:"100%"}}>
                                <Button onPress={onPressHandler}>Update Password</Button>
                            </Box>
                        </View>
                        <View style={{flex:1,marginLeft:40}}>
                              <Box style={{width:"100%"}}>
                                  <Button onPress={() => { 
                                    setshow(false);
                                  }
                                }>Back</Button>
                              </Box>
                        </View>
               </View>
            </>:
            <>
            <View style= {styles.aaab}>
                <View style={{flex:1,marginRight: 10,marginLeft: 10}}>
                    <Box style={{width:"100%"}}>
                        <Button onPress={() => { 
                          setshow(true)
                        }
                      }>Change Password</Button>
                    </Box>
                </View>
                <View style={{flex:1,marginLeft: 10,marginRight: 10}}>
                    <Box style={{width:"100%"}}>
                        <Button onPress={() => { 
                            setshow1(false)
                          }
                        }
                      >Back</Button>
                    </Box>
                </View>
                </View>
            </>
          }
        <View style={{flex:3}}></View>
        <View style={{flex:1,margin: 10,marginTop: 30}}>
                    <Box style={{width:"100%"}}>
                        <Button onPress={() => { 
                         changeusername()
                        }
                      }>Save</Button>
                    </Box>
        </View>
                
                <View style={{flex:1}}></View>
        <View></View>
    </View>
    </>:
    <>

    </>
  }
  </ScrollView>

 
  
  )
}
 

 
 const styles = StyleSheet.create({
   input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    margin: 0,
  },
   aaaa: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#fff',
   },
   aaab: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: '#fff',
   },
   body: {
     flex: 1,
     backgroundColor: '#fff',
     alignItems: 'center',
     justifyContent: 'center',
   },
   text: {
     color: '#ffffff',
     fontSize: 20,
     fontStyle:'italic',
     margin: 10,
   },
   container: {
    flex: 1,
    margin: 10,
    flexDirection: "row",
    backgroundColor: '#fff',
    
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#2e64e5',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#2e64e5',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
 });
 
 export default ProfileScreen;