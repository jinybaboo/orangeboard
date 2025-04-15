import React, {useEffect, useRef, useState } from "react";

import WebView from "react-native-webview";

import { useIsFocused, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../common/variables_w";
import { SafeAreaView } from "react-native-safe-area-context";
import { safeAreaView } from "../common/commonStyle";
import { handleDataFromWeb } from "../common/navigator_w";
import Loader from "../assets/component_w/Loader";

const AnalysisMyRequest_W = (props:any) => {
    const [isLoading, setIsLoading] = useState(true);
    const navigation:any = useNavigation();
    const isFocused = useIsFocused();


    const webViewRef:any = useRef(null);
    const webviewUrl = `${BASE_URL}/analysis/myRequest?isApp=app`;

    const handleOnMessage = async (e:any) => {
        await handleDataFromWeb(navigation, e.nativeEvent.data);
    };

    function handleLoadEnd(){
        setIsLoading(false);
    }

    // 페이지가 웹뷰로 전환될 때마다 자동으로 페이지를 다시로드하는 useEffect
    useEffect(() => {
        if(webViewRef.current!==null && isFocused){
             webViewRef.current.reload();
        }
    }, [isFocused]);
    
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

export default AnalysisMyRequest_W;