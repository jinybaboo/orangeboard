import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import styled from "styled-components/native";
import { getWindowWidth, setCurrentPage } from "../../common/commonFunc";
import userSlice from "../../slices/user";
import { useAppDispatch } from "../../store";

const windowWidth = getWindowWidth();
const seriesImgWidth = windowWidth - 32;
const seriesImgHeight = seriesImgWidth/1.6;
const seriesTitleWidth = seriesImgWidth - 32;


const SeriseBox = styled.View`
    width:${seriesImgWidth}px;
    height:${seriesImgHeight}px;
    border-radius:8px;
    margin-left:16px;
    position: relative;
    margin-bottom: 20px;
`

const SeriseImage = styled.Image`
    width:100%;
    height:100%;
    border-radius:8px;
`

const SeriseBlackOpacity = styled.View`
    width:100%;
    height:100%;
    border-radius:8px;
    background-color: rgba(0,0,0,0.2);
    position: absolute;
    top:0; left:0;
`

const SeriseCountBox = styled.View`
    width: 39px;
    height: 24px;
    border-radius: 12px;
    background-color: rgba(0,0,0,0.6);
    justify-content: center;
    align-items: center;
    position: absolute;
    right:16px;
    top:16px;
`

const SeriseCountTxt = styled.Text`
    font-family: 'noto500';
    font-size: 16px;
    line-height:19px;
    color:#FFFFFF;
`

const SeriseTitleBox = styled.View`
    width:${seriesTitleWidth}px;
    padding-bottom: 24px;
    position:absolute;
    bottom:0;
    left:16px;
`
const SeriseTitleTxt = styled.Text`
    font-family: 'noto700';
    font-size: 20px;
    line-height:23px;
    color:#FFFFFF;
`
const SeriseWriterTxt = styled.Text`
    font-family: 'noto500';
    font-size: 16px;
    line-height:19px;
    color:#FFFFFF;
    padding-top: 10px;
`



const SeriesSelectBox = ({dataSet}:any)=>{
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    function goReportInfoMore(id:string, seriesName:string){
        dispatch(userSlice.actions.setReportId(id));
        dispatch(userSlice.actions.setSeriesName(seriesName));
        setCurrentPage(dispatch, 'ReportInfoMoreForSeries');
        navigation.navigate("ReportInfoMoreForSeries" as never);
    }

    const lastThumbnail = dataSet.lastThumbnail;
    const defaultThumb = '../../assets/images/defaultThumb.png'
    const reportCount:number = dataSet.reportCount;
    
    return(
        <Pressable key={dataSet?.id} onPress={()=>{goReportInfoMore(dataSet?.id, dataSet?.seriesName)}}>
            {reportCount!=0 && <SeriseBox>
                {
                lastThumbnail==null?<SeriseImage source={require(defaultThumb)}></SeriseImage>
                :<SeriseImage source={{uri:dataSet?.lastThumbnail}}></SeriseImage>
                }
                <SeriseBlackOpacity>
                    <SeriseCountBox><SeriseCountTxt>+{reportCount}</SeriseCountTxt></SeriseCountBox>
                    <SeriseTitleBox>
                        <SeriseTitleTxt>{dataSet?.seriesName}</SeriseTitleTxt>
                        <SeriseWriterTxt>{dataSet?.User?.Profile?.displayName}</SeriseWriterTxt>
                    </SeriseTitleBox>
                </SeriseBlackOpacity>
            </SeriseBox>}
        </Pressable>
)}

export default SeriesSelectBox;