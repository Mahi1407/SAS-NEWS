import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/core';
import {useForm} from 'react-hook-form';
import {useEffect } from 'react';
import axios from 'axios';
import { ToastAndroid } from 'react-native';
import url from '../url.js';

const ConfirmEmailScreen = (props) => {
  const {control, handleSubmit} = useForm();
  const [details,setdetails]=useState({...props.route.params,
  code:null});
    function getcodefrombackend(){
      let em=details.email;
      let s="";
      let found=false;
      for(let i=0;i<em.length;i++){
        if(i>=3 && em.charAt(i)!='@' && found==false ){
          s=s+'*';
          
        }
        else{
          if(em.charAt(i)=='@'){
            found=true;
          }
            s=s+em.charAt(i);
         
        }
      }
      
      ToastAndroid.show("Confirmation code have been sent to "+s,5000);
      axios.get('http://'+url+'/generateemailconfirmationcode/'+details.email)
      .then(function (response) {
        if(response.data.is_success===false){
          ToastAndroid.show(response.data.message,5000);
        }
        else{
        setdetails({...details,code:response.data.message});
        }
        console.log(response.data.message);
      })
      .catch(function (error) {
        ToastAndroid.show("Something went wrong",3000);
      });
    }
  useEffect(()=>{
   
    getcodefrombackend();
    
  },[]);

  console.log(details);

  const navigation = useNavigation();

  const onConfirmPressed = data => {
    console.log(data.code +" "+ details.code);
    if(data.code!=details.code){
      ToastAndroid.show("Incorrect Confirmation Code",5000);
    }
    else{
      axios.post('http://'+url+'/registeruser', {
        username: details.username,
        password: details.password,
        email : details.email,
      })
      .then(function (response) {
        if(response.data.message==="success"){
          props.save("isLoggedIn","true");
          props.save("user",details.username);
          ToastAndroid.show("Registration Successful",4000);
          props.exec({isSignedIn:true,username:details.username});
        }
        else{
          ToastAndroid.show("Something went wrong",5000);
        }
      })
      .catch(function (error) {
        ToastAndroid.show("Something went wrong",5000);
      });
    }


  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  const onResendPress = () => {
    getcodefrombackend();
  };

  return (
    <View style={styles.main}>
      <View style={styles.root}>
        <Text style={styles.title}>Confirm your email</Text>

        <CustomInput
          name="code"
          control={control}
          placeholder="Enter your confirmation code"
          rules={{
            required: 'Confirmation code is required',
          }}
        />

        <CustomButton text="Confirm" onPress={handleSubmit(onConfirmPressed)} />

        <CustomButton
          text="Resend code"
          onPress={onResendPress}
          type="SECONDARY"
        />

        <CustomButton
          text="Back to Sign in"
          onPress={onSignInPress}
          type="TERTIARY"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main:{
    flex:1,
    justifyContent:'center',
  },
  root: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
});

export default ConfirmEmailScreen;
