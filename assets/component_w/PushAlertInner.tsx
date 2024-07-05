import React, { useEffect, useState } from "react";
import {  Animated, Platform, Pressable, AppState, Alert  } from "react-native";
import styled from "styled-components/native";
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from "@react-navigation/native";
import { Shadow } from 'react-native-shadow-2';
import { checkNavigator } from "../../common/navigator_w";
import { getReportContent, validateAccessToken } from "../../common/fetchData";
import EncryptedStorage from 'react-native-encrypted-storage';

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

    //앱이 켜져있을때 푸시알람 수신 처리
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
        },4000)
        
            
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

    async function goToPageByPush(remoteMessage:any){
        const {type, ReportId, CommentId, pageName, PortfolioId} = remoteMessage?.data;
        if(type==undefined){
            return null;
        }
        closePush();

        if (type=='portfolio-issue'){
            checkNavigator(navigation, 'home' , {isReload:'n'});
            setTimeout(()=>{
                navigation.navigate("PortrolioIssueTalk_N" as never, {param:{pageName}});
            },500)
        }else if(type=='reportComment'){
            checkNavigator(navigation, 'home' , {isReload:'n'});
            let result:any =  await getReportContent(ReportId);
            const title = result?.report?.title;

            setTimeout(()=>{
                navigation.navigate("ReportReply_W" as never, {param:{ReportId, title, from:'report'}});
            },500)
        }else if(type=='Reports'){
            checkNavigator(navigation, 'home' , {isReload:'n'});
            let result:any =  await getReportContent(ReportId);
            const seoTitle = result?.report?.seoTitle;

            setTimeout(()=>{
                if(result==='noReadAuthority'){
                    navigation.navigate("ReportPreview_W" as never, {param:{ReportId}});
                }else{
                    setTimeout(()=>{
                        navigation.navigate("ReportContent_W" as never, {param:{pageName, seoTitle}});
                    },500);
                }
            },500)
        }else if (type=='portfolio'){
            checkNavigator(navigation, 'home' , {isReload:'n'});
            setTimeout(()=>{
                navigation.navigate("PortfolioContent_W" as never, {param:{pageName, PortfolioId}});
            },500)
        }else if(type=='portfolio-comment'){
            checkNavigator(navigation, 'home' , {isReload:'n'});
            setTimeout(()=>{
                navigation.navigate("ReportReply_W" as never, {param:{ReportId:PortfolioId, title:pageName, from:'portfolio'}});
            },500)
        }else if(type=='portfolio-realtime'){
            checkNavigator(navigation, 'home' , {isReload:'n'});
            setTimeout(()=>{
                navigation.navigate("PortfolioOwner_W" as never, {param:{pageName}});
            },500)
        }else{
            checkNavigator(navigation, 'home' , {isReload:'n'});
        }
    }


    const goHome = () =>{
        checkNavigator(navigation, 'home' , {isReload:'y'})
    }

    const goLogin = () =>{
        checkNavigator(navigation, 'login', {})
    }


    // // 백그라운드 실행중 재실행시 오류 방지용 처리 
    // useEffect(()=>{ 
    //     const handleAppStateChange = (nextAppState:any) => {
    //         if (nextAppState === 'active') { // 앱이 백그라운드에서 활성 상태로 변경될 때만 처리하도록 합니다.
    //             const currentScreenName = navigation.getCurrentRoute().name;
    //             const params = navigation.getCurrentRoute().params;
                
    //             const reloadPages =['Report_W','ReportList_W','Portfolio_W','PortfolioList_W','PortrolioIssueTalkList_W','Analysis_W','AnalysisCreators_W','Mypage_W']; //주요 메인 페이지
    //             const reloadWithParams = ['PortrolioIssueTalk_N', 'ReportPreview_W', 'ReportContent_W', 'PortfolioContent_W', 'ReportReply_W']; //푸시알람 수신 페이지

    //             if(reloadPages.includes(currentScreenName)){  //주요 메인 페이지 리로드
    //                 // navigation.navigate(currentScreenName as never);
    //                 goHome(); 
    //             }else if(reloadWithParams.includes(currentScreenName)){ //푸시알람 수신 페이지 리로드
    //                 navigation.navigate(currentScreenName as never, params);
    //             }else{
    //                 // goHome(); //그외 페이지는 백그라운드 복귀 시 홈 화면으로 안보냄 
    //             }
    //         }
    //     };
    //     const listener = AppState.addEventListener('change', handleAppStateChange);
    //     return () => {
    //         listener.remove();
    //     };
    // },[]);


    // 백그라운드 실행중 재실행시 오류 방지용 처리 
    const handleAppStateChange = async (nextAppState:any) => {
        const accessToken:any = await validateAccessToken();
        if(accessToken==='expired'|| accessToken==null || accessToken==undefined){
            goLogin();
        }
    };

    useEffect(()=>{ 
        const listener = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            listener.remove();
        };
    },[]);


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
                        <TitleInner onPress={()=>{goToPageByPush(remoteMessage)}}>
                            <PushLogo source={require('../../assets/icons_w/logo_circle.png')}/>
                            <AlertTitle>{title}</AlertTitle>
                        </TitleInner>
                        <ClosePress onPress={closePush}>
                            <CloseImg source={require('../../assets/icons_w/closeX.png')}/>
                        </ClosePress>
                    </TitleBox>

                    <Pressable onPress={()=>{goToPageByPush(remoteMessage)}}>
                        <AlertContent numberOfLines={2}>{content}</AlertContent>
                    </Pressable>
                </ShadowInner>
            </Shadow>
        </TopAlertViewAnimated>
    )
}

export default PushAlertInner;