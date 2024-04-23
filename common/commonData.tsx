import userSlice from "../slices/user";
import EncryptedStorage from 'react-native-encrypted-storage';
import { Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

import axios from 'axios';
import { setCurrentPage } from "./commonFunc";

let API_URL_DEV = 'https://api.orangedev.shop/'; //개발 (웹앱 통합 배포전 모든 데이터 테스트)
let API_URL = 'https://api.orangeboard.co.kr/'; //웹_앱통합 
let API_URL_APP = 'https://app.orangeboard.kr/'; //앱전용(구버전)

let URL =  API_URL;

export async function getAppAdminInfo(){
    try {
        const {data} = await axios.get(`https://manage.orangeboard.co.kr/v1/managements/app-info`);
        return data[0];
    } catch (error:any) {
        console.error('getAppAdminInfo ',error.response.data);
    }
}


export async function getHomePopular(order:string){
    try {
        const response = await axios.get(`${API_URL_APP}v1/corps?order=${order}&page=1&perPage=6`);
        return response;
    } catch (error:any) {
        console.error('getHomePopular ',error.response.data);
    }
}

export async function getAllPopular(order:string){
    try {
        const response = await axios.get(`${API_URL_APP}v1/corps?order=${order}&page=1&perPage=20`);
        return response;
    } catch (error:any) {
        console.error('getAllPopular ',error.response.data);
    }
}


export async function getHomeTopTen(){
    try {
        const response = await axios.get(`${API_URL_APP}v1/corps?order=popular&page=1&perPage=12`);
        return response;
    } catch (error:any) {
        console.error('getHomeTopTen ',error.response.data);
    }
}

export async function validateAccessToken(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    let refreshToken:any = await EncryptedStorage.getItem('refreshToken');

    //액세스토큰의 유효성을 검증하고여 액세스토큰을 리턴하고, 엑세스 및 리프레시 토큰이 기간이 만료되면 expired를 리턴함!
    try { //액세스토큰으로 유저 정보를 가져온다. 이때 성공하면, 엑세스 토큰이 유효하므로 액세스 토큰 그대로 리턴한다.
        const response:any = await axios.get(`${API_URL_APP}v1/users/me`, {headers:{Authorization: accessToken, }});
        return accessToken;
    } catch (error:any) { //유저정보를 가져오는데 실패하면 엑세스 토큰이 유효하지 않으므로 리프레시 토큰으로 신규 엑세스 토큰을 발급하여 리턴한다.
        //console.log('액세스 토큰 유효하지 않음')
        //console.error('validateAccessToken ',error.response.data);
        const newAccessToken = await getAccessTokenWithRefreshToken(refreshToken, dispatch, navigation); //여기서 리프레시 토큰이 무효하면 expired 토큰이 리턴된다.
        await EncryptedStorage.setItem('accessToken',newAccessToken); //신규 액세스 토큰 앱에 저장
        return newAccessToken;
    }
}



/// 데이터를 꺼내서 return 할것 (위에까지는 데이터안꺼내고 리턴함)
export async function getFinanceInfoDetail(stockCode:string){
    try {
        const response = await axios.get(`${API_URL_APP}v1/corps/${stockCode}/ifrs?term=4`);
        return response?.data;  //배열일 경우 ?.lists 추가 
    } catch (error:any) {
        console.error('getFinanceInfoDetail ',error.response.data);
    }
}


async function deleteEncryptedStorageLoginInfo(){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    if(accessToken!=undefined && accessToken!=null && accessToken!='expired'){
        await EncryptedStorage.removeItem('accessToken');
        await EncryptedStorage.removeItem('refreshToken');
    }
}

export async function setLoginStatus(dispatch:any, navigation:any){
    const userInfo = await getUserInfo(dispatch, navigation);
}



///////// 리프레시 토큰으로 데이터 요청
export async function getUserInfo(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    let refreshToken:any = await EncryptedStorage.getItem('refreshToken');

    //모든 토큰 데이터 요청은 아래 토큰 validate 과정을 거쳐야 함!
    accessToken = await validateAccessToken(dispatch, navigation);
    if(accessToken=='expired'){return accessToken;}

    try {
        const response:any = await axios.get(`${API_URL_APP}v1/users/me`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getUserInfo ',error.response.data);
    }
}


export async function getFinanceInfoSimple(stockCode:string,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${API_URL_APP}v1/corps/${stockCode}`, {headers:{Authorization: accessToken, }});
        return response;
    } catch (error:any) {
        console.error('getFinanceInfoSimple ',error.response.data);
    }
}


export async function getNicknameDoubleChk(nickname:string,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${API_URL_APP}v1/users/display-name/exist?displayName=${nickname}`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getNicknameDoubleChk ',error.response.data);
    }
}

export async function getNotice(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${API_URL_APP}v1/notices?page=1&perPage=1000`, {headers:{Authorization: accessToken, }});
        return response?.data?.lists;
    } catch (error:any) {
        console.error('getNotice ',error.response.data);
    }
}


export async function getEvent(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${API_URL_APP}v1/events?page=1&perPage=1000`, {headers:{Authorization: accessToken, }});
        return response?.data?.lists;
    } catch (error:any) {
        console.error('getEvent ',error.response.data);
    }
}

export async function getNoticeContent(id:number, type:string, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${API_URL_APP}v1/${type}/${id}`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getNoticeContent ',error.response.data);
    }
}

export async function getStockPriceHistory(stockCode:string, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${API_URL_APP}v1/corps/${stockCode}/price-histories?term=10`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getStockPriceHistory ',error.response.data);
    }
}

export async function getSectorC10Count(stockCode:string, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${API_URL_APP}v1/corps/${stockCode}/related-stocks`, {headers:{Authorization: accessToken, }});
        return response?.data?.lists;
    } catch (error:any) {
        console.error('getSectorC10Count ',error.response.data);
    }
}

export async function getFaq(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${API_URL_APP}v1/faq?page=1&perPage=1000`, {headers:{Authorization: accessToken, }});
        return response?.data?.lists;
    } catch (error:any) {
        console.error('getFaq ',error.response.data);
    }
}

export async function getCorpSearchHistory(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${API_URL_APP}v1/corps/search-histories?page=1&perPage=10`, {headers:{Authorization: accessToken, }});
        return response?.data?.lists;
    } catch (error:any) {
        console.error('getCorpSearchHistory ',error.response.data);
    }
}

export async function getCorpBySearch(word:string,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${API_URL_APP}v1/corps?searchKeyword=${word}&order=popular&page=1&perPage=100`, {headers:{Authorization: accessToken, }});
        return response?.data?.lists;
    } catch (error:any) {
        console.error('getCorpBySearch ',error.response.data);
    }
}


export async function getValuationPrice(stockCode:string, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    if(accessToken=='expired'){accessToken=''}
    //console.log(accessToken);
    //accessToken = await validateAccessToken(dispatch, navigation);
    const data:any ={stockCode}
    try {
        const response = await axios.post(`https://value.orangedev.shop/v1/value`,data, {headers:{Authorization: accessToken}});
        // console.log(stockCode, response)
        return response?.data; 
    } catch (error:any) {
        console.error('getValuationPrice ',error.response.data);
    }
}





export async function updateUserProfile(displayName:string, content:string,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    const data = {displayName, content}
    try {
        const response = await axios.patch(`${API_URL_APP}v1/users`, data, {headers:{Authorization: accessToken, } });
    } catch (error:any) {
        console.error('updateUserProfile ',error.response.data);
    }
}

export async function updateUserImage(formData:any,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.post(`${API_URL_APP}v1/users/avatar`, formData, {
            headers:{
                Authorization: accessToken, 
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            } 
        });
        return 'success';
    } catch (error:any) {
        console.error('updateUserImage ',error.response.data);
    }
}

export async function insertReply(id:string, content:string, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    const data = {content}
    try {
        const response = await axios.post(`${API_URL_APP}v1/contents/reports/${id}/comments`, data, {headers:{Authorization: accessToken, } });
        
    } catch (error:any) {
        console.error('insertReply ',error.response.data);
    }
}

export async function insertSendBadReport(id:any, issueType:number, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    const data = {issueType, content:''}
    try {
        const response = await axios.post(`${API_URL_APP}v1/contents/reports/${id}/issue`, data, {headers:{Authorization: accessToken, } });
    } catch (error:any) {
        console.error('insertSendBadReport ',error.response.data);
    }
}

export async function insertSendBadReply(id:string, cid:string, issueType:number, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    const data = {issueType, content:''}
    try {
        const response = await axios.post(`${API_URL_APP}v1/contents/reports/${id}/comments/${cid}/issue`, data, {headers:{Authorization: accessToken, } });
    } catch (error:any) {
        console.error('insertSendBadReport ',error.response.data);
    }
}

export async function delReply(id:string, cid:string,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.delete(`${API_URL_APP}v1/contents/reports/${id}/comments/${cid}`, {headers:{Authorization: accessToken, } });
    } catch (error:any) {
        console.error('delReply ',error.response.data);
    }
}


export async function addOrDelFavorite(stockCode:string, isFavorite:Boolean,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        if(isFavorite){//삭제처리
            const response = await axios.delete(`${API_URL_APP}v1/corps/favorites?stockCode=${stockCode}`, {headers:{Authorization: accessToken, }});
        }else{
            const response = await axios.get(`${API_URL_APP}v1/corps/favorites?stockCode=${stockCode}`, {headers:{Authorization: accessToken, }});    
        }
        
    } catch (error:any) {
        console.error('addOrDelFavorite ',error.response.data);
    }
}


export async function addOrDelSubscribe(id:string, isSubscriber:Boolean ,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        if(isSubscriber){//삭제처리
            const response = await axios.delete(`${API_URL_APP}v1/creators/subscription?CreatorId=${id}`, {headers:{Authorization: accessToken, }});
        }else{
            const response = await axios.get(`${API_URL_APP}v1/creators/subscription?CreatorId=${id}`, {headers:{Authorization: accessToken, }});    
        }
    } catch (error:any) {
        console.error('addOrDelSubscribe ',error.response.data);
    }
}

export async function getFavoCompany(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    if(accessToken=='expired'){return [];}
    
    try {
        const response:any = await axios.get(`${API_URL_APP}v1/users/my-favorites?page=1&perPage=3000`, {headers:{Authorization: accessToken, }});
        return response?.data?.lists
    } catch (error:any) {
        console.error('getFavoCompany ',error.response.data);
    }
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// API 웹 앱  통합 이후 버전///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// 액세스 토큰 없이 접근 가능한 함수
export async function getTopFiveReport(){
    try {
        const response = await axios.get(`${URL}app/v1/contents/reports?page=1&perPage=5&order=popular`);
        return response;
    } catch (error:any) {
        console.error('getTopFiveReport', error);
    }
}

export async function getTopFiveReportWithoutEducation(){
    try {
        const response = await axios.get(`${URL}v2/contents/reports?page=1&perPage=5&ord=ppr`);
        return response;
    } catch (error:any) {
        console.error('getTopFiveReportWithoutEducation', error);
    }
}



//////////// 리포트 호출 함수들
export async function getAllReportList(order:string, dataPage:number, perPage:number, dispatch:any, navigation:any, pageName:string){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);

    let rcQry ="";
    let ordQry =`&ord=${order}`;
    if(pageName==='인기'){rcQry="&rc=pop";}

    const tempUrl = `${URL}v2/contents/reports?page=${dataPage}&perPage=${perPage}${ordQry}${rcQry}`;
    try {
        const response = await axios.get(tempUrl, {headers:{Authorization: accessToken, }});
        return response;
    } catch (error:any) {  console.error('getAllReportList', error);}
}

export async function getSeriesReport(seriesId:string, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/contents/series/${seriesId}?page=1&perPage=10000`, {headers:{Authorization: accessToken, }});
        return response?.data?.reportList?.list;  //배열일 경우 ?.lists 추가 
    } catch (error:any) {
        console.error('getSeriesReport ',error.response.data);
    }
}

export async function getSearchResult_Report(word:string,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/search?styp=rpt&skeywd=${word}&page=1&perPage=10000`, {headers:{Authorization: accessToken, }});
        return response?.data?.reportList;
    } catch (error:any) {
        console.error('getSearchResult_Report ',error.response.data);
    }
}

export async function getSearchResult_Creator(word:string,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/search?styp=crt&skeywd=${word}&page=1&perPage=10000`, {headers:{Authorization: accessToken, }});
        return response?.data?.creatorList;
    } catch (error:any) {
        console.error('getSearchResult_Creator ',error.response.data);
    }
}

export async function getReportWithStockCode(stockCode:string, perPage:number,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);

    const tempUrl = `${URL}v2/contents/reports?page=1&perPage=${perPage}&stc=${stockCode}&ord=rct`;
    try {
        const response = await axios.get(tempUrl, {headers:{Authorization: accessToken, }});
        return response;
    } catch (error:any) {  console.error('getReportWithStockCode', error);}
}

export async function getCreatorReports(id:string, dataPage:number, perPage:number ,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/@${id}/reports?page=${dataPage}&perPage=${perPage}`, {headers:{Authorization: accessToken, }});
        return response;
    } catch (error:any) {
        console.error('getCreatorReports ',error.response.data);
    }
}




export async function getCurrentPrice(stockCode:string){
    try {
        const response = await axios.get(`${URL}v2/corps/current-price?stc=${stockCode}`);
        return response?.data
    } catch (error:any) {
        console.error('getCurrentPrice ',error.response.data);
    }
}


export async function getReportContent(id:string,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/@9999/reports/${id}`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        if (error.response && error.response.status === 403) {
            return 'noReadAuthority'
        } else {
            // 그 외의 오류에 대한 기본 처리
            console.error('getReportContent ',error.response.data);
            // throw error; // 오류 다시 던지기 (기본 오류 처리를 위해)
        }
    }
}

export async function getReportIsLock(id:string,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/contents/reports/accessibility-reports?rid=${id}`, {headers:{Authorization: accessToken,}});
        return response;
    } catch (error:any) {
        console.error('getReportIsLock ',error.response.data);
    }
}



// 액세스 토큰 넣어야 접근 가능한 함수
export async function getCreatorProfileSet(id:string ,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}app/v1/creators/${id}/info`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getCreatorProfileSet ',error.response.data);
    }
}




export async function getCreatorSeries(id:string,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}app/v1/creators/${id}/series?page=1&perPage=5000`, {headers:{Authorization: accessToken, }});
        return response?.data?.lists;
    } catch (error:any) {
        console.error('getCreatorSeries ',error.response.data);
    }
}


export async function getCommunityContent(stockCode:string,order:string,page:number, perPage:number, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    if(accessToken=='expired'){accessToken=''}
    try {
        const response = await axios.get(`${URL}app/v1/corps/${stockCode}/community?page=${page}&perPage=${perPage}&order=${order}`, {headers:{Authorization: accessToken, }});
        //console.log(response?.data?.stockCommentList);
        return response?.data?.stockCommentList;
    } catch (error:any) {
        console.error('getCommunityContent ',error.response.data);
    }
}

export async function getCommunityOneContent(stockCode:string,contentNum:string, page:number, perPage:number, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    if(accessToken=='expired'){accessToken=''}
    try {
        const response = await axios.get(`${URL}app/v1/corps/${stockCode}/community/${contentNum}?page=${page}&perPage=${perPage}`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getCommunityContent ',error.response.data);
    }
}


export async function getCreatorsInfo(order:string, page:number, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    // 크리에이터는 액세스 토큰 있을때와 없을때 리턴값이 다르므로 validate 하면 안된다.
    //accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/creators?page=${page}&perPage=6&ord=${order}`, {headers:{Authorization: accessToken, }});
        return response?.data?.creatorList;
    } catch (error:any) {
        //console.error('getCreatorsInfo ',error.response.data);
    }
}

export async function getReportReplyList(reportId:string,dispatch:any, navigation:any, order:string){
    let accessToken:any = await validateAccessToken(dispatch, navigation);
    const orderQuery = order=='오래된순'?'&ord=asc':'';

    try {
        const response = await axios.get(`${URL}v2/contents/reports/${reportId}/comments?page=1&perPage=1000${orderQuery}`, {headers:{Authorization: accessToken, }});
        return response?.data?.commentList;
    } catch (error:any) {
        console.error('getReportReplyList ',error.response.data);
    }
}

export async function getPortReplyList(PortfolioId:string, pageName:string, dispatch:any, navigation:any, order:string){
    let accessToken:any = await validateAccessToken(dispatch, navigation);
    const orderQuery = order=='오래된순'?'&ord=asc':'';

    try {
        const response = await axios.get(`${URL}v2/portfolio/@${pageName}/reports/${PortfolioId}/comments?page=1&perPage=1000${orderQuery}`, {headers:{Authorization: accessToken, }});
        return response?.data?.commentList;
    } catch (error:any) {
        console.error('getPortReplyList ',error.response.data);
    }
}

export async function getSeriesList(order:string){
    
    try {
        const response = await axios.get(`${URL}v2/contents/series?page=1&perPage=10000&ord=${order}`);
        return response?.data?.seriesList?.list;  //배열일 경우 ?.lists 추가 
    } catch (error:any) {
        console.error('getSeriesList ',error.response.data);
    }
}

export async function getMyFavoReport(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/favorites/reports/likes?page=1&perPage=10000`, {headers:{Authorization: accessToken, }});
        return response?.data?.likeReportList?.list;
    } catch (error:any) {
        console.error('getMyFavoReport ',error.response.data);
    }
}

export async function getMyBookmarkReport(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/favorites/reports/bookmarks?page=1&perPage=10000`, {headers:{Authorization: accessToken, }});
        return response?.data?.bookmarkReportList?.list;
    } catch (error:any) {
        console.error('getMyBookmarkReport ',error.response.data);
    }
}

export async function getUserAlert(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/messages`, {headers:{Authorization: accessToken, }});
        return response?.data?.notificationList;
    } catch (error:any) {
        console.error('getUserAlert ',error.response.data);
    }
}

export async function getSubscriptionInfo(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/users/subscription`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getSubscriptionInfo ',error.response.data);
    }
}

export async function getSubscriptionList(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/users/subscription/list`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getSubscriptionList ',error.response.data);
    }
}

export async function getPaymentList(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/users/subscription/order/list?page=1&perPage=1000`, {headers:{Authorization: accessToken, }});
        return response?.data?.paymentList?.list;
    } catch (error:any) {
        console.error('getPaymentList ',error.response.data);
    }
}

export async function getPaymentDetail(dispatch:any, navigation:any, orderId:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/users/subscription/order?OrderId=${orderId}`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getPaymentDetail ',error.response.data);
    }
}

export async function getMySubscribeCreator(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/favorites/creators?page=1&perPage=1000`, {headers:{Authorization: accessToken, }});
        return response?.data?.subscribeCreatorList?.list;
    } catch (error:any) {
        console.error('getMySubscribeCreator ',error.response.data);
    }
}

export async function getDonationValidation(dntncd:any,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/users/code/validation?dntncd=${dntncd}`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getDonationValidation ',error.response.data);
    }
}



export async function getUserSetting(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/setting`, {headers:{Authorization: accessToken, }});
        return response?.data?.userSettingInfo;
    } catch (error:any) {
        console.error('getUserSetting ',error.response.data);
    }
}

export async function getHomeReportCompany(){
    try {
        const response = await axios.get(`${URL}v2/corps/pick?page=1&perPage=10`);
        return response;
    } catch (error:any) {
        console.error('getHomeReportCompany ',error.response.data);
    }
}

export async function getRecommendPick(){
    try {
        const response = await axios.get(`${URL}v2/corps/pick?page=1&perPage=100`);
        return response;
    } catch (error:any) {
        console.error('getRecommendPick ',error.response.data);
    }
}

export async function getProductInfo(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/products/reports`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getProductInfo ',error.response.data);
    }
}




export async function updateUserSetting(isApproval:boolean, url:string, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    const data ={isApproval}

    try {
        const result = await axios.patch(`${URL}v2/setting/notification/${url}`, data, {headers:{Authorization: accessToken, }});
        return result.status;
    } catch (error:any) {
        console.error('updateUserSetting ',error.response.data);
    }
}



export async function addOrDelReportBookmark(id:string, isMark:Boolean ,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        if(isMark){//삭제처리
            const response = await axios.delete(`${URL}v2/contents/reports/${id}/bookmark`, {headers:{Authorization: accessToken, }});
        }else{
            const response = await axios.get(`${URL}v2/contents/reports/${id}/bookmark`, {headers:{Authorization: accessToken, }});    
        }
    } catch (error:any) {
        console.error('addOrDelReportBookmark ', error);
    }
}

export async function addOrDelReportLike(id:string, isLike:Boolean ,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        if(isLike){//삭제처리
            const response = await axios.delete(`${URL}v2/contents/reports/${id}/likes`, {headers:{Authorization: accessToken, }});
        }else{
            const response = await axios.get(`${URL}v2/contents/reports/${id}/likes`, {headers:{Authorization: accessToken, }});    
        }
    } catch (error:any) {
        console.error('addOrDelReportLike ',error.response.data);
    }
}









export async function insertCommunityContent(stockCode:string, content:string, dispatch:any, navigation:any, ParentId:number){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    let data;
    if(ParentId == -1){
        data = {content}
    }else{
        data = {ParentId, content}
    }
    try {
        await axios.post(`${URL}app/v1/corps/${stockCode}/community`, data, {headers:{Authorization: accessToken, }});
    } catch (error:any) {
        console.error('insertCommunityContent ',error.response.data);
    }
}



export async function addOrDelCommunityLike(stockCode:string, id:string, isLike:Boolean,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        if(isLike){//삭제처리
            const response = await axios.delete(`${URL}app/v1/corps/${stockCode}/community/${id}/likes`, {headers:{Authorization: accessToken, }});
        }else{
            const response = await axios.get(`${URL}app/v1/corps/${stockCode}/community/${id}/likes`, {headers:{Authorization: accessToken, }});
        }
    } catch (error:any) {
        console.error('addOrDelCommunityLike ',error.response.data);
    }
}


export async function insertSendBadCommunityContent(stockCode:string, id:number, issueType:number, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    const data ={ issueType,}
    try {
        const response = await axios.post(`${URL}app/v1/corps/${stockCode}/community/${id}/issue`, data, {headers:{Authorization: accessToken, }});
    } catch (error:any) {
        console.error('insertSendBadCommunityContent ',error.response.data);
    }
}

export async function insertOrUpdateFcmToken(deviceToken:string, deviceInfo:string, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    const data ={ deviceToken, deviceInfo}
    try {
        const response = await axios.post(`${URL}app/v2/auth/device`, data, {headers:{Authorization: accessToken, }});
    } catch (error:any) {
        console.error('insertOrUpdateFcmToken ',error.response.data);
    }
}

export async function insertReportReply(formData:any, reportId:string, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    
    try { 
        const response = await axios.post(`${URL}v2/contents/reports/${reportId}/comments`, formData, {
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
export async function insertPortReply(formData:any, PortfolioId:string, pageName:string, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    
    try { 
        const response = await axios.post(`${URL}v2/portfolio/@${pageName}/reports/${PortfolioId}/comments`, formData, {
            headers:{
                Authorization: accessToken, 
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            } 
        });
    } catch (error:any) {
        console.error('insertPortReply ',error.response.data);
    }
}

// export async function updateUserImage(formData:any,dispatch:any, navigation:any){
//     let accessToken:any = await EncryptedStorage.getItem('accessToken');
//     accessToken = await validateAccessToken(dispatch, navigation);
//     try {
//         const response = await axios.post(`${API_URL_APP}v1/users/avatar`, formData, {
//             headers:{
//                 Authorization: accessToken, 
//                 'Accept': 'application/json',
//                 'Content-Type': 'multipart/form-data',
//             } 
//         });
//         return 'success';
//     } catch (error:any) {
//         console.error('updateUserImage ',error.response.data);
//     }
// }


export async function updateAlertRead(id:string, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
       await axios.get(`${URL}v2/messages/${id}`, {headers:{Authorization: accessToken, }});
    } catch (error:any) {
        console.error('updateAlertRead ',error.response.data);
    }
}





/////// Delete 함수

export async function deleteCommunityContent(stockCode:string, id:number, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.delete(`${URL}app/v1/corps/${stockCode}/community/${id}`, {headers:{Authorization: accessToken, }});
    } catch (error:any) {
        console.error('deleteCommunityContent ',error.response.data);
    }
}

export async function deleteUser(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const result = await axios.delete(`${URL}v1/setting/withdraw`, {headers:{Authorization: accessToken, }});
        return 'success';
    } catch (error:any) {
        console.error('deleteUser ',error.response.data);
    }
}

export async function deleteReportReply(reportId:string, commentId:any, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    
    try { 
        const response = await axios.delete(`${URL}v2/contents/reports/${reportId}/comments/${commentId}`, {headers:{Authorization: accessToken, }});
    } catch (error:any) {
        console.error('deleteReportReply ',error.response.data);
    }
}

export async function deletePortfolioReply(pageName:string, PortfolioId:string, selectedPortfolioReplyId:any, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    
    try { 
        const response = await axios.delete(`${URL}v2/portfolio/@${pageName}/reports/${PortfolioId}/comments/${selectedPortfolioReplyId}`, {headers:{Authorization: accessToken, }});
    } catch (error:any) {
        console.error('deletePortfolioReply ',error.response.data);
    }
}


export async function deleteAlert(id:string, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
       const result = await axios.delete(`${URL}v2/messages/${id}`, {headers:{Authorization: accessToken, }});
    } catch (error:any) {
        console.error('deleteAlert ',error.response.data);
    }
}

export async function deleteFcmToken(deviceToken:string, deviceInfo:string, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    const data ={ deviceToken, deviceInfo}
    try {
        const response = await axios.post(`${URL}v2/auth/logout`, data, {headers:{Authorization: accessToken, }});
    } catch (error:any) {
        console.error('deleteFcmToken ',error.response.data);
    }
}







export async function getWebTokenWithKakaoToken(kakaoAccessToken:string){
    try {
        const response:any = await axios.get(`${URL}app/v2/auth/kakao`,{headers:{accessToken: kakaoAccessToken,}});
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

export async function getWebTokenWithGoogleToken(token:any){
    try {
        const response:any = await axios.get(`${URL}app/v2/auth/google`,{headers:{accessToken: token,}});
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

export async function getWebTokenWithNaverToken(token:string){
    try {
        const response:any = await axios.get(`${URL}app/v2/auth/naver`,{headers:{accessToken: token,}});
        const refreshToken:string = response.headers["set-cookie"][0].split(';')[0].replace('8r2b0o1=','');
        const accessToken:string = response.headers.authorization;
        const status = response.status;
        return {accessToken, refreshToken, status};
    } catch (error:any) {
        console.error('getWebTokenWithNaverToken ',error.response.data);
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

        const response:any = await axios.get(`${URL}app/v2/auth/apple`,{headers:{accessToken: token,}});
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



export async function insertAgreementAndPrivacy(refreshToken:string, check3:boolean, check4:boolean, check5:boolean, deviceInfo:any, deviceToken:any, dispatch:any, navigation:any){
    
    // const cookie = `8r2b0o1=${refreshToken}`
    // console.log(cookie);
    
    const isAdvertiseApproval:number = check3?1:0;
    const isAppPush:number = check4?1:0;
    const isAppPushNight:number = check5?1:0;

    const data ={ isAdvertiseApproval,isAppPush,isAppPushNight,deviceInfo,deviceToken}
    console.log(data)
    try {
        const response:any = await axios.post(`${URL}v2/auth/join`, data, {withCredentials: true,});
        const refreshToken:string = response.headers["set-cookie"][0].split(';')[0].replace('8r2b0o1=','');
        const accessToken:string = response.headers.authorization;
        const status = response.status;
        //console.log(response.headers)
        //console.log(accessToken, refreshToken, status)
        
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

export async function insertApprovalInfoForExistMember(isAdvertiseApproval:boolean,isAppPush:boolean,isAppPushNight:boolean,dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    const data ={ isAdvertiseApproval,isAppPush,isAppPushNight}
    
    try { 
        const response = await axios.patch(`${URL}v2/setting/approval`, data, {headers:{Authorization: accessToken, }});
    } catch (error:any) {
        console.error('insertApprovalInfoForExistMember ',error.response.data);
    }
}



export async function getAccessTokenWithRefreshToken(refreshToken:string, dispatch:any, navigation:any){
    // console.log('refreshToken으로 신규 액세스 토큰 발급');
    // console.log(refreshToken)
    try {
        const response:any = await axios.get(`${URL}v2/auth/refresh`, {withCredentials: true,});
        const newAccessToken:string = response.headers.authorization;
        return newAccessToken;
    } catch (error:any) {
        //console.log('리프레시토큰 기한만료 등으로 액세스토큰 발급 권한 없음' );
        //로그인 관련 정보 삭제(리덕스 및 Encrypted 토큰들)
        dispatch(userSlice.actions.setIsLogin(false));
        deleteEncryptedStorageLoginInfo();
        //console.error('getAccessTokenWithRefreshToken ',error.response.data);
        return 'expired';
    }
}

export async function getApprovalInfoWithRefreshToken(refreshToken:any,dispatch:any,navigation:any){
    try {
        const response:any = await axios.get(`${URL}v2/auth/refresh`, {withCredentials: true,});
        return response.status;
    } catch (error:any) {
        console.error('getApprovalInfoWithRefreshToken ',error.response.data);
    }
}

export async function getReportRiseTop3(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/contents/reports/ranking`, {headers:{Authorization: accessToken, }});
        return response?.data?.list;
    } catch (error:any) {
        console.error('getReportRiseTop3 ',error.response.data);
    }
}
export async function getNewReportDomestic(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/contents/reports/new-domestic`, {headers:{Authorization: accessToken, }});
        return response?.data?.list;
    } catch (error:any) {
        console.error('getNewReportDomestic ',error.response.data);
    }
}
export async function getHomeTopTenReport(dispatch:any, navigation:any, currentTopTen:string, currentDuration:string){
    let dt = 1;
    if(currentDuration=='분기'){dt=2}else if(currentDuration=='반기'){dt=3}
    let ord = "ror";
    if(currentTopTen=="마진률 높은순"){
        ord="mor";
    }else if(currentTopTen=="조회순"){
        ord="vc";
    }else if(currentTopTen=="좋아요순"){
        ord="lc";
    }else if(currentTopTen=="댓글순"){
        ord="cc";
    }

    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/contents/reports?page=1&perPage=10&ord=${ord}&dt=${dt}`, {headers:{Authorization: accessToken, }});
        return response?.data?.reportList?.list;
    } catch (error:any) {
        console.error('getHomeTopTenReport ',error.response.data);
    }
}

export async function getCreatorRanking(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/creators/top-creator`, {headers:{Authorization: accessToken, }});
        return response?.data?.list;
    } catch (error:any) {
        console.error('getTopCreatorRanking ',error.response.data);
    }
}


// 결제 관련
export async function insertReportPaymentAndroid(purchaseToken:any, donationCode:any, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    const data = {purchaseToken, donationCode}
    try {
        const response = await axios.post(`${URL}v2/users/subscription/order/android`, data, {headers:{Authorization: accessToken, } });
        return response.data;
    } catch (error:any) {
        console.error('insertReportPaymentAndroid ',error.response.data);
        return {code:'fail'}
    }
}

// 결제 관련
export async function insertReportPaymentIos(receipt_data:any, donationCode:any, dispatch:any, navigation:any){
    const data = {receipt_data, donationCode}
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    
    try {
        const response = await axios.post(`${URL}v2/users/subscription/order/ios`, data, {headers:{Authorization: accessToken, }});
        return response.data;
    } catch (error:any) {
        console.error('insertReportPaymentIos ',error.response.data);
        return {code:'fail'}
    }
}




export async function getHomeSlideData(dispatch:any, navigation:any){
    try {
        const response = await axios.get(`${URL}v2/banners?bannerType=top`);
        
        return response?.data?.list;
    } catch (error:any) {
        console.error('getHomeSlideData ',error.response.data);
    }
}

export async function getReportPreview(dispatch:any, navigation:any, id:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        let response;
        if(accessToken=='expired'){
            response = await axios.get(`${URL}v2/contents/reports/${id}/preview`);
        }else{
            response = await axios.get(`${URL}v2/contents/reports/${id}/preview`, {headers:{Authorization: accessToken}});
        }
        
        return response?.data;
    } catch (error:any) {
        console.error('getReportPreview ',error.response.data);
    }
}

export async function getMyOrangeStatus(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        if(accessToken!='expired'){
            const response = await axios.get(`${URL}v2/users/orange`, {headers:{Authorization: accessToken}});
            return response?.data;
        }
        
    } catch (error:any) {
        console.error('getMyOrangeStatus ',error.response.data);
    }
}

export async function purchaseReport(ReportId:string, orangeB:number, viewType:string, dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    const data = {ReportId, orangeB, viewType}
    try {
        const response = await axios.post(`${URL}v2/users/orange/purchase/reports`, data, {headers:{Authorization: accessToken, } });
        return response;
    } catch (error:any) {
        console.error('purchaseReport ',error.response.data);
        return error.response.data;
    }
}






export async function getPortList(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/portfolio/list?page=1&perPage=10000`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getPortList ',error.response.data);
    }
}
export async function getPortPersonalList(dispatch:any, navigation:any, pageName:string){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/portfolio/@${pageName}/list?page=1&perPage=10000`, {headers:{Authorization: accessToken, }});
        return response?.data?.portfolioList;
    } catch (error:any) {
        console.error('getPortList ',error.response.data);
    }
}

export async function getPortContent(dispatch:any, navigation:any, PortfolioId:string, pageName:string){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/portfolio/@${pageName}/reports/${PortfolioId}`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getPortContent ',error.response.data);
    }
}

export async function getPortOwnerList(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/portfolio/operator`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getPortOwnerList ',error.response.data);
    }
}

export async function getPortChannelList(dispatch:any, navigation:any, PortChannelId:string){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    const qry = PortChannelId==""?"":`?chlid=${PortChannelId}`;
    try {
        const response = await axios.get(`${URL}v2/portfolio/channel/list${qry}`, {headers:{Authorization: accessToken, }});
        return response?.data?.channelList;
    } catch (error:any) {
        console.error('getPortChannelList ',error.response.data);
    }
}

export async function getPortOwnerData(dispatch:any, navigation:any, pageName:string){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/portfolio/@${pageName}/info`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getPortOwnerData ',error.response.data);
    }
}


export async function togglePortChatLike(dispatch:any, navigation:any, pageName:string, IssueId:string, currentLike:boolean){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        if(currentLike){
            const response = await axios.delete(`${URL}v2/portfolio/@${pageName}/issue/${IssueId}/likes`, {headers:{Authorization: accessToken, }});
        }else{
            const response = await axios.get(`${URL}v2/portfolio/@${pageName}/issue/${IssueId}/likes`, {headers:{Authorization: accessToken, }});
        }
    } catch (error:any) {
        console.error('togglePortChatLike ',error.response.data);
    }
}


// export async function getPortChat(dispatch:any, navigation:any, pageName:string, bwdId:string, fwdId:string, perPage:string){
//     let accessToken:any = await EncryptedStorage.getItem('accessToken');
//     accessToken = await validateAccessToken(dispatch, navigation);
//     const bwdQry = bwdId!=''?`&bwdId=${bwdId}`:'';
//     const fwdQry = fwdId!=''?`&fwdId=${fwdId}`:'';
//     try {
//         let response = await axios.get(`${URL}v2/portfolio/@${pageName}/issue?perPage=${perPage}&${bwdQry}${fwdQry}`, {headers:{Authorization: accessToken, }});
//         return response?.data;
//     } catch (error:any) {
//         console.error('getPortChat ',error.response.data);
//     }
// }

export async function getPortIntroduction(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        let response = await axios.get(`${URL}v2/portfolio/introduction`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getPortIntroduction ',error.response.data);
    }
}

export async function getPortOwnerIntroImages(dispatch:any, navigation:any, pageName:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        let response = await axios.get(`${URL}v2/portfolio/@${pageName}/intro?pf=app`, {headers:{Authorization: accessToken, }});
        return response.data.portfolilChannelIntroImgList;
    } catch (error:any) {
        console.error('getPortOwnerIntroImages ',error.response.data);
    }
}

// 최초호출뒤, 
export async function getPortContentRealtime(dispatch:any, navigation:any, pageName:string){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/portfolio/@${pageName}/realtime`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getPortContentRealtime ',error.response.data);
    }
}

export async function getPortProductList(dispatch:any, navigation:any){
    let accessToken:any = await EncryptedStorage.getItem('accessToken');
    accessToken = await validateAccessToken(dispatch, navigation);
    try {
        const response = await axios.get(`${URL}v2/portfolio/product/list`, {headers:{Authorization: accessToken, }});
        return response?.data;
    } catch (error:any) {
        console.error('getPortProductList ',error.response.data);
    }
}