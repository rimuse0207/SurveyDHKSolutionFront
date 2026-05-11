import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { thunk } from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage 사용

import surveyReducer from "./Reducers/surveyReducer";
import { responderReducer } from "./Reducers/responderReducer";
import LoginReducer from "./Reducers/LoginReducer";

// 1. Persist 설정 추가
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["login"],
};

const rootReducer = combineReducers({
  survey: surveyReducer,
  responder: responderReducer,
  login: LoginReducer,
});

// 2. rootReducer를 persistReducer로 감싸기
const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// 3. store 생성 (persistedReducer 사용)
const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk)),
);

// 4. persistor 생성
export const persistor = persistStore(store);
export default store;
