import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView,ToastAndroid} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import { useEffect } from 'react';
import axios from 'axios';
import url from '../url.js';

const NewPasswordScreen = (props) => {
  const {control, handleSubmit} = useForm();
  const [details,setdetails]=useState({
    ...props.route.params,
    otp:null
  });


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
    
    ToastAndroid.show("OTP have been sent to "+s,5000);
    axios.get('http://'+url+'/sendotp/'+details.email)
    .then(function (response) {
      if(response.data.is_success===false){
        ToastAndroid.show(response.data.message,5000);
      }
      else{
      setdetails({...details,otp:response.data.message});
      }
      console.log(response.data.message);
    })
    .catch(function (error) {
      ToastAndroid.show("Something went wrong",3000);
    });
  }
  useEffect(()=>{
   
      getcodefrombackend();
  },[])

  const navigation = useNavigation();

  const onSubmitPressed = data => {
    console.log(data.otp +" "+ details.otp);
    if(data.otp!=details.otp){
      ToastAndroid.show("Incorrect OTP",5000);
    }
    else{
      axios.post('http://'+url+'/changepassword', {
        username: details.username,
        password: data.password,
     
      })
      .then(function (response) {
        if(response.data.message==="success"){
          ToastAndroid.show("Password Updated Successfully",4000);
          navigation.navigate("SignIn");
        }
        else{
          ToastAndroid.show("Something went wrong ... Click On Resend OTP",5000);
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
        <Text style={styles.title}>Reset your password</Text>

        <CustomInput
          placeholder="OTP"
          name="otp"
          control={control}
          rules={{required: 'OTP is required'}}
        />

        <CustomInput
          placeholder="Enter your new password"
          name="password"
          control={control}
          secureTextEntry
          rules={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password should be at least 8 characters long',
            },
          }}
        />

        <CustomButton text="Submit" onPress={handleSubmit(onSubmitPressed)} />
        <CustomButton
          text="Resend OTP"
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

export default NewPasswordScreen;
