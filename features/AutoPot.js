import { Module } from "../gui/ClickGui"

let bagopened = false

const autoPot = new Module("Dungeons", "Auto Potion", "Opens potion bag at the start of the run.")

function openPotionBag(player) {
     if (!autoPot.toggled || player !== Player.getName() || bagopened) return
     bagopened = true
     ChatLib.command("potionbag") // fuck you if you dont have a cookie
}

register("chat", player => {
     openPotionBag(player)
}).setCriteria("${player} is now ready!")

register("chat", () => {
     openPotionBag()
}).setCriteria("You are not allowed to use Potion Effects while in Dungeon, therefore all active effects have been paused and stored. They will be restored when you leave Dungeon!")

register("worldUnload", () => {
     bagopened = false
})
