import { StatusBar } from "expo-status-bar";
import React, { useState, useContext,useEffect } from "react";
import SingleNews from './SingleNews';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  TextInput,
  Card,
  SectionList,
  FlatList,
} from "react-native";
import { Divider, List, ListItem } from "@ui-kitten/components";
import {
  ApplicationProvider,
  Layout,
  Icon,
  Button,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { TouchableOpacity,ToastAndroid,Image } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import url from "../url";






export default function FavouritesScreen(props) {
  const [modalVisib, setModalVisib] = useState(false);
  const [currentNe, setCurrentNe] = useState(null);
  const [data4,setdata4]=useState([]);
  const isFocused = useIsFocused();
  const handle = (n) => {
    setModalVisib(true);
    setCurrentNe(n);
  };

  function fetchNews(){
      console.log(props.user.username+" "+"hell");
      axios.get('http://'+url+'/getallsavedarticles/'+props.user.username)
  .then(function (response) {
    if(response.data.message==="success"){
        console.log(response.data.arr);
        let a=[];
        for(let i=0;i<response.data.arr.length;i++){
            console.log("hello world");
            let obj={...response.data.arr[i],key:i};
            console.log(obj);
            a.push(obj);
            
            
        }
        console.log(a);
        setdata4(a);
        setModalVisib(false);

    }
    else{
        ToastAndroid.show("Something went wrong ... Try Again",5000);
    }
    

  })
  .catch(function (error) {
    ToastAndroid.show("Something went wrong ... Try Again",5000);
  })
  }
  useEffect(() => {
        
        
    if(isFocused){ 
       fetchNews();
    }
}, [isFocused]);
console.log(data4);
  return (
    
    <View style={[styles.container,{backgroundColor:"white"}]}>

        <Modal animationType='slide'
          transparent={true}
          visible={modalVisib}
          onRequestClose={() => {
            setModalVisib(!modalVisib);
          }}
        >

          <View style={{ height: "100%", transform: [{ scaleY: -1 }] }}>
            <SingleNews item={currentNe} user={{username:props.user.username}} func={fetchNews}/>
          </View>
        </Modal>


      <Text style={{fontSize:20,marginLeft:5,marginBottom:5,marginTop:10}} >
        SAVED ARTICLES
      </Text>
      <ScrollView style={{backgroundColor:"white"}}>
        <View>
          {data4.map((item) => {
            return (
              <TouchableOpacity style={{backgroundColor:"white"}}
              key={item.key}
              onPress={() => {handle(item)}}
              >
              <View style={{flex:1,flexDirection:"row",margin:5,}}>
                  <View style={{flex:4,marginBottom:2,alignItems:"center",justifyContent:"center"}}><Image style={{height:"80%",width:"100%"}}  source={{ uri: item.urlToImage }}
         /></View>
         <View style={{flex:10,alignItems:"center",justifyContent:"center"}}>
                <Text style={styles.item}>{item.title}</Text>
                </View>
              </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft:5,
    marginRight:5,
    flex: 1,
  },
  item: {
    backgroundColor: 'white',
    fontWeight: "bold",
    borderBottomWidth:2,
    padding: 10,
    fontSize: 15,
    marginTop: 5,
  },
  item2: {
   
    padding: 10,
    fontSize: 15,
    marginTop: 5,
  }
});