// Why this way resone mentioned below

import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./appStore";

export const useAppDispatch = ()=> useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/*
//? Problem with regular useDispatch() and useSelector()
1. useDispatch() is untyped -By default, useDispatch() returns a generic Dispatch<ny> — which means TypeScript has no idea what actions or types you're dispatching.
2. useSelector() doesn’t know your state structure - Using useSelector() without typing makes TypeScript guess or forces you to annotate the state manually every time:
*/