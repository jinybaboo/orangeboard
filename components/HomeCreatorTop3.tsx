import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Dimensions, Pressable, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { decimalRound, getIsLockReport, getWindowWidth, setCurrentPage, thousandComma } from "../common/commonFunc";
import { CommonSeeMoreTxt, CommonTitle, EmptyView, LineF5F5F5, TitleUnderline } from "../common/commonStyledComp";
import { useAppDispatch } from "../store";
import colors from "../common/commonColors";
import userSlice from "../slices/user";
import { AntDesign } from '@expo/vector-icons'; 
import { goCreatorInfo } from "../common/commonNav";


const windowWidth = getWindowWidth();

const CreatorPress = styled.Pressable`
    height:90px; flex-direction: row; align-items: center;
`
const CreatorImgBox = styled.View`
    width: 68px; height:68px; border-radius: 5px; position:relative;
`
const RankImgBox = styled.View`
    width:18px; height:20px; position: absolute; left:6px; justify-content: center; align-items: center; margin-top: -2px;
`
const RankImg = styled.Image`
    width:18px; height:20px; position: absolute;
`
const RankTxt = styled.Text`
    font-family: 'noto700'; font-size: 11px; line-height:15px; color:#FFFFFF; margin-left: 0.5px;
`
const CreatorImage = styled.Image`
    width: 68px; height:68px; border-radius: 5px; border-width:1px; border-color:#F5F5F5;
`
const TxtBox = styled.View`
   height:68px; padding-left:14px; width:${windowWidth-44 - 68-20}px;
`
const Txt1 = styled.Text`
    font-family: 'noto500'; font-size: 15px; line-height:18px; color:#000000;
`
const Txt2Box = styled.View`
    flex-direction: row; margin-top: 2px;
`
const Txt2 = styled.Text`
    font-family: 'noto500'; font-size: 12px; line-height:15px; color:${colors.orangeBorder};
`
const Txt2_1 = styled(Txt2)`
    color:#777;
`
const Txt3 = styled.Text`
    font-family: 'noto400'; font-size: 12px; line-height:15px; color:#777777; margin-top: 3px;
`
const VerticalBar = styled.View`
    width:1.5px; height:8px; background-color: #D9D9D9; margin: 3px 5px 0;
`
const ArrowBox = styled.View`
    width:20px; height:90px; justify-content: center; align-items: center;
`

const SpreadBox = styled.View`
    height:90px; flex-direction: row; align-items: center; justify-content: space-between;
`
const ReportImage = styled.Image`
    width: 68px; height:68px; border-radius: 5px; border-width:1px; border-color:#F5F5F5;
`
const SeeMorePress = styled.Pressable`
    width: 68px; height:68px; border-radius: 5px; border-width:1px; border-color:#EEEEEE; 
    justify-content: center; align-items: center;
`
const SeeMoreTxt = styled.Text`
    font-family: 'noto500'; font-size: 12px; line-height:14px; color:#D9D9D9; margin-top: 3px;
`

export const HomeCreatorTop3 = ({data}:any)=>{
    const dispatch = useAppDispatch();
    const navigation:any = useNavigation();

    const [spreadNum, setSpreadNum] = useState<number>(10);

    const setSpread = (num:number) => {
        if(spreadNum == num){
            setSpreadNum(10);
        }else{
            setSpreadNum(num);
        }
    }

    return (
        <View>
        {data.map((item:any,idx:any)=>{
            const subCount = thousandComma(item.subscriber_count);
            return(
            <View key={idx+"key1"}>
                {/* <CreatorPress onPress={()=>{setSpread(idx)}}>  */}
                <CreatorPress onPress={()=>{goCreatorInfo(navigation, dispatch, item.creatorId)}}> 
                    <CreatorImgBox>

                        <CreatorImage source={{uri:item.avatarUrl}}/>
                        <RankImgBox>
                            <RankImg source={require('../assets/icons/rankBox.png')}/>
                            <RankTxt>{item.rank}</RankTxt>
                        </RankImgBox>
                    </CreatorImgBox>
                    <TxtBox>
                        <Txt1>{item.displayName}</Txt1>
                        <Txt2Box>
                            <Txt2>구독자 {subCount}명</Txt2>
                            {/* <VerticalBar/>
                            <Txt2_1>구독자 {subCount}</Txt2_1> */}
                        </Txt2Box>
                        <Txt3 numberOfLines={2}>{item.content}</Txt3>
                    </TxtBox>
                    <ArrowBox>
                        {/* <AntDesign name={spreadNum == idx?"up":"down"} size={12} color='#AAAAAA' /> */}
                    </ArrowBox>
                </CreatorPress>
                <LineF5F5F5/>
                {/* {spreadNum == idx && 
                <SpreadBox>
                    {item.reportsList.map((item2:any, idx2:number)=>{
                        return(
                            <ReportImage key={idx2+"key2"} source={{uri:item2.reportThumbnail}}/>
                        )
                    })}
                    <SeeMorePress onPress={()=>{goCreatorInfo(item.UserId)}}>
                        <SeeMoreTxt>리포트{'\n'}더보기</SeeMoreTxt>
                    </SeeMorePress>
                </SpreadBox>} */}
            </View>)
        })}
        
        </View>
    )
}

