import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import { DATA_FETCH_URL } from './variables_w';
import { Alert } from 'react-native';


export const getCorpLoginToken = async (data:any) =>{
    try {
        const response:any = await axios.post(`${DATA_FETCH_URL}/v2/auth/login`, data, { withCredentials: true });
        const refreshToken:string = response.headers["set-cookie"][0].split(';')[0].replace('8r2b0o1=','');
        const accessToken:string = response.headers.authorization;
        return {accessToken, refreshToken};
    } catch (error:any) {
        console.error('getCorpLoginToken ',error);
        return {accessToken:false, refreshToken:false};
    }
}


export async function getAppAdminInfo(){
    try {
        const {data} = await axios.get(`https://manage.orangeboard.co.kr/v1/managements/app-info`);
        return data[0];
    } catch (error:any) {
        console.error('getAppAdminInfo ',error.response.data);
    }
}

export async function getWebTokenWithKakao(kakaoAccessToken:string){
    try {
        const response:any = await axios.get(`${DATA_FETCH_URL}/app/v2/auth/kakao`,{headers:{accessToken: kakaoAccessToken,}});
        const refreshToken:string = response.headers["set-cookie"][0].split(';')[0].replace('8r2b0o1=','');
        const accessToken:string = response.headers.authorization;
        const status = response.status;
        return {accessToken, refreshToken, status};
    } catch (error:any) {
        console.error('getWebTokenWithKakaoToken ',error.response.data);
        const status = error.response.data.code;
        const OAuthType = error.response.data.message.OAuthType;
        if(status=='303'){
            return {accessToken:status, refreshToken:OAuthType};
        }else{
            return {accessToken:'fail', refreshToken:'fail'};
        }
    }
}

export async function getWebTokenWithNaverToken(token:string){
    try {
        const response:any = await axios.get(`${DATA_FETCH_URL}/app/v2/auth/naver`,{headers:{accessToken: token,}});
        const refreshToken:string = response.headers["set-cookie"][0].split(';')[0].replace('8r2b0o1=','');
        const accessToken:string = response.headers.authorization;
        const status = response.status;
        return {accessToken, refreshToken, status};
    } catch (error:any) {
        console.error('getWebTokenWithNaverToken ',error?.response?.data);
        const status = error?.response?.data?.code;
        if(status=='303'){
            const OAuthType = error.response.data.message.OAuthType;
            return {accessToken:status, refreshToken:OAuthType};
        }else{
            return {accessToken:'fail', refreshToken:'fail'};
        }
    }
}

export async function getWebTokenWithGoogleToken(token:any){ //9.0.0
    try {
        const response:any = await axios.get(`${DATA_FETCH_URL}/app/v2/auth/google`,{headers:{accessToken: token,}});
        const refreshToken:string = response.headers["set-cookie"][0].split(';')[0].replace('8r2b0o1=','');
        const accessToken:string = response.headers.authorization;
        
        const status = response.status;
        return {accessToken, refreshToken, status};
    } catch (error:any) {
        console.error('getWebTokenWithGoogleToken ',error.response.data);
        const status = error.response.data.code;
        if(status=='303'){
            const OAuthType = error.response.data.message.OAuthType;
            return {accessToken:status, refreshToken:OAuthType};
        }else{
            return {accessToken:'fail', refreshToken:'fail'};
        }
    }
}

export async function getWebTokenWithAppleToken(token:any){
    try {

        const response:any = await axios.get(`${DATA_FETCH_URL}/app/v2/auth/apple`,{headers:{accessToken: token,}});
        const refreshToken:string = response.headers["set-cookie"][0].split(';')[0].replace('8r2b0o1=','');
        const accessToken:string = response.headers.authorization;
        const status = response.status;
        return {accessToken, refreshToken, status};

    } catch (error:any) {
        console.error('getWebTokenWithAppleToken ',error.response.data);
        const status = error.response.data.code;
        if(status=='303'){
            const OAuthType = error.response.data.message.OAuthType;
            return {accessToken:status, refreshToken:OAuthType};
        }else{
            return {accessToken:'fail', refreshToken:'fail'};
        }
    }
}

export async function insertAgreementAndPrivacy(check3:boolean, check4:boolean, check5:boolean, deviceInfo:any, deviceToken:any){
    const isAdvertiseApproval:number = check3?1:0;
    const isAppPush:number = check4?1:0;
    const isAppPushNight:number = check5?1:0;
    const data ={ isAdvertiseApproval,isAppPush,isAppPushNight,deviceInfo,deviceToken}
    
    try {
        const response:any = await axios.post(`${DATA_FETCH_URL}/v2/auth/join`, data, {withCredentials: true,});
        const refreshToken:string = response.headers["set-cookie"][0].split(';')[0].replace('8r2b0o1=','');
        const accessToken:string = response.headers.authorization;
        const status = response.status;
        
        return {accessToken, refreshToken, status};
    } catch (error:any) {
        console.error('insertAgreementAndPrivacy ',error.response.data);
        const status = error.response.data.code;
        if(status=='303'){
            const OAuthType = error.response.data.message.OAuthType;
            return {accessToken:status, refreshToken:OAuthType};
        }else{
            return {accessToken:'fail', refreshToken:'fail'};
        }
    }
}



export async function insertOrUpdateFcmToken(deviceToken:string, deviceInfo:string, accessToken:string){
    const data ={ deviceToken, deviceInfo}
    try {
        const response = await axios.post(`${DATA_FETCH_URL}/app/v2/auth/device`, data, {headers:{Authorization: accessToken, }});
    } catch (error:any) {
        console.error('insertOrUpdateFcmToken ',error.response.data);
    }
}

export async function getReportContent(id:string){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');

    try {
        const response = await axios.get(`${DATA_FETCH_URL}/v2/@9999/reports/${id}`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        if (error.response && error.response.status === 403) {
            return 'noReadAuthority'
        } else {
            console.error('getReportContent ',error.response.data);
        }
    }
}


export async function togglePortChatLike(pageName:string, IssueId:string, currentLike:boolean){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    try {
        if(currentLike){
            await axios.delete(`${DATA_FETCH_URL}/v2/portfolio/@${pageName}/issue/${IssueId}/likes`, {headers:{Authorization: accessToken, }});
        }else{
            await axios.get(`${DATA_FETCH_URL}/v2/portfolio/@${pageName}/issue/${IssueId}/likes`, {headers:{Authorization: accessToken, }});
        }
    } catch (error:any) {
        console.error('togglePortChatLike ',error.response.data);
    }
}

export async function toggleIssueTalkEmoji(IssueId:any, pageName:string, EmojiId:number, isActive:boolean){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    try {
        if(isActive){
            const res = await axios.delete(`${DATA_FETCH_URL}/v2/portfolio/@${pageName}/issue/${IssueId}/reaction/${EmojiId}`, {headers:{Authorization: accessToken, }});
            return res.data;
        }else{
            const res = await axios.get(`${DATA_FETCH_URL}/v2/portfolio/@${pageName}/issue/${IssueId}/reaction/${EmojiId}`, {headers:{Authorization: accessToken, }});
            return res.data;
        }
    } catch (error:any) {
        console.error('toggleIssueTalkEmoji',error.response.data);
    }
}

export const getPayment_Faq = async() =>{
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    try {
        const res = await axios.get(`${DATA_FETCH_URL}/v2/products/faqs`, {headers:{'Authorization' : accessToken,}});
        return res.data?.list;
    } catch (error:any) {
        return null
    }
}


// 결제 관련
export const getPayment_ProductReportAndPort = async() =>{
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    
    try {
        const res = await axios.get(`${DATA_FETCH_URL}/v2/products/list`, {headers:{'Authorization' : accessToken,}});
        return res.data;
    } catch (error) {
        console.error('getPayment_ProductReportAndPort 오류', error);
        return false;
    }
}
export const getPayment_SubscriptionProduct = async(ProductOptionId:any) =>{
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    try {
        const res = await axios.get(`${DATA_FETCH_URL}/v2/users/subscription/checkout?ProductOptionId=${ProductOptionId}`, {headers:{'Authorization' : accessToken,}});
        return res.data;
    } catch (error:any) {
        return error.response.data.message;
    }
}

export async function insertReportPaymentAndroid(purchaseToken:any, donationCode:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    const data = {purchaseToken, donationCode}
    try {
        const response = await axios.post(`${DATA_FETCH_URL}/v2/users/subscription/order/android`, data, {headers:{Authorization: accessToken, } });
        return response.data;
    } catch (error:any) {
        console.error('insertReportPaymentAndroid ',error.response.data);
        return error.response.data
    }
}

export async function insertReportPaymentIos(receipt_data:any, donationCode:any){
    const data = {receipt_data, donationCode}
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    
    try {
        const response = await axios.post(`${DATA_FETCH_URL}/v2/users/subscription/order/ios`, data, {headers:{Authorization: accessToken, }});
        return response.data;
    } catch (error:any) {
        console.error('insertReportPaymentIos ',error.response.data);
        return error.response.data
    }
}



//네이티브 페이지 데이터 요청
export async function getPortChat(pageName:string, bwdId:string, fwdId:string, perPage:string, IssueId:any, moveTyp:string){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    
    const bwdQry = bwdId!=''?`&bwdId=${bwdId}`:'';
    const fwdQry = fwdId!=''?`&fwdId=${fwdId}`:'';
    const IssueIdQry = IssueId!=''?`&IssueId=${IssueId}`:'';
    const moveTypQry = moveTyp!=''?`&moveTyp=${moveTyp}`:'';


    try {
        let response = await axios.get(`${DATA_FETCH_URL}/v2/portfolio/@${pageName}/issue?perPage=${perPage}&${bwdQry}${fwdQry}${IssueIdQry}${moveTypQry}`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getPortChat ',error?.response?.data);
        return false;
    }
}

export async function getMyProfile(){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    if(accessToken === 'expired'){
        return false;
    }
    
    try {
        const res = await axios.get(`${DATA_FETCH_URL}/v1/profile`, {headers:{'Authorization' : accessToken}});
        return res?.data;
    } catch (error:any) {
        console.error('getMyProfile ',error?.response?.data);
        return false;
    }
}

export async function getGosuTalkSearch(pageName:string, skeywd:string){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    try {
        const res = await axios.get(`${DATA_FETCH_URL}/v2/portfolio/@${pageName}/issue/search?skeywd=${skeywd}`, {headers:{'Authorization' : accessToken}});
        return res?.data?.issueSearchList;
    } catch (error:any) {
        console.error('getGosuTalkSearch ',error?.response?.data);
        return 'fail';
    }
}


export async function getReportShortUrlInfo(shortUrl:string){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    try {
        let response = await axios.get(`${DATA_FETCH_URL}/v2/url/${shortUrl}`, {headers:{Authorization: accessToken, }});
        return response?.data?.url?.originUrl;
    } catch (error:any) {
        console.error('getReportShortUrlInfo ',error?.response?.data);
        return false;
    }
}

export async function getPortEmojiList(){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    try {
        let response = await axios.get(`${DATA_FETCH_URL}/v2/contents/emoji`, {headers:{Authorization: accessToken, }});
        return response?.data?.emojiList;
    } catch (error:any) {
        console.error('getPortEmojiList ',error?.response?.data);
        return false;
    }
}


export async function getReportSpeechContent(ReportId:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    try {
        let response = await axios.get(`${DATA_FETCH_URL}/v2/contents/post/${ReportId}/text`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('gerReportSpeechContent ',error?.response?.data);
        return false;
    }
}



export async function insertIssueTalk(formData:any, ci:string){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    
    try { 
        const response = await axios.post(`${DATA_FETCH_URL}/v2/portfolio/@${ci}/issue`, formData, {
            headers:{
                Authorization: accessToken, 
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            } 
        });
    } catch (error:any) {
        console.error('insertReportReply ',error);
    }
}

export async function deleteIssueTalk(isid:any, ci:string){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    
    try {
        const response = await axios.delete(`${DATA_FETCH_URL}/v2/portfolio/@${ci}/issue/${isid}`, {headers:{Authorization: accessToken, }});
        return response.data;
    } catch (error:any) {
        console.error('insertReportPaymentIos ',error.response.data);
        return error.response.data
    }
}

export async function updateEditIssueTalk(ci:string, isid:any, content:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    const data ={content}
    try {
        const response = await axios.patch(`${DATA_FETCH_URL}/v2/portfolio/@${ci}/issue/${isid}`, data, {headers:{Authorization: accessToken, }});
        return response.status;
    } catch (error:any) {
        console.error('updateEditIssueTalk ',error.response.data);
    }
}

export async function insertShareIssueTalk(pageName:string, IssueId:any, ){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    console.log(accessToken);
    
    try {
        const response = await axios.post(`${DATA_FETCH_URL}/v2/portfolio/@${pageName}/issue/${IssueId}/share`, {}, {headers:{Authorization: accessToken, } });
        return response.data;
    } catch (error:any) {
        console.error('insertShareIssueTalk ',error.response.data);
        return error.response.data
    }
}



//// 토큰 Validation
export async function validateAccessToken(){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');

    //액세스토큰의 유효성을 검증하고여 액세스토큰을 리턴하고, 엑세스 및 리프레시 토큰이 기간이 만료되면 expired를 리턴함!
    try { //액세스토큰으로 유저 정보를 가져온다. 이때 성공하면, 엑세스 토큰이 유효하므로 액세스 토큰 그대로 리턴한다.
        const res = await axios.get(`${DATA_FETCH_URL}/v1/profile`, {headers:{'Authorization' : accessToken}});
        console.log('엑세스토큰 유효함');
        
        return accessToken;
    } catch (error:any) { //유저정보를 가져오는데 실패하면 엑세스 토큰이 유효하지 않으므로 리프레시 토큰으로 신규 엑세스 토큰을 발급하여 리턴한다.
        //console.log('액세스 토큰 유효하지 않음')
        const newAccessToken = await getAccessTokenWithRefreshToken(); //여기서 리프레시 토큰이 무효하면 expired 토큰이 리턴된다.
        await EncryptedStorage.setItem('accessToken',newAccessToken); //신규 액세스 토큰 앱에 저장
        console.log('엑세스토큰 무효, 재저장 함');
        return newAccessToken;
    }
}



export async function getAccessTokenWithRefreshToken(){
    // console.log('refreshToken으로 신규 액세스 토큰 발급');
    try {
        const response:any = await axios.get(`${DATA_FETCH_URL}v2/auth/refresh`, {withCredentials: true,});
        const newAccessToken:string = response.headers.authorization;
        return newAccessToken;
    } catch (error:any) {
        console.log('리프레시토큰 기한만료 등으로 액세스토큰 발급 안됨, 로그아웃 처리');
        //로그인 관련 정보 삭제(리덕스 및 Encrypted 토큰들)
        deleteEncryptedStorageLoginInfo();
        return 'expired';
    }
}

async function deleteEncryptedStorageLoginInfo(){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    if(accessToken!=undefined && accessToken!=null && accessToken!='expired'){
        await EncryptedStorage.removeItem('accessToken');
        await EncryptedStorage.removeItem('refreshToken');
    }
}


export async function getIosTransctionReceipt(receipt:string){
    const type = 'test';
    const url = type==='test'?'https://sandbox.itunes.apple.com/verifyReceipt' : 'https://buy.itunes.apple.com/verifyReceipt'
    try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            'receipt-data': receipt,
            'password': 'cd3932ac74834a8d8c8f1113a024423a', // 꼭! App Store Connect에서 발급받은 shared secret
            'exclude-old-transactions': true
          }),
        });
    
        const json = await response.json();
        console.log('🍏 Apple 응답:', json);
    
        // 21007 = 샌드박스 영수증을 프로덕션에 보냈을 때 발생하는 에러 (이 케이스는 지금 안 나올 거지만 참고)
        if (json.status === 21007) {
          console.warn('🔁 Sandbox receipt를 production에 보냄 → sandbox로 다시 시도해야 함');
        }
    
        return json;
      } catch (err) {
        console.error('❌ Apple 검증 실패:', err);
        return { error: '검증 실패', reason: err };
      }
}