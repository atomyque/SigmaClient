import { Module } from "../gui/ClickGui"
import { guiPiece } from "../gui/draggableGuis"
import Dungeons from "./utils/Dungeons"
import { chat, colors } from "./utils/utils"

// .addSwitch("Play sound", true) will do if I remeber

const melodyAlerts = new Module("Dungeons", "Melody Alerts").addSlider("Color", 10, 0, colors.length - 1).addButton("Move Hud", () => {
     melodyHud.edit()
     guiPiece.gui.open()
})
const melodyHud = new guiPiece("Melody hud", Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() - 100, 1).addText("text", `${colors[melodyAlerts.sliders["Color"].value.toFixed(0)]}Player has Melody`, 0, 0, 2, true, true)

// register("chat", () => ).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")
register("chat", () => melodyHud.dontdraw()).setCriteria("[BOSS] Goldor: There is no stopping me down there!")
//prettier-ignore
register("chat", (message) => {
     if (!Dungeons.inp3) return
     const stage = message.match(/\((\d+)\/(\d+)\)/)
          
          if (stage){
               if (stage[1] == stage[2]) melodyHud.dontdraw()

          }
     }
)
     .setCriteria("${message}")
     .setContains()

register("chat", (player, message) => {
     if (!Dungeons.inp3 || !melodyAlerts.toggled) {
          melodyHud.dontdraw()
          return
     }

     const color = colors[melodyAlerts.sliders["Color"].value.toFixed(0)]
     const username = player.replace(/\[.*?\]\s*/, "").trim()
     if (message.includes("(")) return
     const stage = message.match(/(\d+)\/4/)

     if (stage) {
          if (stage > 4) return
          //   World.playSound("random.orb", 1, 2)
          melodyHud.draw()
          melodyHud.text["text"].text = color + username + " has " + stage[1] + "/4 melody"

          setTimeout(() => {
               if (melodyHud.text["text"].text != color + username + " has " + stage[1] + "/4 melody") return
               melodyHud.dontdraw()
          }, 5000)
          return
     }
})
     .setCriteria("Party > ${player}: ${message}")
     .setContains()

register("chat", (player, message) => {
     if (!Dungeons.inp3 || !melodyAlerts.toggled) {
          melodyHud.dontdraw()
          return
     }

     const color = colors[melodyAlerts.sliders["Color"].value.toFixed(0)]
     const username = player.replace(/\[.*?\]\s*/, "").trim()
     const stage = message.match(/(\d+)%/)
     if (stage) {
          if (stage[1] > 100) return
          //   World.playSound("random.orb", 1, 2)
          melodyHud.draw()
          melodyHud.text["text"].text = color + username + " has " + (stage[1] / 25).toFixed(0) + "/4 melody"

          setTimeout(() => {
               if (melodyHud.text["text"].text != color + username + " has " + (stage[1] / 25).toFixed(0) + "/4 melody") return
               melodyHud.dontdraw()
          }, 5000)
          return
     }
})
     .setCriteria("Party > ${player}: ${message}")
     .setContains()
