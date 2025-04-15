import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Linking, Platform, Text, View, findNodeHandle, Share, DeviceEventEmitter, Keyboard, ActivityIndicator, Pressable, AppState, BackHandler, TouchableOpacity, StyleSheet } from "react-native";
import styled from "styled-components/native";
import colors from "../common/commonColors";
import { changeChatDate, convertToAMPM, delay, fileDown, getIphoneBottomInfo, getWindowHeight, getWindowWidth, goBack} from "../common/commonFunc";
import {LineEEEEEE, PaddingView, Space} from "../common/commonStyledComp";
import { EvilIcons } from '@expo/vector-icons'; 
import { useAppDispatch } from "../store";
import ImageViewer from 'react-native-image-zoom-viewer';
import { Space50 } from "../common/commonStyledComp";
import { CaptureProtection } from 'react-native-capture-protection';
import { deleteIssueTalk, getGosuTalkSearch, getMyProfile, getPortChat, getPortEmojiList, getReportShortUrlInfo, insertIssueTalk, insertShareIssueTalk, toggleIssueTalkEmoji, togglePortChatLike, updateEditIssueTalk } from "../common/fetchData";
import { checkNavigator } from "../common/navigator_w";
import {Shadow} from 'react-native-shadow-2';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Loader from "../common/Loader";
import IPhoneBottomWhite from "../components/common/IPhoneBottomWhite";

const buySellStyle = StyleSheet.create({
    buy: {
      backgroundColor: 'rgba(255, 46, 0, 0.04)',
    },
    sell: {
      backgroundColor: 'rgba(32, 128, 217, 0.04)',
    },
});

const buySellTxtStyle = StyleSheet.create({
    buy: {
      color:'#FF2E00',
    },
    sell: {
      color:'#2080D9',
    },
});

const getBuySellStyle = (value:string) =>{
    if (value === 'buy') {
        return buySellStyle.buy;
    } else if (value === 'sell') {
        return buySellStyle.sell;
    }
}

const getBuySellTextStyle = (value:string) =>{
    if (value === 'buy') {
        return buySellTxtStyle.buy;
    } else if (value === 'sell') {
        return buySellTxtStyle.sell;
    }
}

const os = Platform.OS;
const windowWidth = getWindowWidth();
const boxWidth = windowWidth -32;
const chatboxWidth = windowWidth-120 ;
const imgBoxWidth = chatboxWidth - 16;
const img2BoxWidth = (windowWidth-145)/2-16;
const windowHeight = getWindowHeight();

const BasicView = styled.View`
    flex:1; background-color: #F5F5F5; position: relative;  
`
const ChatScrollView = styled.ScrollView`
   flex:1; background-color: #F5F5F5;
`
const ScrollInnerView = styled.View`
    padding:0 20px; 
`

const ChatOuterBox = styled.View`
  width:100%; min-height: 30px; margin-top: 16px; flex-direction: row; position: relative;
`
const ChatInnerBox = styled.View`
  width:${chatboxWidth}px; padding:4px 12px 12px; border-radius: 20px; min-height: 25px; margin-left: 7px; background-color: #FFF;  
`
const MoreTxtBox = styled.View`
  width:${imgBoxWidth}px; min-height: 25px; padding:1px 0px 8px;
`

const ReplyHeadBox = styled.Pressable`
  width:${imgBoxWidth}px; min-height: 25px; padding:2px 0px 8px;
`
const ReplyHeadTxt = styled.Text`
  font-family: 'noto500'; font-size: 12px; line-height:15px; color:${colors.orangeBorder}; padding-top: 8px; padding-bottom: 2px;
`
const ReplyFileNameTxt = styled.Text`
  font-family: 'noto400'; font-size: 12px; line-height:18px; color:rgb(119, 119, 119); 
`

const ForwardHeadBox = styled(ReplyHeadBox)`
    
`
const ForwardHeadTxt = styled(ReplyHeadTxt)`
    color:#2080D9;
`
const ForwardHeadTxt2 = styled(ForwardHeadTxt)`
    font-family: 'noto700';  padding-left: 5px;
`
const ForwardUserBox = styled.View`
    flex-direction: row; align-items: center; margin-top: -6px;
`
const ForwardIcon = styled.Image`
    width: 12px; height: 12px; border-radius: 50px; margin-top: 5px;
`

const ChatTxt = styled.Text`
  font-family: 'noto500'; font-size: 12px; line-height:18px; color:#333; padding-top: 7px;
`
const PortLogo = styled.Image`
  width:30px; height:30px; border-radius: 5px; margin-top: 5px;
`
const ChatToolBox = styled.View`
  width:38px; height: 34px; position: absolute; bottom: 0px; right:0px;
`
const ChatToolInner = styled.View`
  flex-direction: row; margin-top: -3px;
`
const ToolView = styled.Pressable`
  width:30px; height:30px; margin-right:2px; display: flex; justify-content: center;
`
const ToolIcon = styled.Image`
  width:25px; height:25px; 
`
const TimeTxt = styled.Text`
  font-family: 'noto500'; font-size: 8px; line-height:12px; color:#777; padding-top: 1px;
`
const LikeCountBox = styled.View`
  background-color: #FFF;  position: absolute; left:18px; top:-1px; border-radius: 30px;
`
const LikeCount = styled.Text`
  font-family: 'noto500'; font-size: 8px; line-height:11px; color:#999; padding:1px 4px;
`
const ImgPress = styled.Pressable`
  width:${imgBoxWidth}px; height:${imgBoxWidth}px; flex-wrap: wrap; justify-content: space-between; align-content: space-between;
`
const ImgPress2Image = styled.Pressable`
  width:${imgBoxWidth}px; height:${img2BoxWidth}px; flex-direction:row; justify-content: space-between; 
`
const SingleImage = styled.Image`
  width:100%; height:100%; border-radius: 5px;
`
const SingleImageForReply = styled(SingleImage)`
    width: 80px; height: 80px;
`
const MultiImage = styled.Image`
  width:49%; height:49%; ;
`
const MultiImageMoreBox = styled.View`
  width:49%; height:49%; background-color: rgba(226, 226, 226, 0.80); border-radius: 5px; position: relative;
`
const MultiImageMoreTxt = styled.Text`
    font-family: 'noto700'; font-size: 16px; line-height:22px; color:#c8c8c8; text-align: center;
`
const MultiImageFinalAdd = styled.Image`
  width:100%; height:100%; position:absolute; 
`
const MultiImageFinalAddBlack = styled.View`
  width:100%; height:100%; position:absolute;  background-color: rgba(0, 0, 0, 0.6); border-radius: 5px; align-items: center; justify-content: center; 
`

const MultiImage2Image = styled.Image`
  width:49%; height:100%; ;
`
const DateBox = styled.View`
  width:100%; height:15px; margin-top: 15px; flex-direction: row; align-items: center; justify-content: center; 
`
const DateTxt = styled.Text`  
  font-family: 'noto500'; font-size: 12px; line-height:15px; color:#777; text-align: center;
  width:150px;
`
const DateLine = styled.View`
  width:${(windowWidth - 150 - 40)/2}px; height:1px; background-color: #777;
`


const FileOuterBox = styled.View`
  width:100%; margin-top:6px; flex-direction: row; position: relative;
`
const FileInnerBox = styled.Pressable`
    width:${chatboxWidth-50}px; padding:8px; border-radius: 5px; height: 40px; margin-left: 7px; background-color: #FFFFFF; flex-direction: row; align-items: center;
    border-width: 1px; border-color: #EEE;
`
const FileIcon1 = styled.Image`
    width:10.5px; height:10.4px;
`
const FileIcon2 = styled.Image`
    width:8.8px; height:9.3px; margin-left: 10px;
`
const FileTxtBox = styled.View`
    width:${chatboxWidth-110}px; margin-left: 8px; padding-top: 2px;
`
const FileNameTxt = styled.Text`
    font-family: 'noto500'; font-size: 10px; line-height:11px; color:#000; margin-top: 2px;
`
const FileNameTxt2 = styled(FileNameTxt)`
    color:#AAA;
`
const FileToolBox = styled.View`
  width:68px; height: 34px; position: absolute; top: 25px; right:37px;
`
const ReadHereView = styled.View`
    width:100%; height:30px; align-items: center; justify-content: flex-end;
`
const ReadHereBox = styled.View`
    width:90px; height:15px; background-color: rgba(153, 153, 153, 1); border-radius: 30px;
`
const ReadHereTxt = styled.Text`
    font-family: 'noto500'; font-size: 9px; line-height:14px; color:#F2F2F2; margin-top:0.5px; text-align: center;
` 

const ModalCloseView = styled.View`
    width:100%; height:50px; align-items:flex-end; 
`
const ModalCloseView2 = styled(ModalCloseView)`
    position: absolute; top:40px; 
`
const ClosePress = styled.Pressable`
    width:100px; height:50px; justify-content: center; align-items: flex-end; padding-right: 10px;
`
const ModalView = styled.View`
    width:100%; height:100%; background-color: #000; flex:1; position:absolute; padding:0 10px; z-index: 100;
`




// 댓글 입력 부분
const ReplyInputView = styled.View`
  width:100%; min-height:90px; background-color: #FFFFFF; position:relative; padding-top:14px; 
`
const ReplyBottomView = styled.View`
    width:100%; height:35px; flex-direction: row; position: relative;
`
const ReplyBtmPress = styled.Pressable`
    min-width:80px; height:35px; justify-content:center; 
`
const ReplyBtmPress2 = styled(ReplyBtmPress)`
    position: absolute; right:0; flex-direction: row;  align-items: center;
`
const ImgUpBtn = styled.Image`
    width:16px; height:16px; margin-left: 10px;
`
const SecretTxt = styled.Text`
     font-family: 'noto400';	font-size: 13px; line-height:16px;	color:#777; margin-top: 2px; padding-left: 2px;
`

const ReplyTextInputBox =styled.View`
    width:${boxWidth}px; height:40px; background-color:#FFF5EF; border-radius: 8px; flex-direction: row; justify-content:space-between;
`
const ReplyTextInput = styled.TextInput`
    width:${windowWidth-95}px; height:40px; padding-left: 15px; padding-top: ${os=='ios'?12:0}px;
`
const ReplySendPress = styled.Pressable`
    width:40px; height:40px;justify-content:center; align-items: center;
`


const AttachImgView = styled.View`
  flex-direction: row; padding-bottom: 16px;
`
const ImgBox = styled.View`
  border-radius: 5px; margin-right: 8px; position: relative;
`
const ImgBlaOpa = styled.View`
  width: 80px; height:80px; border-radius: 5px; background-color: rgba(0,0,0,0.3); position: absolute;
`
const ReplyAttachImg = styled.Image`
  width: 80px; height:80px; border-radius: 5px;
`
const ImgDelPress = styled.Pressable`
  width:25px; height:25px; position: absolute; right:0px; top:0px; align-items: center; justify-content: center;
`
const ImgDelX = styled.Text`
  font-family: 'noto900';	font-size: 16px; line-height:19px;	color:#FFFFFF;
`
const SendReplyBtn = styled.Image`
  width:24px; height:24px;
`

const ModalBackground = styled.View`
    flex:1; position: absolute; background-color: rgba(0,0,0,0.6); width: 100%; height: 100%; align-items: center; justify-content: center;
`
const SelBtnView = styled.View`
    width: ${windowWidth - 80}px; max-width:300px; background-color: #FFF; border-radius: 8px; min-height: 60px;
`
const SelBtnPress = styled.TouchableOpacity`
    width: 100%; height: 60px; align-items: center; justify-content: center;
`
const SelBtnTxt = styled.Text`
    font-family: 'noto700';	font-size: 14px; line-height:17px;	color:#777;
`

const EmojiBox = styled.View`
    width: 100%; height: 60px; flex-direction: row; justify-content: space-around; align-items: center; padding: 0 10px;
`
const EmojiPress = styled.TouchableOpacity`
    width: 40px; height: 40px; justify-content: center; align-items: center;
    border-width: 1px; border-color:#FFF; border-radius: 10px;
`
const EmojiPressActive = styled(EmojiPress)`
    border-color:#FF7900; background-color: #FFF9F4;
`
const EmojiImg = styled.Image`
    width: 22px; height:22px; border-radius: 10px;
`
const EmojiViewBox = styled.View`
    flex-direction: row; width: ${chatboxWidth}px; margin-left: 40px; margin-top: 4px;
`
const EmojiResultBox = styled.Pressable`
    min-width: 36px; height: 22px; border-radius: 20px; background-color: #FFF; padding: 0 7px 0 6px; margin-right: 5px;
    flex-direction: row; align-items: center; justify-content: space-between; border-width: 1px; border-color: #FFF;
`
const EmojiResultImg = styled.Image`
    width: 12px; height: 12px;
`
const EmojiResultTxt = styled.Text`
    font-family: 'noto500';	font-size: 10px; line-height:13px;	color:#333;
`


const ReplyInfoTxt = styled.Text`
    font-family: 'noto500';	font-size: 12px; line-height:15px;	color:${colors.orangeBorder}; padding-bottom: 5px;
`
const ReplyInfoTxt2 = styled(ReplyInfoTxt)`
    color:#333; padding-bottom: 15px;
`
const EditInputView = styled.View`
    position: absolute; top: 50px;
`
const EditInput = styled.TextInput`
     width:${windowWidth-40}px; height:200px; padding: 15px; background-color: #FFF; border-radius: 10px; 
`
const EditBtn = styled.Pressable`
    width:${windowWidth-40}px; height: 50px; background-color: #FF7900; border-radius: 10px; margin-top: 15px;
`
const EditBtnTxt = styled.Text`
    font-family: 'noto500'; font-size: 16px; line-height:50px; color:#FFF; margin-top:0.5px; text-align: center;
`

const ScrollBtnBox = styled.View`
    position: absolute; left:20px;  bottom:${os==='ios'?35:20}px;
`
const ScrollImg = styled.Image`
    width: 40px; height: 40px; 
`


const HeaderView = styled.View`
    width: 100%; height: 90px; background-color: #FFF; 
`
const Header = styled.View`
    width: 100%; height:50px; margin-top: 40px; position: relative; flex-direction: row;
`
const HeaderL = styled.View`
    
`
const BackPress = styled.Pressable`
    width: 50px; height: 50px; justify-content: center; align-items: center; 
`
const BackArrow = styled.Image`
    width: 9px; height: 16px;
`
const NoSearchView = styled.View`
    width: ${windowWidth-50}px;
`
const HeaderC = styled.View`
     height: 50px; justify-content: center; 
`
const GosuName = styled.Text`
    font-family: 'noto500';	font-size: 17px; line-height:21px;	color:#000;
`
const HeaderR = styled.View`
    height: 50px; position: absolute; right:0px; align-items: center;  padding-right: 15px; flex-direction: row;
`
const PortPress = styled.Pressable`
    width: 60px; height: 30px; align-items: center; justify-content: center; border-width:1px; border-radius: 8px; border-color: ${colors.orangeBorder};
`
const HeaderTxt = styled.Text`
     font-family: 'noto500'; font-size: 12px; line-height:15px; color: ${colors.orangeBorder}; padding-top: 2px;
`
const SearchPress = styled.Pressable`
    width: 50px; height: 50px; justify-content: center; align-items: center;
`
const Search = styled.Image`
    width: 22px; height:22px;
`
const SearchView = styled(NoSearchView)`
    justify-content: center; 
`
const SearchInputBox =styled.View`
    width:100%; height:50px; flex-direction: row; justify-content:space-between;
`
const SearchInput = styled.TextInput`
    width:${windowWidth-100}px; height:50px; padding-left: 15px; 
`
const SearchClosePress = styled.Pressable`
    width: 50px; height:50px; align-items: center; justify-content: center;
`
const SearchClose = styled.Image`
    width: 16px; height:16px;
`

const SearchUpDownView = styled.View`
    width: 100%; height:60px; background-color: #FFF;  flex-direction: row; justify-content: flex-end; padding-right: 12px;
`
const SearchUpDownPress = styled.Pressable`
    width: 40px; height: 60px; justify-content: center; margin-left: 10px;
`
const SearchUpDown = styled.Image`
    width: 40px; height: 40px;
`
const SearchNumBox = styled.View`
    width: 100px; height: 60px; justify-content: center; align-items: flex-end;
`
const SearchNumTxt = styled.Text`
    font-family: 'noto400';	font-size: 12px; line-height:15px;	color:${colors.placeholder};
`
const SearchedTxt = styled(ChatTxt)`
    background-color: #FFF5AC;
`

const MetaTagBox = styled.Pressable`
    width:${chatboxWidth}px;  border-radius: 20px; background-color: #FFF;  padding:0; margin-left: 37px; margin-top: 5px;
`
const MetaImg = styled.Image`
    width: 100%; height: 140px; border-top-left-radius: 20px; border-top-right-radius: 20px;
    background-color: red;
`
const MetaBtm = styled.View`
    width: 100%; padding: 12px;
`
const MetaTxt1 = styled.Text`
    font-family: 'noto500';	font-size: 14px; line-height:17px;	color:#242424; 
`
const MetaTxt2 = styled.Text`
    font-family: 'noto500';	font-size: 12px; line-height:15px;	color:#999; margin-top: 8px;
`
const MetaBtn = styled.View`
    width: 100%; height: 30px; background-color: #F2F2F2; border-radius: 10px; margin-top: 10px; justify-content: center;
`
const MetaBtnTxt = styled.Text`
    font-family: 'noto700';	font-size: 12px; line-height:17px;	color:#777; text-align: center;
`


export const PortfolioIssueTalk_N = (props:any) => {
    const {pageName} = props.route.params.param

    //댓글
    const [inputMarginBtm, setInputMarginBtm] = useState(0);
    const [selectedImg, setSelectedImg] = useState([]);
    const [selectedImgCount, setSelectedImgCount] = useState(0);
    const [issueTxt, setIssueTxt] = useState('');
    const [isSendDisabled, setISendDisabled] = useState(false);
    const [reload, setReload] = useState(false);

    const replyInput:any = useRef();
    const searchInputRef:any = useRef(null);
    const searchTargetRef:any = useRef(null);

    const dispatch = useAppDispatch();	
    const navigation:any = useNavigation();	

    const [chatData, setChatData] = useState<any>([]);
    const [readIssueId, setReadIssueId] = useState();
    const [fwdId, setFwdId] = useState('');
    const [bwdId, setBwdId] = useState('');
    const [channelInfo, setChannelInfo] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);
    const [isScrollToReadPlayed, setIsScrollToReadPlayed] = useState(false);
    const [isScrollToSearchResultPlayed, setIsScrollToSearchResultPlayed] = useState(false);
    const [totalFetchCount, setTotalFetchCount] = useState(0);
    const [isShowModal, setIsShowModal] = useState(false);
    const [modalImg, setModalImg] = useState([]);

    const [isOwner, setIsOwner] = useState(false);
    const [myRole, setMyRole] = useState('');

    const [showDelModal, setShowDelModal] = useState(false);
    const [showEmojiModal, setShowEmojiModal] = useState(false);
    const [OriginIssueId, setOriginIssueId] = useState('');
    const [OriginalContent, setOriginalContent] = useState('');
    const [OriginalEmojiList, setOriginalEmojiList] = useState([]);


    const [showEditModal, setShowEditModal] = useState<any>(false);
    const [contentForEdit, setContentForEdit] = useState(null);
    const [issueType, setIssueType] = useState<any>('');
    const [isForwardType, setIsForwardType] = useState<any>(false);

    //검색
    const [isSearchMode, setIsSearchMode] = useState<any>(false);
    const [searchTxt, setSearchTxt] = useState('');
    const [searchResult, setSearchResult] = useState<any>(null);
    const [searchIssueId, setSearchIssueId] = useState<any>(0);
    const [currentSearchResultIdx, setCurrentSearchResultIdx] = useState<any>(0);

    const [showLoader, setShowLoader] = useState(false);

    const [emojiList, setEmojiList] = useState<any>([]);

    const chatScrollRef:any = useRef(null); 
    const readHereRef:any = useRef(null);
    const BASE_URL = `https://cdn.orangeboard.co.kr/`;

    let interval:any="";

    async function getBasicData(){
        let data = await getMyProfile();
        if(!data){
            checkNavigator(navigation, 'home' , {isReload:'y'});
        }
        setMyRole(data?.roleTag);

        data = await getPortEmojiList();
        setEmojiList(data);
    }

    useEffect(()=>{
        getBasicData();
    },[]);


    useEffect(() => {
        return () => {
            DeviceEventEmitter.emit('backFromChatRoom');
        }
    }, []);


    useEffect(()=>{
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => backHandler.remove(); 
    },[isShowModal]);

    const backAction = () => {
        if(isShowModal){
            setIsShowModal(false);
            return true;
        }else{
            navigation.goBack();
            return true;
        }
    };

    async function getData(){
        let result =  await getPortChat(pageName,'','', '50', '', '');

        if(!result){
            result =  await getPortChat(pageName,'','', '50', '', '');
        }
        if(!result){
            checkNavigator(navigation, 'home' , {isReload:'y'});
        }

        setChatData(result?.issueByDateList?.list);
        setReadIssueId(result?.issueByDateList?.readIssueId);
        setFwdId(result?.issueByDateList?.fwdId);
        setBwdId(result?.issueByDateList?.bwdId);
        setChannelInfo(result?.channelInfo)
        setIsOwner(result.isOwner);
        
        setIsLoading(false);
    } 

    useEffect(()=>{
        getData();
    },[reload]);


    useEffect(()=>{
        //캡쳐 방지
        CaptureProtection.preventScreenRecord();
        CaptureProtection.preventScreenshot();
        return () => clearInterval(interval);
    },[]);


    const fetchNewData = async () => {
        let result =  await getPortChat(pageName, bwdId,'', '60', '', '');
        const newChatData = result?.issueByDateList?.list;
        
        if(newChatData.length==0){return;}

        let tempData = [...chatData,  ...newChatData];
       
        setChatData(tempData);
        setReadIssueId(result?.issueByDateList?.readIssueId);
        setBwdId(result?.issueByDateList?.bwdId);
    }

    const fetchOldData = async () => {
        let result =  await getPortChat(pageName, '', fwdId, '60', '', '');
        const newChatData = result?.issueByDateList?.list;

        if(newChatData.length===0){
            Alert.alert('알림','처음입니다.'); return;
        }else{
            let tempData = [...newChatData,  ...chatData];
            setChatData(tempData);
            setReadIssueId(result.issueByDateList.readIssueId);
            setFwdId(result.issueByDateList.fwdId);
        }
    }

    const handleScroll = ({ nativeEvent }:any) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        const isEndOfScroll = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
        const isTopOfScroll = contentOffset.y === 0; 
        if (isEndOfScroll && !isLoading) {
            //최초 호출은 자동 스크롤에 의한 호출이므로 무시하기 (2번째 부터 호출 가능 )
            totalFetchCount != 0 && fetchNewData(); // 새로운 데이터 가져오기
            setTotalFetchCount(totalFetchCount+1);
        }

        if (isTopOfScroll && !isLoading) {
            fetchOldData(); // 과거 데이터 가져오기
        }
    };


    // 백그라운드 실행중 재실행시 오류 방지용 처리 
    const handleAppStateChange = async (nextAppState:any) => {
        setReload(!reload);
        // getData();
        
    };

    useEffect(()=>{ 
        const listener = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            listener.remove();
        };
    },[]);


    if(isLoading){
        return <Loader />
    }


    const displayName:any = channelInfo?.displayName;
    const headerTitle = `${displayName} 고수톡`
    navigation.setOptions({
        headerTitle: headerTitle,
    });


    const changeHttpUrlTxt = (text:string) =>{
        if(text===null){
            return null;
        }

        if(typeof(text)!=='string'){
            return text;
        }

        const urlRegex = /(https?:\/\/[^\s]+)/g;  // 정규표현식을 사용하여 URL 추출
        const splitText = text.split(urlRegex);

        const urlUnderlineTxt = splitText.map((item, index)=>{
        const isUrl = item.substring(0,4)==='http'?true:false;
            return(
                <Text key={index}>
                {isUrl ? 
                    <Text 
                    style={{ textDecorationLine: 'underline', color:'#2685CA' }} 
                    onPress={() => {goLinkOpen(item)}}
                    >{item}</Text>
                :
                <Text>{item}</Text>
                }
                </Text>
            )
        })
        return urlUnderlineTxt;
    }

    const goLinkOpen = async (url:string) => {
        let isAppLink = 'none';
        if(url.includes('https://orangeboard.co.kr/portfolios/@')){
            isAppLink = 'portfolio'
        }else if(url.includes('https://orangeboard.co.kr/insight/')){
            isAppLink = 'report'
        }

        if(isAppLink==='none'){
            Linking.openURL(url);
        }else if(isAppLink==='portfolio'){
            const temp = url.split('/@')[1];
            const pageName = temp.split('/')[0]
            const PortfolioId = temp.split('/')[1]
            checkNavigator(navigation, 'portfolioContent', {pageName, PortfolioId});
        }else if(isAppLink==='report'){
            const shortUrl = url.split('/insight/')[1];
            const data = await getReportShortUrlInfo(shortUrl);
            
            const temp = data.split('/@')[1];
            const pageName = temp.split('/')[0];
            const temp2 = temp.split('/')[1];
            const seoTitle = temp2.split('?')[0];
            checkNavigator(navigation, 'reportContent', {pageName, seoTitle, "postType": "report"});
        }
    }

    const scrollToComponent = () => {
        if(!isScrollToReadPlayed){
            readHereRef?.current?.measureLayout( 
                findNodeHandle(chatScrollRef?.current),
                (x:any, y:any) => { chatScrollRef?.current?.scrollTo({ y, animated: false });} 
            );
            setIsScrollToReadPlayed(true);
        }
    };

    const showImageModal = (Images:any) =>{
        let imageArr:any = [];
        Images.forEach((item:any)=>{
            const url = BASE_URL+item.key;
            imageArr.push({url})
        });
        setModalImg(imageArr);
        setIsShowModal(true);
    }

    const toggleLike = async (id:string, currentLike:boolean) =>{
        const tempArr:any = [];
        chatData.forEach((item:any)=>{
            const date = item.date;
            let issueList:any = [];

            item.issueList.forEach((item2:any)=>{
                const {IssueId, isLike, likeCount} = item2;
                if(id==IssueId){
                    item2.isLike = !isLike;
                    item2.likeCount = !isLike?likeCount+1:likeCount-1;
                }
                issueList.push(item2);
            });
            tempArr.push({date, issueList});
        });
        setChatData(tempArr);
        await togglePortChatLike(pageName, id, currentLike);
    }


    const share = async (text:string, Images:any, Files:any) =>{
        const imgCount = Images.length;

        let message = `오렌지보드에서 전달됨${'\n\n'}${text}`;

        if(imgCount===1){
           const imgUrl = BASE_URL+Images[0].key;
           message+=`${'\n\n'}[이미지]${'\n'}${imgUrl}`;
        }

        if(imgCount>1){
            Images.forEach(({key}:any)=>{
                const imgUrl = BASE_URL+key;
                message+=`${'\n\n'}[이미지]${'\n'}${imgUrl}`;
            })
        }

        const result = await Share.share({message});

    }


    function removeImage(idx:number){
        const newAnswerArr = [...selectedImg];
        newAnswerArr.splice(idx, 1);
        setSelectedImg(newAnswerArr);
        setSelectedImgCount(newAnswerArr.length);
    }   

      // 갤러리 또는 카메라 접근하기
    async function selectImage(){
        const maxImageCount = 3;

        if(selectedImgCount>=maxImageCount){
            Alert.alert('', `이미지는 최대 업로드 갯수 ${maxImageCount}개를 초과 하였습니다.`);		
            return;
        }

        const options:any ={
            mediaType: 'photo', //필수값
            selectionLimit:maxImageCount-selectedImgCount //사진갯수 제한   
        }
        const result:any = await launchImageLibrary(options);
        if (result.didCancel){
            return null;
        } 
        const {assets} = result;
        let finalSelectedImgArr:any = [...selectedImg, ...assets];
        
        setSelectedImg(finalSelectedImgArr);
        setSelectedImgCount(finalSelectedImgArr.length)
    }

    function changeText(txt:any){
        setIssueTxt(txt);
    }

    // 키보드 활성화시 인풋태그 이동 및 스크롤 위로 올림 처리!!! 
    const hasIosBottom = getIphoneBottomInfo();

    Keyboard.addListener('keyboardDidShow', (event:any) => {
        const keyboardHeight = event.endCoordinates.height;
        if(os=='ios'){
            const fixedHeight = hasIosBottom?keyboardHeight-20:keyboardHeight;
            //console.log(fixedHeight)
            setInputMarginBtm(fixedHeight);
        }
        //console.log('Keyboard height is:', event.endCoordinates.height);
        //scrollToPosition();
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollToEnd({ animated: true });
        }
    });
  
    Keyboard.addListener('keyboardDidHide', (event:any) => {
        setInputMarginBtm(0)
    });



    async function replySubmit(){

        if(issueTxt.length < 3 && selectedImg.length === 0){
                Alert.alert( //alert 사용					
                '잠깐!', '고수톡은 3자 이상 작성해 주세요.', [ //alert창 문구 작성				
                {text: '확인', onPress: () => {setISendDisabled(false);} }, //alert 버튼 작성			
            ]				
            );					
            return;
        }
        setShowLoader(true);
        setISendDisabled(true);

        
        //파일 가공하기
        const formData = new FormData();
        formData.append('content', issueTxt);

        if(OriginIssueId!==''){
            formData.append('OriginIssueId', OriginIssueId);
        }

        selectedImg.forEach(({fileName, uri})=>{
            formData.append('images', {
                uri,
                type: 'image/jpeg', 
                name: fileName,
            });
        });

        await insertIssueTalk(formData, channelInfo.pageName);
        finishWriteIssuetalk();
        setShowLoader(false);
    }

    function finishWriteIssuetalk(){
        setSelectedImg([]);
        setSelectedImgCount(0);
        setIssueTxt('');
        setISendDisabled(false);
        setReload(!reload);
        setOriginIssueId('');
        setOriginalContent('');
        setShowDelModal(false);
        setTimeout(()=>{
            Keyboard.dismiss();     //키보드 숨기기

            if (chatScrollRef.current) {
                chatScrollRef.current.scrollToEnd({ animated: true });
            }
        },100);

    }

    function checkDelIssue(){
        Alert.alert( //alert 사용																		
            '잠깐!', '정말로 삭제 하시겠습니까?', [ 																	
                {text: '취소', onPress: () => {}}, 																
                {text: '확인', onPress: () => {
                    delIssue();
                }}, 																
            ]																	
        );																		
    }
    async function delIssue(){
        await deleteIssueTalk(OriginIssueId, channelInfo.pageName);
        finishWriteIssuetalk();
    }

    function checkWriteReply(){
        setShowDelModal(false);
        if (replyInput.current) {
            replyInput.current.focus();
        }
    }

    function goFarmOwner(){
        checkNavigator(navigation, 'farmOwner' , {pageName})
    }


    async function prepareEditMode(){
        setShowDelModal(false);
        setShowEditModal(true);
    }

    function changeEditText(txt:any){
        setContentForEdit(txt);
    }

    async function sendEditTalk(){
        const res = await updateEditIssueTalk(pageName, OriginIssueId, contentForEdit);
        if(res==204){
            setShowEditModal(false);
            finishWriteIssuetalk();
        }else{
            Alert.alert('안내','수정에 실패 하였습니다. 다시 시도해 주세요.')
        }
    }

    function goPortDirect(pageName:string){
        checkNavigator(navigation, 'portfolioOwner' , {pageName})
    }

    function readySearchMode(){
        setIsSearchMode(true);
        setTimeout(()=>{
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        },500)
    }


    function changeSearchTxt(txt:any){
        setSearchTxt(txt);
    }

    async function prepareSearch(){
        if(searchTxt.length <2){
            Alert.alert('안내', '검색어는 2자 이상 입력해 주세요.');
            return;
        }
        const data = await getGosuTalkSearch(pageName, searchTxt);
        
        if(data.length===0){
            Alert.alert('안내', '검색 결과가 없습니다.');
        }else if(data==='fail'){
            Alert.alert('안내', '다시 시도해 주세요.');
        }else{
            setSearchResult(data);
            setSearchIssueId(data[0].IssueId);
            setCurrentSearchResultIdx(0);

            await getChatDataByIssueId(data[0].IssueId);
        }
    }

    async function upSearch () {
        if(currentSearchResultIdx+1===searchResult.length){
            Alert.alert('안내', '처음 입니다.');
            return;
        }

        setIsLoading(true);
        setShowLoader(true);
        setTimeout(async()=>{
            setSearchIssueId(searchResult[currentSearchResultIdx+1].IssueId);
            await getChatDataByIssueId(searchResult[currentSearchResultIdx+1].IssueId);
            setCurrentSearchResultIdx(currentSearchResultIdx+1);
            setShowLoader(false);
            setIsLoading(false);
        },100);

        scrollToSearchResult();
    }

    async function downSearch () {
        if(currentSearchResultIdx===0){
            Alert.alert('안내', '마지막 입니다.');
            return;
        }
        setIsLoading(true);
        setShowLoader(true);

        setTimeout(async()=>{
            setSearchIssueId(searchResult[currentSearchResultIdx-1].IssueId);
            await getChatDataByIssueId(searchResult[currentSearchResultIdx-1].IssueId);
            setCurrentSearchResultIdx(currentSearchResultIdx-1);
            setShowLoader(false);
            setIsLoading(false);
        },100);

        scrollToSearchResult();
    }

    async function goToReplyOriginalContent (IssueId:number){
        setSearchIssueId(IssueId);
        setIsLoading(true);
        setShowLoader(true);

        setTimeout(async()=>{
            setSearchIssueId(IssueId);
            await getChatDataByIssueId(IssueId);
            setIsLoading(false);
            setShowLoader(false);
        },100);
        scrollToSearchResult();
    }
 

    async function getChatDataByIssueId(IssueId:number){
        setIsScrollToSearchResultPlayed(false);

        let result =  await getPortChat(pageName,'','', '50', IssueId, '');
        
        result?.issueByDateList?.list.forEach((item:any)=>{
            item.issueList.forEach((item2:any)=>{
                if(IssueId === item2.IssueId){
                    const newContent = highlightText(item2.content, searchTxt);
                    item2.content = newContent;
                }
            })
        })
        
        setChatData(result?.issueByDateList?.list);
        setReadIssueId(result?.issueByDateList?.readIssueId);
        setFwdId(result?.issueByDateList?.fwdId);
        setBwdId(result?.issueByDateList?.bwdId);
        setChannelInfo(result?.channelInfo)
        setIsOwner(result.isOwner);
    }


    const goTopBottom = async (moveTyp:string) =>{
        setShowLoader(true);
        const result =  await getPortChat(pageName,'','', '50', '', moveTyp);

        setChatData(result?.issueByDateList?.list);
        setReadIssueId(result?.issueByDateList?.readIssueId);
        setFwdId(result?.issueByDateList?.fwdId);
        setBwdId(result?.issueByDateList?.bwdId);
        setChannelInfo(result?.channelInfo)
        setIsOwner(result.isOwner);
        setShowLoader(false);

        setTimeout(()=>{
            if (chatScrollRef.current && moveTyp === 'top') {
                chatScrollRef.current.scrollTo({ y: 0, animated: true });
            }
            if (chatScrollRef.current && moveTyp === 'bottom') {
                chatScrollRef.current.scrollToEnd({ animated: true });
            }
        },100)
    }


    const highlightText = (text:string, searchTxt:string) =>{
        if(text===null){
            return null;
        }
        
        const parts = text?.split(new RegExp(`(${searchTxt})`, 'gi'));
        return (
            <Text>
              {parts.map((part, index) =>
                part.toLowerCase() === searchTxt.toLowerCase() ? (
                  <SearchedTxt 
                    key = {index}
                  >{part}</SearchedTxt>
                ) : (
                  <Text 
                    key = {index}
                >{part}</Text>
                )
              )}
            </Text>
          );
    }

    const scrollToSearchResult = () => {
        if(!isScrollToSearchResultPlayed){
            searchTargetRef?.current?.measureLayout( 
                findNodeHandle(chatScrollRef?.current),
                (x:any, y:any) => { 
                    chatScrollRef?.current?.scrollTo({ y, animated: false });
                } 
            );
            setIsScrollToSearchResultPlayed(true);
        }
    };

    function closeSearchMode(){
        setIsSearchMode(false);
        setSearchTxt('');
        setSearchIssueId(0);
        setCurrentSearchResultIdx(0);
    }

    async function shareMyTalk(){
        const {code} = await insertShareIssueTalk(pageName, OriginIssueId);
        if(code!='201'){
            Alert.alert('안내','다시 시도해 주세요.');
        }
        setShowEmojiModal(false);
        setOriginIssueId('');
    }

    function closeEmojiModal(){
        setShowEmojiModal(false);
        setOriginIssueId('');
        setOriginalEmojiList([]);
    }

    async function toggleEmoji(IssueId:any, pageName:string, EmojiId:number, isActive:boolean){
        const newChatData = [...chatData];
        let isAdjusted = false;

        newChatData.forEach((item:any)=>{
            item.issueList.forEach((item2:any)=>{
                const curIssueId = item2.IssueId;

                //1. 이모지 없으면 바로 추가 하기
                if(curIssueId === IssueId && item2.EmojiReaction.length === 0){
                    const obj = {EmojiId, isReacted : true, reactCount:1};
                    item2.EmojiReaction.push(obj);
                    isAdjusted = true;
                }

                //2. 이모지 나와 있거나 이미 누른 이모지이면 조정 해주기
                item2.EmojiReaction.forEach((item3:any, idx:number)=>{
                    if(!isAdjusted && curIssueId=== IssueId && EmojiId==item3.EmojiId){
                        if(item3.reactCount === 1 && isActive ){
                            item2.EmojiReaction.splice(idx, 1);
                        }else{
                            item3.isReacted = !isActive;
                            item3.reactCount = isActive?item3.reactCount-1:item3.reactCount+1;
                            isAdjusted = true;
                        }
                    }
                });
                
                //팝업 띄워 누르면 추가 해주기
                if(!isAdjusted && curIssueId === IssueId && !isActive){
                    const obj = {EmojiId, isReacted : true, reactCount:1};
                    item2.EmojiReaction.push(obj);
                    
                }
                
            });
        });

        setChatData(newChatData);
        closeEmojiModal();

        const res = await toggleIssueTalkEmoji(IssueId, pageName, EmojiId, isActive);
        
    }

    return (
        <BasicView>
            <HeaderView>
                <Header>
                    <HeaderL>
                        <BackPress
                            onPress = {()=>{goBack(navigation)}}
                        >
                            <BackArrow source={require("../assets/icons_w/left_arrow.png")}/>
                        </BackPress>
                    </HeaderL>
                    {!isSearchMode?
                    <NoSearchView>
                        <HeaderC>
                            <GosuName>{channelInfo.displayName} 고수톡</GosuName>
                        </HeaderC>
                        <HeaderR>
                                <SearchPress
                                    onPress={readySearchMode}
                                >
                                    <Search source={require("../assets/icons/searchIconBlack.png")}/>
                                </SearchPress>
                                <PortPress onPress={()=>{goPortDirect(pageName)}}>
                                    <HeaderTxt>계좌보기</HeaderTxt>
                                </PortPress>
                        </HeaderR>
                    </NoSearchView>
                    :
                    <SearchView>
                        <SearchInputBox>
                            <SearchInput 
                                ref={searchInputRef}
                                placeholder= {'검색어를 입력해 주세요'}
                                onChangeText={changeSearchTxt} 
                                value={searchTxt}
                                onSubmitEditing = {prepareSearch}
                            />
                            <SearchClosePress
                                onPress={closeSearchMode}
                            >
                                <SearchClose source={require("../assets/icons_w/search_close.png")}/>
                            </SearchClosePress>
                        </SearchInputBox>
                    </SearchView>
                    }
                    
                </Header>
            </HeaderView>

            <ChatScrollView 
                ref={chatScrollRef}
                onContentSizeChange={searchIssueId === 0 ? scrollToComponent : scrollToSearchResult}
                onScroll={handleScroll}
            >
                {chatData?.map((item:any, idx:number)=>{
                    const { date, issueList } = item;
                    const dateStr = changeChatDate(date);
                    // console.log(readIssueId, bwdId, fwdId);
                    
                    return(
                        <ScrollInnerView key={idx+'_chat'}>
                            <DateBox>
                                <DateLine />
                                <DateTxt>{dateStr}</DateTxt>
                                <DateLine />
                            </DateBox>

                            {issueList?.map((item2: any, idx2: number) => {
                                let { content, OriginIssue, Images, Files, IssueId, likeCount, isLike, createdAt, issueType, User, EmojiReaction, Metatag }:any = item2;
                                const isReply = OriginIssue != null;
                                const hasMetaTag = Metatag != null;

                                const time = convertToAMPM(createdAt);
                                let isForwarded = false;
                                const topIssueIdForForward = IssueId;
                                if(item2.ForwardedIssue !== null){
                                    isForwarded = true;
                                    content = item2.ForwardedIssue.content;
                                    OriginIssue = item2.ForwardedIssue.OriginIssue;
                                    Images = item2.ForwardedIssue.Images;
                                    Files = item2.ForwardedIssue.Files;
                                    IssueId = item2.ForwardedIssue.IssueId;
                                    likeCount = item2.ForwardedIssue.likeCount;
                                    isLike = item2.ForwardedIssue.isLike;
                                    createdAt = item2.ForwardedIssue.createdAt;
                                    issueType = item2.ForwardedIssue.issueType;
                                    User = item2.ForwardedIssue.User;
                                    
                                }
                                
                                const contentOriginal = content;


                                // 답장 부분
                                let replyContent = "";
                                let replyImages = [];
                                let replyFile = [];
                                let replyImgCount = 0;
                                let isForwardedReply = false;

                                if(isReply){
                                    isForwardedReply = OriginIssue.ForwardedIssue != null;
                                    replyContent = isForwardedReply?  OriginIssue.ForwardedIssue.content : OriginIssue?.content;
                                    replyImages = isForwardedReply ? OriginIssue.ForwardedIssue.Images : OriginIssue?.Images;
                                    replyFile = isForwardedReply ? OriginIssue.ForwardedIssue.Files : OriginIssue?.Files;
                                    replyImgCount = replyImages.length;
                                }
                                content = changeHttpUrlTxt(content);
                                const imageCount = Images.length;

                                let isImgWithTxt = false;
                                if(imageCount>0 && contentOriginal?.length !=0){
                                    isImgWithTxt = true;
                                }

                                let isFileExist = false;
                                if(Files.length != 0){
                                    isFileExist = true;
                                }

                                return (
                                    <View key={idx+'_'+idx2+'_chat'}>
                                        <ChatOuterBox>
                                            <Pressable onPress={goFarmOwner}>
                                                <PortLogo 
                                                    ref = {IssueId === searchIssueId ? searchTargetRef : null}
                                                    source={{uri:channelInfo?.avatarUrl}} 
                                                />
                                            </Pressable>
                                            <ChatInnerBox
                                                style= {getBuySellStyle(issueType)}
                                            >

                                                {/* 답장 헤더 부분 */}
                                                {isReply &&
                                                <>
                                                <ReplyHeadBox 
                                                    onPress = {()=>{goToReplyOriginalContent(
                                                        OriginIssue?.ForwardedIssue?.IssueId != undefined ? 
                                                        OriginIssue?.ForwardedIssue?.IssueId : 
                                                        OriginIssue?.IssueId
                                                    )}}
                                                >
                                                    <ReplyHeadTxt>{displayName}에게 답장</ReplyHeadTxt>

                                                   {isForwardedReply && 
                                                    <ForwardUserBox>
                                                        <ForwardIcon source={{uri:OriginIssue?.ForwardedIssue?.User?.avatarUrl}}/>
                                                        <ForwardHeadTxt2>{OriginIssue?.ForwardedIssue?.User?.displayName}에서 가져온 메세지</ForwardHeadTxt2>
                                                    </ForwardUserBox>
                                                    }



                                                    <ChatTxt 
                                                        numberOfLines={2}
                                                        style={getBuySellTextStyle(OriginIssue.issueType)}
                                                    >{replyContent}</ChatTxt>
                                                    <Space height={6} />

                                                   
                                                    {replyImgCount != 0 &&
                                                        <SingleImageForReply source={{uri:BASE_URL+replyImages[0]?.key}}/>
                                                    }


                                                    {
                                                    replyFile.length!=0 &&
                                                    <ReplyFileNameTxt>파일 : {replyFile[0].fileName}</ReplyFileNameTxt>   
                                                    } 

                                                    {/* {replyImgCount === 1 &&
                                                    <ImgPress onPress={()=>{showImageModal(replyImages)}}>
                                                        <SingleImage source={{uri:BASE_URL+replyImages[0]?.key}}/>
                                                    </ImgPress>
                                                    }

                                                    {replyImgCount ==2 &&
                                                    <ImgPress2Image onPress={()=>{showImageModal(replyImages)}}>
                                                        {replyImages.map((img:any, idx:number)=><MultiImage2Image key={idx+'reply_2img'} source={{uri:BASE_URL+img.key}}/>)}
                                                    </ImgPress2Image>
                                                    }

                                                    {replyImgCount >2 && replyImgCount <=4 &&
                                                    <ImgPress onPress={()=>{showImageModal(replyImages)}}>
                                                        {replyImages.map((img:any, idx:number)=><MultiImage key={idx+'reply_2img'} source={{uri:BASE_URL+img.key}}/>)}
                                                    </ImgPress>
                                                    }

                                                    {replyImgCount >4 &&
                                                    <ImgPress onPress={()=>{showImageModal(replyImages)}}>
                                                        <MultiImage source={{uri:BASE_URL+replyImages[0].key}}/>
                                                        <MultiImage source={{uri:BASE_URL+replyImages[1].key}}/>
                                                        <MultiImage source={{uri:BASE_URL+replyImages[2].key}}/>
                                                        <MultiImageMoreBox>
                                                            <MultiImageFinalAdd source={{uri:BASE_URL+replyImages[3].key}}/>
                                                            <MultiImageFinalAddBlack>
                                                                <MultiImageMoreTxt>+{imageCount-4}장{'\n'}더보기</MultiImageMoreTxt>
                                                            </MultiImageFinalAddBlack>
                                                        </MultiImageMoreBox>
                                                    </ImgPress>
                                                    }
                                                    */}

                                                    

                                                  
                                                </ReplyHeadBox>
                                                <LineEEEEEE />
                                                <Space height={6} />
                                                </>
                                                }
                                                

                                                {/* 전달 헤더 부분 */}
                                                {isForwarded && 
                                                    <ForwardHeadBox>
                                                        <ForwardHeadTxt>다음으로부터 가져옴</ForwardHeadTxt>
                                                        <ForwardUserBox>
                                                            <ForwardIcon source={{uri:User.avatarUrl}}/>
                                                            <ForwardHeadTxt2>{User.displayName} 고수톡</ForwardHeadTxt2>
                                                        </ForwardUserBox>
                                                    </ForwardHeadBox>
                                                }

                                                {
                                                isImgWithTxt?
                                                <MoreTxtBox
                                                   
                                                >
                                                    {contentOriginal?.length !== 0 && <ChatTxt>{content}</ChatTxt>}
                                                </MoreTxtBox>
                                                :
                                                <>
                                                    {contentOriginal?.length !== 0 && <ChatTxt style={getBuySellTextStyle(issueType)}>{content}</ChatTxt>}
                                                </>
                                                }

                                                {imageCount === 1 &&
                                                <ImgPress onPress={()=>{showImageModal(Images)}}>
                                                    <SingleImage source={{uri:BASE_URL+Images[0]?.key}}/>
                                                </ImgPress>
                                                }

                                                {imageCount ==2 &&
                                                <ImgPress2Image onPress={()=>{showImageModal(Images)}}>
                                                    {Images.map((img:any, idx:number)=><MultiImage2Image key={idx+'_2img'} source={{uri:BASE_URL+img.key}}/>)}
                                                </ImgPress2Image>
                                                }

                                                {imageCount >2 && imageCount <=4 &&
                                                <ImgPress onPress={()=>{showImageModal(Images)}}>
                                                    {Images.map((img:any, idx:number)=><MultiImage key={idx+'_2img'} source={{uri:BASE_URL+img.key}}/>)}
                                                </ImgPress>
                                                }

                                                {imageCount >4 &&
                                                <ImgPress onPress={()=>{showImageModal(Images)}}>
                                                    <MultiImage source={{uri:BASE_URL+Images[0].key}}/>
                                                    <MultiImage source={{uri:BASE_URL+Images[1].key}}/>
                                                    <MultiImage source={{uri:BASE_URL+Images[2].key}}/>
                                                    <MultiImageMoreBox>
                                                        <MultiImageFinalAdd source={{uri:BASE_URL+Images[3].key}}/>
                                                        <MultiImageFinalAddBlack>
                                                            <MultiImageMoreTxt>+{imageCount-4}장{'\n'}더보기</MultiImageMoreTxt>
                                                        </MultiImageFinalAddBlack>
                                                    </MultiImageMoreBox>
                                                </ImgPress>
                                                }


                                                {isFileExist && 
                                                    Files.map((file:any, idx_f:number)=>{
                                                        // console.log(file);
                                                        const {fileName, size, key} = file;
                                                        return(
                                                            <FileOuterBox key={idx_f+"file"}>
                                                                <FileInnerBox onPress={()=>{fileDown(BASE_URL, key, fileName)}}>
                                                                    <FileIcon1 source={require('../assets/icons/chatDown1.png')}/>
                                                                    <FileTxtBox>
                                                                        <FileNameTxt numberOfLines={1}>{fileName}</FileNameTxt>
                                                                        <FileNameTxt2 numberOfLines={1}>{size}KB</FileNameTxt2>
                                                                    </FileTxtBox>
                                                                    <FileIcon2 source={require('../assets/icons/chatDown2.png')}/>
                                                                </FileInnerBox>

                                                                <FileToolBox>
                                                                    <TimeTxt>{time}</TimeTxt>
                                                                </FileToolBox>
                                                            </FileOuterBox>
                                                        )
                                                    })
                                                }
                                            </ChatInnerBox>

                                            <ChatToolBox>
                                                    <ChatToolInner>
                                                        {isOwner &&
                                                        <ToolView onPress={(()=>{
                                                            setShowDelModal(true);
                                                            setOriginIssueId(topIssueIdForForward);
                                                            setOriginalContent(content);
                                                            setContentForEdit(contentOriginal);
                                                            setIssueType(issueType);
                                                            setIsForwardType(isForwarded);
                                                        })}>
                                                            <ToolIcon
                                                                source={require("../assets/icons_w/verticalDotCircle.png")}
                                                            />
                                                        </ToolView>
                                                        }

                                                        {!isOwner &&
                                                        <ToolView onPress={(()=>{
                                                            setShowEmojiModal(true);
                                                            setOriginIssueId(topIssueIdForForward);
                                                            setOriginalEmojiList(EmojiReaction);
                                                        })}>
                                                            <ToolIcon
                                                                source={require("../assets/icons_w/verticalDotCircle.png")}
                                                            />
                                                        </ToolView>
                                                        }

                                                        {/* <ToolView  
                                                            onPress={()=>{toggleLike(IssueId, isLike)}}>
                                                            <ToolIcon
                                                                source={isLike?require("../assets/icons/chatHeart.png"):require("../assets/icons/chatHeartOff.png")}
                                                            />

                                                            <LikeCountBox>
                                                                <LikeCount>{likeCount}</LikeCount>
                                                            </LikeCountBox>
                                                        </ToolView> */}
                                                    </ChatToolInner>
                                                    <TimeTxt>{time}</TimeTxt>
                                                
                                            </ChatToolBox>
                                        </ChatOuterBox>

                                        
                                        {EmojiReaction.length !== 0 &&
                                        <EmojiViewBox>
                                            {EmojiReaction.map((item:any, idx:number)=>{
                                                const key = emojiList.reduce((returnKey:any, item2:any) =>{									
                                                    if( item2.EmojiId ===  item.EmojiId ){returnKey =  item2.key}								
                                                    return returnKey;								
                                                },'');	
                                                const isReacted = item.isReacted;
                                                								
                                                return(
                                                    <EmojiResultBox
                                                        key={'emoji_'+idx}
                                                        style={isReacted?{borderColor:'#FF7900', backgroundColor:'#FFF9F4'}:{}}
                                                        onPress={()=>{
                                                            toggleEmoji(topIssueIdForForward, pageName, item.EmojiId, isReacted);
                                                        }}
                                                    >
                                                        <EmojiResultImg source={{uri:BASE_URL+key}}/>
                                                        <EmojiResultTxt>{item.reactCount}</EmojiResultTxt>
                                                    </EmojiResultBox>
                                                )
                                            })}
                                        </EmojiViewBox>
                                        }

                                        { hasMetaTag && 
                                        <MetaTagBox
                                            onPress={()=>{goLinkOpen(Metatag.url)}}
                                        >
                                            {Metatag.image !== null && <MetaImg source={{uri:Metatag.image}}/>}
                                            <MetaBtm>
                                                <MetaTxt1>{Metatag.title}</MetaTxt1>
                                                <MetaTxt2>{Metatag.baseUrl}</MetaTxt2>
                                                <MetaBtn>
                                                    <MetaBtnTxt>링크로 이동</MetaBtnTxt>
                                                </MetaBtn>
                                            </MetaBtm>
                                        </MetaTagBox>    
                                        }

                                        {item2.IssueId == readIssueId &&
                                        <ReadHereView ref={readHereRef}>
                                            <ReadHereBox>
                                                <ReadHereTxt>여기까지 읽었습니다</ReadHereTxt>
                                            </ReadHereBox>
                                        </ReadHereView>
                                        }
                                    </View>
                                )})

                            }
                        </ScrollInnerView>
                    )
                })

                }
                    <Space50 />
                </ChatScrollView> 
                
                {isShowModal&& 
                <ModalView>
                    <Space height={40}/>
                    <ModalCloseView>
                        <ClosePress onPress={()=>{setIsShowModal(false)}}>
                            <EvilIcons name="close" size={28} color="white" />
                        </ClosePress>
                    </ModalCloseView>
                    <ImageViewer imageUrls={modalImg}/>

                </ModalView>
                }


                {searchResult != null && isSearchMode &&
                <SearchUpDownView>
                    <SearchNumBox>
                        <SearchNumTxt>{currentSearchResultIdx+1}/{searchResult.length}</SearchNumTxt>
                    </SearchNumBox>
                    <SearchUpDownPress
                        onPress = {upSearch}
                    >
                        <SearchUpDown source={require('../assets/icons_w/search_up.png')}/>
                    </SearchUpDownPress>
                    <SearchUpDownPress
                        onPress= {downSearch}
                    >
                        <SearchUpDown source={require('../assets/icons_w/search_down.png')}/>
                    </SearchUpDownPress>
                </SearchUpDownView>
                }

        {!isSearchMode &&    
        <ScrollBtnBox style={isOwner&&{bottom:os==='ios'?120:100}}>
            <TouchableOpacity onPress={()=>{goTopBottom('top')}}>
                <ScrollImg source={require('../assets/icons_w/scroll_up.png')}/>
            </TouchableOpacity>
            
            <Space height={8}/>

            <TouchableOpacity onPress={()=>{goTopBottom('bottom')}}>
                <ScrollImg source={require('../assets/icons_w/scroll_down.png')}/>
            </TouchableOpacity>

        </ScrollBtnBox>
        }



        {/* 댓글쓰기 아래 고정 부분 */}
        {isOwner &&
        <>
        <Shadow
          startColor={'rgba(0,0,0,0.02)'} 
          endColor={'rgba(0,0,0,0)'}				
          style={{borderRadius:0}}			
          distance={20}			
          offset = {[0,-20]}			
        >				
          <ReplyInputView style={{marginBottom:inputMarginBtm}}>
                <PaddingView>
                    {OriginIssueId!=='' && !showDelModal &&
                        <>
                        <ReplyInfoTxt>{channelInfo.displayName}에게 답장</ReplyInfoTxt>
                        <ReplyInfoTxt2
                            numberOfLines={1}
                        >{OriginalContent}</ReplyInfoTxt2>
                        </>
                    }

                    <AttachImgView style={selectedImg.length==0?{paddingBottom:0}:{paddingBottom:16}}>
                        {selectedImg.map((item:any, idx)=>{
                            return(
                                <ImgBox key={idx+'img'}>
                                <ReplyAttachImg source={{uri:item.uri,}}/>
                                <ImgBlaOpa />
                                <ImgDelPress onPress={()=>{removeImage(idx)}}>
                                    <ImgDelX>&times;</ImgDelX>
                                </ImgDelPress>
                                </ImgBox>
                            )
                        })}
                    </AttachImgView>


                    <ReplyTextInputBox>
                        <ReplyTextInput 
                            multiline = {true}
                            placeholder= {'내용을 입력해 주세요'}
                            onChangeText={changeText} 
                            value={issueTxt}
                            ref={replyInput}
                        />
                        
                        <ReplySendPress 
                            onPress={replySubmit}
                            disabled={isSendDisabled}
                        >
                            <SendReplyBtn source={require('../assets/icons/sendReplyBtn.png')}/>
                        </ReplySendPress>
                    </ReplyTextInputBox>
                    <ReplyBottomView>
                        <ReplyBtmPress onPress={selectImage}>
                            <ImgUpBtn source={require('../assets/icons/upImg.png')} />
                        </ReplyBtmPress>

                    </ReplyBottomView>
                </PaddingView>
          </ReplyInputView>
        </Shadow>
        <IPhoneBottomWhite />
        </>
        }

       {showDelModal &&
        <ModalBackground style={{zIndex:100}}>
            <ModalCloseView2>
                <ClosePress onPress={()=>{
                    setShowDelModal(false);
                    setOriginIssueId('');
                    setOriginalContent('');
                }}>
                    <EvilIcons name="close" size={28} color="white" />
                </ClosePress>
            </ModalCloseView2>
            <SelBtnView>
                <SelBtnPress 
                    onPress={checkWriteReply}
                >
                    <SelBtnTxt>답장하기</SelBtnTxt>
                </SelBtnPress>

               {issueType !== 'buy' && issueType !== 'sell' &&
               <>
                   {!isForwardType && 
                    <SelBtnPress
                        onPress={prepareEditMode}
                    >
                        <SelBtnTxt>수정하기</SelBtnTxt>
                    </SelBtnPress>
                    }
                    <SelBtnPress
                        onPress={checkDelIssue}
                    >
                        <SelBtnTxt>삭제하기</SelBtnTxt>
                    </SelBtnPress>
                </>
                }
            </SelBtnView>

        </ModalBackground>
        }

        {showEmojiModal &&
        <ModalBackground>
            <ModalCloseView2>
                <ClosePress onPress={closeEmojiModal}>
                    <EvilIcons name="close" size={28} color="white" />
                </ClosePress>
            </ModalCloseView2>
            <SelBtnView>
                <EmojiBox>
                    {emojiList.map((item:any, idx:number)=>{
                        let isActive = false;

                        OriginalEmojiList.forEach((item2:any) =>{									
                            if( item2.EmojiId ===  item.EmojiId ){isActive =  item2.isReacted}								
                        });	

                        return(
                            <EmojiPress 
                                style = {isActive?{borderColor:'#FF7900', backgroundColor:'#FFF9F4'}:{}}
                                key={'emoji_'+idx} onPress={()=>{toggleEmoji(OriginIssueId, pageName, item.EmojiId, isActive)}}
                            >
                                <EmojiImg source={{uri:BASE_URL+item.key}}/>
                            </EmojiPress>
                            )
                    })}
                </EmojiBox>
                    <LineEEEEEE/>
                    {isOwner ?
                    <SelBtnPress 
                        onPress={shareMyTalk}
                    >
                        <SelBtnTxt style={{color:'#333'}}>내 고수톡에 공유하기</SelBtnTxt>
                    </SelBtnPress>
                    :
                    <SelBtnPress>
                        <SelBtnTxt>고수의 메세지에 감정을 공유해 보아요</SelBtnTxt>
                    </SelBtnPress>
                    }

            </SelBtnView>

        </ModalBackground>
        }

        {showLoader &&
        <ModalBackground>
            <ActivityIndicator size="small" color="#FF7900"/>
        </ModalBackground>
        }

        {showEditModal &&
        <ModalBackground>
            <ModalCloseView2>
                <ClosePress onPress={()=>{
                    setShowEditModal(false);
                    setOriginIssueId('');
                    setOriginalContent('');
                }}>
                    <EvilIcons name="close" size={28} color="white" />
                </ClosePress>
            </ModalCloseView2>
            
            <EditInputView>
                <EditInput
                    style={{textAlignVertical: 'top'}}
                    multiline = {true}
                    placeholder= {'수정할 내용을 입력해 주세요'}
                    onChangeText={changeEditText} 
                    value={contentForEdit}
                />

                <EditBtn onPress={sendEditTalk}>
                    <EditBtnTxt>수정하기</EditBtnTxt>
                </EditBtn>
            </EditInputView>
          

            
            
        </ModalBackground>
        }

        </BasicView>
    );
    };


