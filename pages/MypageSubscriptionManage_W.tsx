import React, { useCallback, useEffect, useRef, useState } from "react";

import WebView from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../common/variables_w";
import { SafeAreaView } from "react-native-safe-area-context";
import { safeAreaView } from "../common/commonStyle";
import { handleDataFromWeb } from "../common/navigator_w";
import Loader from "../assets/component_w/Loader";
import { Linking, Platform } from "react-native";



const MypageSubscriptionManage_W = (props:any) => {
    const navigation:any = useNavigation();
    const webViewRef:any = useRef(null);

    const [isLoading, setIsLoading] = useState(true);

    const webviewUrl = `${BASE_URL}/mypage/subscriptionManage?isApp=app`;

    const openCancelAppStore = () =>{
        const os = Platform.OS;
        if(os==='android'){
            Linking.openURL('https://play.google.com/store/account/subscriptions');
        }else{
            Linking.openURL('https://support.apple.com/ko-kr/HT202039');
        }
    }

    const handleOnMessage = async (e:any) => {
        const {type, value} = JSON.parse(e.nativeEvent.data);
        if(type==='cancelPayment'){
            openCancelAppStore();
        }else{
            await handleDataFromWeb(navigation, e.nativeEvent.data);
        }
    };

    function handleLoadEnd(){
        setIsLoading(false);
    }

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
};

export default MypageSubscriptionManage_W;
