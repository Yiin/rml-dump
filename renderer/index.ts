import alt from "alt-client";
import { renderElement, markElementAsHidden } from "./element-renderer";
import { prepareFrameForEntity } from "./element-updater";
import { visibleElementsHeap, notRenderedElements } from "./frame-state";
import {
  resetFocusedEntity,
  getFocusedEntity,
} from "./hooks/use-closest-entity";
import { resetMenu, updateMenu } from "./hooks/use-menu";
import { setCurrentNode } from "./internals/current-node";

alt.everyTick(() => {
  // Cleanup previous frame
  visibleElementsHeap.clear();
  notRenderedElements.clear();
  resetFocusedEntity();

  // AnchorType.Ped
  alt.Ped.streamedIn.forEach(prepareFrameForEntity);

  updateMenu();

  // Update the positions of elements that are still visible
  (visibleElementsHeap.consume() as alt.RmlElement[]).forEach(renderElement);

  setCurrentNode(null);

  // Hide elements that are not shown because of the limit
  notRenderedElements.forEach(markElementAsHidden);
});
