
import { useNavigation} from "@react-navigation/native";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../store";
import userSlice from "../slices/user";
import styled from "styled-components/native";
import ReportListBox from "./ReportListBox";
import { decimalRound } from "../common/commonFunc";
import { getAllReportList } from "../common/commonData";
import { Pressable, Animated, View } from "react-native";
import IPhoneBottom from "./common/IPhoneBottom";
import Loader from "./common/Loader";

const ReportListFlatList = styled.FlatList``
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

const ContentReports = ({pageName}:any) =>{

    const [allReport, setAllReport] = useState([]);
    const [dataPage, setDataPage] = useState(1);
    const [reportCount, setReportCount] = useState(0);

    const [isOrderSelectOpened, setIsOrderSelectOpened] = useState(false);
    const [orderName, setOrderName] = useState('최신순');
    const [order, setOrder] = useState('rct');

    const [isAllDataLoaded, setIsAllDataLoded] = useState(false);

    const perPage = 10;
    const pickerBoxPositionY = useRef(new Animated.Value(0)).current;

      //리듀서 사용 세팅
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    async function getAllData(){
        setIsAllDataLoded(false);
        let result:any =  await getAllReportList(order, dataPage, perPage, dispatch, navigation, pageName);
        setReportCount(result?.data?.reportList?.count);
        setAllReport(result?.data?.reportList?.list);

        setIsAllDataLoded(true);
    }

   

    useEffect(()=>{
        getAllData();

        Animated.timing(pickerBoxPositionY, {
            toValue: 500,
            duration:600,
            useNativeDriver: true,
        }).start();
    },[order])

    function renderReport({item}:any){
        return(
            <>
                <Space16 />
                <ReportListBox item={item} from='contents'/>
            </>
        )
    }

    async function onEndReached(){
        const calledCount = (dataPage+1)*perPage;
        const maxCount = (decimalRound(reportCount/perPage,0)+1)*perPage;

        if(calledCount > maxCount ){return;}
        setDataPage(dataPage+1);
        let result:any =  await getAllReportList(order, dataPage+1, perPage, dispatch, navigation, pageName);
        
        let newArr:any = [...allReport, ...result?.data?.reportList?.list];
        setAllReport(newArr);
    }


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
        setDataPage(1);
        closeBottomSelect();
        setTimeout(()=>{
            setOrderName(value);
            setOrder(order);
        },600)
    }

    if(!isAllDataLoaded){return <Loader />;}

    return (
        <>
        <ReportListFlatList
                data = {allReport}
                renderItem={renderReport}
                keyExtractor={(item, index) => index.toString()+""}
                showsVerticalScrollIndicator={true}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                ListHeaderComponent ={()=><Pressable onPress={openBottomSelect}>
                                                <OrderBtnView>
                                                    <OrderBtnTxt>{orderName}</OrderBtnTxt>
                                                    <OrderBtnArrowImg source={require('../assets/icons/orderBtnArrow.png')}/>
                                                </OrderBtnView>
                                            </Pressable>
                }
                ListFooterComponent = {()=><Space48 />}
            >
        </ReportListFlatList>

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
                    <BottomSelectTouch onPress={()=>{selectOrderName('수익률순', 'ror')}}>
                        <BottomSelectTxt>수익률순</BottomSelectTxt>
                        <BottomSelectChkImg source={orderName=='수익률순'?require('../assets/icons/orderChkActive.png'):require('../assets/icons/orderChk.png')} />
                    </BottomSelectTouch>
                    <BottomSelectTouch onPress={()=>{selectOrderName('좋아요순', 'lc')}}>
                        <BottomSelectTxt>좋아요순</BottomSelectTxt>
                        <BottomSelectChkImg source={orderName=='좋아요순'?require('../assets/icons/orderChkActive.png'):require('../assets/icons/orderChk.png')} />
                    </BottomSelectTouch>
                    <BottomSelectTouch onPress={()=>{selectOrderName('마진순', 'mor')}}>
                        <BottomSelectTxt>마진순</BottomSelectTxt>
                        <BottomSelectChkImg source={orderName=='마진순'?require('../assets/icons/orderChkActive.png'):require('../assets/icons/orderChk.png')} />
                    </BottomSelectTouch>
                    {/* <BottomSelectTouch onPress={()=>{selectOrderName('프리미엄', 'pr')}}>
                        <BottomSelectTxt>프리미엄</BottomSelectTxt>
                        <BottomSelectChkImg source={orderName=='프리미엄'?require('../assets/icons/orderChkActive.png'):require('../assets/icons/orderChk.png')} />
                    </BottomSelectTouch>
                    <BottomSelectTouch onPress={()=>{selectOrderName('투자포인트', 'ip')}}>
                        <BottomSelectTxt>투자포인트</BottomSelectTxt>
                        <BottomSelectChkImg source={orderName=='투자포인트'?require('../assets/icons/orderChkActive.png'):require('../assets/icons/orderChk.png')} />
                    </BottomSelectTouch> */}
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
export default ContentReports;