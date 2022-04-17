


import { StatusBar } from "expo-status-bar";
import React, { useState, useContext } from "react";
import SingleNews from './SingleNews';

import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";

import Context from "./Context";
import { categories } from "./api";
import Carousel from "react-native-snap-carousel";
import { NewsContext } from "./Context";




import Searchb from "./Searchb";



function SingleArticle({ route }) {
  const { title, content, sourcej } = route.params;
  return (
    <View style={styles.SinglePageContainer}>
      <Text>{title}</Text>
      <ScrollView>
        <Text style={styles.text2}>{content}</Text>
      </ScrollView>
    </View>
  );
}

function HomeScreen({user}) {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const SLIDE_WIDTH = Math.round(windowWidth / 3.5);

  const { setCategory } = useContext(NewsContext);
  const { category } = useContext(NewsContext);

  const {
    news: { articles },
  } = useContext(NewsContext);

 
  const [modalVisible, setModalVisible] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const handleModal = (n) => {
    setModalVisible(true);
    setCurrentNews(n);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StatusBar translucent={false} backgroundColor="#fff" />
        <View style={styles.appName}>
          <Text style={styles.text1}> SaS News</Text>
        </View>
        <View style={styles.profile}>
          
        </View>
      </View>
      <ScrollView style={styles.body}>
        <Searchb user={{username:user.username}}/>
        <View style={styles.categoriesView}>
          <Text style={styles.subtitle2}>Categories</Text>
          <Carousel
            layout={"default"}
            data={categories}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => setCategory(item.name)}
                  style={styles.category}
                >
                  <Image
                    source={{ uri: item.pic }}
                    style={styles.categoryImage}
                  />
                  <Text style={{ ...styles.name, color: "white" }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
            sliderWidth={windowWidth}
            itemWidth={SLIDE_WIDTH}
            activeSlideAlignment={"start"}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
          />
        </View>
        {/* <Text style={styles.subtitle2}></Text> */}
        {category == "general" ? (
          <Text style={styles.subtitle2}>Breaking News</Text>
        ) : (
          <Text style={styles.subtitle2}>{category}</Text>
        )}

        <Modal animationType='slide'
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >

          <View style={{ height: "100%", transform: [{ scaleY: -1 }] }}>
            <SingleNews item={currentNews} user={{username:user.username}} />
          </View>
        </Modal>
        <View style={styles.breakingNewsView}>
          {articles && (
            <Carousel
              layout={"stack"}
              data={articles}
              sliderWidth={windowWidth}
              itemWidth={windowWidth}

              renderItem={({ item }) => {
                return (

                  <TouchableOpacity
                    key={item.title}
                    activeOpacity={0.7}
                    onPress={() => {handleModal(item)}}
                    style={styles.cardView}
                  >

                    <View style={styles.view1}>
                      <Image
                        source={{ uri: item.urlToImage }}
                        style={{
                          flex: 1,
                          borderTopRightRadius: 10,
                          borderTopLeftRadius: 10,
                        }}
                      />
                    </View>
                    <View style={styles.view2}>
                      <Text style={{ fontSize: 20 }}>{item.title}</Text>
                    </View>


                  </TouchableOpacity>

                );
              }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingLeft: 5,
    height: 60,
    backgroundColor: "#292A2A",

    alignItems: "center",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    flexDirection: "row",
  },
  appName: {
    flexDirection: "row",
    flex: 1,
  },
  profile: {
    flexDirection: "row",
    marginRight: 10,
    alignItems: "flex-end",
  },
  body: {
    flex: 14,
    backgroundColor: "#52595D",
    padding: 10,
  },
  input: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    marginBottom: 3,
    marginTop: 3,
  },
  text1: {

    fontSize: 25,
    color: "#fff",
  },
  text2: {
    fontStyle: "italic",
    fontSize: 20,
    color: "#000",
    alignItems: "stretch",
  },
  textinput: {},
  categoriesView: {
    padding: 5,
    marginBottom: 5,
  },
  categories: {},
  subtitle2: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 3,
    marginHorizontal: 5,
    borderBottomColor: "#007FFF",
    borderBottomWidth: 5,
    alignSelf: "flex-start",
    borderRadius: 10,
    color: "white",
    textTransform: "capitalize",
  },
  breakingNewsView: {},
  category: {
    height: 130,
    margin: 10,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  categoryImage: {
    height: "60%",
    width: "100%",
    resizeMode: "contain",
  },
  name: {
    fontSize: 12,
    textTransform: "capitalize",
  },
  BN: {
    height: 400,
    margin: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  cardView: {
    margin: 10,
    width: "90%",
    height: 450,
    marginBottom: 30,
    flex: 1,
  },
  articleTitle: {
    marginTop: 50,
  },
  SinglePageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  view1: {
    flex: 1.75,
  },
  view2: {
    flex: 1,
    backgroundColor: "#f0ffff",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    padding: 10,
  },
});

export default (props) => {
  console.log(props);
  return (
    <Context user={{username:props.user.username}}  >
      <HomeScreen user={{username:props.user.username}}/>
    </Context>
  );
};

