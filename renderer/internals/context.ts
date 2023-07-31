import alt from "alt-client";
import { AnchorType } from "../anchors";
import { ElementRegistration } from "../types";

const contexts = new WeakMap<alt.RmlElement, any>();

export function updateContext(
  node: alt.RmlElement,
  registeredElement: ElementRegistration<AnchorType, any>
) {
  if (
    !contexts.has(node) ||
    registeredElement.context?.shouldUpdateContext({ entity: node.entity })
  ) {
    contexts.set(
      node,
      registeredElement.context?.updateContext({ entity: node.entity })
    );
  }
}

export function getContext(node: alt.RmlElement) {
  return contexts.get(node);
}
