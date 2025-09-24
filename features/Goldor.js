import Dungeons from "./utils/Dungeons"
import { guiPiece } from "../gui/draggableGuis"
import { gui, Module } from "../gui/ClickGui"
import { playSound, title } from "./utils/utils"

const cleanTerm = new Module("Dungeons", "Clean Terms", "Makes the terminal phase look cleaner with less information on your screen.")
     .addSwitch("Disable Titles", false)
     .addSwitch("Phase Completed Title", false)
     .addColor("Main Color", 0, 245, 0, 255, true)
     .addColor("Subtitle Color", 0, 170, 0, 255, true)
     .addColor("Phase Finished Title Color", 75, 255, 75, 255, true)
     .addButton("Move Hud", () => {
          guiPiece.gui.open()
          termcounter.edit()
     })

const pre4 = new Module("Dungeons", "Pre 4", "Chat alerts and titles having to do with i4 state")
     .addSwitch("Only Work On Berserk", false)
     .addSwitch("Pre 4 Complete Title", false)
     .addSwitch("Pre 4 Undone Title", false)
     .addSwitch("Send Pre 4 Complete In Chat", false)
     .addSwitch("Remind Pre 4 Undone In Chat", true)

register("packetReceived", (packet, event) => {
     if (!Dungeons.inp3 || !cleanTerm.switches["Disable Titles"] || !cleanTerm.toggled) return
     if (packet.func_179807_a().toString() !== "TITLE") return

     cancel(event)
}).setFilteredClass(net.minecraft.network.play.server.S45PacketTitle)

register("chat", () => {
     Dungeons.inp3 = false
     termcounter.dontdraw()
     if (!cleanTerm.toggled || !cleanTerm.switches["Phase Completed Title"]) return

     playSound("random.orb", 1, 1)
     phasefinished.register()

     setTimeout(() => {
          phasefinished.unregister()
     }, 750)
}).setCriteria("The Core entrance is opening!")

let first = false
let action = ""

const termcounter = new guiPiece("Term Counter", Renderer.screen.getWidth() / 2, 100, 1).addText("text", "6/7", 1, 0, 2, true, true, 0, 245, 0, 255).addText("subtext", "dev", 1, 12, 1, true, true, 0, 170, 0, 255)

const phasefinished = register("renderOverlay", () => {
     Renderer.retainTransforms(true)
     Renderer.scale(3, 3)
     Renderer.colorize(cleanTerm.color["Phase Finished Title Color"].r, cleanTerm.color["Phase Finished Title Color"].g, cleanTerm.color["Phase Finished Title Color"].b, cleanTerm.color["Phase Finished Title Color"].alpha)
     Renderer.drawString("Phase completed!", Renderer.screen.getWidth() / 2 / 3 - Renderer.getStringWidth("Phase completed!") / 2, Renderer.screen.getHeight() / 2 / 3 - 15, true)
     Renderer.scale(1, 1)
     Renderer.retainTransforms(false)
}).unregister()

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
     gateBlown = false
     isphasefinished = false
})

register("chat", () => {
     termcounter.text["text"].text = 0 + "/" + 7
     termcounter.text["subtext"].text = ""
     gateBlown = false
     isphasefinished = false
     i4done = false
     if (!cleanTerm.toggled) return
     termcounter.draw()
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")
let gateBlown = false
let isphasefinished = false
register("chat", message => {
     if (!Dungeons.inp3 || !cleanTerm.toggled) {
          termcounter.dontdraw()
          phasefinished.unregister()
     }
     if (message == "The gate has been destroyed!") {
          termcounter.text["subtext"].text = "boom"
          gateBlown = true
          if (!isphasefinished) return
          if (this.whats == 2) termcounter.text["text"].text = 0 + "/" + 8
          else termcounter.text["text"].text = 0 + "/" + 7
          isphasefinished = false
          gateBlown = false
          if (Dungeons.whats == 4) {
               if (i4done) return
               termcounter.text["text"].text = 1 + "/" + 7
               if (Dungeons.getPlayerClass(Player.getName()) != "Berserk" && pre4.switches["Only Work On Berserk"]) return
               if (pre4.switches["Remind Pre 4 Undone In Chat"]) ChatLib.command("pc [Σ] Pre 4 Undone (reminder)")
               if (pre4.switches["Pre 4 Undone Title"])
                    setTimeout(() => {
                         title("&cPre 4 Undone", true, 0, 0, 0, "note.pling", 1, 0.5)
                    }, 750)
          }
          if (cleanTerm.switches["Phase Completed Title"]) {
               isphasefinished = false
               phasefinished.register()
               playSound("random.orb", 1, 1)
          }
          setTimeout(() => {
               phasefinished.unregister()
          }, 750)
     }

     const stage = message.match(/\((\d+)\/(\d+)\)/)

     if (!stage) return
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

     if (stage[1] != stage[2]) return
     isphasefinished = true
     setTimeout(() => {
          if (Dungeons.whats == 5) {
               termcounterHudActive = false
               return
          }
          if (Dungeons.whats == 2 && gateBlown) termcounter.text["text"].text = 0 + "/" + 8
          if (Dungeons.whats != 2 && gateBlown) termcounter.text["text"].text = 0 + "/" + 7
          if (Dungeons.whats == 4 && gateBlown && i4done) {
               termcounter.text["text"].text = 1 + "/" + 7
               if (Dungeons.getPlayerClass(Player.getName()) != "Berserk" && pre4.switches["Only Work On Berserk"]) return
               if (pre4.switches["Pre 4 Undone"])
                    setTimeout(() => {
                         title("&cPre 4 Undone", true, 0, 0, 0, "note.pling", 1, 0.5)
                    }, 750)
          }
          if (cleanTerm.switches["Phase Completed Title"] && gateBlown) {
               gateBlown = false
               isphasefinished = false

               phasefinished.register()
               playSound("random.orb", 1, 1)
          }
          setTimeout(() => {
               phasefinished.unregister()
          }, 750)
     }, 10)
})
     .setCriteria("${message}")
     .setContains()

let i4done = false

register("chat", (player, phase) => {
     if ((Dungeons.getPlayerClass(player) == "Berserk" && Dungeons.whats == 1) || (Dungeons.getPlayerClass(player) == "Berserk" && Dungeons.whats == 2 && phase == "7/7")) {
          i4done = true
          if (Dungeons.getPlayerClass(Player.getName()) != "Berserk" && pre4.switches["Only Work On Berserk"]) return
          if (pre4.switches["Send Pre 4 Complete In Chat"]) ChatLib.command("pc [Σ] Pre 4 Complete")
          if (pre4.switches["Pre 4 Complete Title"]) title("&aPre 4 Complete", true, 0, 0, 0, "random.orb", 1, 2)
     }
}).setCriteria("${player} completed a device! (${phase})")
