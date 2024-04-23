import React, {useRef } from "react";

import WebView from "react-native-webview";

import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../common/variables_w";
import { SafeAreaView } from "react-native-safe-area-context";
import { safeAreaView } from "../common/commonStyle";
import { handleDataFromWeb } from "../common/navigator_w";

const ReportBuy_W = (props:any) => {
    const {type, ReportId, pageName, seoTitle} = props.route.params.param;
    const navigation:any = useNavigation();
    const webViewRef:any = useRef(null);
    const webviewUrl = `${BASE_URL}/report/buy?isApp=app&type=${type}&r=${ReportId}&pageName=${pageName}&seoTitle=${seoTitle}`;

    const handleOnMessage = async (e:any) => {
        await handleDataFromWeb(navigation, e.nativeEvent.data);
    };

    function handleLoadEnd(){
       
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
            </SafeAreaView>
    );
}

export default ReportBuy_W;