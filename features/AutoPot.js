import { Module } from "../gui/ClickGui"

const autoPot = new Module("Dungeons", "Auto Potion", "Opens potion bag at the start of the run.")

register("chat", () => {
     if (!autoPot.toggled) return
     ChatLib.command("potionbag")
}).setCriteria("You are not allowed to use Potion Effects while in Dungeon, therefore all active effects have been paused and stored. They will be restored when you leave Dungeon!")
