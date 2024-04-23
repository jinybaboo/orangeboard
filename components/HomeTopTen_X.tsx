import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Dimensions, Pressable, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { decimalRound, setCurrentPage, thousandComma } from "../common/commonFunc";
import { CommonSeeMoreTxt, CommonTitle, EmptyView, TitleUnderline } from "../common/commonStyledComp";
import { useAppDispatch } from "../store";
import colors from "../common/commonColors";
import Swiper from "react-native-swiper";
import userSlice from "../slices/user";


const windowWidth = Dimensions.get('window').width;
const slideWidth = windowWidth - 32;

const HomeTopTenView = styled.View`
    width:${windowWidth - 32}px;
    margin-left: 16px;
    margin-top: 40px;
    background-color: #fff;;
    border-radius: 20px;
`


const TopTenitleView =styled.View`
    width:100%;
    height: 72px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding:4px 16px 0;
`

const TopTenInnerView1 = styled.View`
    flex-direction: row;
`
const TopTenTitle = styled(CommonTitle)``

const TopTenTitleIcon = styled.Image`
    width:12px;
    height:13px;
    margin:3px 0 0 8px;
    
`

const HomePopularItemView = styled.View`
    width:100%;
    padding-left: 20px;
`

const HomePopularItemTxtView = styled.View`
    width:100%;
    margin-top: 24px;
    flex-direction: row;
    align-items: center;
`
const HomePopularItemTxt1 = styled.Text`
    font-family: 'noto900';
    font-size: 16px;
    line-height:19px;
    color:#999999;
    width:22px;
    text-align: center;
`
const HomePopularItemTxt2 = styled.Text`
    font-family: 'noto700';
    font-size: 16px;
    line-height:19px;
    color:#000000;
    padding-left: 12px;
`

const HomePopularItemTxt3 = styled.Text`
    font-family: 'noto500';
    font-size: 12px;
    line-height:15px;
    color:${colors.plusColor};
    padding-left: 8px;
`

const HomePopularItemTxt3Minus = styled(HomePopularItemTxt3)`
    color:${colors.minusColor};
`


const HomeTopTen = ({dataSet}:any)=>{

    //리듀서 사용 세팅
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    
    const goSearch = () =>{
        setCurrentPage(dispatch,'Search');
        navigation.navigate("Search" as never);
    }

    const goCompanyInfo = (stockCode:string) =>{
        dispatch(userSlice.actions.setCompnayInfoStockCode(stockCode));
        setCurrentPage(dispatch,'CompanyInfo');
        navigation.navigate("CompanyInfo" as never);
    }

    return (
        <HomeTopTenView>
            <TopTenitleView>
                <TopTenInnerView1>
                    <TopTenTitle>조회수 TOP 12</TopTenTitle>
                    <TopTenTitleIcon source={require('../assets/icons/topTenIcon.png')} />
                </TopTenInnerView1>
            </TopTenitleView>
            <TitleUnderline/>

            <Swiper
                autoplay 
                showsPagination={true} 
                width={slideWidth}
                height={204} 
                autoplayTimeout={2.5}
                paginationStyle={{ 
                    position: "absolute", 
                    top: -255,
                    right:-285,
                }}
                dotColor = '#999999'
                activeDotColor = '#FF7900'
            >
                <HomePopularItemView>
                {
                    dataSet.map((item:any, idx:number)=>{
                    const flucRate = item.flucRate;
                    return (
                        idx <= 3 ?
                        <TouchableOpacity  key={item.stockCode+''} onPress={()=>{goCompanyInfo(item.stockCode)}}>
                        <HomePopularItemTxtView>
                            <HomePopularItemTxt1>{idx+1}</HomePopularItemTxt1>
                            <HomePopularItemTxt2>{item.corpName}</HomePopularItemTxt2>
                            {flucRate>=0?<HomePopularItemTxt3>+{item.flucRate}%</HomePopularItemTxt3>
                            :<HomePopularItemTxt3Minus>{item.flucRate}%</HomePopularItemTxt3Minus>
                            }
                        </HomePopularItemTxtView>
                        </TouchableOpacity>
                        :<EmptyView  key={item.stockCode}/>
                    ) 
                    })
                }
                </HomePopularItemView>

                <HomePopularItemView>
                {
                    dataSet.map((item:any, idx:number)=>{
                    const flucRate = item.flucRate;
                    return (
                        idx >3 && idx <= 7 ?
                        <TouchableOpacity key={item.stockCode+''} onPress={()=>{goCompanyInfo(item.stockCode)}}>
                        <HomePopularItemTxtView>
                            <HomePopularItemTxt1>{idx+1}</HomePopularItemTxt1>
                            <HomePopularItemTxt2>{item.corpName}</HomePopularItemTxt2>
                            {flucRate>=0?<HomePopularItemTxt3>+{item.flucRate}%</HomePopularItemTxt3>
                            :<HomePopularItemTxt3Minus>{item.flucRate}%</HomePopularItemTxt3Minus>
                            }
                        </HomePopularItemTxtView>
                        </TouchableOpacity>
                        :<EmptyView  key={item.stockCode}/>
                    ) 
                    })
                }
                </HomePopularItemView>

                <HomePopularItemView>
                {
                    dataSet.map((item:any, idx:number)=>{
                    const flucRate = item.flucRate;
                    return (
                        idx >7 && idx <= 12 ?
                        <TouchableOpacity key={item.stockCode+''} onPress={()=>{goCompanyInfo(item.stockCode)}}>
                        <HomePopularItemTxtView>
                            <HomePopularItemTxt1>{idx+1}</HomePopularItemTxt1>
                            <HomePopularItemTxt2>{item.corpName}</HomePopularItemTxt2>
                            {flucRate>=0?<HomePopularItemTxt3>+{item.flucRate}%</HomePopularItemTxt3>
                            :<HomePopularItemTxt3Minus>{item.flucRate}%</HomePopularItemTxt3Minus>
                            }
                        </HomePopularItemTxtView>
                        </TouchableOpacity>
                        :<EmptyView  key={item.stockCode}/>
                    ) 
                    })
                }
                </HomePopularItemView>
                
            </Swiper>
            
        </HomeTopTenView>
    )
}


export default HomeTopTen;