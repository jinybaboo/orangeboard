import React, { useEffect, useState } from "react";
import { Platform, Pressable, View } from "react-native";
import styled from "styled-components/native";
import { getIsLockReport, getWindowWidth, setCurrentPage } from "../common/commonFunc";
import colors from "../common/commonColors";
import { LineF5F5F5 } from "../common/commonStyledComp";
import userSlice from "../slices/user";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "../store";
import Swiper from "react-native-swiper";
import { changeDataTypeDot } from "../common/commonFunc";
import { goReportContent } from "../common/commonNav";

const os = Platform.OS;
const windowWidth = getWindowWidth();


const NewView = styled.View`
    height:475px; margin-bottom: 27px; 
`
const NewPress = styled.Pressable`
    height:94px;
`
const MarginView = styled.View`
    margin-top: 16px; flex-direction: row; align-items: center;
`
const MarginBox = styled.View`
    background-color:rgba(255, 242, 229, 1) ; padding:3px 5px; border-radius: 3px;
`
const MarginText = styled.Text`
    font-family: 'noto500'; font-size: 10px; line-height:13px; color:rgba(255, 121, 0, 1);
`
const TitleView = styled.View`
    flex-direction: row; margin-top: 8px;
`
const LockImage = styled.Image`
    width:9px; height:12px; margin-top: 1.6px; margin-right: 7px;
`
const TitleTxt = styled.Text`
    width:${windowWidth-44 - 9 - 7}px ;font-family: 'noto400'; font-size: 15px; line-height:18px; color:#000000; 
`
const BtmTxtView = styled.View`
    flex-direction: row; margin-top: 8px;
`
const BomTxt1 = styled.Text`
    font-family: 'noto400'; font-size: 12px; line-height:15px; color:#AAAAAA;
`

export const HomeNewReport = ({data}:any)=>{
    const dispatch = useAppDispatch();
    const navigation:any = useNavigation();
   
    return (
        <NewView>
        <Swiper 
            autoplay 
            showsPagination={true} 
            paginationStyle={{bottom:-20}}
            activeDotColor ='#999999'
            autoplayTimeout = {5}
        >
            
           { data.map((pageData:any, idx:any)=>{
                return(
                   <View key={idx+'_domestic'}>
                        {pageData.map((item:any, idx2:any)=>{
                            const createdAt = changeDataTypeDot(item.createdAt);
                            const isLock = getIsLockReport(item.readAvailableTime)
                            // console.log(item.title, item.readAvailableTime);
                            return(
                            <View key={idx2+"_new"}>
                                <NewPress onPress={()=>{goReportContent(navigation, dispatch,item.reportId, isLock)}}>
                                    {item.maginOfRetrun !=null ? 
                                    <MarginView>
                                        <MarginBox><MarginText>마진 {item.maginOfRetrun}%</MarginText></MarginBox>
                                    </MarginView>
                                    :
                                    <MarginView>
                                        <MarginBox style={{backgroundColor:"#FFF"}}></MarginBox>
                                    </MarginView>
                                    }
                                    <TitleView>
                                        {isLock && <LockImage source={require('../assets/icons/lock_small.jpg')}/>}
                                        <TitleTxt numberOfLines={1}>{item.title}</TitleTxt>
                                    </TitleView>
                                    <BtmTxtView>
                                        <BomTxt1>{item.displayName} {createdAt}</BomTxt1>
                                    </BtmTxtView>
                                </NewPress>
                                {idx2!=4 && <LineF5F5F5 />}
                            </View>
                            )
                        })
                        }
                   </View>
                )
            })
            }
            
            {/* <NewView>
                
            </NewView> */}
        </Swiper>
        </NewView>
    )
}

