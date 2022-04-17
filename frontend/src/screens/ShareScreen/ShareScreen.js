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
  Button,
} from "react-native";
import { Divider, List, ListItem } from "@ui-kitten/components";
import {
  ApplicationProvider,
  Layout,
  Icon,
  
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { TouchableOpacity,ToastAndroid,Image } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import url from "../url";
import { Row } from "native-base";






export default function ShareScreen(props) {
  const [modalVisib, setModalVisib] = useState(false);
  const [currentNe, setCurrentNe] = useState(null);
  const [data4,setdata4]=useState([]);
  const isFocused = useIsFocused();
  const [like,setlike] = useState({l: 'Like'})
  const handleModal = (n) => {
    setModalVisib(true);
    setCurrentNe(n);
  };

  function fetchNews(){
      console.log(props.user.username+" "+"hell");

      axios.get('http://'+url+'/getalllikedarticles/'+props.user.username)
  .then(function (response) {
    if(response.data.message==="success"){
        console.log(response.data.arr);
        let a=[];
        for(let i=0;i<response.data.arr.length;i++){
            console.log("hello world");
           
            a.push(response.data.arr[i].title);

            console.log(a);
            
            
        }


        axios.get('http://'+url+'/getallsharedarticles')
        .then(function (res) {
          if(res.data.message==="success"){
              console.log(res.data.arr);
              let ary=[];
              for(let i=0;i<res.data.arr.length;i++){
                  console.log("hello world");
                  let obj={...res.data.arr[i],key:i};
                  console.log(obj);
                  if(a.includes(obj.title)){
                    obj.isliked=true;
                  }
                  else{
                    obj.isliked=false;
                  }
                  ary.push(obj);
                  
                  
              }
              console.log(ary);
              setdata4(ary);
      
          }
          else{
              ToastAndroid.show("Something went wrong ... Try Again",5000);
          }
          
      
        })
        .catch(function (err) {
          ToastAndroid.show("Something went wrong ... Try Again",5000);
        })



       

    }
    else{
        ToastAndroid.show("Something went wrong ... Try Again",5000);
    }
    

  })
  .catch(function (error) {
    ToastAndroid.show("Something went wrong ... Try Again",5000);
  })








      

  }



  function sendliked(obj){

    if(obj.isliked===false){
    delete obj.isliked;


    console.log(obj,props.user.username);
    axios.post('http://'+url+'/savelikedarticle', {
        username:props.user.username,
        article:obj
      })
      .then(function (response) {
        if(response.data.message==="error"){
          ToastAndroid.show("Something went wrong ... Try Again",5000);
        }
        else{
          if(response.data.message==="success"){
           fetchNews();
         
          }
          
        }
         
      })
      .catch(function (error) {
        console.log(error);
        ToastAndroid.show("Something went wrong ... Try Again",5000);
      });

    }

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
            <SingleNews item={currentNe} user={{username:props.user.username}}/>
          </View>
        </Modal>


      <Text style={{fontSize:20,marginLeft:5,marginBottom:5,marginTop:10}} >
        SHARED ARTICLES
      </Text>
      <ScrollView style={{backgroundColor:"white"}}>
        <View>
          {data4.map((item) => {
            return (
              <TouchableOpacity 
              key={item.key}
              activeOpacity={0.7}
                    onPress={() => {handleModal(item)}}
                    style={styles.cardView}
              >
              <View style={{flex:1,flexDirection:"column",margin:5,}}>
                  <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Image style={{height:"100%",width:"100%",borderTopLeftRadius: 10,borderTopRightRadius: 10}}  source={{ uri: item.urlToImage }}
              /></View>
              <View style={{flex:0.5,alignItems:"center",justifyContent:"center"}}>
                      <Text style={styles.item}>{item.title}</Text>
                </View>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1,paddingHorizontal: 10}}><Button title={item.isliked?"LIKED":"LIKE"} onPress={() => {
                  sendliked(item);

                }} ></Button>
                </View>
                <View style={{flex: 1,alignItems:"center",justifyContent:"center",borderWidth:2,borderRadius:10}}><Text>Likes : {item.likescount}</Text>
                </View>
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
    padding: 10,
    fontSize: 15,
    marginTop: 5,
  },
  cardView: {
    borderWidth:2,
    borderRadius:15,
    padding:10,
    margin: 10,
    width: "90%",
    height: 450,
    marginBottom: 30,
    flex: 1,
  },
  item2: {
   
    padding: 10,
    fontSize: 15,
    marginTop: 5,
  }
});