import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, TouchableOpacity} from "react-native";
import styled from "styled-components/native";
import { addRandomColorToJsonArr, setCurrentPage } from "../common/commonFunc";
import { CommonSeeMoreTxt, CommonTitle, TitleUnderline } from "../common/commonStyledComp";
import { useAppDispatch } from "../store";
import colors from "../common/commonColors";
import CompanyShow1 from "./CompanyShow1";
import TextSlideMenu1 from "./TextSlideMenu1_X";
import LinearGradient from "react-native-linear-gradient";
import { getHomePopular } from "../common/commonData";
import { useIsFocused } from '@react-navigation/native';


const windowWidth = Dimensions.get('window').width;

const HomePopularView = styled.View`
    width:${windowWidth - 32}px;
    margin-left: 16px;
    margin-top: 32px;
    
    background-color: #fff;;
    border-radius: 20px;
`

const PopularTitleView =styled.View`
    width:100%;
    height: 20px;
    margin-top: 35px;
    padding:0 16px;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom:38px;
    
`

const PopularInnerView1 = styled.View`
    flex-direction: row;
`

const PopularTitle1 = styled(CommonTitle)``

const PopularTitleIcon = styled.Image`
    width:12px;
    height:13px;
    margin:4px 0 0 8px;
    
`



const HomePopularSeeMoreTxt = styled(CommonSeeMoreTxt)`
    padding-top: 2px;
`



const HomePopularItemView = styled.View`
    width:100%;
    padding: 28px 16px 10px;
`

// const HomePopularItemBox =styled.View`
//     width:100%;
//     height: 38px;
//     flex-direction: row;
//     justify-content: space-between;
// `

// const HomePooularItemInnerView1 = styled.View`
//     width:50%;
//     height: 100%;
//     flex-direction: row;

// `

// const HomePooularItemInnerView1_1 = styled.View`
//     width:36px;
//     height:36px;
//     border-radius: 12px;
//     align-items: center;
//     justify-content: center;
// `
// const HomePooularItemTxt1 = styled.Text`
//     font-family: 'noto500';
//     font-size: 14px;
//     line-height:17px;
// `

// const HomePooularItemInnerView1_2 = styled.View`
//     justify-content: center;
//     margin-left: 8px;
// `

// const HomePooularItemTxt2 = styled.Text`
//     font-family: 'noto500';
//     font-size: 16px;
//     line-height:19px;
//     color:#000000;
// `
// const HomePooularItemTxt3 = styled.Text`
//     font-family: 'noto500';
//     font-size: 12px;
//     line-height:15px;
//     color:#777777;
// `

// const HomePooularItemInnerView2 = styled.View`
//     width:50%;
//     height: 100%;
//     justify-content: center;
//     align-items: flex-end;
// `

// const HomePooularItemTxt4 = styled.Text`
//     font-family: 'noto400';
//     font-size: 16px;
//     line-height:19px;
//     color:#000000;
// `

// const HomePooularItemTxt5 = styled.Text`
//     font-family: 'noto400';
//     font-size: 14px;
//     line-height:17px;
//     color:${colors.plusColor};
// `

// const HomePooularItemTxt5Minus = styled.Text`
//     color:${colors.minusColor};
// `

// const HomePopularItemBoxGap =styled.View`
//     width:100%;
//     height: 32px;
// `


// 메뉴슬라이더 시작
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


let memuDataSet = [
    {title:'게시글많은순', order:'reports'},
    {title:'상승률높은순', order:'hgFluc'},
    {title:'하락률높은순', order:'lwFluc'},
    {title:'신규상장순', order:'newList'},
    {title:'관심기업순', order:'favorites'},
];
// 메뉴슬라이더 끝

const HomePopular = ({dataSet}:any)=>{
    const [popularOrder, setPopularOrder] = useState('reports');
    const [popularOrderName, setPopularOrderName] = useState('게시글많은순');
    const [popularDataSet, setPopularDataSet] = useState([]);

    const isFocused = useIsFocused();


    useEffect(()=>{
        async function getAllData(){
            let result:any =  await getHomePopular(popularOrder);
            result = result?.data.lists;
            result = addRandomColorToJsonArr(result);
            setPopularDataSet(result);
        }
        getAllData()
    },[popularOrder, isFocused]);
    


    //리듀서 사용 세팅
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    
    const goPopularChart = () =>{
        setCurrentPage(dispatch,'PopularChart');
        navigation.navigate("PopularChart" as never);
    }



    //슬라이드 메뉴
    const RenderSlideBox = ({item}:any)=>{
        return(
            <Pressable onPress={()=>{setPopularOrderName(item.title); setPopularOrder(item.order)}}>
                {popularOrderName!=item.title?<HomePopularMenuSlideTxt>{item.title}</HomePopularMenuSlideTxt>
                :<HomePopularMenuSlideTxtSelected>{item.title}</HomePopularMenuSlideTxtSelected>}
            </Pressable>
        )
    }
    

    return (
        <HomePopularView>
            <PopularTitleView>
                <PopularInnerView1>
                    <PopularTitle1>인기 CHART</PopularTitle1>
                    <PopularTitleIcon source={require('../assets/icons/popularIcon.png')} />
                </PopularInnerView1>
                <TouchableOpacity onPress={goPopularChart}>
                    <HomePopularSeeMoreTxt>더보기</HomePopularSeeMoreTxt>
                </TouchableOpacity>
            </PopularTitleView>

            <SliderView>
                <HomePopularMenuSlideFlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingLeft:16, paddingRight:16}}
                    ItemSeparatorComponent={()=><SliderGap/>}
                    data ={memuDataSet}
                    renderItem={RenderSlideBox}
                    keyExtractor={(item, index) => index.toString()+"pwj"}
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
            
            <TitleUnderline style={{marginTop:20}}/>
            <HomePopularItemView>
                {
                popularDataSet.map((item:any, idx:number)=>{
                    return(
                        <CompanyShow1 name={item}  key={item.stockCode}/>
                    )
                })
                }
            </HomePopularItemView>
        </HomePopularView>
    )
}


export default HomePopular;