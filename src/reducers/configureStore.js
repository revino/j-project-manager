import { createStore, applyMiddleware  } from 'redux'
import createSagaMiddleware from 'redux-saga';

import { composeWithDevTools } from "redux-devtools-extension";

import createRootReducer, {rootSaga} from './modules'

import history from '../history';

const sagaMiddleware = createSagaMiddleware({
    context: {
      history: history
    }
}); 


export default function configureStore(preloadedState) {
    const store = createStore(
          createRootReducer(),
          composeWithDevTools(
            applyMiddleware(
                sagaMiddleware
              )
          )

    )
    
    sagaMiddleware.run(rootSaga)

    return store
}