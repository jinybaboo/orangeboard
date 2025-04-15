import {combineReducers} from 'redux';

import userSlice from '../slices/user';

// root 리듀서로서, 여기에 각각의 슬라이스를 등록하면 app.js 에서 state.user, state.XXX 등으로 각 슬라이서의 정보를 쓸 수 있음.
const rootReducer = combineReducers({
  user: userSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;