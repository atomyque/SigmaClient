import RenderLibV2 from "../../RenderLibV2"
import { Module } from "../gui/ClickGui"
import Dungeons from "./utils/Dungeons"
import { title } from "./utils/utils"

let lanterncord = {}
let animation = false
let clicks = 0
let first = false
let second = false
let ticks = 0
let canbreak = false
let devicedone = false

const SimonSays = new Module("Dungeons", "Simon Says", "Helps you with stuff related to simon says.")
     .addSwitch("Solver", true)
     .addSwitch("Block Wrong Clicks", false)
     .addSwitch("Send Reset In Party Chat", true)
     .addSwitch("Reset Title", true)
     .addTextBox("Reset Text", "! SSRS SSRS SSRS !")
     .addTextBox("Reset Title Text", "&c&lSS RS!")

register("playerInteract", (action, pos, event) => {
     if (!SimonSays.switches["Solver"] || !SimonSays.toggled || !SimonSays.switches["Block Wrong Clicks"]) return
     if (action.toString() == "RIGHT_CLICK_BLOCK") {
          if (Player.lookingAt().getX() == 110 && Player.lookingAt().getY() == 121 && Player.lookingAt().getZ() == 91) {
               lanterncord = {}
               first = true
               clicks = 0
          }
          if (Object.keys(lanterncord).length < 1) return
          if (lanterncord[0].x - 1 == Player.lookingAt().getX() && lanterncord[0].y == Player.lookingAt().getY() && lanterncord[0].z == Player.lookingAt().getZ()) {
               deletefirst()
          } else {
               if (Player.isSneaking()) return
               cancel(event)
          }
     }
})

register("chat", () => {
     lanterncord = {}
     animation = false
     clicks = 0
     first = false
     second = false
     ticks = 0
     canbreak = false
     devicedone = false
     ssbreak.register()
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")
register("chat", player => {
     if (Dungeons.getPlayerClass(player) != "Berserk") ssbreak.unregister()
}).setCriteria("${player} completed a device! ${ok}")

function blockDetected() {}

const ssbreak = register("packetReceived", () => {
     let found = false
     ticks--

     for (let i = 0; i < 16; i++) {
          const blocky = Math.floor(i / 4)
          const blockz = i - blocky * 4
          const dupe = Object.keys(lanterncord).some(block => lanterncord[block].y == 120 + blocky && lanterncord[block].z == 92 + blockz)

          if (World.getBlockAt(111, 120 + blocky, 92 + blockz).type.getID() !== 169) continue
          found = true
          ticks = 12
          canbreak = true
          if (dupe) continue
          lanterncord[Object.keys(lanterncord).length] = { x: 111, y: 120 + blocky, z: 92 + blockz }
     }
     if (!found && first && Object.keys(lanterncord).length !== 0) {
          first = false
          found = true
          if (Object.keys(lanterncord).length == 3) deletefirst()
     }

     if (ticks > 0 || !canbreak || devicedone) return
     if (World.getBlockAt(110, 120, 92).type.getID() != 0) return
     canbreak = false
     lanterncord = {}
     if (SimonSays.switches["Send Reset In Party Chat"]) ChatLib.command(`pc ${SimonSays.textBox["Reset Text"]}`)
     if (!SimonSays.switches["Reset Title"]) return
     title(SimonSays.textBox["Reset Title Text"], true, 255, 255, 255, "random.anvil_land", 1, 1)
})
     .setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)
     .unregister()

function deletefirst() {
     const keys = Object.keys(lanterncord)
          .map(Number)
          .sort((a, b) => a - b)

     for (let i = 1; i < keys.length; i++) {
          lanterncord[i - 1] = lanterncord[i]
     }
     delete lanterncord[keys[keys.length - 1]]
}

register("renderWorld", () => {
     if (!SimonSays.switches["Solver"] || !SimonSays.toggled) return
     Object.keys(lanterncord).forEach(lantern => {
          const x1 = lanterncord[lantern]?.x
          const y1 = lanterncord[lantern]?.y + 0.35
          const z1 = lanterncord[lantern]?.z + 0.3

          const x2 = lanterncord[lantern]?.x - 0.125
          const y2 = lanterncord[lantern]?.y + 0.625
          const z2 = lanterncord[lantern]?.z + 0.7

          const r = 1
          const g = 1
          const b = 1
          const a = 1
          const phase = true

          Tessellator.drawString((parseInt(lantern) + 1).toString(), x1 - Math.abs(x2 - x1), y1 + Math.abs(y2 - y1), z1 + Math.abs(z2 - z1) / 2, Renderer.WHITE, false, 0.03, false)

          RenderLibV2.drawLine(x1, y1 + 0.01, z1, x1, y1 + 0.01, z2, r, g, b, a, phase, 3)
          RenderLibV2.drawLine(x2, y1 + 0.01, z1, x2, y1 + 0.01, z2, r, g, b, a, phase, 3)
          RenderLibV2.drawLine(x1, y1 + 0.01, z1, x2, y1 + 0.01, z1, r, g, b, a, phase, 3)
          RenderLibV2.drawLine(x1, y1 + 0.01, z2, x2, y1 + 0.01, z2, r, g, b, a, phase, 3)
          // First Layer

          RenderLibV2.drawLine(x1, y2, z1, x1, y2, z2, r, g, b, a, phase, 3)
          RenderLibV2.drawLine(x2, y2, z1, x2, y2, z2, r, g, b, a, phase, 3)
          RenderLibV2.drawLine(x1, y2, z1, x2, y2, z1, r, g, b, a, phase, 3)
          RenderLibV2.drawLine(x1, y2, z2, x2, y2, z2, r, g, b, a, phase, 3)
          //Second Layer

          RenderLibV2.drawLine(x1, y1 + 0.01, z1, x1, y2, z1, r, g, b, a, phase, 3)
          RenderLibV2.drawLine(x2, y1 + 0.01, z1, x2, y2, z1, r, g, b, a, phase, 3)
          RenderLibV2.drawLine(x1, y1 + 0.01, z2, x1, y2, z2, r, g, b, a, phase, 3)
          RenderLibV2.drawLine(x2, y1 + 0.01, z2, x2, y2, z2, r, g, b, a, phase, 3)
          Tessellator.draw()
     })
     //  RenderLibV2.drawLine(58, 169.01, 40, 58, 169.01, 50, 1, 1, 1, 1, false, 2)
     //  RenderLibV2.drawLine(58, 169, 40, 58, 169, 50, 1, 1, 1, 1, false, 2)
})
