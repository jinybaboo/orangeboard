import {createSlice} from '@reduxjs/toolkit';

//컴포넌트 전체에서 공유하는 전역상태의 변수들 (초기상태)
const initialState = {
  userId: '',
  isLogin: false,
  name: '',
  nickname:'',
  email:'',
  accessToken: '',
  refreshToken: '',
  currentPage:'',
  pageStack:[],

  //리포트 이동시 필요 정보 저장
  reportId:'',
  reportStockCode:'',

  //회사정보 이동시 
  compnayInfoStockCode:'',

  //크리에이터 정보 이동시
  creatorInfoId:'',

  //크리에이터/리포트 검색어
  contentsSearchWord:'',

  //커뉴니티 이동시 글번호
  communityContentNum:0,

  //companyInfo페이지 로딩되면 기업이름 저장하기
  companyInfoCompanyName:'',

  //시리즈 이동시 시리즈 제목 저장
  seriesName:'시리즈 리포트',
  seriesId : '',

  //리포트 이동시 카테고리 저장
  reportCate:'리포트 카테고리',

  //포트폴리오 운영자 이동시 정보
  pageName:'',
  PortfolioId:'',

  //포트폴리오 구독 결제 시 
  selectedPortData:{},
};


const userSlice = createSlice({
  name: 'user',
  initialState,

  //동기액션용 리듀서
  reducers: {
    //모든 상태를 동시에 바꾸는 리듀서
    setUser(state, action) {
      state.userId = action.payload.userId;
      state.isLogin = action.payload.isLogin;
      state.nickname = action.payload.nickname;
    },
    // 이름만 바꾸는 리듀서  (주로 데이터 1개일때 편하다)
    setName(state, action) {
      state.name = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setPageStack(state, action) {
      if(action.payload=='Back' || action.payload=='AndroidBackBtn'){
        state.pageStack.pop();
      }else if(action.payload=='Home'){
        state.pageStack=[action.payload as never]
      }else{
        if(action.payload!=state.pageStack[state.pageStack.length-1]){
          state.pageStack.push(action.payload as never);
        }
      }
    },

    //로그인 정보 저장
    setIsLogin(state, action) {state.isLogin = action.payload;},
    setNickname(state, action) {state.nickname = action.payload;},
    setEmail(state, action) {state.email = action.payload;},

    //// 리포트 읽을때 저장
    setReportId(state, action) {state.reportId = action.payload;},
    setReportStockCode(state, action) {state.reportStockCode = action.payload;},

    //회사정보 페이지 이동시 저장
    setCompnayInfoStockCode(state, action) {state.compnayInfoStockCode = action.payload;},

    //크리에이터/리포트 검색어
    setContentsSearchWord(state, action) {state.contentsSearchWord = action.payload;},

    setCreatorInfoId(state, action) {state.creatorInfoId = action.payload;},

    //커뉴니티 이동시 글번호
    setCommunityContentNum(state, action) {state.communityContentNum = action.payload;},

    //companyInfo페이지 로딩되면 기업이름 저장하기
    setCompanyInfoCompanyName(state, action) {state.companyInfoCompanyName = action.payload;},

    //시리즈 이동시 시리즈 제목 저장
    setSeriesName(state, action) {state.seriesName = action.payload;},
    setSeriesId(state, action) {state.seriesId = action.payload;},
    
    //리포트 이동시 카테고리 저장
    setReportCate(state, action) {state.reportCate = action.payload;},

    setPageName(state, action) {state.pageName = action.payload;},
    setPortfolioId(state, action) {state.PortfolioId = action.payload;},
    
    setSelectedPortData(state, action) {state.selectedPortData = action.payload;},

  },

  //비동기액션용 리듀서
  extraReducers: builder => {},
});

export default userSlice;