import React, {useEffect, useRef, useState } from "react";

import WebView from "react-native-webview";

import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../common/variables_w";
import { SafeAreaView } from "react-native-safe-area-context";
import { safeAreaView } from "../common/commonStyle";
import { checkNavigator, handleDataFromWeb } from "../common/navigator_w";
import Loader from "../assets/component_w/Loader";
import { initConnection, requestSubscription, getSubscriptions, Sku, finishTransaction, purchaseErrorListener, purchaseUpdatedListener, type ProductPurchase, type PurchaseError, type SubscriptionPurchase, flushFailedPurchasesCachedAsPendingAndroid,} from 'react-native-iap';
import { ActivityIndicator, Alert, Platform } from "react-native";
import { insertReportPaymentAndroid, insertReportPaymentIos } from "../common/fetchData";
import { useAppDispatch } from "../store";
import styled from "styled-components/native";
import { getWindowWidth } from "../common/commonFunc";

const windowWidth = getWindowWidth();

const LoaderView = styled.View`
    position: absolute; width:${windowWidth}px; height:100%; flex:1; background-color : rgba(0,0,0,0.5); align-items: center; justify-content: center;
`

const PaymentSubReport_W = (props:any) => {
    const dispatch = useAppDispatch();
    const [isShowPayLoader, setIsShowPayLoader] = useState(false);


    const os = Platform.OS;
    const {ProductOptionId, appProductName_Report} = props.route.params.param;

    const [isLoading, setIsLoading] = useState(true);
    const navigation:any = useNavigation();
    const webViewRef:any = useRef(null);
    const webviewUrl = `${BASE_URL}/payment/subscription_report?isApp=app&ProductOptionId=${ProductOptionId}`;
    const [offerToken, setOfferToken] = useState('');


    const handleOnMessage = async (e:any) => {
        const {type, value, param} = JSON.parse(e.nativeEvent.data);
        if(type==='payment'){
            buySubscription();
        }else{
            await handleDataFromWeb(navigation, e.nativeEvent.data);
        }
    };

    function handleLoadEnd(){
        setIsLoading(false);
    }


    useEffect(()=>{
        initIAP(); //초기화
    },[]);

    const skus:any = Platform.select({
        ios: [appProductName_Report],
        android: [appProductName_Report],
    });

    const params:any = Platform.select({
        ios: {
            sku: appProductName_Report,
            andDangerouslyFinishTransactionAutomaticallyIOS: false
        },
        android: {
            skus: [appProductName_Report],
            ...(offerToken && {
                subscriptionOffers: [
                {
                    sku: appProductName_Report,          // as a string
                    offerToken: offerToken,  // as a string
                },
                ],
            })
        }
    });

    async function initIAP() {
        try {
            const init = await initConnection();
            getItems();
           
        } catch (err:any) {
            console.warn(err.code, err.message);
        }
    }

    const getItems = async () => {
       
        try {
            const items:any = await getSubscriptions({skus});
            if(os=='android'){
                setOfferToken(items[0]?.subscriptionOfferDetails[0]?.offerToken);
            }
           
        } catch(error) {
            console.log('get item error: ', error);
        }
    }


    // 구매 시도
    async function buySubscription() {
        setIsShowPayLoader(true);
        try {
            await requestSubscription(params);
        } catch (err:any) {
            console.warn(err.code, err.message);
        }
    }



    //리스너 처리
    useEffect(()=>{
        // 결제 성공시 listener
        let purchaseUpdateSubscription:any ='';

        setTimeout(()=>{

            purchaseUpdateSubscription = purchaseUpdatedListener(
                async (purchase: ProductPurchase | SubscriptionPurchase) => {
                    console.log('---------결제성공 리스너 작동 --------------');
                    //리스너 작동과 동시에 해제 
                    purchaseUpdateSubscription.remove();
                    console.log('---------리스너 작동과 동시에 해제 --------------');

                    const receipt = purchase?.transactionReceipt ? purchase?.transactionReceipt : purchase?.purchaseToken;
                    if (receipt) {
                        try {
                            const response:any = await validateReceiptOnServer(receipt);
                            setIsShowPayLoader(false);

                            if (response?.code == '201') {
                                checkNavigator(navigation, 'home' , {isReload:'y'});
                            } else { // 결제는 성공하였으나 결과 서버 저장에 실패
                                Alert.alert('실패', `구독 결제 중 오류가 발생하였습니다.${'\n'}오렌지보드에 문의해 주세요.`);
                            }
                            
                            checkNavigator(navigation, 'home' , {isReload:'y'});
                            const ackResult = await finishTransaction({purchase, isConsumable: false});
                            // console.log(ackResult);
                        
                        } catch(error) {
                            console.log('purchaseUpdatedListener에서 ackError: ', error);
                            setIsShowPayLoader(false);
                            // Alert.alert('실패', `구독 결제 중 오류가 발생하였습니다.${'\n'}오렌지보드에 문의해 주세요.`);
                        }
                    }
                }
            ); // 결제 성공 리스너 끝!

        },3000);


        //결제 취소 또는 실패시 리스너
        const purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
            //리스너 작동과 동시에 해제 
            purchaseErrorSubscription.remove();

            setIsShowPayLoader(false);
            if (error && error.code === 'E_USER_CANCELLED') {
                Alert.alert('취소', '구독 결제를 취소하셨습니다.');
            } else {
                Alert.alert('실패', '구독 결제 중 오류가 발생하였습니다.');
            }
        }); //결제 실패 리스너 끝!

        return () => {
            purchaseUpdateSubscription.remove();
            purchaseErrorSubscription.remove();
        };
    },[]);


    // 영수증 서버 유효성 검사 함수 (서버 측에서 구현)
    async function validateReceiptOnServer(receipt:any) {
        if(os==='android'){
            const receiptObj:any = JSON.parse(receipt);
            const {purchaseToken} = receiptObj;
            const response:any = await insertReportPaymentAndroid(purchaseToken, 'donationCode', dispatch, navigation);
            return response;            
        }else if(os==='ios'){
            const response:any = await insertReportPaymentIos(receipt, 'donationCode', dispatch, navigation);
            return response;
        }
    }

    
    return (
            <>
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

            {isShowPayLoader && <LoaderView><ActivityIndicator size="small" color="#FF7900"/></LoaderView>}
            </>
    );
}

export default PaymentSubReport_W;