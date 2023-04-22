import {combineReducers} from 'redux';

import {
  heroSlice
} from './heroes';

const rootReducer = combineReducers({
    hero: heroSlice.reducer,
});

// Exports
export default rootReducer;
