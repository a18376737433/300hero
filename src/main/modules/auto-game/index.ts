import GameEvent from "@/modules/auto-game/utlis/game-event";
import { useLogin, useHall, useZc } from "@/modules/auto-game/modules";
let game = new GameEvent();
game.on("dl", useLogin);
game.on("dt", useHall);
game.on("zc", useZc);
export default game;
