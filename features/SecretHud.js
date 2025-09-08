import { Module } from "../gui/ClickGui"
import { guiPiece } from "../gui/draggableGuis"
import Dungeons from "./utils/Dungeons"
const SecretDisplayModule = new Module("Dungeons", "Secret Hud", "Shows you how many secrets you have done in the room you are in.").addSelector("Style Selector", "SBA Style", "Plain Style").addButton("Move Display", () => {
     SecretHud.edit()
     guiPiece.gui.open()
     if (SecretDisplayModule.selectors["Style Selector"].value == "SBA Style") {
          SecretHud.text["bottomtext"].drawn = true
          SecretHud.text["toptext"].drawn = true
          SecretHud.item["item"].drawn = true
     }
     if (SecretDisplayModule.selectors["Style Selector"].value == "Plain Style") {
          SecretHud.text["bottomtext"].drawn = true
          SecretHud.text["toptext"].drawn = false
          SecretHud.item["item"].drawn = false
     }
     SecretHud.text["bottomtext"].text = `&a6&7/&a7`
})
const SecretHud = new guiPiece("Secret Hud", Renderer.screen.getWidth() / 2, 30, 1).addItem("item", "minecraft:chest", -38, -8, 1).addText("toptext", "&7Secrets", 0, -4.5, 1, true, true).addText("bottomtext", "&a67&7/&a7", 0, 5.5, 1, true, true)

register("actionBar", bar => {
     if (!Dungeons.inClear || !SecretDisplayModule.toggled) return SecretHud.dontdraw()
     SecretHud.draw()
     const completedSecrets = bar.match(/(\d+)\/\d+ Secrets/)?.[1] || ""
     const roomSecrets = bar.match(/\d+\/(\d+) Secrets/)?.[1] || ""

     const ratio = completedSecrets / roomSecrets

     //  ChatLib.chat(ratio)
     if (roomSecrets == "") return (SecretHud.text["bottomtext"].text = "&7None")
     const secretcolor = ratio >= 0.75 ? "&a" : ratio >= 0.25 ? "&e" : ratio < 0.25 && ratio > 0 ? "&e" : "&c"
     if (SecretDisplayModule.selectors["Style Selector"].value == "SBA Style") {
          SecretHud.text["bottomtext"].drawn = true
          SecretHud.text["toptext"].drawn = true
          SecretHud.item["item"].drawn = true
     }
     if (SecretDisplayModule.selectors["Style Selector"].value == "Plain Style") {
          SecretHud.text["bottomtext"].drawn = true
          SecretHud.text["toptext"].drawn = false
          SecretHud.item["item"].drawn = false
     }
     SecretHud.text["bottomtext"].text = `${secretcolor}${completedSecrets}&7/${secretcolor}${roomSecrets}`
}).setCriteria("${bar}")
