import { List, OrderedSet, Record, Set } from "immutable";
import { Dispatch, SetStateAction } from "react";

export interface Point {
  x: number;
  y: number;
  lineWidth: number;
}

export type iOSTouch = Touch & {
  force?: number;
  touchType: "stylue" | "direct";
};

// export type DrawState = Record<{
//   state: 'drawing'|'revoking',
//   strokes: List<{
//     uid: string,
//     points: Point[],
//   }>,
//   revoked: OrderedSet<string>,
//   deleted: Set<string>,
//   position: List<Set<string>>,
// }>

// export type SetDrawState =  Dispatch<SetStateAction<DrawState>>