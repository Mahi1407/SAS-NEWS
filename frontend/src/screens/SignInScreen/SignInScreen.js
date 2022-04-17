import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TextInput,
} from 'react-native';
import Logo from '../../../assets/images/pic.png';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import axios from 'axios';
import url from '../url.js';
import { ToastAndroid } from 'react-native';
const SignInScreen = (props) => {
  const {height} = useWindowDimensions();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const onSignInPressed = data => {
    console.log("On sign in pressed ... Clicked");
    console.log(data);
    axios.post('http://'+url+'/find_user', {
      username: data.username,
      password: data.password,
   
    })
    .then(function (response) {
      if(response.data.message==="found"){
     props.save("isLoggedIn","true");
        props.save("user",data.username);
        
        props.exec({isSignedIn:true,username:data.username});
      }
      else{
        if(response.data.message==="notfound"){
        ToastAndroid.show("Incorrect Username or Password ",5000);
        }
        else{
          ToastAndroid.show("Something went wrong ",5000);
        }
      }
    })
    .catch(function (error) {
      console.log(error);
      ToastAndroid.show("Something went wrong   ",5000);
    });
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Image
          source={Logo}
          style={[styles.logo, {height: height * 0.6}]}
          resizeMode="contain"
        />

        <CustomInput
          name="username"
          placeholder="Username"
          control={control}
          rules={{required: 'Username is required'}}
        />

        <CustomInput
          name="password"
          placeholder="Password"
          secureTextEntry
          control={control}
          rules={{
            required: 'Password is required',
          
          }}
        />

        <CustomButton text="Sign In" onPress={handleSubmit(onSignInPressed)} />

        <CustomButton
          text="Forgot password?"
          onPress={onForgotPasswordPressed}
          type="TERTIARY"
        />

 

        <CustomButton
          text="Don't have an account? Create one"
          onPress={onSignUpPress}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex:1,
    justifyContent:'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 100,
  },
});

export default SignInScreen;
