import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Platform, Pressable } from "react-native";
import styled from "styled-components/native";
import { decimalRound, getToday, getWindowWidth, setCurrentPage } from "../common/commonFunc";
import { useAppDispatch } from "../store";
import colors from "../common/commonColors";
import { useSelector } from "react-redux";
import { addOrDelReportBookmark, addOrDelReportLike, getUserAlert } from "../common/commonData";
import { Shadow } from 'react-native-shadow-2';
import userSlice from "../slices/user";
import { Space20 } from "../common/commonStyledComp";
import { goReportContent } from "../common/commonNav";

const os = Platform.OS;
const windowWidth = getWindowWidth();

const ShadowBox = styled.View`
    margin-left: 12px; 
`
const ReportListView = styled.View`
    width: ${windowWidth-32}px; padding:12px; flex-direction: row; 
`
const ReportInnerLeft = styled.View`
    width:${windowWidth - 32 - 24 - 72 - 14 - 12}px; padding-right:6px;
`
const ReportTitleBox = styled.View`
    position: relative; flex-direction: row;
`
const ReportTitleTxt = styled.Text`
    font-family: 'noto400'; font-size: 16px; line-height:23px; color:#000000; 
`

const PremiumBox = styled.View`
    border:1px solid ${colors.orangeBorder}; background-color:${colors.orangeBorder}; width:54px; height:20px; border-radius:2px; position: absolute; top:2px;
`
const PremiumBoxSpace = styled.View`
    width:59px; height:1px;
`

const PremiumTxt = styled.Text`
    font-family: 'noto700'; font-size: 12px; line-height:15px; color:#FFFFFF; text-align: center; padding-top:2px;
`

const InvestPointBox = styled(PremiumBox)`
     width:64px; border-color: #00C0CC; background-color: #00C0CC;
`
const InvestPointTxt = styled(PremiumTxt)`
    color:#FFFFFF;
`
const InvestPointSpace = styled(PremiumBoxSpace)`
     width:69px; 
`

const CreatorBox = styled.View`
    margin-top: 8px; flex-direction: row;
`
const CreatorImg = styled.Image`
    width:16px; height:16px; border-radius: 16px;
`
const CreatorTxt = styled.Text`
    font-family: 'noto400'; font-size: 13px; line-height:16px; color:#000000; padding-top: 1px; padding-left: 8px;
`

const RateView = styled.View`
    flex-direction: row; margin-top:12px;
`

const RateBox = styled.View`
    border:1px solid #FF3333; padding:2px 4px 0; height:20px; border-radius:2px; margin-right: 8px;
`
const RateTxt = styled.Text`
    font-family: 'noto700'; font-size: 12px; line-height:15.5px; color:#FF3333;
`
const RateBoxFinal = styled(RateBox)`
    background-color:#FF3333;
`
const RateTxtFinal = styled(RateTxt)`
    color:#FFFFFF;
`
const ContentImgBox = styled.View`
     width:96px; height: 72px; border: 1px solid #f6f6f6; position: relative; 
`
const ContentImg = styled.Image`
    width:96px; height: 72px;  position: absolute; border-radius: 4px;
`
const ContentImgBalckOpa = styled.View`
    width:96px; height: 72px;  position: absolute; border-radius: 4px; background-color: rgba(0,0,0,0.1); 
`
const BlackOpaBox = styled.View`
    position: relative;
`
const BookmarkImg = styled.Image`
    width:18px; height:20px;
`
const FavoImg = styled.Image`
    width:22.5px; height:19px; 
`
const ImgPress = styled.Pressable`
    position: absolute; right:12px; bottom:12px;
`
const LockImg = styled.Image`
    width:24px; height:24px; position:absolute; right:-2px; top:0px;
`
const ExclusiveBox = styled(RateBox)`
    border-color:#5E62F6; 
`
const HasStockBox = styled(RateBox)`
    border-color:#FF7900; 
`
const ExclusiveTxt = styled(RateTxt)`
    color:#5E62F6;
`
const HasStockTxt = styled(RateTxt)`
    color:#FF7900;
`

const MarginBox = styled(RateBox)`
    border-color:rgb(49, 140, 72); 
`
const MarginTxt = styled(RateTxt)`
    color:rgb(49, 140, 72);
`

const HeartView = styled.View`
    width: 100%; height:24px; margin-top: 12px; flex-direction: row;
`
const HeartImg = styled.Image`
    width:24px; height:24px;
`
const HeartTxt = styled.Text`
    font-family: 'noto400'; font-size: 13px; line-height:16px; color:#000000; padding-top:4.5px; margin-right: 8px;
`
const DateText = styled.Text`
    font-family: 'noto400'; font-size: 13px; line-height:20px; color:#999999; position: absolute;
    bottom:12px; right:12px;
`



const ReportListBox = (props:any)=>{
    const {item, from}:any = props;

    const dispatch = useAppDispatch();
    const navigation:any = useNavigation();

    const thumbnail = item?.thumbnail;
    const defaultThumb = '../assets/images/defaultThumb.png';
    const endTime = item.endTime==null?0:item.endTime.replace('/','');
    const today = getToday().substring(0,7).replace('-','');
    const isReportFinish = endTime>=today?false:true;
    const displayName = item.displayName;
    const creatorImg = item?.avatarUrl;

    let reportType = item.reportType;

    const readAvailableTime = item?.readAvailableTime;
    const targetRatio = item?.targetRatio==null?item?.targetRatio:decimalRound(item?.targetRatio,0);
    
    let isLock = false; 

    if(readAvailableTime==null){
        isLock = true;
    }else{
        const today = new Date(new Date().getTime() + 540*60*1000); 
        const readLimit = new Date(readAvailableTime);
        isLock = readLimit > today; 
    }


    let isExclusive = item.isExclusive==1?true:false;
    let stockHolding = item.stockHolding;
    let rateOfReturn = item.rateOfReturn==null?item.rateOfReturn:decimalRound(item.rateOfReturn, 1);


    let isRateViewExist = false;
    if(rateOfReturn!=null || isExclusive || stockHolding=='hold'){
        isRateViewExist = true;
    }

    async function delReportFavo(id:string){
        await addOrDelReportLike(id, true, dispatch, navigation);
        props.onData({'action':'reload'})
    }

    async function delReportBookmark(id:string){
        await addOrDelReportBookmark(id, true, dispatch, navigation);
        props.onData({'action':'reload'})
    }
    
   

    return (
        
            <ShadowBox>
            <Shadow		
                startColor="rgba(0,0,0,0.05)"
                endColor="rgba(255, 255, 255, 0.05)"
                distance={8}
                style={{width:windowWidth-32,backgroundColor:'#FFFFFF', borderRadius:8}}
                offset={[0,3]}
            >	
                <ReportListView>
                    <Pressable onPress={()=>{goReportContent(navigation, dispatch, item.ReportId, isLock)}}>
                        <ReportInnerLeft>
                            <ReportTitleBox>
                                {/* {reportType=='premium' &&<PremiumBox><PremiumTxt>프리미엄</PremiumTxt></PremiumBox>}
                                {reportType=='investPoint' &&<InvestPointBox><InvestPointTxt>투자포인트</InvestPointTxt></InvestPointBox>} */}
                                <ReportTitleTxt numberOfLines={2}>
                                    {/* {reportType=='premium' &&<PremiumBoxSpace /> }
                                    {reportType=='investPoint' &&<InvestPointSpace /> } */}
                                {item.title}</ReportTitleTxt>
                            </ReportTitleBox>

                            <CreatorBox>
                                {creatorImg==null?
                                <CreatorImg source={require('../assets/icons/defaultUser.png')}/>
                                :
                                <CreatorImg source={{uri:creatorImg}}/>}
                                <CreatorTxt>{displayName}</CreatorTxt>
                            </CreatorBox>
                            
                            {isRateViewExist ?<RateView>
                                {stockHolding=='hold' && <HasStockBox><HasStockTxt>보유</HasStockTxt></HasStockBox>}
                                {isExclusive && <ExclusiveBox><ExclusiveTxt>독점</ExclusiveTxt></ExclusiveBox>}

                                {targetRatio!==null && <MarginBox><MarginTxt>마진 {targetRatio}%</MarginTxt></MarginBox>}

                                {rateOfReturn==null?'':
                                isReportFinish?
                                <RateBoxFinal style={rateOfReturn<0&&{borderColor:'#0066FF', backgroundColor:'#0066FF'}}>
                                <RateTxtFinal>최종수익 {rateOfReturn}%</RateTxtFinal>
                                </RateBoxFinal>
                                :
                                <RateBox style={rateOfReturn<0&&{borderColor:'#0066FF'}}>
                                <RateTxt style={rateOfReturn<0&&{color:'#0066FF'}}>수익 {rateOfReturn}%</RateTxt>
                                </RateBox>
                                }
                            </RateView>
                            :
                            <Space20 />
                            }

                            <HeartView>
                                <HeartImg source={require('../assets/icons/reportHeart.png')}/>
                                <HeartTxt>{item.likeCount}</HeartTxt>

                                <HeartImg source={require('../assets/icons/reportReply.png')}/>
                                <HeartTxt>{item.commentCount}</HeartTxt>
                            </HeartView>
                        </ReportInnerLeft>
                    </Pressable>

                    <ContentImgBox>
                        <ContentImg source={thumbnail==null?require(defaultThumb):{uri : thumbnail}} />
                        
                        {
                        isLock && 
                        <BlackOpaBox>
                            <ContentImgBalckOpa />
                            <LockImg source={require('../assets/icons/lock.png')}/>
                        </BlackOpaBox>
                        }

                    </ContentImgBox>

                    {/* <ContentImgBox>
                        <ContentImg source={thumbnail==null?require(defaultThumb):{uri : thumbnail}} />
                        {from == 'bookmarkReport' && 
                            <Pressable onPress={()=>{delReportBookmark(item.ReportId)}}>
                                <ContentImgBalckOpa />
                                <BookmarkImg source={require('../assets/icons/bookmarkNoPadding.png')}/>
                            </Pressable>
                        }

                        {from == 'favoReport' && 
                            <Pressable onPress={()=>{delReportFavo(item.ReportId)}}>
                                <ContentImgBalckOpa />
                                <FavoImg source={require('../assets/icons/heartNoPadding.png')}/>
                            </Pressable>
                        }

                    </ContentImgBox> */}
                    {/* <DateText>{date}</DateText> */}
                    {from == 'bookmarkReport' && 
                        <ImgPress onPress={()=>{delReportBookmark(item.ReportId)}}>
                            <BookmarkImg source={require('../assets/icons/bookmarkNoPadding.png')}/>
                        </ImgPress>
                    }


                    {from == 'favoReport' && 
                        <ImgPress onPress={()=>{delReportFavo(item.ReportId)}}>
                            <FavoImg source={require('../assets/icons/heartNoPadding.png')}/>
                        </ImgPress>
                    }
                </ReportListView>
            </Shadow>
            </ShadowBox>
       
    )
}


export default ReportListBox;