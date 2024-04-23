import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { PaddingView22 } from "../common/commonStyledComp";
import Swiper from "react-native-swiper";
import { useAppDispatch } from "../store";
import userSlice from "../slices/user";
import { isSlideAvailable, setCurrentPage } from "../common/commonFunc";
import { goReportContent } from "../common/commonNav";
import { getHomeSlideData } from "../common/commonData";
import {Linking} from 'react-native';

const SlideView = styled.View`
    width:100%; height:120px;
`
const SlideImage = styled.Image`
    width: 100%; height:120px; border-radius: 5px;
`
const SlidePress = styled.Pressable`
    
`




export const HomeSlide = ()=>{
    const [slideData, setSlideData] = useState([]);

  const dispatch = useAppDispatch();	
  const navigation:any = useNavigation();	
    
    const pressSlide = (linkType:any, linkId:any, bannerLink:any) => {
        if(linkType==='report'){
            goReportContent(navigation, dispatch, linkId, false);
        }else if(linkType==='notices'){
            goNoticeContent(linkId, 'notices');
        }else if(linkType==='events'){
            goNoticeContent(linkId, 'events');
        }else if(linkType==='youtube'){
            if(bannerLink!=null){
                Linking.openURL(bannerLink);
            }
        }
    }

    useEffect(()=>{
        async function getData () {
            const data = await getHomeSlideData(dispatch, navigation);
            
            const slideDataArr:any = [];
            data.forEach((item:any) =>{
                const {startTimeDate, endTimeDate} = item;
                const isAvalible = isSlideAvailable(startTimeDate, endTimeDate);
                if(isAvalible){
                    slideDataArr.push(item)
                }
            })
            setSlideData(slideDataArr); 
        }
        getData();
    },[]);


    const goNoticeContent = (id:number, type:string) =>{
        setCurrentPage(dispatch,'NoticeContent');
        navigation.navigate("NoticeContent", {id, type});
    }
    
    return (
        <PaddingView22>
            <SlideView>
                <Swiper 
                    autoplay 
                    showsPagination={false} 
                    loop = {true}
                >
                {
                    slideData?.map((item:any, idx:number)=>{
                    return(
                        <SlidePress key={idx+'slide'} onPress={()=>{pressSlide(item?.linkType, item?.linkId, item?.bannerLink)}}>
                            <SlideImage key={idx+'slide'} source={{uri:item?.appKey}}/>
                        </SlidePress>
                    )
                    })
                }
                </Swiper>
            </SlideView>
        </PaddingView22>
    );
}



