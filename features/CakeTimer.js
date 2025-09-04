import { Module } from "../gui/ClickGui"
import { guiPiece } from "../gui/draggableGuis"
import { sigmadata } from "./Pog"

const CakeTimerModule = new Module("Skyblock", "Cake Timer", "Shows in how much time the cakes will take to refresh.").addSwitch("Only Show When Ready", false).addButton("Move Hud", () => {
     CakeTimer.edit()
     guiPiece.gui.open()
})
const CakeTimer = new guiPiece("Cake Timer", 100, 100, 1).addItem("item", "minecraft:cake", 0, 0, 1).addText("text", "&c1d19h", 20, 16 / 2, 1, false)

register("chat", () => {
     sigmadata.lastcake = Date.now()
     sigmadata.save()
}).setCriteria("Yum! You gain ${cake} for 48 hours!")

register("chat", () => {
     sigmadata.lastcake = Date.now()
     sigmadata.save()
}).setCriteria("Big Yum! You refresh ${cake} for 48 hours!")

register("step", () => {
     if (CakeTimerModule.toggled) CakeTimer.draw()
     else CakeTimer.dontdraw()

     //  ChatLib.chat(sigmadata.lastcake)
     const h = 60 * 60 * 1000
     const days2 = Date.now()
     const cakeday = sigmadata.lastcake
     const days = 2 - (days2 - cakeday) / h
     if (2 - (days2 - cakeday) / h < 0) return (CakeTimer.text["text"].text = "&aCakes Ready!")
     if (CakeTimerModule.switches["Only Show When Ready"]) return CakeTimer.dontdraw()
     CakeTimer.text["text"].text = `&c${Math.floor(days)}d${Math.floor(days * 24 - Math.floor(days) * 24 + 1)}h`
}).setFps(1)
