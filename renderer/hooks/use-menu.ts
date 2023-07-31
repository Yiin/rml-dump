import alt from "alt-client";
import game from "natives";
import { Control, ControlType } from "@/constants/controls";
import { getCurrentNode } from "../internals/current-node";
import { AnchorEntity } from "../types";
import { getFocusedEntity } from "./use-closest-entity";

type MenuOption = string;

type Menu = {
  options: MenuOption[];
  onSelect(option: any): void;
  node: alt.RmlElement;
};

const registeredMenus: WeakMap<AnchorEntity, Menu> = new WeakMap();
let currentEntity: AnchorEntity | null = null;
let currentIndex: number = 0;

export function resetMenu() {
  currentEntity = null;
  currentIndex = 0;
}

export function updateMenu() {
  const entity = getFocusedEntity();

  if (!entity) {
    resetMenu();
    return;
  }

  if (entity !== currentEntity) {
    currentEntity = entity;
    currentIndex = 0;
  }
}

export function useMenu(
  options: MenuOption[],
  menu: Omit<Menu, "options" | "node">
) {
  registeredMenus.set(getCurrentNode().entity, {
    ...menu,
    options,
    node: getCurrentNode(),
  });
  return menuControls;
}

const menuControls = {
  selectNext() {
    if (!currentEntity) {
      return;
    }
    const currentMenu = registeredMenus.get(currentEntity);

    if (!currentMenu) {
      return;
    }

    if (++currentIndex >= currentMenu.options.length) {
      currentIndex = 0;
    }
    game.playSoundFrontend(-1, "NAV_UP_DOWN", "HUD_FREEMODE_SOUNDSET", true);
  },

  selectPrevious() {
    if (!currentEntity) {
      return;
    }
    const currentMenu = registeredMenus.get(currentEntity);

    if (!currentMenu) {
      return;
    }

    if (--currentIndex < 0) {
      currentIndex = currentMenu.options.length - 1;
    }
    game.playSoundFrontend(-1, "NAV_UP_DOWN", "HUD_FREEMODE_SOUNDSET", true);
  },

  currentIndex() {
    if (getFocusedEntity() !== getCurrentNode().entity) {
      return -1;
    }
    return currentIndex;
  },

  get options() {
    return registeredMenus.get(getCurrentNode().entity)!.options;
  },

  get isActive() {
    return getFocusedEntity() === getCurrentNode().entity;
  },
};

const defaultKeys = {
  0: "V	BACK",
  1: "MOUSE RIGHT	RIGHT STICK",
  2: "MOUSE DOWN	RIGHT STICK",
  3: "(NONE)	RIGHT STICK",
  4: "MOUSE DOWN	RIGHT STICK",
  5: "(NONE)	RIGHT STICK",
  6: "MOUSE RIGHT	RIGHT STICK",
  7: "(NONE)	R3",
  8: "S	LEFT STICK",
  9: "D	LEFT STICK",
  10: "PAGEUP	LT",
  11: "PAGEDOWN	RT",
  12: "MOUSE DOWN	RIGHT STICK",
  13: "MOUSE RIGHT	RIGHT STICK",
  14: "SCROLLWHEEL DOWN	DPAD RIGHT",
  15: "SCROLLWHEEL UP	DPAD LEFT",
  16: "SCROLLWHEEL DOWN	(NONE)",
  17: "SCROLLWHEEL UP	(NONE)",
  18: "ENTER / LEFT MOUSE BUTTON / SPACEBAR	A",
  19: "LEFT ALT	DPAD DOWN",
  20: "Z	DPAD DOWN",
  21: "LEFT SHIFT	A",
  22: "SPACEBAR	X",
  23: "F	Y",
  24: "LEFT MOUSE BUTTON	RT",
  25: "RIGHT MOUSE BUTTON	LT",
  26: "C	R3",
  27: "ARROW UP / SCROLLWHEEL BUTTON (PRESS)	DPAD UP",
  28: "(NONE)	L3",
  29: "B	R3",
  30: "D	LEFT STICK",
  31: "S	LEFT STICK",
  32: "W	LEFT STICK",
  33: "S	LEFT STICK",
  34: "A	LEFT STICK",
  35: "D	LEFT STICK",
  36: "LEFT CTRL	L3",
  37: "TAB	LB",
  38: "E	LB",
  39: "[	LEFT STICK",
  40: "]	LEFT STICK",
  41: "[	LEFT STICK",
  42: "]	DPAD UP",
  43: "[	DPAD DOWN",
  44: "Q	RB",
  45: "R	B",
  46: "E	DPAD RIGHT",
  47: "G	DPAD LEFT",
  48: "Z	DPAD DOWN",
  49: "F	Y",
  50: "SCROLLWHEEL DOWN	R3",
  51: "E	DPAD RIGHT",
  52: "Q	DPAD LEFT",
  53: "(NONE)	Y",
  54: "E	DPAD RIGHT",
  55: "SPACEBAR	RB",
  56: "F9	Y",
  57: "F10	B",
  58: "G	DPAD LEFT",
  59: "D	LEFT STICK",
  60: "LEFT CTRL	LEFT STICK",
  61: "LEFT SHIFT	LEFT STICK",
  62: "LEFT CTRL	LEFT STICK",
  63: "A	LEFT STICK",
  64: "D	LEFT STICK",
  65: "(NONE)	(NONE)",
  66: "MOUSE RIGHT	RIGHT STICK",
  67: "MOUSE DOWN	RIGHT STICK",
  68: "RIGHT MOUSE BUTTON	LB",
  69: "LEFT MOUSE BUTTON	RB",
  70: "RIGHT MOUSE BUTTON	A",
  71: "W	RT",
  72: "S	LT",
  73: "X	A",
  74: "H	DPAD RIGHT",
  75: "F	Y",
  76: "SPACEBAR	RB",
  77: "W	LT",
  78: "S	RT",
  79: "C	R3",
  80: "R	B",
  81: ".	(NONE)",
  82: ",	(NONE)",
  83: "=	(NONE)",
  84: "-	(NONE)",
  85: "Q	DPAD LEFT",
  86: "E	L3",
  87: "W	RT",
  88: "S	LT",
  89: "A	LB",
  90: "D	RB",
  91: "RIGHT MOUSE BUTTON	LT",
  92: "LEFT MOUSE BUTTON	RT",
  93: "(NONE)	R3",
  94: "(NONE)	(NONE)",
  95: "MOUSE DOWN	RIGHT STICK",
  96: "NUMPAD- / SCROLLWHEEL UP	(NONE)",
  97: "NUMPAD+ / SCROLLWHEEL DOWN	(NONE)",
  98: "MOUSE RIGHT	RIGHT STICK",
  99: "SCROLLWHEEL UP	X",
  100: "[	(NONE)",
  101: "H	DPAD RIGHT",
  102: "SPACEBAR	RB",
  103: "E	DPAD RIGHT",
  104: "H	DPAD RIGHT",
  105: "X	A",
  106: "LEFT MOUSE BUTTON	(NONE)",
  107: "NUMPAD 6	LEFT STICK",
  108: "NUMPAD 4	LEFT STICK",
  109: "NUMPAD 6	LEFT STICK",
  110: "NUMPAD 5	LEFT STICK",
  111: "NUMPAD 8	LEFT STICK",
  112: "NUMPAD 5	LEFT STICK",
  113: "G	L3",
  114: "RIGHT MOUSE BUTTON	A",
  115: "SCROLLWHEEL UP	DPAD LEFT",
  116: "[	(NONE)",
  117: "NUMPAD 7	LB",
  118: "NUMPAD 9	RB",
  119: "E	DPAD RIGHT",
  120: "X	A",
  121: "INSERT	R3",
  122: "LEFT MOUSE BUTTON	(NONE)",
  123: "NUMPAD 6	LEFT STICK",
  124: "NUMPAD 4	LEFT STICK",
  125: "NUMPAD 6	LEFT STICK",
  126: "NUMPAD 5	LEFT STICK",
  127: "NUMPAD 8	LEFT STICK",
  128: "NUMPAD 5	LEFT STICK",
  129: "W	RT",
  130: "S	LT",
  131: "LEFT SHIFT	X",
  132: "LEFT CTRL	A",
  133: "A	LB",
  134: "D	RB",
  135: "LEFT MOUSE BUTTON	(NONE)",
  136: "W	A",
  137: "CAPSLOCK	A",
  138: "Q	LT",
  139: "S	RT",
  140: "R	B",
  141: "Q	A",
  142: "LEFT MOUSE BUTTON	RT",
  143: "SPACEBAR	X",
  144: "F / LEFT MOUSE BUTTON	Y",
  145: "F	Y",
  146: "D	LEFT STICK",
  147: "A	LEFT STICK",
  148: "D	LEFT STICK",
  149: "S	LEFT STICK",
  150: "W	LEFT STICK",
  151: "S	LEFT STICK",
  152: "Q	LB",
  153: "E	RB",
  154: "X	A",
  155: "LEFT SHIFT	(NONE)",
  156: "(NONE)	(NONE)",
  157: "1	(NONE)",
  158: "2	(NONE)",
  159: "6	(NONE)",
  160: "3	(NONE)",
  161: "7	(NONE)",
  162: "8	(NONE)",
  163: "9	(NONE)",
  164: "4	(NONE)",
  165: "5	(NONE)",
  166: "F5	(NONE)",
  167: "F6	(NONE)",
  168: "F7	(NONE)",
  169: "F8 (CONSOLE)	(NONE)",
  170: "F3	B",
  171: "CAPSLOCK	(NONE)",
  172: "ARROW UP	DPAD UP",
  173: "ARROW DOWN	DPAD DOWN",
  174: "ARROW LEFT	DPAD LEFT",
  175: "ARROW RIGHT	DPAD RIGHT",
  176: "ENTER / LEFT MOUSE BUTTON	A",
  177: "BACKSPACE / ESC / RIGHT MOUSE BUTTON	B",
  178: "DELETE	Y",
  179: "SPACEBAR	X",
  180: "SCROLLWHEEL DOWN	(NONE)",
  181: "SCROLLWHEEL UP	(NONE)",
  182: "L	RT",
  183: "G	RB",
  184: "E	R3",
  185: "F	LB",
  186: "X	L3",
  187: "ARROW DOWN	DPAD DOWN",
  188: "ARROW UP	DPAD UP",
  189: "ARROW LEFT	DPAD LEFT",
  190: "ARROW RIGHT	DPAD RIGHT",
  191: "ENTER	A",
  192: "TAB	Y",
  193: "(NONE)	X",
  194: "BACKSPACE	B",
  195: "D	LEFT STICK",
  196: "S	LEFT STICK",
  197: "]	RIGHT STICK",
  198: "SCROLLWHEEL DOWN	RIGHT STICK",
  199: "P	START",
  200: "ESC	(NONE)",
  201: "ENTER / NUMPAD ENTER	A",
  202: "BACKSPACE / ESC	B",
  203: "SPACEBAR	X",
  204: "TAB	Y",
  205: "Q	LB",
  206: "E	RB",
  207: "PAGE DOWN	LT",
  208: "PAGE UP	RT",
  209: "LEFT SHIFT	L3",
  210: "LEFT CONTROL	R3",
  211: "TAB	RB",
  212: "HOME	BACK",
  213: "HOME	RB",
  214: "DELETE	X",
  215: "ENTER	A",
  216: "SPACEBAR	X",
  217: "CAPSLOCK	BACK",
  218: "D	LEFT STICK",
  219: "S	LEFT STICK",
  220: "MOUSE RIGHT	RIGHT STICK",
  221: "MOUSE DOWN	RIGHT STICK",
  222: "RIGHT MOUSE BUTTON	Y",
  223: "LEFT MOUSE BUTTON	A",
  224: "LEFT CTRL	X",
  225: "RIGHT MOUSE BUTTON	B",
  226: "(NONE)	LB",
  227: "(NONE)	RB",
  228: "(NONE)	LT",
  229: "LEFT MOUSE BUTTON	RT",
  230: "(NONE)	L3",
  231: "(NONE)	R3",
  232: "W	DPAD UP",
  233: "S	DPAD DOWN",
  234: "A	DPAD LEFT",
  235: "D	DPAD RIGHT",
  236: "V	BACK",
  237: "LEFT MOUSE BUTTON	(NONE)",
  238: "RIGHT MOUSE BUTTON	(NONE)",
  239: "(NONE)	(NONE)",
  240: "(NONE)	(NONE)",
  241: "SCROLLWHEEL UP	(NONE)",
  242: "SCROLLWHEEL DOWN	(NONE)",
  243: "~ / `	(NONE)",
  244: "M	BACK",
  245: "T	(NONE)",
  246: "Y	(NONE)",
  247: "(NONE)	(NONE)",
  248: "(NONE)	(NONE)",
  249: "N	(NONE)",
  250: "R	L3",
  251: "F	R3",
  252: "X	LT",
  253: "C	RT",
  254: "LEFT SHIFT	(NONE)",
  255: "SPACEBAR	A",
  256: "DELETE	X",
  257: "LEFT MOUSE BUTTON	RT",
  258: "(NONE)	A",
  259: "(NONE)	X",
  260: "(NONE)	RT",
  261: "SCROLLWHEEL UP	DPAD LEFT",
  262: "SCROLLWHEEL DOWN	DPAD RIGHT",
  263: "R	B",
  264: "Q	A",
  265: "(NONE)	(NONE)",
  266: "D	LEFT STICK",
  267: "D	LEFT STICK",
  268: "S	LEFT STICK",
  269: "S	LEFT STICK",
  270: "MOUSE RIGHT	RIGHT STICK",
  271: "MOUSE RIGHT	RIGHT STICK",
  272: "MOUSE DOWN	RIGHT STICK",
  273: "MOUSE DOWN	RIGHT STICK",
  274: "[	RIGHT STICK",
  275: "[	RIGHT STICK",
  276: "[	LEFT STICK",
  277: "[	LEFT STICK",
  278: "D	LEFT STICK",
  279: "D	LEFT STICK",
  280: "LEFT CTRL	LEFT STICK",
  281: "LEFT CTRL	LEFT STICK",
  282: "MOUSE RIGHT	RIGHT STICK",
  283: "MOUSE RIGHT	RIGHT STICK",
  284: "MOUSE RIGHT	RIGHT STICK",
  285: "MOUSE RIGHT	RIGHT STICK",
  286: "MOUSE RIGHT	RIGHT STICK",
  287: "MOUSE RIGHT	RIGHT STICK",
  288: "F1	A",
  289: "F2	X",
  290: "MOUSE RIGHT	RIGHT STICK",
  291: "MOUSE DOWN	RIGHT STICK",
  292: "(NONE)	RIGHT STICK",
  293: "(NONE)	RIGHT STICK",
  294: "(NONE)	RIGHT STICK",
  295: "(NONE)	RIGHT STICK",
  296: "DELETE	X",
  297: "DELETE	Y",
  298: "SPACEBAR	A",
  299: "ARROW DOWN	LB",
  300: "ARROW UP	RB",
  301: "M	A",
  302: "S	(NONE)",
  303: "U	DPAD UP",
  304: "H	R3",
  305: "B	(NONE)",
  306: "N	(NONE)",
  307: "ARROW RIGHT	DPAD RIGHT",
  308: "ARROW LEFT	DPAD LEFT",
  309: "T	DPAD DOWN",
  310: "R	BACK",
  311: "K	DPAD DOWN",
  312: "[	DPAD LEFT",
  313: "]	DPAD RIGHT",
  314: "NUMPAD +	RB",
  315: "NUMPAD -	LB",
  316: "PAGE UP	(NONE)",
  317: "PAGE DOWN	(NONE)",
  318: "F5	START",
  319: "C	(NONE)",
  320: "V	(NONE)",
  321: "SPACEBAR	(NONE)",
  322: "ESC	(NONE)",
  323: "X	(NONE)",
  324: "C	(NONE)",
  325: "V	(NONE)",
  326: "LEFT CTRL	(NONE)",
  327: "F5	(NONE)",
  328: "SPACEBAR	RT",
  329: "LEFT MOUSE BUTTON	(NONE)",
  330: "RIGHT MOUSE BUTTON	(NONE)",
  331: "RIGHT MOUSE BUTTON	(NONE)",
  332: "MOUSE DOWN	RIGHT STICK",
  333: "MOUSE RIGHT	RIGHT STICK",
  334: "SCROLLWHEEL DOWN	LEFT STICK",
  335: "SCROLLWHEEL UP	LEFT STICK",
  336: "SCROLLWHEEL DOWN	LEFT STICK",
  337: "X	A",
  338: "A	LEFT STICK",
  339: "D	LEFT STICK",
  340: "LEFT SHIFT	LEFT STICK",
  341: "LEFT CTRL	LEFT STICK",
  342: "D	LEFT STICK",
  343: "LEFT CTRL	LEFT STICK",
  344: "F11	DPAD RIGHT",
  345: "X	A",
  346: "LEFT MOUSE BUTTON	LB",
  347: "RIGHT MOUSE BUTTON	RB",
  348: "SCROLLWHEEL BUTTON (PRESS)	Y",
  349: "TAB	X",
  350: "E	L3",
  351: "E	L3",
  352: "LEFT SHIFT	L3",
  353: "SPACEBAR	A",
  354: "X	A",
  355: "E	DPAD RIGHT",
  356: "E	DPAD RIGHT",
  357: "X	A",
  358: "	RB",
  359: "",
  360: "",
};

const controls = Object.values(Control).filter((c) => typeof c === "string");

let arr = [];

for (const control of controls) {
  arr.push({
    control,
    default: defaultKeys[Control[control as keyof typeof Control]],
    string: game.getControlInstructionalButtonsString(
      ControlType.PLAYER_CONTROL,
      Control[control as keyof typeof Control],
      false
    ),
  });
}

let chunk_size = 30;

for (let i = 0; i < arr.length; i += chunk_size) {
  alt.log(JSON.stringify(arr.slice(i, i + chunk_size)));
}

alt.everyTick(() => {
  if (!currentEntity) {
    return;
  }

  const currentMenu = registeredMenus.get(currentEntity);

  if (!currentMenu) {
    return;
  }

  if (!currentMenu.node.isVisible) {
    return;
  }

  game.disableControlAction(
    ControlType.PLAYER_CONTROL,
    Control.INPUT_ATTACK,
    true
  );

  if (
    game.isControlJustPressed(
      ControlType.PLAYER_CONTROL,
      Control.INPUT_WEAPON_WHEEL_PREV
    )
  ) {
    menuControls.selectPrevious();
  } else if (
    game.isControlJustPressed(
      ControlType.PLAYER_CONTROL,
      Control.INPUT_WEAPON_WHEEL_NEXT
    )
  ) {
    menuControls.selectNext();
  } else if (
    game.isDisabledControlJustPressed(
      ControlType.PLAYER_CONTROL,
      Control.INPUT_ATTACK
    )
  ) {
    game.playSoundFrontend(-1, "SELECT", "HUD_FREEMODE_SOUNDSET", true);
    currentMenu.onSelect(currentMenu.options[currentIndex]);
  }
});
