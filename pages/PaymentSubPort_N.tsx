import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import { LineEEEEEE, OrangeBtnPress, OrangeBtnTxt, Space} from "../common/commonStyledComp";
import {  getWindowHeight, getWindowWidth, setCurrentPage, thousandComma } from "../common/commonFunc";
import { useAppDispatch } from "../store";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import colors from "../common/commonColors";
import userSlice from "../slices/user";
import EncryptedStorage from 'react-native-encrypted-storage';
import { Ionicons } from '@expo/vector-icons'; 
import { ActivityIndicator, Alert, Keyboard, Platform, Pressable, View } from "react-native";
import { initConnection, requestSubscription, getSubscriptions, Sku, finishTransaction, purchaseErrorListener, purchaseUpdatedListener, type ProductPurchase, type PurchaseError, type SubscriptionPurchase, flushFailedPurchasesCachedAsPendingAndroid, ProrationModesAndroid, getAvailablePurchases} from 'react-native-iap';
import { useSelector } from "react-redux";
import { checkNavigator } from "../common/navigator_w";
import { getIosTransctionReceipt, getPayment_SubscriptionProduct } from "../common/fetchData";
import { insertReportPaymentIos } from "../common/fetchData";
import { insertReportPaymentAndroid } from "../common/fetchData";



const windowWidth = getWindowWidth();
const os = Platform.OS;

const ScrollView = styled.ScrollView`
    flex:1; background-color: #FFFFFF; padding: 22px 22px; 
`
const PayTitle = styled.Text`
    font-family: 'noto700';font-size: 24px; line-height:27px; color:#4C4C4C;
`
const PayTitleTxt = styled.Text`
    font-family: 'noto700';font-size: 20px; line-height:24px; color:#4C4C4C; padding-top: 30px;
`
const TicketView = styled.View`
    width: 100%; height:88px; background-color: rgba(238, 238, 238, 0.20); padding:18px 16px; border-radius: 10px;
    border-color: #EEE; border-width: 1px; flex-direction: row;
`
const TicketImg = styled.Image`
    width: 36px; height:36px;
`
const TiecketBox = styled.View`
    width: 100%; height:100%;
`
const TiecketTxt1 = styled.Text`
    font-family: 'noto500';font-size: 16px; line-height:20px; color:#4C4C4C; padding-top: 6px;
`

const CheckTxtBox = styled.View`
    flex-direction: row; align-items: center; padding-top: 6px;
`
const CheckTxt = styled.Text`
    font-family: 'noto500';font-size: 13px; line-height:18px; color:#777; 
`
const CheckImg = styled.Image`
    width: 14px; height: 14px; margin-right: 3px;
`
const SelectTxtView = styled.View`
    width: 100%; height:70px; background-color: #FFF4EB; padding:0 16px; border-radius: 10px;
    border-color: #FFF4EB; border-width: 1px; flex-direction: row; align-items: center;
`
const SelectTxt = styled.Text`
     font-family: 'noto500';font-size: 14px; line-height:18px; color:#555; padding-top: 2px;
`

const SubInfoBox = styled.View`
    padding:5px 0px; flex-direction:row; justify-content: space-between;
`
const SubInfoTxt = styled.Text`
    font-family: 'noto500';font-size: 14px; line-height:18px; color:#777; 
`




//유의사항
const InfoView = styled.View`
    border-radius: 5px; background: rgba(246, 246, 246, 0.50); padding:20px 13px 20px;
`

const InfoTitle = styled.Text`
    font-family: 'noto500';font-size: 12px; line-height:15px; color:#777;
`
const InfoTxtBox = styled.View`
    flex-direction: row; margin-bottom: 2px;
`
const InfoTxtCircle = styled.View`
    width:4px; height:4px; border-radius: 50px; background-color:#999; margin-top: ${os==='ios'?8:7}px; margin-right: 8px;
`
const InfoTxt = styled.Text`
    font-family: 'noto400';font-size: 11px; line-height:20px; color:#999;
`

const AgreePress = styled.Pressable`
    height:58px; flex-direction: row; align-items: center; justify-content: center;
`
const ProductSelectTxt = styled.Text`
    font-family: 'noto300';font-size: 14px; line-height:17px; color:#999; padding-left: 8px; padding-top: 3px;
`

const LoaderView = styled.View`
    position: absolute; width:${windowWidth}px; height:100%; flex:1; background-color : rgba(0,0,0,0.5); align-items: center; justify-content: center;
`


const ChangeTxt = styled.Text`
    font-family: 'noto500';font-size: 12px; line-height:20px; color:#EC4D2D; 
`


export const PaymentSubPort_N = (props:any) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    let {ProductOptionId, appPrice, productName, appProductPlanId, appProductName, appProductNameIOS, isTrialAvailable}:any =  props.route.params.param.data;

    const productId = os==='ios'?appProductNameIOS:appProductName;

    // console.log(productId);
    const isCurrentUser =  props.route.params.param.isCurrentUser;
    console.log('isCurrentUser', isCurrentUser);
    
    const [isLoading, setIsLoading] = useState(true);
    
    const [productData, setProductData] = useState<any>([]);
    const [isShowPayLoader, setIsShowPayLoader] = useState(false);
    const [isAgreeChecked, setIsAgreeChecked] = useState(false);
    const [offerToken, setOfferToken] = useState('');

    const [resultReqCount, setResultReqCount] = useState(0);
    const [activeSubscriptionTokenAndroid, setActiveSubscriptionTokenAndroid] = useState<any>('');


    async function getData(){
        let accessToken:any = await EncryptedStorage.getItem('accessToken');
        if(accessToken==='expired'|| accessToken==null || accessToken==undefined){
            Alert.alert( '안내', '로그인을 해 주세요.',  [{text: '확인', onPress: () => {
                checkNavigator(navigation, 'back' , 'noParam');
            } }])
        }

        const data = await getPayment_SubscriptionProduct(ProductOptionId);

        if(data?.errCode == 'OBPF0007'){
            Alert.alert( '안내', data.errMsg,  [{text: '확인', onPress: () => {
                checkNavigator(navigation, 'back' , 'noParam');
                setTimeout(()=>{
                    checkNavigator(navigation, 'phoneCertification', {});
                },500)
            } }])
        }

        setProductData(data);
        setIsLoading(false)
        
        if(data.errCode==='OBPA0002'){
            Alert.alert( '안내', '이미 구독중 입니다.',  [{text: '확인', onPress: () => {
                // checkNavigator(navigation, 'back' , 'noParam');
            } }])
        }else if(data.errCode==='OBPF0007'){
           
        }

    }

    useEffect(()=>{
        getData();
        getActiveSubscription();
    },[]);
    
    useEffect(()=>{
        initIAP(); //초기화
        
    },[]);

    const skus:any = Platform.select({
        ios: [productId],
        android: [productId],
    });

    const getActiveSubscription = async () => {
        try {
            const purchases = await getAvailablePurchases();
            // console.log(purchases);
            
            const activeSubscription = purchases.find(p => p.productId.includes('orangeboard.portfolio.person'));
            
            if (activeSubscription) {
                // console.log('activeSubscription.purchaseToken : ', activeSubscription.purchaseToken);
                
                setActiveSubscriptionTokenAndroid(activeSubscription.purchaseToken)
                return activeSubscription.purchaseToken;
            } else {
                setActiveSubscriptionTokenAndroid('')
                console.log('No active subscription found');
                return null;
            }
        } catch (error) {
            console.error('Error fetching active subscription:', error);
            return null;
        }
    };


    const params:any = Platform.select({
        ios: {
            sku: productId,
            andDangerouslyFinishTransactionAutomaticallyIOS: false
        },
        android: {
            sku: productId,
            subscriptionOffers: [
                {
                    sku: productId,        
                    offerToken: offerToken,
                },
            ],
        }
    });

    const paramUpDownGrade = Platform.select({
        ios: {
            sku: productId,
            andDangerouslyFinishTransactionAutomaticallyIOS: false
        },
        android: {
            sku: productId,
            subscriptionOffers: [
                {
                    sku: productId,        
                    offerToken: offerToken,
                },
            ],

            // 기존 구독 관련 정보 추가
            oldSku: productId,  // 필요한 경우 기존 구독의 sku 정보도 전달
            purchaseToken: activeSubscriptionTokenAndroid,  // 기존 구독 토큰


            subscriptionUpdateParams: {
                oldSku: productId,  
                oldSkuAndroid: productId,
                purchaseToken: activeSubscriptionTokenAndroid, // 기존 구독의 purchaseToken
                prorationMode : ProrationModesAndroid.IMMEDIATE_AND_CHARGE_PRORATED_PRICE,
                prorationModeAndroid: ProrationModesAndroid.IMMEDIATE_AND_CHARGE_PRORATED_PRICE
            }
        }
    });



    const getItems = async () => {
        
        try {
            const items:any = await getSubscriptions({skus});
            // console.log(items[0].subscriptionOfferDetails)

            if(os=='android'){
                // console.log('결제선택 길이 : ',items[0].subscriptionOfferDetails.length);
                const productId = items[0].productId;
                // console.log(productId);
                
                if(appProductName===productId){
                    const arr = items[0].subscriptionOfferDetails;
                    for(let i=0; i<arr.length; i++){
                        const {offerId, offerToken, basePlanId} = arr[i];
                        if(basePlanId === appProductPlanId){
                            console.log('basePlanId : ', basePlanId);
                            
                            if(isTrialAvailable && offerId!=null){
                                console.log('-------trialCode---------');
                                setOfferToken(offerToken);
                                break;
                            }else if(offerId==null){
                                setOfferToken(offerToken);
                            }
                        }
                    }
                }
            }else{
                console.log('Trial 여부 : ',items[0].introductoryPricePaymentModeIOS);
            }
        } catch(error) {
            console.log('get item error: ', error);
        }
    }

    async function initIAP() {
        try {
            const init = await initConnection();
            await getItems();

        } catch (err:any) {
            console.warn(err.code, err.message);
        }
    }

    // 구매 시도
    async function buySubscription() {
        const param = isCurrentUser ?paramUpDownGrade:params;
        console.log(param);
        
        setIsShowPayLoader(true);
        try {
            const res = await requestSubscription(param);

            if(isCurrentUser){
                setTimeout(()=>{
                    goHome();
                },5000)
            }
        } catch (err:any) {
            console.warn(err.code, err.message);
        }
    }

     //리스너 처리
     useEffect(()=>{
        // 결제 성공시 listener
        let purchaseUpdateSubscription:any ='';
        console.log('결제 성공 리스너 작동!!!'); 


        purchaseUpdateSubscription = purchaseUpdatedListener(
            async (purchase: ProductPurchase | SubscriptionPurchase) => {
                console.log('isCurrentUser', isCurrentUser);
                
                console.log('---------결제성공 리스너 작동 --------------');
                //리스너 작동과 동시에 해제 
                purchaseUpdateSubscription.remove();
                // console.log('---------리스너 작동과 동시에 해제 --------------');


                const receipt = purchase?.transactionReceipt ? purchase?.transactionReceipt : purchase?.purchaseToken;

                if (receipt && !isCurrentUser) {
                    console.log('결제 성공 여부 진입 ');
                    try {
                        const response:any = await validateReceiptOnServer(receipt);
                        console.log(response);
                        
                        setIsShowPayLoader(false);
                        if (response?.code == '201') {
                            console.log('결제 성공! 201!!')
                            goHome();
                        }else if (response?.code == '452') {
                            Alert.alert('안내', `${response?.message?.errMsg}`);
                            setIsShowPayLoader(false);
                        } else { // 결제는 성공하였으나 결과 서버 저장에 실패
                            Alert.alert( '안내', `구독 결제 중 오류가 발생하였습니다.${'\n'}오렌지보드에 문의해 주세요.`,  [{text: '확인', onPress: () => {
                                goHome();
                            } }])
                        }
                    
                        const ackResult = await finishTransaction({purchase, isConsumable: false});
                        // console.log(ackResult);
                    
                    } catch(error) {
                        console.log('purchaseUpdatedListener에서 ackError: ', error);
                        setIsShowPayLoader(false);
                        Alert.alert( '안내', `구독 결제 중 오류가 발생하였습니다.${'\n'}오렌지보드에 문의해 주세요.`,  [{text: '확인', onPress: () => {
                            goHome();
                        } }])
                    }
                } 
            }
        ); // 결제 성공 리스너 끝!



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
            if(purchaseUpdateSubscription !==''){
                purchaseUpdateSubscription.remove();
            }
            purchaseErrorSubscription.remove();
        };
    },[]);


    // 영수증 서버 유효성 검사 함수 (서버 측에서 구현)
    async function validateReceiptOnServer(receipt:any) {
        if(os==='android'){
            const receiptObj:any = JSON.parse(receipt);
            const {purchaseToken} = receiptObj;
            const response:any = resultReqCount === 0 && !isCurrentUser && await insertReportPaymentAndroid(purchaseToken, '');
            setResultReqCount(resultReqCount+1);
            // const response:any = await insertReportPaymentAndroid(purchaseToken, '');
            return response;            
        }else if(os==='ios'){
            const response:any = resultReqCount === 0 && !isCurrentUser && await insertReportPaymentIos(receipt, '');
            setResultReqCount(resultReqCount+1);

            // const response:any = await insertReportPaymentIos(receipt, '');
            return response;
        }
    }


    const goHome = () =>{
        checkNavigator(navigation, 'home' , {isReload:'n'})
    }

    const appPriceStr = thousandComma(appPrice);

    if(isLoading){
        return null;
    }

    const {curSubscriptionList, curSubscriptionCount, subscriptionInfo} = productData;
    // console.log(productData);
    

    return (
        <>
        <ScrollView>
            <StatusBar style='dark' />

            <Space height={20} />
            <PayTitle>주문/결제</PayTitle>
            <PayTitleTxt>주문 정보</PayTitleTxt>
            <Space height={16} />

            <TicketView>
                <TicketImg source={require('../assets/icons_w/ticket.png')} />
                <TiecketBox>
                    <TiecketTxt1>{productName}</TiecketTxt1>
                    <CheckTxtBox>
                        <CheckImg source={require('../assets/icons_w/check_orange.png')}/>
                        <CheckTxt>매월 정기결제</CheckTxt>
                    </CheckTxtBox>
                </TiecketBox>
            </TicketView>

            <Space height={15} />

            <SelectTxtView>
                <SelectTxt><SelectTxt style={{color:'#FF7900'}}>고수선택</SelectTxt>은 이용권 결제 후, 마이페이지의 구독관리에서 가능해요.</SelectTxt>
            </SelectTxtView>


            {/* <Space height={55} />
            <PayTitleTxt>결제 정보</PayTitleTxt>
            <Space height={16} />


            <SubInfoBox>
                <SubInfoTxt>구독명</SubInfoTxt>
                <SubInfoTxt>{productName}</SubInfoTxt>
            </SubInfoBox>
            <SubInfoBox>
                <SubInfoTxt>구독기간</SubInfoTxt>
                <SubInfoTxt>{subscriptionInfo?.startDd} ~ {subscriptionInfo?.endDd}</SubInfoTxt>
            </SubInfoBox>
            <SubInfoBox>
                <SubInfoTxt>구독 가격</SubInfoTxt>
                <SubInfoTxt>{thousandComma(subscriptionInfo?.schedulePrice)}원/월</SubInfoTxt>
            </SubInfoBox>
            <SubInfoBox>
                <SubInfoTxt>다음 결제일</SubInfoTxt>
                <SubInfoTxt>{subscriptionInfo?.scheduleDd}</SubInfoTxt>
            </SubInfoBox> */}
            


            <Space height={30} />
            <InfoView>
                <InfoTitle>구독 이용안내</InfoTitle>
                <Space height={5} />

                <InfoTxtBox>
                    <InfoTxtCircle/>
                    <InfoTxt>이용권은 월간 정기결제 서비스이며 이용권을 결제한 날짜에 자동 결제됩니다. </InfoTxt>
                </InfoTxtBox>

                <InfoTxtBox>
                    <InfoTxtCircle/>
                    <InfoTxt>결제일이 존재하지 않는 달에는 해당 월의 마지막 날에 자동 결제됩니다.</InfoTxt>
                </InfoTxtBox>

                <InfoTxtBox>
                    <InfoTxtCircle/>
                    <InfoTxt>정기구독 해지 시 이용기간이 만료되는 날까지 이용권이 유지되며, 다음 결제일에 결제가 이루어지지 않습니다.</InfoTxt>
                </InfoTxtBox>

                <InfoTxtBox>
                    <InfoTxtCircle/>
                    <InfoTxt>정기구독 중 해지할경우 당월 이후 서비스가 즉시 종료되고 구독결제가 이루어지지 않습니다.</InfoTxt>
                </InfoTxtBox>

                {os==='ios' && 
                <>
                <InfoTxtBox>
                    <InfoTxtCircle/>
                    <InfoTxt>정기결제는 i Tunes Account로 구매가 진행됩니다.</InfoTxt>
                </InfoTxtBox>
                <InfoTxtBox>
                    <InfoTxtCircle/>
                    <InfoTxt>구독은 사용자가 관리할 수 있으며, iPhone 또는 iPad의 설정 {'>'} 사용자 {'>'} 구독으로 이동하여 구독을 중단 할 수 있습니다.</InfoTxt>
                </InfoTxtBox>
                <InfoTxtBox>
                    <InfoTxtCircle/>
                    <InfoTxt>구독결제는 Apple 미디어 서비스 이용 약관의 정책을 따릅니다.</InfoTxt>
                </InfoTxtBox>
                </>
                }

                {os==='android' && 
                <>
                <InfoTxtBox>
                    <InfoTxtCircle/>
                    <InfoTxt>Google Play 인앱 결제는 Google Payments 서비스 약관의 정책을 따릅니다.</InfoTxt>
                </InfoTxtBox>
                </>
                }
            </InfoView>


            <Space height={10} />

            <AgreePress onPress={()=>{setIsAgreeChecked(!isAgreeChecked)}} >
                <Ionicons name={isAgreeChecked?"checkbox":"checkbox-outline"} size={20} color={isAgreeChecked?colors.orangeBorder:'rgb(188,188,188)'} />
                <ProductSelectTxt>이용 안내 및 결제 진행에 동의합니다.</ProductSelectTxt>
            </AgreePress>

            <OrangeBtnPress 
                style={isAgreeChecked ?{}:{backgroundColor:'rgb(188, 188, 188)'}} 
                disabled={isAgreeChecked ?false:true}
                onPress={()=>{buySubscription()}}
            >
                <OrangeBtnTxt>결제 하기</OrangeBtnTxt>
            </OrangeBtnPress>
           
           <Space height={80}/>
        </ScrollView>

        {isShowPayLoader && <LoaderView><ActivityIndicator size="small" color="#FF7900"/></LoaderView>}

        </>
    );
}






