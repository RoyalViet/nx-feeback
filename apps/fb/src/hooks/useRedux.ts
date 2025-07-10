import { useDispatch, useSelector, useStore } from 'react-redux';

import { IStoreState } from '@/models/stores';
import { TAppDispatch, TAppStore } from '@/stores';

export const useAppDispatch = useDispatch.withTypes<TAppDispatch>();
export const useAppSelector = useSelector.withTypes<IStoreState>();
export const useAppStore = useStore.withTypes<TAppStore>();
