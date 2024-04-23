
import { useNavigation} from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Pressable, Animated, View } from "react-native";
import styled from "styled-components/native";
import { getSeriesList } from "../common/commonData";
import { getWindowWidth, setCurrentPage } from "../common/commonFunc";
import IPhoneBottom from "./common/IPhoneBottom";
import Loader from "./common/Loader";
import { Shadow } from 'react-native-shadow-2';
import { useAppDispatch } from "../store";
import userSlice from "../slices/user";

const windowWidth = getWindowWidth();
const seriesBoxWidth = (windowWidth-32)/2 - 8;
const seriesImgWidth = seriesBoxWidth - 24;
const seriesImgHeight = seriesImgWidth / 1.43;
const seriesBoxHeight = seriesImgHeight + 52;

const SeriesListFlatList = styled.FlatList``
const Space16 = styled.View`
    width:100%; height:16px;
`
const OrderBtnView = styled.View`
    padding:24px 0 0 16px; flex-direction: row; align-items:center;
`
const OrderBtnTxt = styled.Text`
    font-family: 'noto700'; font-size: 20px; line-height:23px; color:#000000;
`
const OrderBtnArrowImg = styled.Image`
    width: 12px; height:12px; margin-left:4px;
`
const Space48 = styled.View`
    width:100%; height:48px;
`

const SeriesPress = styled.Pressable`
    
`

const ShadowBox = styled.View`
    width:${seriesBoxWidth}px; height:${seriesBoxHeight}px; border-radius: 8px; margin-left: 16px;;
`

const SeriesBox = styled.View`
    width:100%; height:100%; padding:12px; border-radius: 8px;
`
const SeriesImgBox = styled.View`
    width:${seriesImgWidth}px; height:${seriesImgHeight}px; border-radius: 8px; position: relative; 
`
const SeriesImg = styled.Image`
    width:100%; height:100%; border-radius: 8px; position: absolute;
`
const SeriesImgBlackOpa = styled.View`
    width:100%; height:100%; border-radius: 8px; position: absolute; background-color: rgba(0,0,0,0.2); border-radius: 8px; 
`
const SeriesCountView = styled.View`
    width:46px; height:24px; background-color: rgba(0,0,0,0.6); border-radius: 12px; position: absolute; top:8px; right:11px;
    justify-content: center; align-items: center; flex-direction: row;
`
const SeriesCountImg = styled.Image`
    width:15px; height:14px;
`
const SeriesCountTxt = styled.Text`
    font-family: 'noto500'; font-size: 14px; line-height:17px; color:#FFFFFF; margin-left: 4px; padding-top:2px;
`
const SeriesTxt = styled.Text`
    font-family: 'noto700'; font-size: 16px; line-height:20px; color:#000000; padding-top: 9px;
`


// 셀렉트 박스 바틈
const BottomSelectView = styled.View`
   width:100%; height:200%; position: absolute; bottom:0;
`
const BottomSelectBlackOpaView = styled.Pressable`
    width:100%; height:200%; position: absolute; bottom:0; background-color: rgba(0,0,0,0.5);
`
const BottomWhiteBackForIos = styled.View`
    width:100%; height:30px; background-color: #FFFFFF; position: absolute; bottom:0;
`

const BottomSelectBoxAnimated =  styled(Animated.createAnimatedComponent(View))`
    z-index:9999;
    width:100%;
    position:absolute;
    bottom:0;
    margin-bottom: 56px;
`

const BottomSelectTitle = styled.Text`
    font-family: 'noto700'; font-size: 20px; line-height:23px; color:#000000;text-align:center;
    padding-top: 32px; padding-bottom: 40px;
`

const BottomBtnBox = styled.View`
    width:100%;
    background-color: #FFFFFF;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    padding-top:5px;
    padding-bottom:5px;
`

const BottomSelectTouch = styled.Pressable`
    width:100%; height:48px; padding-left:20px; align-items: center;
`
const BottomSelectTxt = styled.Text`
    width:100%; font-family: 'noto400'; font-size: 16px; line-height:19px; color:#000000;
`
const BottomSelectChkImg = styled.Image`
    width:20px; height:20px; position:absolute; right:20px;
`




const ContentSeries = () =>{
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    const [seriesList, setSeriesList] = useState([]);
    const [isAllDataLoaded, setIsAllDataLoded] = useState(false);

    const [isOrderSelectOpened, setIsOrderSelectOpened] = useState(false);
    const [orderName, setOrderName] = useState('최신순');
    const [order, setOrder] = useState('rct');

    const pickerBoxPositionY = useRef(new Animated.Value(0)).current;

    useEffect(()=>{
        async function getAllData(){
            setIsAllDataLoded(false);
            let result:any  =  await getSeriesList(order);
            //reportCount==0인 데이터는 미리 제거 할것
            result = result.filter((item:any)=>{ return item.reportCount !=0 })
            setSeriesList(result);
            setIsAllDataLoded(true);
        }

        getAllData();

        Animated.timing(pickerBoxPositionY, {
            toValue: 500,
            duration:600,
            useNativeDriver: true,
        }).start();
    },[order]);


    function openBottomSelect(){
        setIsOrderSelectOpened(true);
        Animated.timing(pickerBoxPositionY, {
            toValue: 0,
            duration:600,
            useNativeDriver: true,
        }).start();
    }

    function closeBottomSelect(){
        Animated.timing(pickerBoxPositionY, {
            toValue: 500,
            duration:600,
            useNativeDriver: true,
        }).start();
        setTimeout(()=>{
            setIsOrderSelectOpened(false);
        },600)
        
    }

    function selectOrderName(value:string, order:string){
        closeBottomSelect();
        setTimeout(()=>{
            setOrderName(value);
            setOrder(order);
        },600)
    }

    function goReportInfoMore(id:string, seriesName:string){
        dispatch(userSlice.actions.setSeriesId(id));
        dispatch(userSlice.actions.setSeriesName(seriesName));
        setCurrentPage(dispatch, 'ReportInfoMoreForSeries');
        navigation.navigate("ReportInfoMoreForSeries" as never);
    }

    if(!isAllDataLoaded){return <Loader />;}

    function renderSeries({item}:any){
        const thumbnail = item.thumbnail;
        const defaultThumb = '../assets/images/defaultThumb.png';
        
        return(
            <SeriesPress onPress={()=>{goReportInfoMore(item?.SeriesId, item?.seriesName)}}>
                <Space16 />
                    <ShadowBox>
                        <Shadow		
                            startColor="rgba(0,0,0,0.03)"
                            endColor="rgba(255, 255, 255, 0.03)"
                            distance={12}
                            offset={[0,4]}
                            style={{width:seriesBoxWidth, height:seriesBoxHeight, backgroundColor:'#FFFFFF', borderRadius:8}}
                        >	
                            <SeriesBox>
                                <SeriesImgBox>
                                    {thumbnail==null?
                                    <SeriesImg source={require(defaultThumb)} />:
                                    <SeriesImg source={{uri:item?.thumbnail}} />
                                    }
                                    <SeriesImgBlackOpa/>

                                    <SeriesCountView>
                                        <SeriesCountImg source={require('../assets/icons/seriesCount.png')}/>
                                        <SeriesCountTxt>{item.reportCount}</SeriesCountTxt>
                                    </SeriesCountView>
                                </SeriesImgBox>

                                <SeriesTxt numberOfLines={1}>{item.seriesName}</SeriesTxt>
                            </SeriesBox>
                        </Shadow>
                    </ShadowBox>
            </SeriesPress>
        )
    }

    return (
        <>
            <SeriesListFlatList 
                    data = {seriesList}
                    renderItem={renderSeries}
                    keyExtractor={(item, index) => index.toString()+""}
                    showsVerticalScrollIndicator={true}
                    numColumns = {2} //가로로 2개씩 배치
                    ListHeaderComponent ={()=><Pressable onPress={openBottomSelect}>
                                                    <OrderBtnView>
                                                        <OrderBtnTxt>{orderName}</OrderBtnTxt>
                                                        <OrderBtnArrowImg source={require('../assets/icons/orderBtnArrow.png')}/>
                                                    </OrderBtnView>
                                                </Pressable>
                    }
                    ListFooterComponent = {()=><><Space48 /><Space16/></>}
            />


            {isOrderSelectOpened?
            <BottomSelectView>
                <BottomSelectBlackOpaView onPress={closeBottomSelect}>
                    
                </BottomSelectBlackOpaView>


                <BottomSelectBoxAnimated
                    style={[{ transform: [{ translateY: pickerBoxPositionY }] }]}
                >
                    <BottomBtnBox>
                        <BottomSelectTitle>정렬 설정</BottomSelectTitle>

                        <BottomSelectTouch onPress={()=>{selectOrderName('최신순', 'rct')}}>
                            <BottomSelectTxt>최신순</BottomSelectTxt>
                            <BottomSelectChkImg source={orderName=='최신순'?require('../assets/icons/orderChkActive.png'):require('../assets/icons/orderChk.png')} />
                        </BottomSelectTouch>
                        <BottomSelectTouch onPress={()=>{selectOrderName('리포트순', 'rc')}}>
                            <BottomSelectTxt>리포트순</BottomSelectTxt>
                            <BottomSelectChkImg source={orderName=='리포트순'?require('../assets/icons/orderChkActive.png'):require('../assets/icons/orderChk.png')} />
                        </BottomSelectTouch>
                        <BottomSelectTouch onPress={()=>{selectOrderName('가나다순', 'asc')}}>
                            <BottomSelectTxt>가나다순</BottomSelectTxt>
                            <BottomSelectChkImg source={orderName=='가나다순'?require('../assets/icons/orderChkActive.png'):require('../assets/icons/orderChk.png')} />
                        </BottomSelectTouch>

                        <IPhoneBottom />
                    </BottomBtnBox>    
                </BottomSelectBoxAnimated>
                <BottomWhiteBackForIos />
            </BottomSelectView>
            :<></>
            }





        </>
    );
}
export default ContentSeries;