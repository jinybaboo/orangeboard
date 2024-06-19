
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
import { ChannelIO } from 'react-native-channel-plugin';
import colors from "../common/commonColors";
import { validateAccessToken } from "../common/commonData";
import VersionCheck from "react-native-version-check";
import { Alert, Linking, Platform } from "react-native";

const os = Platform.OS;

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
    width:20%;
    height: 56px;
    align-items: center;
    position: relative;
`

const BottomTabImg = styled.Image`
    width:52px;
    height:52px;
    
    margin-top: 2px;
`
const Btm1Img = styled.Image`
    width:18px;
    height:18px;
    margin-top:9px;
`
const Btm2Img = styled.Image`
    width:16px;
    height:14.8px;
    margin-top:10px;
`
const Btm3Img = styled.Image`
    width:17px;
    height:17px;
    margin-top:9px;
`
const Btm4Img = styled.Image`
    width:16px;
    height:16px;
    margin-top:10px;
`
const Btm5Img = styled.Image`
    width:17.5px;
    height:17px;
    margin-top:10px;
`

const BottomTabTxt = styled.Text`
    font-size:12px;
    line-height: 16px;
    font-family: 'noto500';
    position: absolute;
    bottom: 8px;
    color:#D9D9D9;
`



const BottomTab = () =>{
    //어드민 버전 정보 등
    const [currentVersion, setCurrentVersion] = useState('notReady');
    const [isShowUpdateAlarm, setIsShowUpdateAlarm] = useState(1);


     //로그인 정보 가져오기
     const isLogin = useSelector((state:RootState)=>state.user.isLogin);
     const dispatch = useAppDispatch();
     
        
    async function loginCheck(){
      
        const tokenStatus = await validateAccessToken(dispatch, navigation);
        if(tokenStatus=='expired'){
            dispatch(userSlice.actions.setIsLogin(false))
        }else{
            dispatch(userSlice.actions.setIsLogin(true))
        }
    }





    //앱 시작시 토큰 유효성 체크 및 로그인 상태 저옵 리덕스에 넣기!!
    useEffect(()=>{
        loginCheck();
    });

   
    const pageStack = useSelector((state:RootState)=>state.user.pageStack);
    let pageNow = pageStack[pageStack.length-1];

    let isShowTab = false;
   

    if(pageNow=='Home' || pageNow=='Portfolio' || pageNow=='Contents'|| pageNow=='Creators' || pageNow=='Mypage'){
        isShowTab=true;
    }

    //my페이지가 아니면 채널톡 다 끄기
    if(pageNow!='Mypage'){
        ChannelIO.boot({}).then((result:any) => {
            // console.log(result.status);
        })
        ChannelIO.hideChannelButton();
    }


    const navigation = useNavigation();


    const goHome = () =>{
        setCurrentPage(dispatch, 'Home');
        navigation.navigate("Home" as never)
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

    const goPortfolio = () =>{
        setCurrentPage(dispatch, 'Portfolio');
        navigation.navigate("Portfolio" as never);
    }



    return (
        <BottomTabContainer>
            {isShowTab?
            <BottomTabView> 
                <BottomTabPress onPress={goContents}>
                    <Btm1Img  source={pageNow=='Contents'?require('../assets/icons/btm1_a.png'):require('../assets/icons/btm1.png')}/>
                    <BottomTabTxt style={pageNow=='Contents'?{color:colors.orangeBorder}:{color:'#d9d9d9'}}>리포트</BottomTabTxt>
                </BottomTabPress> 

                <BottomTabPress onPress={goPortfolio}>
                    <Btm2Img  source={pageNow=='Portfolio'?require('../assets/icons/btm2_a.png'):require('../assets/icons/btm2.png')}/>
                    <BottomTabTxt style={pageNow=='Portfolio'?{color:colors.orangeBorder}:{color:'#d9d9d9'}}></BottomTabTxt>
                </BottomTabPress>

                <BottomTabPress onPress={goHome}>
                    <Btm3Img  source={pageNow=='Home'?require('../assets/icons/btm3_a.png'):require('../assets/icons/btm3.png')}/>
                    <BottomTabTxt style={pageNow=='Home'?{color:colors.orangeBorder}:{color:'#d9d9d9'}}>홈</BottomTabTxt>
                </BottomTabPress>
                
                <BottomTabPress onPress={goCreators}>
                    <Btm4Img  source={pageNow=='Creators'?require('../assets/icons/btm4_a.png'):require('../assets/icons/btm4.png')}/>
                    <BottomTabTxt style={pageNow=='Creators'?{color:colors.orangeBorder}:{color:'#d9d9d9'}}>크리에이터</BottomTabTxt>
                </BottomTabPress>

                
                {
                isLogin?
                <BottomTabPress onPress={goMypage}>
                    <Btm5Img  source={pageNow=='Mypage'?require('../assets/icons/btm5_a.png'):require('../assets/icons/btm5.png')}/>
                    <BottomTabTxt style={pageNow=='Mypage'?{color:colors.orangeBorder}:{color:'#d9d9d9'}}>마이페이지</BottomTabTxt>
                </BottomTabPress>
                :
                <BottomTabPress onPress={goLogin}>
                    <Btm5Img  source={pageNow=='Login'?require('../assets/icons/btm5_a.png'):require('../assets/icons/btm5.png')}/>
                    <BottomTabTxt style={pageNow=='Login'?{color:colors.orangeBorder}:{color:'#d9d9d9'}}>로그인</BottomTabTxt>
                </BottomTabPress>
                }
            </BottomTabView>
            :<EmptyView />}

            {
            pageNow=='Home'?<IPhoneBottomWhite />:<IPhoneBottom />
            }
            
        </BottomTabContainer>
    );
}
export default BottomTab;