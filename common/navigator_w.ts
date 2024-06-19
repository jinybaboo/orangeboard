import { getTokens } from "./common_w";
import EncryptedStorage from 'react-native-encrypted-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import { Alert, Platform } from "react-native";
import Share from 'react-native-share';
import RNFS from 'react-native-fs';


export async function handleDataFromWeb(navigation:any, data:any){
    const {type, value, param} = JSON.parse(data);

    
   
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
    }else if(type==='forwardReport'){
        const {url, title} = value;
        const txtOptions = { //텍스트만 공유
            url,
            message:title,
        }
        await Share.open(txtOptions);
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
    }


    //Search
    else if(value==='search'){
        navigation.navigate("Search_W" as never);
    }else if(value==='searchResult'){
        navigation.navigate("SearchResult_W" as never, {param:param});
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
    }
}