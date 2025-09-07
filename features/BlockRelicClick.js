import { Module } from "../gui/ClickGui"
import Dungeons from "./utils/Dungeons"

const blockWrongClick = new Module("Dungeons", "Block Wrong Relic Clicks", "Blocks you from clicking the wrong relic.")

const relics = { Blue: { x: 59, y: 7, z: 44 }, Orange: { x: 57, y: 7, z: 42 }, Purple: { x: 54, y: 7, z: 41 }, Red: { x: 51, y: 7, z: 42 }, Green: { x: 49, y: 7, z: 44 } }
let pickeduprelick = ""
register("chat", (player, relic) => {
     if (player === Player.getName()) pickeduprelick = relic
}).setCriteria("${player} picked the Corrupted ${relic} Relic!")

register("playerInteract", (action, pos, event) => {
     if (!Dungeons.inp5 || pickeduprelick == "" || !blockWrongClick.toggled) return

     if (action.toString() == "RIGHT_CLICK_BLOCK") {
          Object.keys(relics).forEach(key => {
               const relic = relics[key]
               const lookinatrelic = relic.x == Player.lookingAt()?.getX() && relic.y == Player.lookingAt()?.getY() && relic.z == Player.lookingAt()?.getZ()
               //  && Player.getHeldItem()?.getID() === 397
               if (lookinatrelic && key.toString() !== pickeduprelick) {
                    cancel(event)
               }
          })
     }
})
register("worldUnload", () => {
     pickeduprelick = ""
     first = true
})
