import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, Pressable, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { decimalRound, deleteArray, setCurrentPage, thousandComma } from "../common/commonFunc";
import { CommonSeeMoreTxt, CommonTitle, EmptyView, FavoStarImage, Space40, TitleUnderline } from "../common/commonStyledComp";
import { useAppDispatch } from "../store";
import colors from "../common/commonColors";
import Swiper from "react-native-swiper";
import userSlice from "../slices/user";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducer";
import { addOrDelFavorite, getFavoCompany, getUserInfo } from "../common/commonData";


const windowWidth = Dimensions.get('window').width;
const boxWidth = windowWidth - 56 - 16;

const HomeFavoView = styled.View`
    
    margin-top: 40px;
    background-color: #fff;;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    min-height: 100px;
    padding:0 16px;
    

`

const HomeFavoTitleView = styled.View`
    width:100%;
    height:60px;
    margin: 28px 0 20px 0;
`

const HomeFavoTitleTxt1 = styled.Text`
    font-family: 'noto500';
    font-size: 20px;
    line-height:30px;
    color:#000000;
`
const HomeFavoTitleTxt2 = styled(HomeFavoTitleTxt1)`
     font-family: 'noto900';
`

const HomeFavoContentView = styled.View`
    padding-top:32px;
`

const HomeFavoContentBox = styled.View`
    width: ${boxWidth}px;
    height: 36px;
    margin-bottom: 34px;
    flex-direction: row;
    justify-content: space-between;
    position: relative;
`
const HomeFavoTouch = styled.TouchableOpacity`
    width: ${boxWidth}px;
    height: 36px;
    margin-bottom: 34px;
    flex-direction: row;
    justify-content: space-between;
    position: relative;
`

const HomeFavoContentInnerBox1 = styled.View`
    height:100%;
    justify-content: space-between;
`
const HomeFavoContentInnerBox2 = styled.View`
    height:100%;
    text-align: right;
    justify-content: space-between;
    
`

const HomeFavoContentTxt1 = styled.Text`
    font-family: 'noto500';
    font-size: 16px;
    line-height:19px;
    color:#000000;
`

const HomeFavoContentTxt2 = styled.Text`
    font-family: 'noto400';
    font-size: 12px;
    line-height:15px;
    color:#777777;
`

const HomeFavoContentTxt3 = styled.Text`
    font-family: 'noto400';
    font-size: 16px;
    line-height:19px;
    color:#000000;
    text-align: right;
    letter-spacing: -0.2px;
`

const HomeFavoContentTxt4 = styled.Text`
    font-family: 'noto400';
    font-size: 14px;
    line-height:17px;
    color:${colors.plusColor};
    text-align: right;
`
const HomeFavoContentTxt4Minus = styled(HomeFavoContentTxt4)`
    color:${colors.minusColor};
`

const HomeFavoStarImg = styled(FavoStarImage)`
    margin:4px 0 0 8px;
    position: absolute;
    right:10px; 
    top:0px;
`

const NoFavoTxt = styled.Text`
    font-family: 'noto400';
    font-size: 14px;
    line-height:17px;
    color:#999999;
    text-align: center;
    margin-top: 42px;
    padding-bottom: 74px;
`

const NullRetunView = styled.View`
    width:100%; height:30px;
`


const HomeFavo = ()=>{
    //리듀서 사용 세팅
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    const isFocused = useIsFocused();
    //로그인 정보 가져오기
    const isLogin = useSelector((state:RootState)=>state.user.isLogin);

    const [nickname, setNickname] = useState('');
    const [favoDataSet, setFavoDataSet] = useState([{"cloPrc": 0, "cloPrcAt": "", "corpClass": "", "corpName": ""}]);
    const [reload, setReload] = useState(false);

    const goCompanyInfo = (stockCode:string) =>{
        dispatch(userSlice.actions.setCompnayInfoStockCode(stockCode));
        setCurrentPage(dispatch,'CompanyInfo');
        navigation.navigate("CompanyInfo" as never);
    }

    const toggleFavorite = (stockCode:string, isFavorite:boolean) =>{
        Alert.alert( //alert 사용								
        '잠깐!', '관심기업에서 삭제 하시겠습니까?', [ //alert창 문구 작성							
           {text: '취소', onPress: () => {}}, //alert 버튼 작성						
           {text: '확인', onPress: () => {delFavo(stockCode, isFavorite)}}, //alert 버튼 작성						
        ]							
        );														
    }

    const delFavo = async(stockCode:string, isFavorite:boolean)=>{
        await addOrDelFavorite(stockCode, isFavorite, dispatch,navigation);
        setReload(!reload);
    }


    useEffect(()=>{
        async function reloadData(){
            if(isLogin){
                const result:any =  await getFavoCompany(dispatch, navigation);
                setFavoDataSet(result);

                const {Profile} = await getUserInfo(dispatch, navigation);
                setNickname(Profile?.displayName);
            }
        }
        reloadData();
    },[reload, isFocused])


    if(favoDataSet?.length==0){return <NullRetunView />;}

    return (
        <HomeFavoView style={{
            shadowColor: '#171717',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.1,
            shadowRadius: 3,
        }}>
            <HomeFavoTitleView>
                <HomeFavoTitleTxt1><HomeFavoTitleTxt2>{nickname}님</HomeFavoTitleTxt2>을 위한{"\n"}관심 기업을 알려드릴게요😎</HomeFavoTitleTxt1>
            </HomeFavoTitleView>
            <TitleUnderline />
            <HomeFavoContentView>
                { 
                    favoDataSet?.map( (item:any) =>{
                        const curPrc = thousandComma(item.curPrc);
                        return(
                        <HomeFavoContentBox key={item.stockCode+''}>
                            <HomeFavoTouch onPress={()=>{goCompanyInfo(item.stockCode)}}>
                                <HomeFavoContentInnerBox1>
                                    <HomeFavoContentTxt1>{item.corpName}</HomeFavoContentTxt1>
                                    <HomeFavoContentTxt2>{item.stockCode}</HomeFavoContentTxt2>
                                </HomeFavoContentInnerBox1>
                                <HomeFavoContentInnerBox2>
                                    <HomeFavoContentTxt3>{curPrc}원</HomeFavoContentTxt3>
                                    {
                                    item.flucRate>=0?<HomeFavoContentTxt4>+{item.flucRate}%</HomeFavoContentTxt4>
                                    :<HomeFavoContentTxt4Minus>{item.flucRate}%</HomeFavoContentTxt4Minus>
                                    }
                                </HomeFavoContentInnerBox2>
                            </HomeFavoTouch>

                            <Pressable onPress={()=>{toggleFavorite(item.stockCode, true)}} style={{width:50, height:50,}} >
                            <HomeFavoStarImg source={require('../assets/icons/favoStar.png')} />
                            </Pressable>
                        </HomeFavoContentBox>
                        )
                    })    
                }
            </HomeFavoContentView>
        </HomeFavoView>
    )
    
}


export default HomeFavo;