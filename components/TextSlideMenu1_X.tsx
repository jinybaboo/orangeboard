import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Dimensions, Pressable, TouchableOpacity} from "react-native";
import styled from "styled-components/native";
import { setCurrentPage } from "../common/commonFunc";
import { CommonSeeMoreTxt, CommonTitle, TitleUnderline } from "../common/commonStyledComp";
import { useAppDispatch } from "../store";
import colors from "../common/commonColors";
import LinearGradient from "react-native-linear-gradient";

const SliderView = styled.View`
    position:relative;
`

const HomePopularMenuSlideFlatList = styled.FlatList`
    height:20px;
`
const HomePopularMenuSlideTxt = styled.Text`
    font-family: 'noto700';
    font-size: 16px;
    height:20px;
    line-height:20px;
    color:#777777;
`

const HomePopularMenuSlideTxtSelected = styled(HomePopularMenuSlideTxt)`
    color:#000000;
`


const SliderGap = styled.View`
    width:28px;
`

const SliderBlur = styled.View`
    width:24px;
    height: 20px;
    position: absolute;
    right:0;
`



const TextSlideMenu1 = ()=>{
    let dataSet = [
        {title:'게시글많은순'},
        {title:'인기검색'},
        {title:'배당'},
        {title:'신규상장순'},
        {title:'일이삼'},
        {title:'오렌지보드화이팅'},
    ];

    const [selPopualr, setSelPopular] = useState('게시글많은순');

    const RenderSlideBox = ({item}:any)=>{
        return(
            <Pressable onPress={()=>{setSelPopular(item.title)}}>
                {selPopualr!=item.title?<HomePopularMenuSlideTxt>{item.title}</HomePopularMenuSlideTxt>
                :<HomePopularMenuSlideTxtSelected>{item.title}</HomePopularMenuSlideTxtSelected>}
            </Pressable>
        )
    }

    return (
        <SliderView>
            <HomePopularMenuSlideFlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingLeft:16, paddingRight:16}}
                ItemSeparatorComponent={()=><SliderGap/>}
                data ={dataSet}
                renderItem={RenderSlideBox}
            >
            </HomePopularMenuSlideFlatList>
            <SliderBlur>
                <LinearGradient 
                style={{ width:24, height:20}} 
                start={{x: 0, y: 1}} end={{x: 1, y: 1}}
                colors={['rgba(255, 255, 255, 0)',  'rgba(255, 255, 255, 1)']}
                locations={[0,0.7]}
                />
            </SliderBlur>
        </SliderView>
    );
}


export default TextSlideMenu1;

