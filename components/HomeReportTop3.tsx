import React, { useEffect, useState } from "react";
import { Platform, Pressable, View } from "react-native";
import styled from "styled-components/native";
import { getIsLockReport, getWindowWidth, setCurrentPage } from "../common/commonFunc";
import colors from "../common/commonColors";
import { LineF5F5F5 } from "../common/commonStyledComp";
import userSlice from "../slices/user";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "../store";
import { goReportContent } from "../common/commonNav";

const os = Platform.OS;
const windowWidth = getWindowWidth();


const Top3View = styled.View`
        
`
const Top3Press = styled.Pressable`
    width:100%; height:84px; flex-direction: row; align-items: center;
`
const Rank = styled.Text`
    font-family: 'noto700'; font-size: 15px; line-height:17px; color:${colors.orangeBorder};
`
const ImageBox = styled.View`
    width:65px; height:65px; border-radius: 5px; margin-left:10px; position: relative;
`
const ReportImg = styled.Image`
    width:65px; height:65px; border-radius: 5px; border-width: 1px; border-color: #F5F5F5;
`
const TxtBox = styled.View`
    width:${windowWidth - 44 - 65 - 10}px; height:84px; padding:0 12px; justify-content: center;
`
const Txt1 = styled.Text`
    font-family: 'noto400'; font-size: 15px; line-height:18px; color:#000000;
`
const TxtBox2 = styled.View`
    flex-direction: row; align-items: center; margin-top: 3px;
`
const Txt2 = styled.Text`
    font-family: 'noto400'; font-size: 12px; line-height:15px; color:#F00;
`
const Txt3Box = styled.View`
    background-color: rgba(255, 0, 0, 0.05); margin-left: 5px; border-radius: 50px; 
`
const Txt3 = styled(Txt2)`
      padding:3px 6px;
`
const BlackOpa = styled.View`
     width:65px; height:65px; border-radius: 5px; position: absolute; top:0; left:0; background-color: rgba(0,0,0,0.3);
`
const LockImg = styled.Image`
    width:21px; height:21px; position: absolute; bottom:7px; right:7px;
`


export const HomeReportTop3 = ({data}:any)=>{
    const dispatch = useAppDispatch();
    const navigation:any = useNavigation();
   
    return (
        
        <Top3View>
        {data.map((item:any, idx:number)=>{
            const readAvailableTime = item.readAvailableTime;
            const isLock = getIsLockReport(readAvailableTime);
            return(
                <View key={idx+'top'}>
                <Top3Press onPress={()=>{goReportContent(navigation, dispatch,item.reportId, isLock)}}>
                    <Rank>{idx+1}</Rank>
                    <ImageBox>
                        <ReportImg source={{uri:item.thumbnail}}/>
                        {isLock && <BlackOpa>
                            <LockImg source={require('../assets/icons/lock_new.png')}/>
                        </BlackOpa>}
                    </ImageBox>
                    <TxtBox>
                        <Txt1 numberOfLines={2}>{item.title}</Txt1>
                        <TxtBox2>
                            <Txt2 style={item.rateOfReturn<0?{color:'#4579FF'}:{color:'#F00'}}>{item.corpName}</Txt2>
                            <Txt3Box style={item.rateOfReturn<0?{backgroundColor:'rgba(70, 122, 255, 0.05)'}:{backgroundColor:'rgba(255, 0, 0, 0.05)'}}>
                                <Txt3 style={item.rateOfReturn<0?{color:'#4579FF'}:{color:'#F00'}}>{item.rateOfReturn}%</Txt3>
                            </Txt3Box>
                        </TxtBox2>
                    </TxtBox>
                </Top3Press>
                {idx!==2&&<LineF5F5F5 />}
                </View>
            )
        })}
       
    </Top3View>
       
    )
}

