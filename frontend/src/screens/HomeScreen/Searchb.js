import { View, Text, TextInput, StyleSheet, Modal } from 'react-native';
import {Entypo} from "@expo/vector-icons";
import React, { useState, useContext } from "react";
import { NewsContext } from './Context';
import { TouchableOpacity } from 'react-native';
import SingleNews from './SingleNews';
const Searchb = ({user}) => {

    const {
        news: { articles },
    } = useContext(NewsContext);

    const [searchResults, setSearchResults] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentNews, setCurrentNews] = useState();
    const handleModal = (n) => {
        setModalVisible(true);
        setCurrentNews(n);
    };
    const handleSearch = (text) => {
        if (!text) {
            setSearchResults([]);
            return;
        }

        setSearchResults(articles.filter((query) => query.title.includes(text)));
    };
    return (
        <View>
            <TextInput style={styles.textinput}
                onChangeText={(text) => handleSearch(text)}
                placeholder=" Search here..."
                placeholderTextColor={"white"}
            />
            <View style={styles.view1} >
                {searchResults.slice(0, 10).map((n) => (
                    <TouchableOpacity
                        key={n.title}
                        activeOpacity={0.95}
                        onPress={() => handleModal(n)}
                    >
                        <Text style={styles.text} >
                            {n.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Modal animationType='slide'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                
                <View style = {{height: "100%", transform: [{scaleY: -1}]}}>
                    <SingleNews item={currentNews} user={{username:user.username}} />
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        backgroundColor: "white",
        color: "black",
        borderRadius: 5,
        padding: 10,
        margin: 0.5,
        elevation: 5,
        shadowColor: "black",
    },
    view1: {
        position: "absolute",
        zIndex: 1,
        top: 50,
    },
    textinput: {
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        margin: 10,
        marginTop: 5,
        borderRadius: 15,
        color: "white",
        padding: 10,
        height: 45,
    }
})
export default Searchb