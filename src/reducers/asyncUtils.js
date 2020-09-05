import { call, put } from 'redux-saga/effects';

// fetch 결과를 디스패치하는 사가
export const createPromiseSaga = (type, fetchCreator, dataParser) => {
  const [SUCCESS, ERROR] = [`${type}Success`, `${type}Failure`];
  return function* saga(action) {
    try {
      const payload = yield fetchCreator(action.payload);
      if(!payload.ok) throw new Error(payload);
      const result  = yield call(dataParser,payload);
      
      yield put({ type: SUCCESS, payload:result});
    } catch (err) {
      console.log(err);
      yield put({ type: ERROR, error: true, payload: err });
    }
  };
};

// 리듀서에서 사용 할 수 있는 여러 유틸 함수들입니다.
export const reducerUtils = {
  initial: (initialData = null) => ({
    loading: false,
    data: initialData,
    error: null
  }),
  // 로딩중 상태. prevState의 경우엔 기본값은 null 이지만
  // 따로 값을 지정하면 null 로 바꾸지 않고 다른 값을 유지시킬 수 있습니다.
  loading: (prevState = null) => ({
    loading: true,
    data: prevState,
    error: null
  }),
  // 성공 상태
  success: payload => ({
    loading: false,
    data: payload,
    error: null
  }),
  // 실패 상태
  error: error => ({
    loading: false,
    data: null,
    error: error
  })
};

export const handleAsyncActions = (type, key, keepData = false) => {
  const [SUCCESS, ERROR] = [`${type}Success`, `${type}Failure`];
  return (state, action) => {
    switch (action.type) {
      case type:
        return {
          ...state,
          [key]: reducerUtils.loading(keepData ? state[key].data : null)
        };
      case SUCCESS:
        return {
          ...state,
          [key]: reducerUtils.success(action.payload)
        };
      case ERROR:
        return {
          ...state,
          [key]: reducerUtils.error(action.payload)
        };
      default:
        return state;
    }
  };
};
