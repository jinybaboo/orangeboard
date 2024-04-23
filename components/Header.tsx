import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { setCurrentPage } from "../common/commonFunc";
import { useAppDispatch } from "../store";
import { useSelector } from "react-redux";
import { getUserAlert } from "../common/commonData";
import colors from "../common/commonColors";
import { Pressable } from "react-native";
import { goHome } from "../common/commonNav";

export const Header = ()=>{

    const isLogin = useSelector((state:any)=>state.user.isLogin);
    const [newMessageCount, setNewMessageCount] = useState(0);

    const isFocused = useIsFocused(); // isFoucesd Define

    const HeaderView = styled.View` 
        width:100%; height: 60px; padding:0 16px;flex-direction:row; background-color: #FFFFFF; justify-content: space-between; align-items: center;
    `
    const HeaderRightBox = styled.View`
        flex-direction: row; align-items: center;
    `

    const LogoImg = styled.Image`
        width:150px; height:22px;
    `
    const SearchPress = styled.Pressable` 
        width:35px; height:60px; justify-content: center; align-items: center; 
    `
    const SearchIcon = styled.Image` 
        width:20px; height:20px;
    `

    const AlertPress = styled.Pressable` 
        width:40px; height:60px; justify-content: center; align-items: center;  position: relative; 
    `
    const BellImg = styled.Image`
        width:16px; height:20px; 
    `
    const BellOnCircie = styled.View`
       width:5px; height:5px; border-radius: 50px; background-color: ${colors.orangeBorder};
       position: absolute; right:6px; top:18px;
   `

    //리듀서 사용 세팅
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    
    const goSearch = () =>{
        setCurrentPage(dispatch,'Search');
        navigation.navigate("Search" as never);
    }

    const goAlertInfo = () =>{
        setCurrentPage(dispatch,'AlertInfo');
        navigation.navigate("AlertInfo" as never);
    }

    useEffect(()=>{
        async function getAllData(){
            if(isLogin){
                let result:any =  await getUserAlert(dispatch, navigation);
                setNewMessageCount(result.newMessageCount);
            }
        }
        getAllData()
    },[isFocused])

    return (

        <HeaderView>
            <Pressable onPress={()=>{goHome(navigation, dispatch)}}>
            <LogoImg source={require('../assets/icons/logoLong.png')}/>
            </Pressable>
            <HeaderRightBox>
                <SearchPress onPress={goSearch}>
                    <SearchIcon source={require('../assets/icons/searchIconBlack.png')}/>
                </SearchPress>

                {isLogin &&
                <>
                <AlertPress onPress={goAlertInfo}>
                    <BellImg source={require('../assets/icons/bell_black.png')}/>
                    {
                    newMessageCount>0 && <BellOnCircie/>
                    }
                </AlertPress>
                </>
                }
            </HeaderRightBox>
        </HeaderView>
    )
}
