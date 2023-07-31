import alt from "alt-client";
import game from "natives";
import { watch } from "vue";
import { Bones } from "@shared/enums/bones";
import { NpcFlags } from "@shared/modules/npc/constants";
import { playerStore } from "@/store/player.store";
import { registerElement } from "../renderer/element-registry";
import { div, span } from "../renderer/rml-tags";
import { Icon } from "../components/icon/icon";
import { AnchorType } from "../renderer/anchors";
import { useMenu } from "../renderer/hooks/use-menu";

let shouldUpdateContext = true;

watch(
  () => playerStore.character?.questFacts,
  () => {
    shouldUpdateContext = true;
  }
);

registerElement({
  key: "interaction",
  renderDistance: 3,
  anchorType: AnchorType.Ped,
  focusable: true,
  context: {
    shouldUpdateContext: () => {
      if (shouldUpdateContext) {
        shouldUpdateContext = false;
        return true;
      }
      return false;
    },
    updateContext({ entity: ped }) {
      const flags = (ped.getStreamSyncedMeta("flags") as NpcFlags) ?? 0;
      const options = [
        (flags & NpcFlags.Quest) === NpcFlags.Quest && "quest",
        (flags & NpcFlags.Talkable) === NpcFlags.Talkable && "talk",
        (flags & NpcFlags.Shop) === NpcFlags.Shop && "shop",
      ].filter(Boolean) as string[];

      const menu = useMenu(options, {
        onSelect(option) {
          switch (option) {
            case "quest":
              alt.log("Starting the quest");
              break;
            case "talk":
              alt.log("Starting the dialogue");
              break;
            case "shop":
              alt.log("Opening the shop");
              break;
          }
        },
      });

      return { menu };
    },
  },
  render({ entity: ped, scale }, { menu }) {
    const lowerBodyPos = game.getPedBoneCoords(
      ped.scriptID,
      Bones.SKEL_Pelvis,
      0,
      0,
      0.2
    );
    const { x: screenX, y: screenY } = alt.worldToScreen(
      lowerBodyPos.x,
      lowerBodyPos.y,
      lowerBodyPos.z
    );

    return div(
      {
        className: "interaction-wrapper",
        style: {
          transform: `translate(-50%, -50%) translate(${screenX}px, ${screenY}px)`,
          opacity: menu.isActive ? 1 : 0.5,
        },
      },
      [
        div(
          {
            className: "interaction-content",
            style: {
              transform: `scale(${scale})`,
            },
          },
          menu.options.map((option, index) => {
            if (option) {
              return div([
                div(
                  {
                    className: [
                      "interaction",
                      menu.currentIndex() === index && "interaction--selected",
                    ],
                  },
                  {
                    quest: [
                      Icon("quest"),
                      span({ className: "label" }, ["Start quest"]),
                    ],
                    talk: [
                      Icon("dialog"),
                      span({ className: "label" }, ["Talk"]),
                    ],
                    shop: [
                      Icon("shop"),
                      span({ className: "label" }, ["Shop"]),
                    ],
                  }[option] || []
                ),
              ]);
            }
            return null;
          })
        ),
      ]
    );
  },
});
