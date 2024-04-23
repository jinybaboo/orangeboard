import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import styled from "styled-components/native";
import { setCurrentPage } from "../common/commonFunc";
import { useAppDispatch } from "../store";
import colors from "../common/commonColors";
import { useSelector } from "react-redux";
import { getUserAlert } from "../common/commonData";

const HomeHeader = ()=>{

    const isLogin = useSelector((state:any)=>state.user.isLogin);
    const [newMessageCount, setNewMessageCount] = useState(0);

    const isFocused = useIsFocused(); // isFoucesd Define

    const HomeSearchView = styled.View`
        width:100%;
        height: 144px;
        padding:0 16px;
        background-color: #333333;
    `
    const HomeSearchBox1 = styled.View`
        height: 72px;
        flex-direction: row;
        align-items: center;
        position: relative;
    `

    const LogoSimpleImg = styled.Image`
        width:28px; height:28px;
    `
    const AlertPress = styled.Pressable`
        position: absolute; 
        right:9px;
        width:40px;
        height:40px;
        justify-content: center;
        align-items: flex-end;
    `
    const BellWhiteImg = styled.Image`
        width:20.27px; height:25px; 
    `
    const BellOnCircie = styled.View`
        width:5px; height:5px; border-radius: 50px; background-color: ${colors.orangeBorder};
        position: absolute; right:4px; top:18px;
    `
    const IntroSearchView = styled.View`
        width:100%;
        height:52px;
        border:1px solid #ffffff;
        border-radius:12px;
        background-color: #ffffff;
        flex-direction:row;
        align-items: center;
    `
    const SearchIcon = styled.Image`
        width:20px;
        height:20px;
        margin-left:20px;
    `

    const PlaceholderTxt = styled.Text`
        font-family: 'noto400';
        font-size: 16px;
        line-height:21px;
        color:${colors.placeholder};
        margin-left:8px;
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

        <HomeSearchView>
            <HomeSearchBox1>
                <LogoSimpleImg source={require('../assets/icons/logo_simple.png')}/>
                {isLogin &&
                <>
                <AlertPress onPress={goAlertInfo}>
                    <BellWhiteImg source={require('../assets/icons/bell_white.png')}/>
                </AlertPress>
                {
                newMessageCount>0 && <BellOnCircie/>
                }
                </>
                }
            </HomeSearchBox1>
            
            <Pressable onPress={goSearch}>
                <IntroSearchView>
                    <SearchIcon source={require('../assets/icons/searchIcon.png')}/>
                    <PlaceholderTxt>기업의 목표주가를 검색해 보세요</PlaceholderTxt>
                </IntroSearchView>
            </Pressable>
        </HomeSearchView>
    )
}


export default HomeHeader;