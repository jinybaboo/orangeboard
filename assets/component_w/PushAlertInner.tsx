import React, { useEffect, useState } from "react";
import {  Animated, Platform, Pressable, AppState, Alert  } from "react-native";
import styled from "styled-components/native";
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from "@react-navigation/native";
import { Shadow } from 'react-native-shadow-2';
import { checkNavigator, goToPageByPush } from "../../common/navigator_w";

const os = Platform.OS;

const TopAlertViewAnimated = styled(Animated.createAnimatedComponent(Pressable))`
    width: 100%; height: 120px; background-color:#FFF; position:absolute; top:-200px; border-bottom-width:1px; border-bottom-color: #E2E2E2;
    padding: ${os==='ios'?55:40}px 20px 0;
`
const ShadowInner = styled.View`
    width: 100%; height: 100%; padding: 14px 14px 0;
`
const TitleBox = styled.View`
    flex-direction: row; justify-content: space-between; 
`

const AlertTitle = styled.Text`
    font-family: 'noto500';font-size: 13px; line-height:16px; color:#333; padding-left: 5px;
`
const TitleInner = styled.Pressable`
    flex-direction: row;
`
const ClosePress = styled.Pressable`
    padding: 6px; margin-top: -5px;
`
const CloseImg = styled.Image`
    width: 10px; height: 10px;
`
const AlertContent = styled.Text`
    font-family: 'noto400';font-size: 13px; line-height:17px; color:#555; padding-top: 5px;
`
const PushLogo = styled.Image`
    width: 14px; height: 14px;
`

const PushAlertInner = ({animationPositionY}:any)=>{
    const navigation:any = useNavigation();
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [remoteMessage, setRemoteMessage] = useState('');

    const [lastBackgroundTimestamp, setLastBackgroundTimestamp] = useState<any>(null); // 백그라운드로 간 시간
    const [appState, setAppState] = useState(AppState.currentState); // 현재 앱 상태


    // 앱이 켜져있을때 푸시알람 수신 처리
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async (remoteMessage:any) => {
        const pushTxt = remoteMessage?.notification?.body;
        
        setTitle(remoteMessage?.notification?.title);
        setContent(pushTxt);
        setRemoteMessage(remoteMessage)

        Animated.timing(animationPositionY, {
            toValue: 200,
            duration:600,
            useNativeDriver: true,
        }).start();

        setTimeout(()=>{
            Animated.timing(animationPositionY, {
                toValue: -200,
                duration:600,
                useNativeDriver: true,
            }).start();
        },6000);
        
            
        });
        return unsubscribe;
    }, []);

    function closePush(){
        Animated.timing(animationPositionY, {
            toValue: -200,
            duration:0,
            useNativeDriver: true,
        }).start();
    }

    async function checkGoToPageByPush(remoteMessage:any){
        let {type, ReportId, CommentId, pageName, PortfolioId} = remoteMessage?.data;
        if(type==undefined){
            return null;
        }
        closePush();

        goToPageByPush(remoteMessage, navigation);

    }


    const goHome = async () =>{
        checkNavigator(navigation, 'home' , {isReload:'y'})
    }



    useEffect(() => {
        const curPage = navigation.getCurrentRoute().name;

        const handleAppStateChange = (nextAppState:any) => {
            if (nextAppState === 'background') {
                // console.log('앱이 백그라운드로 전환됨');
                setLastBackgroundTimestamp(Date.now());
            } else if (appState === 'background' && nextAppState === 'active') {
                setLastBackgroundTimestamp(null); // 초기화
            }
            setAppState(nextAppState); // 상태 업데이트

            //백그라운드 체류 시간
            const backgroundTimeSec = lastBackgroundTimestamp===null ? 0 : (Date.now() - lastBackgroundTimestamp) / 1000;
            // console.log(curPage, backgroundTimeSec);
            
            if((curPage === 'PortrolioIssueTalkList_W' || curPage === 'PortfolioOwner_W' ) && backgroundTimeSec > 60*3){
                goHome();
            }else if(curPage !== 'Login_N' && backgroundTimeSec > 60*4){
                goHome();
            }
        };
    
        // AppState 리스너 추가
        const subscription = AppState.addEventListener('change', handleAppStateChange);
    
        // 클린업
        return () => {
          subscription.remove();
        };
      }, [appState, lastBackgroundTimestamp]);


    return(
        <TopAlertViewAnimated
            style={[{ transform: [{ translateY: animationPositionY }] }]}
        >
            <Shadow		
                startColor="rgba(0,0,0,0.05)"
                endColor="rgba(255, 255, 255, 0.05)"
                distance={8}
                style={{width:'100%', height:80, backgroundColor:'#FFFFFF', borderRadius:8}}
                offset={[0,3]}
            >	
                <ShadowInner>
                    <TitleBox>
                        <TitleInner onPress={()=>{checkGoToPageByPush(remoteMessage)}}>
                            <PushLogo source={require('../../assets/icons_w/logo_circle.png')}/>
                            <AlertTitle>{title}</AlertTitle>
                        </TitleInner>
                        <ClosePress onPress={closePush}>
                            <CloseImg source={require('../../assets/icons_w/closeX.png')}/>
                        </ClosePress>
                    </TitleBox>

                    <Pressable onPress={()=>{checkGoToPageByPush(remoteMessage)}}>
                        <AlertContent numberOfLines={2}>{content}</AlertContent>
                    </Pressable>
                </ShadowInner>
            </Shadow>
        </TopAlertViewAnimated>
    )
}

export default PushAlertInner;