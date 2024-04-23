
import { useNavigation} from "@react-navigation/native";

import DeviceInfo, {getModel} from 'react-native-device-info';
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../store";
import userSlice from "../slices/user";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducer";
import { setCurrentPage } from "../common/commonFunc";
import { EmptyView } from "../common/commonStyledComp";
import styled from "styled-components/native";
import SpaceForBottomTab from "./common/SpaceForBottomTab";
import EncryptedStorage from 'react-native-encrypted-storage';
import IPhoneBottom from "./common/IPhoneBottom";
import IPhoneBottomWhite from "./common/IPhoneBottomWhite";


const BottomTabContainer = styled.View`
    width:100%;
    position: absolute;
    bottom: 0px;
`

const BottomTabView = styled.View`
    width:100%;
    height: 56px;
    flex-direction: row;
    background-color:#FFFFFF;
    z-index: 1000;
    border-top-width: 1px;
    border-top-color: #F2F2F2;
    justify-content: space-around;
    padding:0 12px;
`

const BottomTabPress = styled.Pressable`
    width:52px;
    height: 56px;
    align-items: center;
    position: relative;
`

const BottomTabImg = styled.Image`
    width:52px;
    height:52px;
    
    margin-top: 2px;
    
`

const BottomTabTxt = styled.Text`
    font-size:12px;
    line-height: 16px;
    font-family: 'noto400';
    position: absolute;
    bottom: 4px;
`


const BottomTab2 = ({pageNow}:any) =>{

    //로그인 정보 가져오기
    const isLogin = useSelector((state:RootState)=>state.user.isLogin);
    //console.log(userId, isLogged)
    const dispatch = useAppDispatch();
    
    //const currentPage = useSelector((state:RootState)=>state.user.currentPage);
    //console.log('currentPage',currentPage);
    const pageStack = useSelector((state:RootState)=>state.user.pageStack);
    //let pageNow = pageStack[pageStack.length-1];
    //console.log(pageStack);
    //console.log('pageNow : ',pageNow)

    const navigation = useNavigation();


    const goHome = () =>{
        setCurrentPage(dispatch, 'Home');
        navigation.navigate("Home" as never);
    }

    const goContents = () =>{
        setCurrentPage(dispatch, 'Contents');
        navigation.navigate("Contents" as never);
    }
    const goCreators = () =>{
        setCurrentPage(dispatch, 'Creators');
        navigation.navigate("Creators" as never);
    }
    const goMypage = () =>{
        setCurrentPage(dispatch, 'Mypage');
        navigation.navigate("Mypage" as never);
    }

    const goLogin = () =>{
        setCurrentPage(dispatch, 'Login');
        navigation.navigate("Login" as never);
    }



    return (
        <BottomTabContainer>
            <BottomTabView> 
                <BottomTabPress onPress={goHome}>
                    {pageNow=='Home'?<BottomTabImg source={require('../assets/icons/home_on.png')}/>:<BottomTabImg source={require('../assets/icons/home_off.png')}/>}
                </BottomTabPress>
                <BottomTabPress onPress={goContents}>
                    {pageNow=='Contents'?<BottomTabImg  source={require('../assets/icons/contents_on.png')}/>:<BottomTabImg source={require('../assets/icons/contents_off.png')}/>}
                </BottomTabPress>
                <BottomTabPress onPress={goCreators}>
                    {pageNow=='Creators'?<BottomTabImg source={require('../assets/icons/creators_on.png')}/>:<BottomTabImg source={require('../assets/icons/creators_off.png')}/>}
                </BottomTabPress>
                {
                isLogin?
                <BottomTabPress onPress={goMypage}>
                {pageNow=='Mypage'?<BottomTabImg  source={require('../assets/icons/mypage_on.png')}/>:<BottomTabImg  source={require('../assets/icons/mypage_off.png')}/>}
                </BottomTabPress>   
                :
                <BottomTabPress onPress={goLogin}>
                    {pageNow=='Login'?<BottomTabImg source={require('../assets/icons/mypage_on.png')}/>:<BottomTabImg source={require('../assets/icons/mypage_off.png')}/>}
                    {/* <BottomTabTxt style={pageNow=='Login'?{fontFamily:'noto500'}:{}}>로그인</BottomTabTxt> */}
                </BottomTabPress>
                }
            </BottomTabView>
            <IPhoneBottomWhite />
            
            {/* {
            pageNow=='Home'?<IPhoneBottomWhite />:<IPhoneBottom />
            } */}
            
        </BottomTabContainer>
    );
}
export default BottomTab2;