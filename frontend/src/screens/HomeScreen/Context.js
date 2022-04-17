import { createContext, useState, useEffect } from "react";
import { getNewsAPI } from "./api";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";


export const NewsContext = createContext();

const Context = ({ children,user}) => {
    const  [news, setNews] = useState([]);
    const [category, setCategory] = useState("general");
    const isFocused = useIsFocused();

    const fetchNews = async()  => {
        const {data} = await axios.get(getNewsAPI(category));
        setNews(data);


    };
    console.log(user.username);

    useEffect(() => {
        
        
         if(isFocused){ 
            fetchNews();
         }
    }, [category,isFocused]);

  return <NewsContext.Provider value={{news, category, setCategory, fetchNews}}>{children}</NewsContext.Provider>;
};

export default Context;
