import userSlice from "../slices/user";
import { getAppAdminInfo } from "./commonData";
import { setCurrentPage } from "./commonFunc";

//헤더 백버튼 누를때
export const goBack = (navigation:any, dispatch:any)=>{
    setCurrentPage(dispatch, 'Back');
    navigation.goBack();
}

export async function goReportContent(navigation:any, dispatch:any, id:string, isLock:boolean){
    // const {isShowReportPreview} = await getAppAdminInfo();
    // if(isLock){
    //     dispatch(userSlice.actions.setReportId(id));
    //     setCurrentPage(dispatch, 'ReportPreview');
    //     navigation.navigate("ReportPreview" as never);
    // }else{
    //     dispatch(userSlice.actions.setReportId(id));
    //     setCurrentPage(dispatch, 'ReportContent');
    //     navigation.navigate("ReportContent" as never);
    // }
    dispatch(userSlice.actions.setReportId(id));
    setCurrentPage(dispatch, 'ReportPreview');
    navigation.navigate("ReportPreview" as never);
}

export async function goReportContentFromPreview(navigation:any, dispatch:any){
    setCurrentPage(dispatch, 'ReportContent');
    navigation.navigate("ReportContent" as never);
}


export const goHome = (navigation:any, dispatch:any) =>{
    setCurrentPage(dispatch, 'Home');
    navigation.navigate("Home" as never);
}

export const goContents = (navigation:any, dispatch:any) =>{
    setCurrentPage(dispatch, 'Contents');
    navigation.navigate("Contents" as never);
}
export const goCreators = (navigation:any, dispatch:any) =>{
    setCurrentPage(dispatch, 'Creators');
    navigation.navigate("Creators" as never);
}
export const goMypage = (navigation:any, dispatch:any) =>{
    setCurrentPage(dispatch, 'Mypage');
    navigation.navigate("Mypage" as never);
}

export const goLogin = (navigation:any, dispatch:any) =>{
    setCurrentPage(dispatch, 'Login');
    navigation.navigate("Login" as never);
}

export const goSubscriptionPayInfo = (navigation:any, dispatch:any) =>{
    setCurrentPage(dispatch,'SubscriptionPayInfo');
    navigation.navigate("SubscriptionPayInfo" as never);
}

export const goReportBuy = (navigation:any, dispatch:any, type:string) =>{
    setCurrentPage(dispatch,'ReportBuy');
    navigation.navigate("ReportBuy" as never, {type});
}

export const goCreatorInfo = (navigation:any, dispatch:any, id:string) =>{
    dispatch(userSlice.actions.setCreatorInfoId(id));
    setCurrentPage(dispatch,'CreatorInfo');
    navigation.navigate("CreatorInfo" as never);
}
export const goPortOwner = (navigation:any, dispatch:any, pageName:string) =>{
    dispatch(userSlice.actions.setPageName(pageName));
    
    setCurrentPage(dispatch,'PortOwner');
    navigation.navigate("PortOwner" as never);
}
export const goPortContent = (navigation:any, dispatch:any, PortfolioId:string, pageName:string) =>{
    console.log(PortfolioId, pageName)
    dispatch(userSlice.actions.setPageName(pageName));
    dispatch(userSlice.actions.setPortfolioId(PortfolioId));

    setCurrentPage(dispatch,'PortContent');
    navigation.navigate("PortContent" as never);
}
export const goPortContentRealtime = (navigation:any, dispatch:any,  pageName:string) =>{
    setCurrentPage(dispatch,'PortContentRealtime');
    navigation.navigate("PortContentRealtime" as never, {pageName});
}
export const goPortReply = (navigation:any, dispatch:any, PortfolioId:string, pageName:string, title:string, isSubscribeChannel:boolean) =>{
    dispatch(userSlice.actions.setPageName(pageName));
    dispatch(userSlice.actions.setPortfolioId(PortfolioId));

    setCurrentPage(dispatch,'PortReply');
    navigation.navigate("PortReply" as never, {title, isSubscribeChannel});
}

export const goSelectPhoto = (navigation:any, dispatch:any) =>{
    setCurrentPage(dispatch,'SelectPhoto');
    navigation.navigate("SelectPhoto" as never);
}
  
export const goPortChat = (navigation:any, dispatch:any, pageName:string) =>{
    dispatch(userSlice.actions.setPageName(pageName));
    setCurrentPage(dispatch,'PortChat');
    navigation.navigate("PortChat" as never);
}

export const goPortfolio = (navigation:any, dispatch:any,) =>{
    setCurrentPage(dispatch, 'Portfolio');
    navigation.navigate("Portfolio" as never);
}

export const goSubscriptionPayReport = (navigation:any, dispatch:any) =>{
    setCurrentPage(dispatch,'SubscriptionPayReport');
    navigation.navigate("SubscriptionPayReport" as never);
}
export const goSubscriptionPayPort = (navigation:any, dispatch:any, selectedPortData:any) =>{
    dispatch(userSlice.actions.setSelectedPortData(selectedPortData));
    setCurrentPage(dispatch,'SubscriptionPayPort');
    navigation.navigate("SubscriptionPayPort" as never);
}
  
export const goEvent = (navigation:any, dispatch:any,) =>{
    setCurrentPage(dispatch,'Notice');
    navigation.navigate("Notice", {page:'이벤트'});
}
  