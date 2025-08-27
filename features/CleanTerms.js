import Dungeons from "./utils/Dungeons"
import { guiPiece } from "../gui/draggableGuis"
import { Module } from "../gui/ClickGui"
import { colors } from "./utils/utils"

const cleanTerm = new Module("Dungeons", "Clean Terms")
     .addSlider("Main Text Color", 10, 0, colors.length - 1)
     .addColor("test", 255, 255, 0, 255, true)
     .addSlider("Subtitle Color", 10, 0, colors.length - 1)
     .addSwitch("Disable Titles", false)
     .addColor("Main Coloreee", 100, 100, 100, 255, false)
     .addButton("Move Hud", () => {
          guiPiece.gui.open()
          termcounter.edit()
     })

register("packetReceived", (packet, event) => {
     if (!Dungeons.inp3 || !cleanTerm.switches["Disable Titles"] || !cleanTerm.toggled) return
     if (packet.func_179807_a() !== "TITLE") return
     if (!packet.func_179805_b().getText().includes("/")) return
     cancel(event)
}).setFilteredClass(net.minecraft.network.play.server.S45PacketTitle)

let first = false
let action = ""

const termcounter = new guiPiece("Term Counter", Renderer.screen.getWidth() / 2, 100, 1).addText("text", "6/7", 1, 0, 2, true, true).addText("subtext", "dev", 1, 12, 1, true, true)

register("chat", () => {
     const maincolor = colors[cleanTerm.sliders["Main Text Color"].value.toFixed(0)]

     termcounter.text["text"].text = maincolor + 0 + "/" + 7
     termcounter.text["subtext"].text = ""
     termcounter.draw()
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")

register("tick", () => {
     const maincolor = colors[cleanTerm.sliders["Main Text Color"].value.toFixed(0)]
     const subcolor = colors[cleanTerm.sliders["Subtitle Color"].value.toFixed(0)]

     termcounter.text["text"].text = maincolor + termcounter.text["text"].text.slice(2)
     termcounter.text["subtext"].text = subcolor + termcounter.text["subtext"].text.slice(2)
})
register("chat", message => {
     if (!Dungeons.inp3 || !cleanTerm.toggled) {
          termcounter.dontdraw()
          return
     }

     const stage = message.match(/\((\d+)\/(\d+)\)/)

     if (stage) {
          const maincolor = colors[cleanTerm.sliders["Main Text Color"].value.toFixed(0)]
          const subcolor = colors[cleanTerm.sliders["Subtitle Color"].value.toFixed(0)]

          if (message.includes("term")) {
               termcounter.text["subtext"].text = subcolor + "term"
          }
          if (message.includes("dev")) {
               termcounter.text["subtext"].text = subcolor + "dev"
          }
          if (message.includes("lever")) {
               termcounter.text["subtext"].text = subcolor + "lever"
          }

          first = false
          termcounterHudActive = true
          termcounter.text["text"].text = maincolor + stage[1] + "/" + stage[2]

          if (stage[1] == stage[2]) {
               setTimeout(() => {
                    World.playSound("mob.cat.meow", 100, 5)
                    if (Dungeons.whats == 5) {
                         termcounterHudActive = false
                         return
                    }
                    if (Dungeons.whats == 2) termcounter.text["text"].text = maincolor + 0 + "/" + 8
                    if (Dungeons.whats != 2) termcounter.text["text"].text = maincolor + 0 + "/" + 7
               }, 10)
          }
     }
})
     .setCriteria("${message}")
     .setContains()
