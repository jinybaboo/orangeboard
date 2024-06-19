import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import { DATA_FETCH_URL } from './variables_w';

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

export async function getWebTokenWithGoogleToken(token:any){
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
            const response = await axios.delete(`${DATA_FETCH_URL}/v2/portfolio/@${pageName}/issue/${IssueId}/likes`, {headers:{Authorization: accessToken, }});
        }else{
            const response = await axios.get(`${DATA_FETCH_URL}/v2/portfolio/@${pageName}/issue/${IssueId}/likes`, {headers:{Authorization: accessToken, }});
        }
    } catch (error:any) {
        console.error('togglePortChatLike ',error.response.data);
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
export async function getPortChat(pageName:string, bwdId:string, fwdId:string, perPage:string){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    
    const bwdQry = bwdId!=''?`&bwdId=${bwdId}`:'';
    const fwdQry = fwdId!=''?`&fwdId=${fwdId}`:'';
    try {
        let response = await axios.get(`${DATA_FETCH_URL}/v2/portfolio/@${pageName}/issue?perPage=${perPage}&${bwdQry}${fwdQry}`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getPortChat ',error?.response?.data);
        return false;
    }
}

export async function getMyProfile(){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    try {
        const res = await axios.get(`${DATA_FETCH_URL}/v1/profile`, {headers:{'Authorization' : accessToken}});
        return res?.data;
    } catch (error:any) {
        console.error('getMyProfile ',error?.response?.data);
        return false;
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



//// 토큰 Validation
export async function validateAccessToken(){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');

    //액세스토큰의 유효성을 검증하고여 액세스토큰을 리턴하고, 엑세스 및 리프레시 토큰이 기간이 만료되면 expired를 리턴함!
    try { //액세스토큰으로 유저 정보를 가져온다. 이때 성공하면, 엑세스 토큰이 유효하므로 액세스 토큰 그대로 리턴한다.
        const res = await axios.get(`${DATA_FETCH_URL}/v1/profile`, {headers:{'Authorization' : accessToken}});
        return accessToken;
    } catch (error:any) { //유저정보를 가져오는데 실패하면 엑세스 토큰이 유효하지 않으므로 리프레시 토큰으로 신규 엑세스 토큰을 발급하여 리턴한다.
        //console.log('액세스 토큰 유효하지 않음')
        const newAccessToken = await getAccessTokenWithRefreshToken(); //여기서 리프레시 토큰이 무효하면 expired 토큰이 리턴된다.
        await EncryptedStorage.setItem('accessToken',newAccessToken); //신규 액세스 토큰 앱에 저장
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
        //console.log('리프레시토큰 기한만료 등으로 액세스토큰 발급 권한 없음' );
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
