import alt from "alt-client";

let map = new WeakMap<alt.RmlElement, any>();
let current: alt.RmlElement;

export function setupHooks(node: alt.RmlElement) {
  map.set(node, {});
  current = node;
}

export function lazy(getter: () => any) {}
