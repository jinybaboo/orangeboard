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
import { initConnection, requestSubscription, getSubscriptions, Sku, finishTransaction, purchaseErrorListener, purchaseUpdatedListener, type ProductPurchase, type PurchaseError, type SubscriptionPurchase, flushFailedPurchasesCachedAsPendingAndroid,} from 'react-native-iap';
import { useSelector } from "react-redux";
import { checkNavigator } from "../common/navigator_w";
import { getPayment_SubscriptionProduct } from "../common/fetchData";
import { insertReportPaymentIos } from "../common/fetchData";
import { insertReportPaymentAndroid } from "../common/fetchData";

const windowWidth = getWindowWidth();
const os = Platform.OS;

const ScrollView = styled.ScrollView`
    flex:1; background-color: #FFFFFF; padding: 22px 22px; 
`

const TopBanner = styled.View`
    width: 100%; height:118px; background-color: ${colors.orangeBorder}; border-radius: 5px; align-items: center; justify-content: center;
`
const TopBannerTxt1 = styled.Text`
    font-family: 'noto500';font-size: 14px; line-height:17px; color:#FFF; text-align: center;
`
const TopBannerTxt2 = styled.Text`
    font-family: 'noto700';font-size: 18px; line-height:24px; color:#FFF; text-align: center;
`
const PayTitleView = styled.View`
    flex-direction: row;
`
const PayTitle = styled.Text`
    font-family: 'noto700';font-size: 18px; line-height:21px; color:#333;
`
const OrgImg = styled.Image`
    width: 18px; height:18px; margin-left: 3px;
`
const PayTitleTxt = styled.Text`
    font-family: 'noto300';font-size: 12px; line-height:15px; color:#555; padding-top: 6px;
`

const PriceView = styled.View`
    width: 100%; height:72px; background-color: #FBFBFB; padding:19px 20px 0; border-radius: 10px;
`
const PriceBox = styled.View`
    flex-direction: row; justify-content: space-between;
`
const PriceTxt1 = styled.Text`
    font-family: 'noto500';font-size: 14px; line-height:17px; color:#333; 
`
const PriceTxt2 = styled(PriceTxt1)`
    color:${colors.orangeBorder};
`
const PriceTxt3 = styled.Text`
    font-family: 'noto300';font-size: 10px; line-height:13px; color:#777; 
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

const SubInfoBox = styled.View`
    padding:5px 15px; flex-direction:row; justify-content: space-between;
`
const SubInfoTxt = styled.Text`
    font-family: 'noto500';font-size: 13px; line-height:20px; color:#333; 
`
const ChangeTxt = styled.Text`
    font-family: 'noto500';font-size: 12px; line-height:20px; color:#EC4D2D; 
`


export const PaymentSubPort_N = (props:any) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    let {ProductOptionId, appPrice, productName, appProductName, isTrialAvailable}:any =  props.route.params.param.data;
    const productId = appProductName;
    
    const [isLoading, setIsLoading] = useState(true);
    
    const [productData, setProductData] = useState<any>([]);
    const [isShowPayLoader, setIsShowPayLoader] = useState(false);
    const [isAgreeChecked, setIsAgreeChecked] = useState(false);
    const [offerToken, setOfferToken] = useState('');

    const [resultReqCount, setResultReqCount] = useState(0);

    async function getData(){
        let accessToken:any = await EncryptedStorage.getItem('accessToken');
        if(accessToken==='expired'|| accessToken==null || accessToken==undefined){
            Alert.alert( '안내', '로그인을 해 주세요.',  [{text: '확인', onPress: () => {
                checkNavigator(navigation, 'back' , 'noParam');
            } }])
        }

        const data = await getPayment_SubscriptionProduct(ProductOptionId);
        // console.log(data);
        
        setProductData(data);
        setIsLoading(false)
        
        if(data.errCode==='OBPA0002'){
            Alert.alert( '안내', '이미 구독중 입니다.',  [{text: '확인', onPress: () => {
                checkNavigator(navigation, 'back' , 'noParam');
            } }])
        }
    }

    useEffect(()=>{

        
        getData();
        
    },[]);

    
    
    useEffect(()=>{
        initIAP(); //초기화
    },[]);

    const skus:any = Platform.select({
        ios: [productId],
        android: [productId],
    });

    const params:any = Platform.select({
        ios: {
            sku: productId,
            andDangerouslyFinishTransactionAutomaticallyIOS: false
        },
        android: {
            skus: [productId],
            ...(offerToken && {
                subscriptionOffers: [
                {
                    sku: productId,          // as a string
                    offerToken: offerToken,  // as a string
                },
                ],
            })
        }
    });

    const getItems = async () => {
        
        try {
            const items:any = await getSubscriptions({skus});
            // console.log(items)
            if(os=='android'){
                console.log('결제선택 길이 : ',items[0].subscriptionOfferDetails.length);

                const productId = items[0].productId;
                if(appProductName===productId){
                    const arr = items[0].subscriptionOfferDetails;
                    for(let i=0; i<arr.length; i++){
                        const {offerId, offerToken} = arr[i];
                        if(isTrialAvailable && offerId!=null){
                            console.log('-------trialCode---------');
                            setOfferToken(offerToken);
                            break;
                        }else if(offerId==null){
                            setOfferToken(offerToken);
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
        setIsShowPayLoader(true);
        try {
            const res = await requestSubscription(params);
            console.log('requestSubscription');
        } catch (err:any) {
            console.warn(err.code, err.message);
        }
    }

    
     //리스너 처리
     useEffect(()=>{
        // 결제 성공시 listener
        let purchaseUpdateSubscription:any ='';
        console.log('결제 성공 리스너 작동!!!');
        

        setTimeout(()=>{

            purchaseUpdateSubscription = purchaseUpdatedListener(
                async (purchase: ProductPurchase | SubscriptionPurchase) => {
                    console.log('---------결제성공 리스너 작동 --------------');
                    //리스너 작동과 동시에 해제 
                    purchaseUpdateSubscription.remove();
                    console.log('---------리스너 작동과 동시에 해제 --------------');

                    const receipt = purchase?.transactionReceipt ? purchase?.transactionReceipt : purchase?.purchaseToken;

                    console.log('-----f---------');
                    
                    if (receipt) {
                        console.log('결제 성공 여부 진입 ');
                        try {
                            const response:any = await validateReceiptOnServer(receipt);
                            console.log(response);
                            
                            
                            setIsShowPayLoader(false);
                            
                            if (response?.code == '201') {
                                console.log('결제 성공! 201!!')
                                goHome();
                            }else if (response?.code == '452') {
                                Alert.alert('안내', `${response.message.errMsg}`);
                                setIsShowPayLoader(false);
                            } else { // 결제는 성공하였으나 결과 서버 저장에 실패
                                Alert.alert('안내', `구독 결제 중 오류가 발생하였습니다.${'\n'}오렌지보드에 문의해 주세요.`);
                                goHome();
                            }
                        
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
            const response:any = resultReqCount ===0 && await insertReportPaymentAndroid(purchaseToken, '');
            setResultReqCount(resultReqCount+1);
            return response;            
        }else if(os==='ios'){
            const response:any = resultReqCount ===0 && await insertReportPaymentIos(receipt, '');
            setResultReqCount(resultReqCount+1);
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

    return (
        <>
        <ScrollView>
            <StatusBar style='dark' />


            {curSubscriptionCount >0 && 

            <>
                <Space height={10} />
                <PayTitleView>
                    <PayTitle>현재 이용중인 고수의계좌 구독권</PayTitle>
                </PayTitleView>
                <PayTitleTxt>이용중인 고수의계좌 구독권이 있습니다.</PayTitleTxt>

                {curSubscriptionList.map((item:any, idx:number)=>{
                    return(
                        <View key={'cur_'+idx}>
                            <Space height={16} />
                            <PriceView>
                                <PriceBox>
                                    <PriceTxt1>{item.productName}</PriceTxt1>
                                    <PriceTxt2>{thousandComma(item.paidPrice)}원</PriceTxt2>
                                </PriceBox>
                                <Space height={3}/>
                                <PriceBox>
                                    <PriceTxt3>고수의계좌 열람, 실시간 고수톡 서비스 혜택</PriceTxt3>
                                    {/* <PriceTxt3 style={isTrialAvailable&&{color:colors.orangeBorder}}>{isTrialAvailable?'첫달 무료 적용':'부가세포함'}</PriceTxt3> */}
                                    <PriceTxt3>부가세포함</PriceTxt3>
                                </PriceBox>
                            </PriceView>

                            <SubInfoBox>
                                <SubInfoTxt>이용기간</SubInfoTxt>
                                <SubInfoTxt>{item.startDd} ~ {item.endDd}</SubInfoTxt>
                            </SubInfoBox>
                            <SubInfoBox>
                                <SubInfoTxt>다음 결제일</SubInfoTxt>
                                <SubInfoTxt>{item.scheduleDd}</SubInfoTxt>
                            </SubInfoBox>
                            <SubInfoBox>
                                <SubInfoTxt>결제 예정금액</SubInfoTxt>
                                <SubInfoTxt>{thousandComma(item.schedulePrice)}원</SubInfoTxt>
                            </SubInfoBox>
                        </View>
                     )
                })
                }

                <Space height={10} />
                <ChangeTxt> * 현재 이용중인 고수의 계좌 구독권은 반드시 해지해 주세요.</ChangeTxt>
                <Space height={20} />
                <LineEEEEEE />
                <Space height={25} />
            </>
            }



            <Space height={10} />
            <PayTitleView>
                <PayTitle>구매할 고수의계좌 구독권</PayTitle>
            </PayTitleView>
            <PayTitleTxt>구매할 고수의계좌 구독권을 확인해주세요.</PayTitleTxt>

            <Space height={16} />

            <PriceView>
                <PriceBox>
                    <PriceTxt1>{productName}</PriceTxt1>
                    <PriceTxt2>{appPriceStr}원</PriceTxt2>
                </PriceBox>
                <Space height={3}/>
                <PriceBox>
                    <PriceTxt3>고수의계좌 열람, 실시간 고수톡 서비스 혜택</PriceTxt3>
                    {/* <PriceTxt3 style={isTrialAvailable&&{color:colors.orangeBorder}}>{isTrialAvailable?'첫달 무료 적용':'부가세포함'}</PriceTxt3> */}
                    <PriceTxt3>부가세포함</PriceTxt3>
                </PriceBox>
            </PriceView>

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
            </SubInfoBox>
            


            <Space height={60} />
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






