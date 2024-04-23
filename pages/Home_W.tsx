import React, { useCallback, useEffect, useRef } from "react";

import { useState } from "react";
import WebView from "react-native-webview";

import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "../store";
import { BASE_URL } from "../common/variables_w";
import { Alert, Linking, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { safeAreaView } from "../common/commonStyle";
import { checkNavigator, handleDataFromWeb } from "../common/navigator_w";
import { getTokens, sendDataToWeb} from "../common/common_w";
import VersionCheck from "react-native-version-check";
import styled from "styled-components/native";
import colors from "../common/commonColors";
import { Space } from "../common/commonStyledComp";
import { getWindowHeight, getWindowWidth } from "../common/commonFunc";
import { getAppAdminInfo, getReportContent } from "../common/fetchData";
import { checkNotifications, PERMISSIONS, RESULTS, requestNotifications, request } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import Loader from "../assets/component_w/Loader";

const windowWidth = getWindowWidth();
const windowHeight = getWindowHeight();

const AlertView = styled.View`
    width: 100%; height:${windowHeight}px; background: rgba(0, 0, 0, 0.50); position: absolute; bottom:0; display: flex; align-items: center; justify-content:center; z-index: 9999;
`
const AlertBox = styled.View`
    width: ${windowWidth-40}px; border-radius:8px; background: #FFF; padding:26px 24px 18px; margin: 0 auto;
`
const AlertTxt = styled.Text`
    color: #000; text-align: center; font-size: 16px; font-weight: 400; line-height: 24px;
`
const AlertBtn = styled.Pressable`
    width: 100%; height: 50px; line-height:50px; border-radius: 8px; background-color: ${colors.orangeBorder};
`
const AlertBtnTxt = styled.Text`
    font-family: 'noto700'; font-size: 16px; line-height:19px; color:#FFF; text-align: center; line-height: 50px;
`

const Home_W = (props:any) => {
    const isReload = props?.route?.params?.param?.isReload;
    const os = Platform.OS;

    const [isLoading, setIsLoading] = useState(true);
    const [tokens, setTokens] = useState<any>({});

    const [currentVersion, setCurrentVersion] = useState('notReady');
    const [isShowUpdateAlarm, setIsShowUpdateAlarm] = useState(1);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    //리듀서 사용 세팅
    const dispatch = useAppDispatch();
    const navigation:any = useNavigation();
    const webViewRef:any = useRef(null);
    const webviewUrl = `${BASE_URL}/?isApp=app`;

    const isFocused = useIsFocused();

    async function getData(){
        const tokens = await getTokens();
        setTokens(tokens);
        setIsLoading(false);
    }

    // 페이지가 웹뷰로 전환될 때마다 자동으로 페이지를 다시로드하는 useEffect
    useEffect(() => {
        if(isFocused && isReload==='y'){
            sendbTokensToWebview()
            webViewRef.current.reload();
        }

        return ()=>{
            //화면 나갈때 홈화면 스크롤 탑으로 옮기고 나가기'
            sendDataToWeb(webViewRef, 'scrollTop','')
        }
    }, [isFocused]);

    useEffect(()=>{
        getData();

        //최초 시작 시 푸시알림 권한 얻기
        requestNotifications(['alert', 'sound']).then(({status, settings}) => {});
    },[]);


    async function preAppVersion(){
        let {version_android, version_ios, isShowUpdateAlarmAndroid, isShowUpdateAlarmIos} = await getAppAdminInfo();
        setIsShowUpdateAlarm(os==='ios'?isShowUpdateAlarmIos:isShowUpdateAlarmAndroid)
        setCurrentVersion(os==='ios'?version_ios:version_android);
        const appVersion = VersionCheck.getCurrentVersion();
        
        if(currentVersion!='notReady' && isShowUpdateAlarm && (appVersion!=currentVersion)){
            setShowUpdateModal(true);
        }
    }

    useEffect(()=>{
        preAppVersion()
    },[currentVersion, isFocused])


    function openPlayStore(){
        let url = os=='ios'?'https://apps.apple.com/kr/app/%EC%98%A4%EB%A0%8C%EC%A7%80%EB%B3%B4%EB%93%9C-%EC%A3%BC%EC%8B%9D%ED%86%B5%ED%95%A9%ED%94%8C%EB%9E%AB%ED%8F%BC/id1661760963':'market://details?id=com.orangeboard';
        Linking.openURL(url);
    }
    

    const handleOnMessage = async (e:any) => {
        await handleDataFromWeb(navigation, e.nativeEvent.data);
    };


    // RN에서 웹뷰로 데이터를 보낼 때 사용하는 함수입니다. 
    const sendbTokensToWebview = async () => {
        const tokens = await getTokens();
        const sendData =JSON.stringify({   
            type:"tokens",
            data:tokens,
        });
        webViewRef.current.postMessage(sendData);
    }
    

    // 앱이 백그라운드에 있을때(앱을 사용하지 않으나 활성화 되어있는 경우) 푸시 수신될 경우
    useEffect(()=>{
        const background =  messaging().setBackgroundMessageHandler(async (remoteMessage:any) => {
            //console.log('Message handled in the background!', remoteMessage);
        });
        return background;
    },[]);


    //앱이 백그라운드에 있을때 사용자가 푸시알람을 눌렀을때 앱이 실행된뒤 호출되는 함수(페이지 전환 등)
    useEffect(()=>{
        const onNotiOpened =   messaging().onNotificationOpenedApp(async (remoteMessage:any) => {
            const type = remoteMessage?.data?.type;
            //console.log('onNotiOpened', type);
            if(type!=undefined){
                goToPageByPush(remoteMessage)
            }
        });
            return onNotiOpened;
    },[]);

    // 앱이 꺼져있는 경우 사용자가 푸시알람을 눌렀을때 앱이 실행된뒤 호출되는 함수(페이지 전환 등)
    useEffect(()=>{
        messaging().getInitialNotification().then(async (remoteMessage) => {
            //console.log(remoteMessage)
            const type = remoteMessage?.data?.type;
            //console.log('getInitialNotification', type)  
            if(type!=undefined){
                goToPageByPush(remoteMessage)
            }
        });
    },[]);
   


    async function goToPageByPush(remoteMessage:any){
        const {type, ReportId, CommentId, pageName, PortfolioId} = remoteMessage?.data;
        // console.log('remoteMessage?.data', remoteMessage?.data);

        if (type=='portfolio-issue'){
            checkNavigator(navigation, 'home' , {isReload:'n'})
            setTimeout(()=>{
                navigation.navigate("PortrolioIssueTalk_N" as never, {param:{pageName}});
            },500)
        }else if(type=='reportComment'){
            checkNavigator(navigation, 'home' , {isReload:'n'})
            let result:any =  await getReportContent(ReportId);
            const title = result?.report?.title;

            setTimeout(()=>{
                navigation.navigate("ReportReply_W" as never, {param:{ReportId, title, from:'report'}});
            },500)
        }else if(type=='Reports'){
            checkNavigator(navigation, 'home' , {isReload:'n'})
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
            checkNavigator(navigation, 'home' , {isReload:'n'})
            setTimeout(()=>{
                navigation.navigate("PortfolioContent_W" as never, {param:{pageName, PortfolioId}});
            },500)
        }else if(type=='portfolio-comment'){
            checkNavigator(navigation, 'home' , {isReload:'n'})
            setTimeout(()=>{
                navigation.navigate("ReportReply_W" as never, {param:{ReportId:PortfolioId, title:pageName, from:'portfolio'}});
            },500)
        }else{
            checkNavigator(navigation, 'home' , {isReload:'n'})
        }
    }
 

    if(isLoading){
        return <Loader />;
    }

    
    return (
            <SafeAreaView style={safeAreaView}>
                <WebView 
                    ref={webViewRef}
                    source={{uri: webviewUrl}}
                    onMessage={handleOnMessage}
                    onLoadEnd={sendbTokensToWebview}
                    textZoom={100}
                />

                {showUpdateModal && 
                <AlertView>
                    <AlertBox>
                        <AlertTxt>{`앱이 업데이트 되었습니다.\n업데이트 후 이용해 주세요`}</AlertTxt>
                        <Space height={20}/>
                        <AlertBtn onPress={openPlayStore}>
                            <AlertBtnTxt>업데이트 하러가기</AlertBtnTxt>
                        </AlertBtn>
                    </AlertBox>
                </AlertView>
                }
            </SafeAreaView>
    );
}

export default Home_W;