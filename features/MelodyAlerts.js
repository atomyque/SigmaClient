import { gui, Module } from "../gui/ClickGui"
import { guiPiece } from "../gui/draggableGuis"
import Dungeons from "./utils/Dungeons"
import { playSound } from "./utils/utils"

// .addSwitch("Play sound", true) will do if I remeber

const melodyAlerts = new Module("Dungeons", "Melody Alerts", "Shows an alert on your screen when a player gets the melody terminal.")
     .addSwitch("Play Sound", true)
     .addColor("Hud Color", 0, 0, 0, 255, false)
     .addButton("Move Hud", () => {
          melodyHud.edit()
          guiPiece.gui.open()
     })
const melodyHud = new guiPiece("Melody hud", Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() - 100, 1).addText("text", `Player has Melody`, 0, 0, 2, true, true)

function refreshcolors() {
     melodyHud.text["text"].r = melodyAlerts.color["Hud Color"].r
     melodyHud.text["text"].g = melodyAlerts.color["Hud Color"].g
     melodyHud.text["text"].b = melodyAlerts.color["Hud Color"].b
     melodyHud.text["text"].alpha = melodyAlerts.color["Hud Color"].alpha
}

// register("chat", () => ).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")
register("chat", () => melodyHud.dontdraw()).setCriteria("[BOSS] Goldor: There is no stopping me down there!")
register("tick", () => {
     if (!gui.isOpen) return
     refreshcolors()
})

register("worldLoad", () => {
     setTimeout(() => {
          refreshcolors()
     }, 1)
})

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

     const username = player.replace(/\[.*?\]\s*/, "").trim()
     if (message.includes("(")) return
     const stage = message.match(/(\d+)\/4/)

     if (stage) {
          if (stage > 4) return
          if (melodyAlerts.switches["Play Sound"]) playSound("random.orb", 1, 2)
          melodyHud.draw()
          melodyHud.text["text"].text = username + " has " + stage[1] + "/4 melody"

          setTimeout(() => {
               if (melodyHud.text["text"].text != username + " has " + stage[1] + "/4 melody") return
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

     const username = player.replace(/\[.*?\]\s*/, "").trim()
     const stage = message.match(/(\d+)%/)
     if (stage) {
          if (stage[1] > 100) return
          if (melodyAlerts.switches["Play Sound"]) playSound("random.orb", 1, 2)
          melodyHud.draw()
          melodyHud.text["text"].text = username + " has " + (stage[1] / 25).toFixed(0) + "/4 melody"

          setTimeout(() => {
               if (melodyHud.text["text"].text != username + " has " + (stage[1] / 25).toFixed(0) + "/4 melody") return
               melodyHud.dontdraw()
          }, 5000)
          return
     }
})
     .setCriteria("Party > ${player}: ${message}")
     .setContains()
