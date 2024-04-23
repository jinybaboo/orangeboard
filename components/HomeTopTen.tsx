import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Dimensions, Pressable, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { changeDataTypeDot, decimalRound, getIsLockReport, setCurrentPage, thousandComma } from "../common/commonFunc";
import { CommonSeeMoreTxt, CommonTitle, EmptyView, TitleUnderline } from "../common/commonStyledComp";
import { useAppDispatch } from "../store";
import colors from "../common/commonColors";
import userSlice from "../slices/user";
import { goReportContent } from "../common/commonNav";


const TopTenSlideBox2 = styled.FlatList``
const TopTenReportPress = styled.Pressable`
    width:180px; position: relative;
`
const TopTenImgBox = styled.View`
  width:180px; height:180px; border-radius: 5px; 
`
const TopTenImg = styled.Image`
  width:180px; height:180px; border-radius: 5px;border: 1px; border-color: ${colors.borderGray};
`
const TopTenTxt1 = styled.Text`
 font-family: 'noto500'; font-size: 12px; line-height:15px; color:#999999; margin-top: 10px;
`
const TopTenTxt2Box = styled.Text`
margin-top:6px;
`
const TopTenTxt2 = styled.Text`
 font-family: 'noto500'; font-size: 15px; line-height:19px; color:#000;
`
const BannerBox = styled.View`
 flex-direction:row;
`
const Banner = styled.View`
 background-color:rgba(255, 121, 0, 0.1) ; padding:3px 5px; border-radius: 3px; margin-right:4px; margin-top: 9px;
`
const BannerTxt = styled.Text`
    font-family: 'noto500'; font-size: 10px; line-height:13px; color:rgba(255, 121, 0, 1);
`
const SliderGap2 = styled.View`
    width:14px;
`
const BlackOpa = styled.View`
    width:180px; height:180px; border-radius: 5px; position: absolute; top:0; left:0; background-color: rgba(0,0,0,0.3);
    align-items: center; justify-content: center;
`
const LockImg = styled.Image`
    width:30px; height:30px; 
`
const DateBox = styled.View`
    flex-direction: row; margin-top: 4px; align-items: center; justify-content: space-between;
`
const DateTxt = styled.Text`
    font-family: 'noto400'; font-size: 12px; line-height:15px; color:#999999; 
`
const LikeBox = styled.View`
    flex-direction: row; 
`
const LikeImg = styled.Image`
    width:11px; height:11px; margin-top: 1px;
`
const ReplyImg = styled.Image`
    width:10px; height:8px; margin-top: 3px;
`
const LikeTxt = styled.Text`
    font-family: 'noto400'; font-size: 11px; line-height:14px; color:#999999; padding-right:4px; padding-left: 2px;
`

export const HomeTopTen = ({data:top10}:any)=>{
    const dispatch = useAppDispatch();
    const navigation:any = useNavigation();

    const RenderReportBox = ({item}:any)=>{
        let {title, targetRatio, rateOfReturn} = item;
        const readAvailableTime = item.readAvailableTime;
        const isLock = getIsLockReport(readAvailableTime);
        const createdAt = changeDataTypeDot(item.createdAt);

        title = title.length<=28?title:title.substring(0,28)+'...';
        return(
            <TopTenReportPress onPress={()=>{goReportContent(navigation, dispatch,item.ReportId, isLock)}}>
                <TopTenImgBox>
                    <TopTenImg source={{uri:item.thumbnail}}/>
                </TopTenImgBox>
                {isLock && <BlackOpa>
                    <LockImg source={require('../assets/icons/lock_new.png')}/>
                </BlackOpa>}
                <TopTenTxt1>{item.displayName}</TopTenTxt1>
                <TopTenTxt2Box>
                    <TopTenTxt2 numberOfLines={2}>{title}</TopTenTxt2>
                </TopTenTxt2Box>
                <BannerBox>
                    {targetRatio!=null && <Banner>
                        <BannerTxt>마진 {targetRatio}%</BannerTxt> 
                    </Banner>}
                   {rateOfReturn !=null && <Banner style={rateOfReturn>=0?{backgroundColor:'rgba(255, 0, 0, 0.05)'}:{backgroundColor:'rgba(70, 122, 255, 0.05)'}}>
                        <BannerTxt style={rateOfReturn>=0?{color:'#F00'}:{color:'#4579FF'}}>수익 {rateOfReturn}%</BannerTxt>
                    </Banner>}
                </BannerBox>
                <DateBox>
                    <DateTxt>{createdAt}</DateTxt>
                    <LikeBox>
                        <LikeImg source={require('../assets/icons/heart_kh.png')}/>
                        <LikeTxt>{item.likeCount}</LikeTxt>
                        <ReplyImg source={require('../assets/icons/reply_kh.png')}/>
                        <LikeTxt>{item.commentCount}</LikeTxt>
                    </LikeBox>
                </DateBox>
            </TopTenReportPress>
        )
    };

    return (
        <TopTenSlideBox2
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingLeft:22, paddingRight:22}}
                ItemSeparatorComponent={()=><SliderGap2/>}
                data ={top10}
                renderItem={RenderReportBox}
                keyExtractor={(item, index) => index.toString()+"pwj"}
        />
    )
}

