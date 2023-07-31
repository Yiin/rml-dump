import alt from "alt-client";
import game from "natives";
import { focusableElements, registeredElements } from "./element-registry";
import { notRenderedElements, visibleElementsHeap } from "./frame-state";
import { container, document } from "./element-renderer";
import { elements } from "./rml-renderer";
import { AnchorEntity, FrameData } from "./types";
import { updateFocusedEntity } from "./hooks/use-closest-entity";
import { AnchorType } from "./anchors";

export const frameDataMap = new Map<AnchorEntity, FrameData>();

alt.on("gameEntityDestroy", (entity) => {
  removeOrphanedElements(entity as AnchorEntity);
});

let screenRes = alt.getScreenResolution().div(
  2.2, // 2.2 feels a bit more natural, as the player ped is not in the center of the screen, but a bit left from it
  2
);

alt.on("windowResolutionChange", () => {
  screenRes = alt.getScreenResolution().div(2.2, 2);
});

export function prepareFrameForEntity(entity: AnchorEntity) {
  const isVisible =
    alt.isPointOnScreen(entity.pos) &&
    game.hasEntityClearLosToEntity(alt.Player.local, entity, 17);

  if (isVisible) {
    const screenPosition = alt.worldToScreen(entity.pos);
    const zIndex = ~~(screenPosition.z * 100000);

    const focusableElement = focusableElements.get(
      entity instanceof alt.Ped ? AnchorType.Ped : AnchorType.Player
    );

    if (focusableElement) {
      if (
        entity.pos.distanceTo(alt.Player.local.pos) <=
        focusableElement.renderDistance
      ) {
        const distanceToCenter = screenRes.distanceTo(screenPosition);

        updateFocusedEntity(entity, distanceToCenter);
      }
    }

    frameDataMap.set(entity, {
      screen: screenPosition,
      zIndex,
      isVisible,
    });
  } else {
    if (!frameDataMap.has(entity) || frameDataMap.get(entity)!.isVisible) {
      frameDataMap.set(entity, {
        screen: new alt.Vector3(0),
        zIndex: 0,
        isVisible,
      });
    }
  }

  prepareEntityElements(entity);
}

export function prepareEntityElements(entity: AnchorEntity) {
  const frameData = frameDataMap.get(entity)!;
  const elementsMap = elements.has(entity)
    ? elements.get(entity)!
    : new Map<string, alt.RmlElement>();

  for (const [key, registeredElement] of registeredElements) {
    if (!elementsMap.has(key)) {
      const node = document.createElement("div");

      node.addClass("hide");
      node.style["z-index"] = frameData.zIndex.toString();
      node.key = key;
      node.entity = entity;

      container.appendChild(node);
      elementsMap.set(key, node);
    }
    const node = elementsMap.get(key)!;

    notRenderedElements.add(node);

    if (
      frameData.isVisible &&
      entity.pos.distanceTo(alt.Player.local.pos) <=
        registeredElement.renderDistance
    ) {
      visibleElementsHeap.push(node);
    }
  }

  if (!elements.has(entity)) {
    elements.set(entity, elementsMap);
  }
}

function removeOrphanedElements(entity: AnchorEntity) {
  if (!elements.has(entity)) {
    return;
  }
  const elementsMap = elements.get(entity)!;

  elementsMap.forEach((element) => {
    notRenderedElements.delete(element);
    container.removeChild(element);
    element.destroy();
  });

  elements.delete(entity);
}
