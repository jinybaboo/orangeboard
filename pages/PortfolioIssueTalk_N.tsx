import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Linking, Platform, Text, View, findNodeHandle, Share, DeviceEventEmitter, Keyboard, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import colors from "../common/commonColors";
import { changeChatDate, convertToAMPM, fileDown, getIphoneBottomInfo, getWindowWidth} from "../common/commonFunc";
import {LineEEEEEE, PaddingView, Space} from "../common/commonStyledComp";
import { EvilIcons } from '@expo/vector-icons'; 
import { useAppDispatch } from "../store";
import ImageViewer from 'react-native-image-zoom-viewer';
import Loader from "../components/common/Loader";
import { Space50 } from "../common/commonStyledComp";
import { CaptureProtection } from 'react-native-capture-protection';
import { deleteIssueTalk, getPortChat, getReportShortUrlInfo, insertIssueTalk, togglePortChatLike } from "../common/fetchData";
import { checkNavigator } from "../common/navigator_w";
import {Shadow} from 'react-native-shadow-2';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import IPhoneBottomWhite from "../components/common/IPhoneBottomWhite";

const os = Platform.OS;
const windowWidth = getWindowWidth();
const boxWidth = windowWidth -32;
const chatboxWidth = windowWidth-145 - 20;
const imgBoxWidth = chatboxWidth - 16;
const img2BoxWidth = (windowWidth-145)/2-16;
const BasicView = styled.View`
    flex:1;
    background-color: #F5F5F5;
    position: relative;  
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
  width:${chatboxWidth}px; padding:0px 8px 8px; border-radius: 5px; min-height: 25px; margin-left: 7px; background-color: #FFFFFF;  
`
const MoreTxtBox = styled.View`
  width:${imgBoxWidth}px; min-height: 25px; padding:1px 0px 8px;
`

const ReplyHeadBox = styled.View`
  width:${imgBoxWidth}px; min-height: 25px; padding:2px 0px 8px;
`
const ReplyHeadTxt = styled.Text`
  font-family: 'noto500'; font-size: 12px; line-height:15px; color:${colors.orangeBorder}; padding-top: 8px; padding-bottom: 2px;
`
const ReplyFileNameTxt = styled.Text`
  font-family: 'noto400'; font-size: 12px; line-height:18px; color:rgb(119, 119, 119); 
`

const ChatTxt = styled.Text`
  font-family: 'noto500'; font-size: 12px; line-height:18px; color:#333; padding-top: 7px;
`

const PortLogo = styled.Image`
  width:30px; height:30px; border-radius: 5px;
`
const ChatToolBox = styled.View`
  width:68px; height: 34px; position: absolute; bottom: 0px; right:3px;
`
const ChatToolInner = styled.View`
  flex-direction: row;
`
const ToolView = styled.Pressable`
  width:22px; height:22px; margin-right:2px; 
`
const ToolIcon = styled.Image`
  width:22px; height:22px; 
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
  width:100%; margin-top: 16px; flex-direction: row; position: relative;
`
const FileInnerBox = styled.Pressable`
    width:${chatboxWidth-50}px; padding:8px; border-radius: 5px; height: 40px; margin-left: 7px; background-color: #FFFFFF; flex-direction: row; align-items: center;
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
  width:68px; height: 34px; position: absolute; top: 25px; right:53px;
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
    position: absolute; top:0px; 
`
const ClosePress = styled.Pressable`
    width:100px; height:50px; justify-content: center; align-items: flex-end; padding-right: 10px;
`
const ModalView = styled.View`
    width:100%; height:100%; background-color: #000; flex:1; position:absolute; padding:0 10px;
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
    width: 240px; background-color: #FFF; border-radius: 8px; min-height: 60px;
`
const SelBtnPress = styled.TouchableOpacity`
    width: 100%; height: 60px; align-items: center; justify-content: center;
`
const SelBtnTxt = styled.Text`
    font-family: 'noto700';	font-size: 14px; line-height:17px;	color:#777;
`
const ReplyInfoTxt = styled.Text`
    font-family: 'noto500';	font-size: 12px; line-height:15px;	color:${colors.orangeBorder}; padding-bottom: 5px;
`
const ReplyInfoTxt2 = styled(ReplyInfoTxt)`
    color:#333; padding-bottom: 15px;
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

    const dispatch = useAppDispatch();	
    const navigation:any = useNavigation();	

    const [chatData, setChatData] = useState<any>([]);
    const [readIssueId, setReadIssueId] = useState();
    const [fwdId, setFwdId] = useState('');
    const [bwdId, setBwdId] = useState('');
    const [channelInfo, setChannelInfo] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);
    const [isScrollToReadPlayed, setIsScrollToReadPlayed] = useState(false);
    const [totalFetchCount, setTotalFetchCount] = useState(0);
    const [isShowModal, setIsShowModal] = useState(false);
    const [modalImg, setModalImg] = useState([]);

    const [isOwner, setIsOwner] = useState(false);

    const [showDelModal, setShowDelModal] = useState(false);
    const [OriginIssueId, setOriginIssueId] = useState('');
    const [OriginalContent, setOriginalContent] = useState('');


    const [showLoader, setShowLoader] = useState(false);

    const chatScrollRef:any = useRef(null); 
    const readHereRef:any = useRef(null);
    const BASE_URL = `https://cdn.orangeboard.co.kr/`;

    let interval:any="";

    useEffect(() => {
        return () => {
            DeviceEventEmitter.emit('backFromChatRoom');
        }
    }, []);

    async function getData(){
        let result =  await getPortChat(pageName,'','', '100');
        if(!result){
            Alert.alert('접근 권한이 없습니다.');
            checkNavigator(navigation, 'home' , {isReload:'n'});
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
        let result =  await getPortChat(pageName, bwdId,'', '10');
        const newChatData = result?.issueByDateList?.list;
        
        if(newChatData.length==0){return;}

        let tempData = [...chatData,  ...newChatData];
       
        setChatData(tempData);
        setReadIssueId(result?.issueByDateList?.readIssueId);
        setBwdId(result?.issueByDateList?.bwdId);
    }

    const fetchOldData = async () => {
        let result =  await getPortChat(pageName, '', fwdId, '10');
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




    if(isLoading){
        return <Loader />
    }


    const {displayName}:any = channelInfo;
    const headerTitle = `${displayName} 고수톡`
    navigation.setOptions({
        headerTitle: headerTitle,
    });


    const changeHttpUrlTxt = (text:string) =>{
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
            Linking.openURL(url)
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
            checkNavigator(navigation, 'reportContent', {pageName, seoTitle});
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

        if(issueTxt.length < 3){
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
        setShowDelModal(false);
        setOriginIssueId('');
        setOriginalContent('');
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

    return (
        <BasicView>
            <ChatScrollView 
                ref={chatScrollRef}
                onContentSizeChange={scrollToComponent}
                onScroll={handleScroll}
            >
                {chatData.map((item:any, idx:number)=>{
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
                                let { content, OriginIssue, Images, Files, IssueId, likeCount, isLike, createdAt, deletedAt }:any = item2;
                                const isReply = OriginIssue != null;
                                const time = convertToAMPM(createdAt);
                                
                                let replyContent = "";
                                let replyImages = OriginIssue?.Images;
                                let replyImgCount = 0;
                                let replyFile = OriginIssue?.Files;
                                if(isReply){
                                    replyContent = OriginIssue?.content;
                                    replyImgCount = replyImages.length;
                                }
                                content = changeHttpUrlTxt(content);
                                const imageCount = Images.length;

                                let isImgWithTxt = false;
                                if(imageCount>0 && item2.content.length !=0){
                                    isImgWithTxt = true;
                                }

                                let isFileExist = false;
                                if(Files.length != 0){
                                    isFileExist = true;
                                }

                                return (
                                    <View key={idx+'_'+idx2+'_chat'}>
                                        <ChatOuterBox>
                                            <PortLogo source={{uri:channelInfo?.avatarUrl}} />
                                            <ChatInnerBox>
                                                {isReply &&
                                                <>
                                                <ReplyHeadBox>
                                                    <ReplyHeadTxt>{displayName}에게 답장</ReplyHeadTxt>
                                                    <ChatTxt numberOfLines={1}>{replyContent}</ChatTxt>
                                                    <Space height={6} />

                                                    {replyImgCount === 1 &&
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

                                                    {
                                                    replyFile.length!=0 &&
                                                    <ReplyFileNameTxt>파일 : {replyFile[0].fileName}</ReplyFileNameTxt>   
                                                    }
                                                </ReplyHeadBox>
                                                <LineEEEEEE />
                                                <Space height={6} />
                                                </>
                                                }

                                                {
                                                isImgWithTxt?
                                                <MoreTxtBox>
                                                    <ChatTxt>{content}</ChatTxt>
                                                </MoreTxtBox>
                                                :
                                                <ChatTxt>{content}</ChatTxt>
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
                                            </ChatInnerBox>

                                            <ChatToolBox>
                                                    <ChatToolInner>
                                                        {isOwner &&
                                                        <ToolView onPress={(()=>{
                                                            setShowDelModal(true);
                                                            setOriginIssueId(IssueId);
                                                            setOriginalContent(content);
                                                        })}>
                                                            <ToolIcon
                                                                source={require("../assets/icons_w/verticalDotCircle.png")}
                                                            />
                                                        </ToolView>
                                                        }

                                                        <ToolView  onPress={()=>{toggleLike(IssueId, isLike)}}>
                                                            <ToolIcon
                                                                source={isLike?require("../assets/icons/chatHeart.png"):require("../assets/icons/chatHeartOff.png")}
                                                            />

                                                            <LikeCountBox>
                                                                <LikeCount>{likeCount}</LikeCount>
                                                            </LikeCountBox>
                                                        </ToolView>
                                                    </ChatToolInner>
                                                    <TimeTxt>{time}</TimeTxt>
                                                
                                            </ChatToolBox>
                                        </ChatOuterBox>


                                        {IssueId==readIssueId &&
                                        <ReadHereView ref={readHereRef}>
                                            <ReadHereBox>
                                                <ReadHereTxt>여기까지 읽었습니다</ReadHereTxt>
                                            </ReadHereBox>
                                        </ReadHereView>
                                        }


                                        {isFileExist && 
                                            Files.map((file:any, idx_f:number)=>{
                                                // console.log(file);
                                                const {fileName, size, key} = file;
                                                return(
                                                    <FileOuterBox key={idx_f+"file"}>
                                                        <PortLogo source={{uri:channelInfo?.avatarUrl}} />
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
                <ModalCloseView>
                    <ClosePress onPress={()=>{setIsShowModal(false)}}>
                        <EvilIcons name="close" size={28} color="white" />
                    </ClosePress>
                </ModalCloseView>
                <ImageViewer imageUrls={modalImg}/>

                </ModalView>
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
        <ModalBackground>
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
                <SelBtnPress
                    onPress={checkDelIssue}
                >
                    <SelBtnTxt>삭제하기</SelBtnTxt>
                </SelBtnPress>
            </SelBtnView>

        </ModalBackground>
        }

        {showLoader &&
        <ModalBackground>
            <ActivityIndicator size="small" color="#FF7900"/>
        </ModalBackground>
        }
        </BasicView>
    );
    };









