import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import {  decimalRound, getDday, thousandComma } from "../common/commonFunc";
import { useAppDispatch } from "../store";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import colors from "../common/commonColors";
import { LineEEEEEE, Space } from "../common/commonStyledComp";
import { Alert, Platform, Pressable } from "react-native";
import { goSubscriptionPayPort, goSubscriptionPayReport} from "../common/commonNav";
import { getPayment_ProductReportAndPort } from "../common/fetchData";

import { initConnection, requestSubscription, getSubscriptions, Sku, finishTransaction, purchaseErrorListener, purchaseUpdatedListener, type ProductPurchase, type PurchaseError, type SubscriptionPurchase, flushFailedPurchasesCachedAsPendingAndroid,} from 'react-native-iap';
import { checkNavigator } from "../common/navigator_w";

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


const CheckTxtView = styled.View`
    flex-direction: row; height: 16px; margin-bottom: 12px;
`
const OrangeCheck = styled.Image`
    width: 16px; height: 16px; 
`
const CheckTxt = styled.Text`
    font-family: 'noto400';font-size: 14px; line-height:17px; color:#333; padding-left: 11px;
`
const BtnPressView = styled.View`
    justify-content: center; align-items: center;
`
const BtnPress = styled.Pressable`
    width:100px; height:40px; background-color:${colors.orangeBorder}; border-radius: 20px; justify-content: center; align-items: center;
`
const BtnTxt = styled.Text`
    font-family: 'noto500';font-size: 15px; line-height:18px; color:#fff; padding-top: 2px;
`
const RadioView = styled.View`
    background-color: #FBFBFB; border-radius: 10px;
`
const RadioBox = styled.View`
    width: 100%; height:50px; flex-direction:row; align-items: center; padding-left: 11px; padding-right: 16px; justify-content: space-between; position: relative;
`
const RadioLine = styled.View`
    width: 100%; height:1px; background-color: rgba(238, 238, 238, 0.5);
`
const RadioLeft = styled.View`
    flex-direction: row; position: relative;
`
const RadioImg = styled.Image`
    width: 16px; height: 16px; 
`
const RadioTxt1 = styled.Text`
    font-family: 'noto400';font-size: 14px; line-height:17px; color:#333; padding-left: 11px; padding-top: 1px;
`
const RadioTxt2 = styled(RadioTxt1)`
    font-family: 'noto500'; color:${colors.orangeBorder};  
`
const RadioTxt3 = styled(RadioTxt1)`
    font-family: 'noto500'; color:${colors.orangeBorder}; color: #999; font-size: 9px; padding-left: 40px; margin-top: -15px; padding-bottom: 3px;
`
const RadioTxt4 = styled.Text`
    font-family: 'noto700';font-size: 8px; line-height:11px; color:${colors.orangeBorder}; position: absolute; left:28px; top:-12px;
`
const RadioTxt5 = styled.Text`
    font-family: 'noto500';font-size: 10px; line-height:17px; color:#888; text-decoration: line-through; 
`
const RadioTx6 = styled.Text`
    font-family: 'noto400';font-size: 8px; line-height:11px; color:#555; position: absolute; right:17px; bottom:4px;
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

const Free1MBox = styled.View`
    width: 100%; height: 50px;border-radius: 10px; background: #FF7900; padding:0 15px; justify-content: center;
`
const FreeTxt1 = styled.Text`
    font-family: 'noto700';font-size: 14px; line-height:20px; color:#fff; 
`
const FreeTxt2 = styled.Text`
    font-family: 'noto500';font-size: 12px; line-height:15px; color:#fff; 
`

export const Payment_N = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    const [reportList, setReportList] = useState<any>([]);
    const [portList, setPortList] = useState<any>([]);

    const [selectedReport, setSelectedReport] = useState('');
    const [selectedReportData, setSelectedReportData] = useState('');


    const [selectedPort, setSelectedPort] = useState('');
    const [selectedPortData, setSelectedPortData] = useState<any>();

    const [selectedPortAll, setSelectedPortAll] = useState('');
    
    const [isLoading, setIsLoading] = useState(true);

    const [portfolioIds, setPortfolioIds] = useState('');

    const [nativeDataAndroid, setNativeDataAndroid] = useState<any>([]);
    const [nativeDataIos, setNativeDataIos] = useState<any>([]);


    function compareByPrice(a:any, b:any) {
        return a.appPrice - b.appPrice;
    }

    const getData = async () =>{
        const data = await getPayment_ProductReportAndPort();
        setReportList(data.reportProductList);
        const portList = data.portfolioProductList;
        portList.sort(compareByPrice);
        setPortList(portList);

        const portfolioIds:any = portList.reduce((returnArr:any, item:any) =>{								
            if( item.appProductName != ''){
                returnArr.push(item.appProductName)
            }							
            return returnArr;							
        },[]);	
        
        setPortfolioIds(portfolioIds);
        setIsLoading(false);
    }
    

    useEffect(()=>{
        getData();
    }, []);


    useEffect(()=>{
        initIAP(); //초기화
    },[isLoading]);


    if(isLoading){
        return null;
    }

    

    const skus:any = Platform.select({
        ios: portfolioIds,
        android: portfolioIds,
    });

    const getItems = async () => {
        try {
            const items:any = await getSubscriptions({skus});
            // console.log(items);

            if(os==='android'){
                setNativeDataAndroid(items);
            }else{
                setNativeDataIos(items);
            }
            
        } catch(error) {
            console.log('get item error: ', error);
        }
    }

    async function initIAP() {
        try {
            if(!isLoading){
                getItems();
                const init = await initConnection();
            }
           
        } catch (err:any) {
            console.warn(err.code, err.message);
        }
    }


    const checkBuyReport = () =>{
        if(selectedReport==='' || !selectedReport.includes('OBR')){
            Alert.alert('안내','구독할 리포트를 선택해 주세요.');
            return;
        }else{
            checkNavigator(navigation, 'paymentSubscription_report' , {data:selectedReportData})
        }
    }

    const checkBuyPortfolio = () =>{
        if(selectedPort==='' || !selectedPort.includes('OBP')){
            Alert.alert('안내','구독할 고수의계좌를 선택해 주세요.');
            return;
        }else{
            checkNavigator(navigation, 'paymentSubscription_port' , {data:selectedPortData})
        }
    }

    const checkBuyPortfolioAll = () =>{
        if(selectedPortAll==='' || !selectedPortAll.includes('OBP')){
            Alert.alert('안내','전체 고수의계좌를 선택해 주세요.');
            return;
        }else{
            checkNavigator(navigation, 'paymentSubscription_port' , {data:selectedPortData})
        }
    }

    if(isLoading){return null;}
    
    return (
        <ScrollView>
            <StatusBar style='dark' />

            <Space height={10} />
            <PayTitleView>
                <PayTitle>리포트 구독</PayTitle>
                <OrgImg source={require('../assets/icons_w/orange.png')}/>
            </PayTitleView>
            <PayTitleTxt>오렌지보드의 모든 리포트를 무제한 열람할 수 있는 플랜입니다.</PayTitleTxt>

            <Space height={16} />
            <LineEEEEEE />

            <Space height={16} />
            <CheckTxtView>
                <OrangeCheck source={require('../assets/icons_w/check_orange.png')} />
                <CheckTxt>리포트 무제한 열람</CheckTxt>
            </CheckTxtView>
            <CheckTxtView>
                <OrangeCheck source={require('../assets/icons_w/check_orange.png')} />
                <CheckTxt>유료 리포트 발행 Push 알림</CheckTxt>
            </CheckTxtView>
            <CheckTxtView>
                <OrangeCheck source={require('../assets/icons_w/check_orange.png')} />
                <CheckTxt>관심 크리에이터가 유료 리포트 발행 시 Push 알림</CheckTxt>
            </CheckTxtView>

            <Free1MBox>
                <FreeTxt1>리포트 구독 혜택</FreeTxt1>
                <FreeTxt2>최초 구독시 첫달 무료로 이용 가능!</FreeTxt2>
            </Free1MBox>
            <Space height={15} />

            <RadioView>
                {reportList.map((item:any, idx:number)=>{
                    const {ProductOptionId, isTrialAvailable, SubscriptionInfo, appProductName, price, regularPrice} = item;
                    
                    const priceStr = thousandComma(price);
                    const regularPriceStr = thousandComma(regularPrice);
                    const monthPriceStr = thousandComma(decimalRound(price/12,0));
                    const discountRateStr = decimalRound((1- price/regularPrice)*100, 0)
                        return(
                            <Pressable key={'report_'+idx} onPress={()=>{setSelectedReport(ProductOptionId); setSelectedReportData(item)}}>
                            <RadioBox>
                                <RadioLeft>
                                    <RadioImg source={item.ProductOptionId == selectedReport ? require('../assets/icons_w/radio_on_orange.png') : require('../assets/icons_w/radio_off_orange.png')}/>
                                    <RadioTxt1>{item.productName}</RadioTxt1>
                                    {regularPrice!==null && <RadioTxt4>{discountRateStr}%할인</RadioTxt4>}
                                </RadioLeft>
                                <RadioTxt2>
                                    {regularPrice !==null && <RadioTxt5>정가 {regularPriceStr}원 </RadioTxt5>}
                                    {priceStr}원
                                </RadioTxt2>
                                <RadioTx6>{ProductOptionId==='OBRPY' && `월 ${monthPriceStr}원`} (V.A.T 별도)</RadioTx6>
                            </RadioBox>
                            <RadioLine />
                            </Pressable>
                        )
                    })
                }
            </RadioView>

            <Space height={25} />

            <BtnPressView>
                <BtnPress onPress={checkBuyReport}>
                    <BtnTxt>구독하기</BtnTxt>
                </BtnPress>
            </BtnPressView>


            <Space height={70} />
            <PayTitleView>
                <PayTitle>고수의계좌 정기구독</PayTitle>
                <OrgImg source={require('../assets/icons_w/orange.png')}/>
            </PayTitleView>
            <PayTitleTxt>고수의계좌 서비스와 고수톡 혜택을 받을 수 있는 플랜입니다.</PayTitleTxt>

            <Space height={16} />
            <LineEEEEEE />

            <Space height={16} />
            <CheckTxtView>
                <OrangeCheck source={require('../assets/icons_w/check_orange.png')} />
                <CheckTxt>운용 보고서 열람</CheckTxt>
            </CheckTxtView>
            <CheckTxtView>
                <OrangeCheck source={require('../assets/icons_w/check_orange.png')} />
                <CheckTxt>실시간 고수톡 서비스 제공 </CheckTxt>
            </CheckTxtView>
            <CheckTxtView>
                <OrangeCheck source={require('../assets/icons_w/check_orange.png')} />
                <CheckTxt>고수의 계좌 공유</CheckTxt>
            </CheckTxtView>
            <Space height={15} />

             {/* 전체 고수*/}
            <Free1MBox>
                <FreeTxt1>고수의계좌 전체 구독 혜택</FreeTxt1>
                <FreeTxt2>최초 구독시 첫달 무료로 이용 가능!</FreeTxt2>
            </Free1MBox>
            <Space height={20} />

            <RadioView>
                {portList.map((item:any, idx:number)=>{
                    
                    let {ProductOptionId, isTrialAvailable, SubscriptionInfo, appProductName, price, regularPrice} = item;
                    const priceStr = thousandComma(price);
                    const regularPriceStr = thousandComma(regularPrice);
                    const discountRateStr = decimalRound((1- price/regularPrice)*100, 0)

                    const freeEndDd = SubscriptionInfo?.freeEndDd;
                    let dDay = freeEndDd===undefined?-1:getDday(freeEndDd);

                    let nativeInfo:any =[];

                    if(os==='android' && nativeDataAndroid.length!=0){
                        nativeInfo = nativeDataAndroid.filter( (item:any)=> {							
                            return item.productId == appProductName;
                        });
    
                        const androidTokenCount = nativeInfo[0]?.subscriptionOfferDetails.length;
                        nativeInfo = nativeInfo[0]?.subscriptionOfferDetails;
                        // console.log(androidTokenCount, nativeInfo)
    
                        if(androidTokenCount<2){
                            isTrialAvailable = false;
                        }
                    }

                    if(ProductOptionId!=='OBP99'){ 
                        return null;
                    }

                    return(
                        <Pressable key={'port_'+idx} onPress={()=>{setSelectedPortAll(item.ProductOptionId); setSelectedPortData(item)}}>
                        <RadioBox>
                            <RadioLeft>
                                <RadioImg source={item.ProductOptionId == selectedPortAll ? require('../assets/icons_w/radio_on_orange.png') : require('../assets/icons_w/radio_off_orange.png')}/>
                                <RadioTxt1>{item.productName}</RadioTxt1>
                                <RadioTxt4>세트 {discountRateStr}% 할인</RadioTxt4>
                            </RadioLeft>
                            <RadioTxt2>
                                <RadioTxt5>정가 {regularPriceStr}원 </RadioTxt5>
                                {dDay>=0?0:priceStr}원
                            </RadioTxt2>
                            <RadioTx6>(V.A.T 별도)</RadioTx6>
                        </RadioBox>
                        <RadioLine />
                        </Pressable>
                    )
                })
                }
            </RadioView>

            <Space height={25} />
            <BtnPressView>
                <BtnPress onPress={checkBuyPortfolioAll}>
                    <BtnTxt>구독하기</BtnTxt>
                </BtnPress>
            </BtnPressView>

            <Space height={60} />
            {/* 개별 고수 */}
            <RadioView>
                {portList.map((item:any, idx:number)=>{
                    
                    let {ProductOptionId, isTrialAvailable, SubscriptionInfo, appProductName, price, regularPrice} = item;
                    const priceStr = thousandComma(price);
                    const regularPriceStr = thousandComma(regularPrice);
                    const discountRateStr = decimalRound((1- price/regularPrice)*100, 0)

                    const freeEndDd = SubscriptionInfo?.freeEndDd;
                    let dDay = freeEndDd===undefined?-1:getDday(freeEndDd);

                    let nativeInfo:any =[];

                    if(os==='android' && nativeDataAndroid.length!=0){
                        nativeInfo = nativeDataAndroid.filter( (item:any)=> {							
                            return item.productId == appProductName;
                        });
    
                        const androidTokenCount = nativeInfo[0]?.subscriptionOfferDetails.length;
                        nativeInfo = nativeInfo[0]?.subscriptionOfferDetails;
                        
                        // console.log(androidTokenCount, nativeInfo)
    
                        if(androidTokenCount<2){
                            isTrialAvailable = false;
                        }
                    }

                    if(ProductOptionId==='OBP99'){ 
                        return null;
                    }

                    return(
                        <Pressable key={'port_'+idx} onPress={()=>{setSelectedPort(item.ProductOptionId); setSelectedPortData(item)}}>
                        <RadioBox>
                            <RadioLeft>
                                <RadioImg source={item.ProductOptionId == selectedPort ? require('../assets/icons_w/radio_on_orange.png') : require('../assets/icons_w/radio_off_orange.png')}/>
                                <RadioTxt1>
                                    {/* <RadioTxt2>{dDay<0 && isTrialAvailable && '[한달무료]  '}</RadioTxt2> */}
                                    <RadioTxt2 style={{fontFamily: 'noto700'}}>{dDay>=0 &&'[무료체험]  '}</RadioTxt2>
                                    {item.productName}
                                </RadioTxt1>
                                {regularPrice!==null && <RadioTxt4>{discountRateStr}%할인</RadioTxt4>}
                            </RadioLeft>
                            <RadioTxt2>
                                {regularPrice !==null && <RadioTxt5>정가 {regularPriceStr}원 </RadioTxt5>}
                                {dDay>=0?0:priceStr}원
                            </RadioTxt2>
                            {dDay<0 && <RadioTx6>(V.A.T 별도)</RadioTx6>}
                        </RadioBox>
                        {dDay>=0 && <RadioTxt3>* 24.03.01 ~ 24.05.30 까지 구독없이 무료로 이용할 수 있어요</RadioTxt3>}
                        <RadioLine />
                        </Pressable>
                    )
                })
                }
            </RadioView>

            <Space height={25} />
            <BtnPressView>
                <BtnPress onPress={checkBuyPortfolio}>
                    <BtnTxt>구독하기</BtnTxt>
                </BtnPress>
            </BtnPressView>


            
            <Space height={60} />
            <InfoView>
                <InfoTitle>유의사항</InfoTitle>
                <Space height={5} />

                <InfoTxtBox>
                    <InfoTxtCircle/>
                    <InfoTxt>구독 결제는 구독기간 마지막 날 진행되며 결제 후 구독기간은 자동 갱신됩니다.</InfoTxt>
                </InfoTxtBox>

                <InfoTxtBox>
                    <InfoTxtCircle/>
                    <InfoTxt>구독 결제 갱신을 중단하고자 할 경우 구독기간 종료 하루 전 까지 구독을 해지 하셔야 합니다.</InfoTxt>
                </InfoTxtBox>

                <InfoTxtBox>
                    <InfoTxtCircle/>
                    <InfoTxt>오렌지를 사용하여 콘텐츠를 열람한 이후에는 사용한 오렌지에 대한 구매 취소는 불가합니다.</InfoTxt>
                </InfoTxtBox>

                <InfoTxtBox>
                    <InfoTxtCircle/>
                    <InfoTxt>정기구독 중 해지할경우 당월 이후 서비스가 즉시 종료되고 구독결제가 이루어지지 않습니다.</InfoTxt>
                </InfoTxtBox>
            </InfoView>



            <Space height={60}/>
        </ScrollView>
    );
}









