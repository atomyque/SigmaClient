import Dungeons from "./utils/Dungeons"
import { guiPiece } from "../gui/draggableGuis"
import { Module } from "../gui/ClickGui"
import { chat, colors } from "./utils/utils"

const cleanTerm = new Module("Dungeons", "Clean Terms")
     .addSlider("Main Text Color", 10, 0, colors.length - 1)
     .addSlider("Subtitle Color", 10, 0, colors.length - 1)
     .addSwitch("Disable Titles", false)
     .addButton("Move Hud", () => {
          guiPiece.gui.open()
          termcounter.edit()
     })

register("packetReceived", (packet, event) => {
     if (!Dungeons.inp3 || !cleanTerm.switches["Disable Titles"] || !cleanTerm.toggled || !packet) return
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
          termcounter.text["text"].text = "&d" + stage[1] + "/" + stage[2]

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

register("renderOverlay", () => {
     Renderer.color(255, 0, 0, 255)
     Renderer.colorize(255, 255, 0, 255)

     Renderer.drawString("azezaeaz", 100, 100)
})

function hsvToRgb(h, s, v) {
     let r, g, b

     s = Math.max(0, Math.min(1, s))
     v = Math.max(0, Math.min(1, v))
     h = h % 360
     if (h < 0) h += 360

     if (s === 0) {
          r = g = b = v // gray
     } else {
          const hPrime = h / 60
          const i = Math.floor(hPrime)
          const f = hPrime - i
          const p = v * (1 - s)
          const q = v * (1 - s * f)
          const t = v * (1 - s * (1 - f))

          switch (i) {
               case 0:
                    r = v
                    g = t
                    b = p
                    break
               case 1:
                    r = q
                    g = v
                    b = p
                    break
               case 2:
                    r = p
                    g = v
                    b = t
                    break
               case 3:
                    r = p
                    g = q
                    b = v
                    break
               case 4:
                    r = t
                    g = p
                    b = v
                    break
               case 5:
                    r = v
                    g = p
                    b = q
                    break
          }
     }

     return {
          r: Math.round(r * 255),
          g: Math.round(g * 255),
          b: Math.round(b * 255)
     }
}

register("renderOverlay", () => {
     // Renderer.
})

let colorse = []

function drawHue() {
     for (let i = 0; i <= 360; i++) {
          // chat(i)

          // chat(i)
          const { r, g, b } = hsvToRgb(i, 1, 1)
          colorse[i] = { r, g, b }
          // Renderer.drawRect(Renderer.color(r, g, b, 255), 100 + i, 100, 0.5, 20)
     }
}

drawHue()

function drawGradient(x, y, width, height, topleft, topright, buttomleft, bottomright) {}
