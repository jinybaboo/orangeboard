import React, { useEffect, useRef } from "react";

import { useState } from "react";
import WebView from "react-native-webview";

import { useIsFocused, useNavigation} from "@react-navigation/native";
import { useAppDispatch } from "../store";
import { BASE_URL } from "../common/variables_w";
import { Alert, DeviceEventEmitter, Linking, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { safeAreaView } from "../common/commonStyle";
import { goToPageByPush, handleDataFromWeb } from "../common/navigator_w";
import VersionCheck from "react-native-version-check";
import styled from "styled-components/native";
import { LineE2E2E2, LineEEEEEE, Space, Space16 } from "../common/commonStyledComp";
import { getWindowHeight, getWindowWidth} from "../common/commonFunc";
import { checkNotifications, PERMISSIONS, RESULTS, requestNotifications, request } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import Loader from "../assets/component_w/Loader";

import EncryptedStorage from 'react-native-encrypted-storage';
import { getModel } from "react-native-device-info";
import { getTokens } from "../common/common_w";
import colors from "../common/commonColors";
import { getAppAdminInfo, insertOrUpdateFcmToken } from "../common/fetchData";

import notifee from '@notifee/react-native';

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
const BtnsBox = styled.View`
    display: flex; flex-direction: row; justify-content: space-between;
`
const AlertBtn = styled.Pressable`
    width: 48%; height: 50px; line-height:50px; border-radius: 8px; background-color: ${colors.orangeBorder};
`
const AlertBtnTxt = styled.Text`
    font-family: 'noto700'; font-size: 16px; line-height:19px; color:#FFF; text-align: center; line-height: 50px;
`
const AlertBtn2 = styled(AlertBtn)`
    background-color: #FFF; border:1px solid ${colors.orangeBorder};
`
const AlertBtnTxt2 = styled(AlertBtnTxt)`
    color:${colors.orangeBorder};
`
const UpdateTitle = styled.Text`
     font-family: 'noto700';  font-size: 14px; line-height: 18px; color: ${colors.placeholder};  padding-bottom: 2px;
`
const UpdateTxt = styled.Text`
     font-family: 'noto400';  font-size: 12px; line-height: 18px; color: ${colors.placeholder};  
`


const Home_W = (props:any) => {
    const isReload = props?.route?.params?.param?.isReload;
    const os = Platform.OS;

    const [isLoading, setIsLoading] = useState(true);
    const [tokens, setTokens] = useState<any>({});
    const [updateText, setUpdateText] = useState<any>('없음');

    const [currentVersion, setCurrentVersion] = useState('notReady');
    const [isShowUpdateAlarm, setIsShowUpdateAlarm] = useState(1);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    //리듀서 사용 세팅
    const dispatch = useAppDispatch();
    const navigation:any = useNavigation();
    const webViewRef:any = useRef(null);
    const webviewUrl = `${BASE_URL}?isApp=app`;

    const isFocused = useIsFocused();
    
    async function getData(){
        const tokens:any = await getTokens();
        
        setTokens(tokens);
        setIsLoading(false);
        
        // 토큰 재 저장
        const fcmToken = await messaging().getToken();
        
        let deviceInfo = getModel();
        tokens.accessToken !== 'expired' && tokens.accessToken !== null && await insertOrUpdateFcmToken(fcmToken, deviceInfo, tokens.accessToken);
    }

    // 페이지가 웹뷰로 전환될 때마다 자동으로 페이지를 다시로드하는 useEffect
    async function checkReload(){
        if(isFocused && isReload==='y'){
            sendbTokensToWebview();
            webViewRef.current.reload();
        }
    }

    async function reloadFromLoginAndLogout(){
        // console.log('backFromHomeReload로 인한 페이지 리로드');
        sendbTokensToWebview();
        webViewRef.current.reload();
    }


    useEffect(() => {
        DeviceEventEmitter.addListener('backFromHomeReload', () => {
            if(webViewRef!==null && webViewRef.current!==null){
                reloadFromLoginAndLogout();
            }
        });
    }, [webViewRef]);


    async function clearAllNotifications() {
        await notifee.cancelAllNotifications(); // 모든 알림 삭제
    }

    useEffect(() => {
        // clearAllNotifications();

        // checkReload();
        return ()=>{
            //화면 나갈때 홈화면 스크롤 탑으로 옮기고 나가기'
            //sendDataToWeb(webViewRef, 'scrollTop','')
        }
    }, [isFocused]);

    useEffect(()=>{
        getData();

        //최초 시작 시 푸시알림 권한 얻기
        requestNotifications(['alert', 'sound']).then(({status, settings}) => {});
    },[]);

    async function check48HourNoOpenUpdate(){
        const updateExpireTimeStr:any = await EncryptedStorage.getItem("updateExpireTime");
        const updateExpireTime = updateExpireTimeStr*1;
        const now = new Date().getTime();
        if(updateExpireTimeStr === null || updateExpireTimeStr === undefined){
            return;
        }
    
        if (now < updateExpireTime) { //저장된 시간이 현재 시간보다 이전이면 팝업을 보여줌
            setShowUpdateModal(false);
        }
    }

    async function save48HourNoOpenUpdate(){
        const now = new Date().getTime();
        const expireTime = now + 48 * 60 * 60 * 1000; // 48시간 = 48 * 60분 * 60초 * 1000밀리초
        EncryptedStorage.setItem("updateExpireTime", expireTime+'');
        setShowUpdateModal(false); 
    }

    async function preAppVersion(){
        let {isShowUpdateAlarmAndroid, isShowUpdateAlarmIos, updateText} = await getAppAdminInfo();
        const storeVersion =  os === 'ios'?await VersionCheck.getLatestVersion({provider: 'appStore'}) : await VersionCheck.getLatestVersion({provider: 'playStore'});
        const appVersion = VersionCheck.getCurrentVersion();

        setIsShowUpdateAlarm(os==='ios'?isShowUpdateAlarmIos:isShowUpdateAlarmAndroid);
        setCurrentVersion(storeVersion);
        setUpdateText(updateText===null?'없음':updateText);
        
        if(currentVersion!='notReady' && currentVersion !== undefined && isShowUpdateAlarm && (appVersion!=currentVersion)){
            setShowUpdateModal(true);
        }
        check48HourNoOpenUpdate();
    }

    useEffect(()=>{
        preAppVersion();
    },[currentVersion])

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
                goToPageByPush(remoteMessage, navigation);
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
                goToPageByPush(remoteMessage, navigation);
            }
        });
    },[]);
   

    // if(isLoading){
    //     return <Loader />;
    // }

    
    const updateTextArr = updateText?.split('^^');

    return (
            <SafeAreaView style={safeAreaView}>
                <WebView 
                    ref={webViewRef}
                    source={{uri: webviewUrl}}
                    onMessage={handleOnMessage}
                    onLoadEnd={sendbTokensToWebview}
                    textZoom={100}
                    style={{height:windowHeight}}
                    bounces={false} //바운스 비활성화
                />
                {showUpdateModal && 
                <AlertView>
                    <AlertBox>
                        <AlertTxt>{`앱이 업데이트 되었습니다.\n업데이트 후 이용해 주세요`}</AlertTxt>
                        <Space height={20}/>
                        <BtnsBox>
                            <AlertBtn2 onPress={save48HourNoOpenUpdate}>
                                <AlertBtnTxt2>다음에 하기</AlertBtnTxt2>
                            </AlertBtn2>

                            <AlertBtn onPress={openPlayStore}>
                                <AlertBtnTxt>업데이트</AlertBtnTxt>
                            </AlertBtn>
                        </BtnsBox>
                        
                        {updateText!=='없음' &&
                        <>
                            <Space height={18} />
                            <LineE2E2E2 />
                            <Space height={14} />

                            <UpdateTitle>업데이트 내역</UpdateTitle>
                            {updateTextArr.map((item:any, idx:number)=>{
                                return(
                                    <UpdateTxt key={'txt_'+idx}>* {item}</UpdateTxt>
                                )
                            })}
                        </>}
                    </AlertBox>
                </AlertView>
                }
            </SafeAreaView>
    );
}

export default Home_W;