import React, {useEffect, useRef, useState } from "react";

import WebView from "react-native-webview";

import { useIsFocused, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../common/variables_w";
import { SafeAreaView } from "react-native-safe-area-context";
import { safeAreaView } from "../common/commonStyle";
import { handleDataFromWeb } from "../common/navigator_w";
import Loader from "../assets/component_w/Loader";
import { sendDataToWeb } from "../common/common_w";
import { DeviceEventEmitter } from "react-native";

const PortfolioReviewList_W = (props:any) => {
    const [isLoading, setIsLoading] = useState(true);
    const navigation:any = useNavigation();
    const webViewRef:any = useRef(null);
    const webviewUrl = `${BASE_URL}/portfolio/reviewList?isApp=app`;

    const isFocused = useIsFocused();

    const handleOnMessage = async (e:any) => {
        await handleDataFromWeb(navigation, e.nativeEvent.data);
    };

    function handleLoadEnd(){
        setIsLoading(false);
    }

    useEffect(()=>{
        sendDataToWeb(webViewRef, 'reload','');
    },[isFocused]);


    // 이 페이지에서 홈화면 돌아가면 홈화면 데이터 및 피드 리프레시 되도록 설정
    useEffect(() => {
        return () => {
            // DeviceEventEmitter.emit('backFromHomeReload');
        }
    }, []);


    useEffect(() => {
        DeviceEventEmitter.addListener('backFromWriteReviewReload', () => {
            if(webViewRef!==null && webViewRef.current!==null){
                webViewRef.current.reload();
            }
        });
    }, [webViewRef]);
    
    return (
            <SafeAreaView style={safeAreaView}>
                <WebView 
                    ref={webViewRef}
                    source={{uri: webviewUrl}}
                    onMessage={handleOnMessage}
                    onLoadEnd={handleLoadEnd}
                    textZoom={100}
                />
                {/* {isLoading && <Loader />} */}
            </SafeAreaView>
    );
}

export default PortfolioReviewList_W;