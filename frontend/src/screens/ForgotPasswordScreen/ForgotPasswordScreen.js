import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView,ToastAndroid} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/core';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import url from '../url.js';
const ForgotPasswordScreen = () => {
  const {control, handleSubmit} = useForm();
  const navigation = useNavigation();

  const onSendPressed = data => {
    console.log("hi");
    axios.post('http://'+url+'/find_user_for_pwch', {
      username: data.username,

   
    })
    .then(function (response) {
      if(response.data.message==="error"){
        ToastAndroid.show("Something went wrong ... Try Again",5000);
      }
      else{
        if(response.data.message==="found"){
          navigation.navigate("NewPassword",{email:response.data.email,username:data.username});
        }
        else{
          ToastAndroid.show("Invalid Username",3000);
        }
      }
       
    })
    .catch(function (error) {
      console.log(error);
      ToastAndroid.show("Something went wrong ... Try Again",5000);
    });
   
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.main}>
      <View style={styles.root}>
        <Text style={styles.title}>Reset your password</Text>

        <CustomInput
          name="username"
          control={control}
          placeholder="Username"
          rules={{
            required: 'Username is required',
          }}
        />

        <CustomButton text="Send" onPress={handleSubmit(onSendPressed)} />

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

export default ForgotPasswordScreen;
