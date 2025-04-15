import EncryptedStorage from 'react-native-encrypted-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import { Alert, Linking, Platform } from "react-native";
import Share from 'react-native-share';
import { fileDown } from './commonFunc';
import { getReportContent, getReportSpeechContent, validateAccessToken } from './fetchData';
import Tts from 'react-native-tts';

export async function handleDataFromWeb(navigation:any, data:any){
    const {type, value, param} = JSON.parse(data);
    // console.log(data);
   
    if(type==='navi'){
        checkNavigator(navigation, value, param);
    }else if(type==='logout'){
        await EncryptedStorage.setItem('accessToken','expired');
        await EncryptedStorage.setItem('refreshToken','expired');
    }else if(type==='copyInviteLink'){
        try {
            Clipboard.setString(value);
            Alert.alert('안내','초대링크가 복사 되었습니다.')
        } catch (error) {
            Alert.alert('안내','초대링크 복사에 실패하였습니다.');
        }
    }else if(type==='inviteByKakao'){
        // // 이미지 파일의 로컬 경로를 설정
        // const imgUrl = 'https://cdn.orangeboard.co.kr/public/images/invite/invite_15995.png';
        // const imagePath = Platform.OS === 'android' ? 'file://' + RNFS.CachesDirectoryPath + '/orangeInvite.jpg' : RNFS.CachesDirectoryPath + '/orangeInvite.jpg';

        // // 이미지 파일을 로컬 파일 시스템에 저장
        // await RNFS.downloadFile({
        //     fromUrl:imgUrl, // 이미지의 웹 URL
        //     toFile: imagePath,
        // }).promise;

        // const shareOptions = {  // 이미지와 텍스트를 공유
        //     message:value,
        //     url: 'file://' + imagePath,
        //     type: 'image/jpeg',
        // };

        const txtOptions = { //텍스트만 공유
            url:value,
        }
        await Share.open(txtOptions);
    }else if(type==='copyStudyInviteLink'){
        try {
            Clipboard.setString(value);
            Alert.alert('안내','초대링크가 복사 되었습니다.')
        } catch (error) {
            Alert.alert('안내','초대링크 복사에 실패하였습니다.');
        }
    }else if(type==='inviteStudyByKakao'){
        const txtOptions = { //텍스트만 공유
            url:value,
        }
        await Share.open(txtOptions);
    }else if(type==='forwardReport'){
        const {url, title} = value;
        const txtOptions = { //텍스트만 공유
            url,
            message:title,
        }
        await Share.open(txtOptions);
    }else if(type==='downloadFile'){
        const {baseUrl, key, fileName} = value;
        fileDown(baseUrl, key, fileName);
    }else if(type==='linkOpen'){
        const {url} = value;
        Linking.openURL(url)
    }else if(type==='reportSpeach'){
        let {seoContent} = await getReportSpeechContent(value);
        
        const start = (event:any) =>{console.log(Platform.OS, "start", event)}
        // const progress = (event:any) =>{console.log(Platform.OS, "progress", event)}
        const progress = (event: any) => {
            let currentIndex = Platform.OS === 'ios'?event.location:event.start; // 현재 읽고 있는 문장의 인덱스
            // console.log(currentIndex);
        };
         const finish = (event:any) =>{console.log(Platform.OS, "finish", event)}

        
        const cancel = (event:any) =>{console.log(Platform.OS, "cancel", event)}
        Tts.addEventListener('tts-start', start);
        Tts.addEventListener('tts-progress', progress);
        Tts.addEventListener('tts-finish', finish);
        Tts.addEventListener('tts-cancel', cancel);

        Tts.setDefaultLanguage('ko-KR');
        Tts.setDefaultVoice('com.apple.eloquence.ko-KR.Yuna');
        Tts.setIgnoreSilentSwitch("ignore"); //"ignore" - 무음 스위치가 설정되어 있어도 오디오를 재생합니다.

        const MAX_TEXT_LENGTH = 4000; // 엔진에 따라 조정

        if (seoContent.length > MAX_TEXT_LENGTH) {
            const parts = seoContent.match(new RegExp(`.{1,${MAX_TEXT_LENGTH}}`, 'g'));
            parts.forEach((part:any, index:number) => {
                Tts.speak(part); 
            });
        } else {
            Tts.speak(seoContent);
        }
        
    }else if(type==='stopReportSpeech'){
        Tts.stop();
    }
}






// checkNavigator(navigation, 'home' , {isReload:'n'})
export async function checkNavigator(navigation:any, value:string, param:any){
    await EncryptedStorage.setItem('currentPage', value);

    if(value==='login'){
        navigation.navigate("Login_N" as never);
    }else if(value==='back'){
        navigation.goBack();
    }else if(value==='home'){
        navigation.navigate("Home_W" as never, {param:param});
    }

    //리포트
    else if(value==='report'){
        navigation.navigate("Report_W" as never);
    }else if(value==='reportList'){
        navigation.navigate("ReportList_W" as never);
    }else if(value==='reportPreview'){
        navigation.navigate("ReportPreview_W" as never, {param:param});
    }else if(value==='reportBuy'){
        navigation.navigate("ReportBuy_W" as never, {param:param});
    }else if(value==='reportContent'){
        navigation.navigate("ReportContent_W" as never, {param:param});
    }else if(value==='reportReply'){
        navigation.navigate("ReportReply_W" as never, {param:param});
    }

    //고수의계좌
    else if(value==='portfolio'){
        navigation.navigate("Portfolio_W" as never);
    }else if(value==='portfolioList'){
        navigation.navigate("PortfolioList_W" as never);
    }else if(value==='portfolioIssueTalkList'){
        navigation.navigate("PortrolioIssueTalkList_W" as never);
    }else if(value==='portfolioIssueTalk'){
        navigation.navigate("PortrolioIssueTalk_N" as never, {param:param});
    }else if(value==='portfolioOwner'){
        navigation.navigate("PortfolioOwner_W" as never, {param:param});
    }else if(value==='portfolioContent'){
        navigation.navigate("PortfolioContent_W" as never, {param:param});
    }else if(value==='portfolioReply'){
        navigation.navigate("ReportReply_W" as never, {param:param});
    }else if(value==='portfolioReviewList'){
        navigation.navigate("PortfolioReviewList_W" as never, {param:param});
    }else if(value==='portfolioReviewContent'){
        navigation.navigate("PortfolioReviewContent_W" as never, {param:param});
    }else if(value==='portfolioPhotoReviewList'){
        navigation.navigate("PortfolioPhotoReviewList_W" as never, {param:param});
    }else if(value==='portfolioWriteReview'){
        navigation.navigate("PortfolioWriteReview_W" as never, {param:param});
    }

    //기업분석요청
    else if(value==='analysis'){
        navigation.navigate("Analysis_W" as never);
    }else if(value==='analysisCreators'){
        navigation.navigate("AnalysisCreators_W" as never);
    }else if(value==='analysisCreatorInfo'){
        navigation.navigate("AnalysisCreatorInfo_W" as never, {param:param});
    }else if(value==='analysisRequest'){
        navigation.navigate("AnalysisRequest_W" as never, {param:param});
    }else if(value==='analysisResult'){
        navigation.navigate("AnalysisResult_W" as never, {param:param});
    }else if(value==='analysisMyRequest'){
        navigation.navigate("AnalysisMyRequest_W" as never, {param:param});
    }else if(value==='analysisMyRequestDetail'){
        navigation.navigate("AnalysisMyRequestDetail_W" as never, {param:param});
    }else if(value==='analysisWriteReview'){
        navigation.navigate("AnalysisWriteReview_W" as never, {param:param});
    }else if(value==='analysisOnRequestList'){
        navigation.navigate("AnalysisOnRequestList_W" as never, {param:param});
    }else if(value==='analysisPublishedList'){
        navigation.navigate("AnalysisPublishedList_W" as never, {param:param});
    }else if(value==='analysisReviewList'){
        navigation.navigate("AnalysisReviewList_W" as never, {param:param});
    }

    //크리에이터
    else if(value==='creator'){
        navigation.navigate("Creator_W" as never, {param:param});
    }else if(value==='creatorProfile'){
        navigation.navigate("CreatorProfile_W" as never, {param:param});
    }


    //마이페이지
    else if(value==='mypage'){
        navigation.navigate("Mypage_W" as never);
    }else if(value==='mypageSetting'){
        navigation.navigate("MypageSetting_W" as never, {param:param});
    }else if(value==='mypageOrangeManage'){
        navigation.navigate("MypageOrangeManage_W" as never, {param:param});
    }else if(value==='mypageFavoriteList'){
        navigation.navigate("MypageFavoriteList_W" as never, {param:param});
    }else if(value==='mypageSubscriptionManage'){
        navigation.navigate("MypageSubscriptionManage_W" as never, {param:param});
    }else if(value==='mypageMyReport'){
        navigation.navigate("MypageMyReport_W" as never, {param:param});
    }else if(value==='mypageMyVirtualAccount'){
        navigation.navigate("MypageMyVirtualAccount_W" as never, {param:param});
    }else if(value==='mypageMyVaContent'){
        navigation.navigate("MypageMyVaContent_W" as never, {param:param});
    }else if(value==='mypageAlarm'){
        navigation.navigate("MypageAlarm_W" as never, {param:param});
    }else if(value==='mypageAlertSetting'){
        navigation.navigate("MypageAlertSetting_W" as never, {param:param});
    }else if(value==='mypageNotice'){
        navigation.navigate("MypageNotice_W" as never, {param:param});
    }else if(value==='mypageNoticeContent'){
        navigation.navigate("MypageNoticeContent_W" as never, {param:param});
    }else if(value==='mypageCoupon'){
        navigation.navigate("MypageCoupon_W" as never, {param:param});
    }else if(value==='phoneCertification'){
        navigation.navigate("MypagePhoneCertification_W" as never, {param:param});
    }


    //결제
    else if(value==='payment'){
        navigation.navigate("Payment_N" as never, {param:param});
    }else if(value==='paymentOrangebuy'){
        navigation.navigate("PaymentOrangeBuy_W" as never, {param:param});
    }else if(value==='paymentSubscription_report'){
        navigation.navigate("PaymentSubReport_N" as never, {param:param});
    }else if(value==='paymentSubscription_port'){
        navigation.navigate("PaymentSubPort_N" as never, {param:param});
    }

    

    //증시동향
    else if(value==='market'){
        navigation.navigate("Market_W" as never, {param:param});
    }

    //Farm
    else if(value==='farm'){
        navigation.navigate("Farm_W" as never, {param:param});
    }else if(value==='farmOwner'){
        navigation.navigate("FarmOwner_W" as never, {param:param});
    }else if(value==='farmVisitReply'){
        navigation.navigate("ReportReply_W" as never, {param:param});
    }


    //Search
    else if(value==='search'){
        navigation.navigate("Search_W" as never);
    }else if(value==='searchResult'){
        navigation.navigate("SearchResult_W" as never, {param:param});
    }

    //Study
    else if(value==='study'){
        navigation.navigate("Study_W" as never);
    }else if(value==='studyMain'){
        navigation.navigate("StudyMain_W" as never, {param:param});
    }else if(value==='studyJoin'){
        navigation.navigate("StudyJoin_W" as never, {param:param});
    }else if(value==='studyInfo'){
        navigation.navigate("StudyInfo_W" as never, {param:param});
    }else if(value==='studyAccount'){
        navigation.navigate("StudyAccount_W" as never, {param:param});
    }else if(value==='studyContent'){
        navigation.navigate("StudyContent_W" as never, {param:param});
    }else if(value==='studyMyList'){
        navigation.navigate("StudyMyList_W" as never, {param:param});
    }else if(value==='studyContentReply'){
        navigation.navigate("StudyContentReply_W" as never, {param:param});
    }else if(value==='studyContentWrite'){
        navigation.navigate("StudyContentWrite_W" as never, {param:param});
    }

    //MyAccount
    else if(value==='myAccount'){
        navigation.navigate("MyAccount_W" as never, {param:param});
    }else if(value==='myAccountGroupMain'){
        navigation.navigate("MyAccountGroupMain_W" as never, {param:param});
    }else if(value==='myAccountVirtualAccountMain'){
        navigation.navigate("MyAccountVirtualAccountMain_W" as never, {param:param});
    }else if(value==='myAccountGroupAdd'){
        navigation.navigate("MyAccountGroupAdd_W" as never, {param:param});
    }else if(value==='myAccountGroupAddIntro'){
        navigation.navigate("MyAccountGroupAddIntro_W" as never, {param:param});
    }else if(value==='myAccountGroupEdit'){
        navigation.navigate("MyAccountGroupEdit_W" as never, {param:param});
    }else if(value==='myAccountVirtualAccountAdd'){
        navigation.navigate("MyAccountVirtualAccountAdd_W" as never, {param:param});
    }else if(value==='myAccountIrContent'){
        navigation.navigate("MyAccountIrContent_W" as never, {param:param});
    }


    //기타
    else if(value==='authPolicy'){
        navigation.navigate("Policy_W" as never, {param:param});
    }else if(value==='join'){
        navigation.navigate("Join_W" as never, {param:param});
    }

    else if(value==='etcInvite'){
        navigation.navigate("EtcInvite_W" as never, {param:param});
    }else if(value==='etcIntro'){
        navigation.navigate("Intro_W" as never, {param:param});
    }else if(value==='etcIntroUserGuide'){
        navigation.navigate("IntroUserGuide_W" as never, {param:param});
    }else if(value==='etcIntroCreatorGuide'){
        navigation.navigate("IntroCreatorGuide_W" as never, {param:param});
    }else if(value==='etcIntroReport'){
        navigation.navigate("IntroReport_W" as never, {param:param});
    }else if(value==='etcIntroGosu'){
        navigation.navigate("IntroGosu_W" as never, {param:param});
    }else if(value==='etcIntroAnalysis'){
        navigation.navigate("IntroAnalysis_W" as never, {param:param});
    }else if(value==='etcHamburger'){
        navigation.navigate("Hamburger_W" as never, {param:param});
    }else if(value==='etcDonationIndex'){
        navigation.navigate("DonationIndex_W" as never, {param:param});
    }else if(value==='etcDonation'){
        navigation.navigate("Donation_W" as never, {param:param});
    }else if(value==='etcIntroFarmerGuide'){
        navigation.navigate("EtcIntroFarmerGuide_W" as never, {param:param});
    }else if(value==='etcIntroFarmerGuideContent'){
        navigation.navigate("EtcIntroFarmerGuideContent_W" as never, {param:param});
    }else if(value==='etcIntroFarmerApply'){
        navigation.navigate("EtcIntroFarmerApply_W" as never, {param:param});
    }else if(value==='etcIntroFarmerApply2'){
        navigation.navigate("EtcIntroFarmerApply2_W" as never, {param:param});
    }
}







export async function goToPageByPush(remoteMessage:any, navigation:any){
    const goLogin = () =>{
        checkNavigator(navigation, 'login', {})
    }

    const accessToken:any = await validateAccessToken();
    if(accessToken==='expired'|| accessToken==null || accessToken==undefined){
        goLogin();
    }
    
    let {type, ReportId, BoardId, pageName, seoTitle, PortfolioId, studyPath, StudyPostId} = remoteMessage?.data;

    if (type=='portfolio-issue'){
        checkNavigator(navigation, 'home' , {isReload:'n'})
        setTimeout(()=>{
            navigation.navigate("PortrolioIssueTalk_N" as never, {param:{pageName}});
        },500)
    }else if(type=='reportComment'){
        checkNavigator(navigation, 'home' , {isReload:'n'});
        let result:any =  await getReportContent(ReportId);
        const title = result?.report?.title;

        setTimeout(()=>{
            navigation.navigate("ReportReply_W" as never, {param:{ReportId, title, from:'report'}});
        },500)
    }else if(type=='Reports'){
        checkNavigator(navigation, 'home' , {isReload:'n'})

        setTimeout(()=>{
            checkNavigator(navigation, 'reportContent', {pageName, seoTitle, postType:'report'});
        },500)
    }else if (type=='portfolio'){
        checkNavigator(navigation, 'home' , {isReload:'n'})
        setTimeout(()=>{
            navigation.navigate("PortfolioContent_W" as never, {param:{pageName, PortfolioId}});
        },500)
    }else if(type=='portfolio-comment'){
        checkNavigator(navigation, 'home' , {isReload:'n'})
        setTimeout(()=>{
            navigation.navigate("ReportReply_W" as never, {param:{ReportId:PortfolioId, title:pageName, from:'portfolio'}});
        },500)
    }else if(type=='portfolio-realtime'){
        checkNavigator(navigation, 'home' , {isReload:'n'});
        setTimeout(()=>{
            navigation.navigate("PortfolioOwner_W" as never, {param:{pageName}});
        },500)
    }else if(type=='orange-donation'){
        checkNavigator(navigation, 'home' , {isReload:'n'});
        setTimeout(()=>{
            checkNavigator(navigation, 'farmOwner' , {pageName})
        },500)
    }else if(type=='study-join'){
        checkNavigator(navigation, 'home' , {isReload:'n'});
        Alert.alert('안내', '오렌지보드 홈페이지에서 가입내역 확인 및 승인이 가능합니다.');
    }else if(type=='study-join-approval'){
        checkNavigator(navigation, 'home' , {isReload:'n'});
        setTimeout(()=>{
            checkNavigator(navigation, 'studyMain' , {studyPath});
        },500)
    }else if(type=='study-post-comment'){
        checkNavigator(navigation, 'home' , {isReload:'n'});
        setTimeout(()=>{
            checkNavigator(navigation, 'studyContentReply' , {studyPath, StudyPostId, from:'studyContent'});
        },500)
    }else if(type=='Notices' || type=='Events' || type=='farmer-notice'){
        checkNavigator(navigation, 'home' , {isReload:'n'});
        let paramType = 'notice';
        if(type=='Events'){ paramType = 'event';}
        if(type=='farmer-notice'){ paramType = 'farmerNotice';}

        setTimeout(()=>{
            checkNavigator(navigation, 'mypageNoticeContent' , {type:paramType, id:BoardId});
        },500)
    }else if(type=='corp-disclosure' || type=='corp-news' || type=='corp-ir'){
        checkNavigator(navigation, 'home' , {isReload:'n'});
       
        setTimeout(()=>{
            checkNavigator(navigation, 'myAccount' , {type});
        },500)
    }else{
        checkNavigator(navigation, 'home' , {isReload:'n'})
    }
}
