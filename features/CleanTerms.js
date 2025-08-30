import Dungeons from "./utils/Dungeons"
import { guiPiece } from "../gui/draggableGuis"
import { gui, Module } from "../gui/ClickGui"
import { colors } from "./utils/utils"

const cleanTerm = new Module("Dungeons", "Clean Terms")
     .addSwitch("Disable Titles", false)
     .addColor("Main Color", 0, 245, 0, 255, true)
     .addColor("Subtitle Color", 0, 170, 0, 255, true)
     .addButton("Move Hud", () => {
          guiPiece.gui.open()
          termcounter.edit()
     })

register("packetReceived", (packet, event) => {
     if (!Dungeons.inp3 || !cleanTerm.switches["Disable Titles"] || !cleanTerm.toggled) return
     if (packet.func_179807_a().toString() !== "TITLE") return

     cancel(event)
}).setFilteredClass(net.minecraft.network.play.server.S45PacketTitle)

let first = false
let action = ""

const termcounter = new guiPiece("Term Counter", Renderer.screen.getWidth() / 2, 100, 1).addText("text", "6/7", 1, 0, 2, true, true, 0, 245, 0, 255).addText("subtext", "dev", 1, 12, 1, true, true, 0, 170, 0, 255)

function refreshcolors() {
     termcounter.text["text"].r = cleanTerm.color["Main Color"].r
     termcounter.text["text"].g = cleanTerm.color["Main Color"].g
     termcounter.text["text"].b = cleanTerm.color["Main Color"].b
     termcounter.text["text"].alpha = cleanTerm.color["Main Color"].alpha

     termcounter.text["subtext"].r = cleanTerm.color["Subtitle Color"].r
     termcounter.text["subtext"].g = cleanTerm.color["Subtitle Color"].g
     termcounter.text["subtext"].b = cleanTerm.color["Subtitle Color"].b
     termcounter.text["subtext"].alpha = cleanTerm.color["Subtitle Color"].alpha
}

register("tick", () => {
     if (!gui.isOpen()) return
     refreshcolors()
})
register("worldLoad", () => {
     refreshcolors()
})

register("chat", () => {
     termcounter.text["text"].text = 0 + "/" + 7
     termcounter.text["subtext"].text = ""
     termcounter.draw()
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")

register("chat", message => {
     if (!Dungeons.inp3 || !cleanTerm.toggled) {
          termcounter.dontdraw()
          return
     }

     const stage = message.match(/\((\d+)\/(\d+)\)/)

     if (stage) {
          if (message.includes("term")) {
               termcounter.text["subtext"].text = "term"
          }
          if (message.includes("dev")) {
               termcounter.text["subtext"].text = "dev"
          }
          if (message.includes("lever")) {
               termcounter.text["subtext"].text = "lever"
          }

          first = false
          termcounterHudActive = true
          termcounter.text["text"].text = stage[1] + "/" + stage[2]

          if (stage[1] == stage[2]) {
               setTimeout(() => {
                    World.playSound("mob.cat.meow", 100, 5)
                    if (Dungeons.whats == 5) {
                         termcounterHudActive = false
                         return
                    }
                    if (Dungeons.whats == 2) termcounter.text["text"].text = 0 + "/" + 8
                    if (Dungeons.whats != 2) termcounter.text["text"].text = 0 + "/" + 7
               }, 10)
          }
     }
})
     .setCriteria("${message}")
     .setContains()
