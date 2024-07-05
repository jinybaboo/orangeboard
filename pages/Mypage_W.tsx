import React, { useCallback, useEffect, useRef, useState } from "react";

import WebView from "react-native-webview";
import { ChannelIO } from "react-native-channel-plugin";


import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../common/variables_w";
import { SafeAreaView } from "react-native-safe-area-context";
import { safeAreaView } from "../common/commonStyle";
import { handleDataFromWeb } from "../common/navigator_w";
import { getMyProfile } from "../common/fetchData";
import EncryptedStorage from 'react-native-encrypted-storage';
import { DeviceEventEmitter } from "react-native";


const Mypage_W = (props:any) => {

    const navigation:any = useNavigation();
    const webViewRef:any = useRef(null);
    const webviewUrl = `${BASE_URL}/mypage?isApp=app`;

    const [isLoading, setIsLoading] = useState<any>(true);
    const [profile, setProfile] = useState<any>();
    const [page, setPage] = useState<any>();

    const handleOnMessage = async (e:any) => {
        const {type, value} = JSON.parse(e.nativeEvent.data);
        await handleDataFromWeb(navigation, e.nativeEvent.data);
    };

    async function getData(){
        const currentPage = await EncryptedStorage.getItem('currentPage');
        setPage(currentPage);
        
        const data = await getMyProfile();
        setProfile(data)
        setIsLoading(false);
    }

    useEffect(()=>{
        getData();

        return ()=>{
            ChannelIO.hideChannelButton();
        }
    },[]);


    // 이 페이지에서 홈화면 돌아가면 홈화면 데이터 및 피드 리프레시 되도록 설정
    useEffect(() => {
        return () => {
            DeviceEventEmitter.emit('backFromHomeReload');
        }
    }, []);


    if(isLoading){
        return null;
    }




    let settings = {
        "pluginKey": 'bfe4381c-686e-4dab-b7a0-897bea321178',
        "memberId" : profile?.uuid,
        "profile": {
            "name": profile?.Profile?.displayName,
            "email": profile?.email,
            "avatarUrl": profile?.Profile?.avatar?.url,
        },
        "channelButtonOption": {
        "xMargin": 20,
        "yMargin": 80,
        "position": 'right',
        }
    }

    ChannelIO.boot(settings).then((result:any) => {
        // console.log(result.status);
    })
    ChannelIO.showChannelButton();



    return (
        <SafeAreaView style={safeAreaView}>
            <WebView 
                ref={webViewRef}
                source={{uri: webviewUrl}}
                onMessage={handleOnMessage}
                textZoom={100}
            />
        </SafeAreaView>

    );
};

export default Mypage_W;
