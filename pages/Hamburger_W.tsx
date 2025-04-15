import React, {useEffect, useRef, useState } from "react";

import WebView from "react-native-webview";

import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../common/variables_w";
import { SafeAreaView } from "react-native-safe-area-context";
import { safeAreaView } from "../common/commonStyle";
import { handleDataFromWeb } from "../common/navigator_w";
import Loader from "../assets/component_w/Loader";
import { DeviceEventEmitter } from "react-native";
import { getMyProfile } from "../common/fetchData";
import { ChannelIO } from "react-native-channel-plugin";

const Hamburger_W = (props:any) => {
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<any>();

    const navigation:any = useNavigation();
    const webViewRef:any = useRef(null);
    const webviewUrl = `${BASE_URL}/etc/hamburger?isApp=app`;

    const handleOnMessage = async (e:any) => {
        await handleDataFromWeb(navigation, e.nativeEvent.data);
    };

    function handleLoadEnd(){
        setIsLoading(false);
    }

    async function getData(){
        
        const data = await getMyProfile();
        setProfile(data)
        setIsLoading(false);
    }


    // 이 페이지에서 홈화면 돌아가면 홈화면 데이터 및 피드 리프레시 되도록 설정
    useEffect(() => {
        getData();

        return () => {
            DeviceEventEmitter.emit('backFromHomeReload');
            ChannelIO.hideChannelButton();
        }
    }, []);

    const settings:any = {
        "pluginKey": 'bfe4381c-686e-4dab-b7a0-897bea321178',
        "memberId" : profile?.uuid,
        "profile": {
            "name": profile?.Profile?.displayName,
            "email": profile?.email,
            "avatarUrl": profile?.Profile?.avatar?.url,
        },
        "channelButtonOption": {
        "xMargin": 20,
        "yMargin": 90,
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
                    onLoadEnd={handleLoadEnd}
                    textZoom={100}
                />
                {isLoading && <Loader />}
            </SafeAreaView>
    );
}

export default Hamburger_W;