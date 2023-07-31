import alt from "alt-client";

export enum AnchorType {
  Ped,
  Player,
}

export type AnchorEntityMap = {
  [AnchorType.Ped]: alt.Ped;
  [AnchorType.Player]: alt.Player;
};
