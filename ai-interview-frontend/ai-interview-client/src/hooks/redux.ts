import {useDispatch, useSelector } from 'react-redux';
import type {TypedUseSelectorHook }from 'react-redux';

import type {Rootstate, AppDispatch} from '../store'; 

export const useAppDispatch =  () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<Rootstate> = useSelector;