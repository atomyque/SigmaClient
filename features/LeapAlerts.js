import RenderLibV2 from "../../RenderLibV2/index"
import { Module } from "../gui/ClickGui"
import { guiPiece } from "../gui/draggableGuis"
import Dungeons from "./utils/Dungeons"
import { chat } from "./utils/utils"

class leapBox {
     static all = []
     constructor(name, x1, y1, z1, x2, y2, z2, amount, dungeonclass) {
          this.name = name
          this.x1 = x1
          this.y1 = y1
          this.z1 = z1

          this.x2 = x2
          this.y2 = y2
          this.z2 = z2

          this.location = false

          this.dungeonclass = dungeonclass
          this.amount = amount

          this.r = 1
          this.g = 1
          this.b = 1
          this.a = 1

          leapBox.all.push(this)
     }
     addLocation(name) {
          this.location = name
     }
}

const LeapAlert = new guiPiece("Leap Alert", Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 4 + 30, 2.5).addText("text", "player leaped", 0, 0, 1, true, true)
const LeapAmount = new guiPiece("Leap Alert", Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 4 + 50, 1.5).addText("text", "4/4", 0, 0, 1, true, true)
const PositionalAlerts = new guiPiece("Positional Alerts", Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2 + 30, 2.5).addText("text", "&aPlayer is at Spot", 0, 0, 1, true, true)

const leapModule = new Module("Dungeons", "Leap alerts")
     .addSwitch("Send in chat", true)
     .addSwitch("Show classes", true)
     .addSwitch("Render Boxes", true)
     .addButton("Move Leap Alerts", () => {
          guiPiece.gui.open()
          LeapAlert.edit()
     })
     .addButton("Move Leap Progress", () => {
          guiPiece.gui.open()
          LeapAmount.edit()
     })
const PositionalAlertsModule = new Module("Dungeons", "Positional Alerts")
     .addSwitch("Send in chat", true)
     .addSwitch("Show on screen", true)
     .addButton("Move Positional Alerts", () => {
          guiPiece.gui.open()
          PositionalAlerts.edit()
     })

const p2bers = new leapBox("p2bers", 59, 169, 44, 55, 169.25, 37, 4, "Berserk")
const ss = new leapBox("Simon Says", 109, 120, 93, 107, 120.25, 95, 4, "Healer").addLocation("Simon Says")
const ee2 = new leapBox("ee2", 59, 109, 132, 57, 109.25, 130, 4, "Archer").addLocation("EE2")
const ee2safe = new leapBox("ee2safe", 48, 109, 122, 49, 109.25, 121, 4, "Archer").addLocation("EE2 Safe")
const ee3 = new leapBox("ee3", 1, 108.5, 106, 3, 109.25, 103, 4, "Healer").addLocation("EE3")
const ee3safe = new leapBox("ee3safe", 19, 121.5, 91, 18, 121.75, 100, 4, "Healer").addLocation("EE3 Safe")
const core = new leapBox("core", 53, 115, 50, 56, 115.25, 53, 4, "Mage").addLocation("Core")
const tunnel = new leapBox("tunnel", 52, 115, 55, 57, 115.25, 58, 4, "Mage").addLocation("Tunnel")
const mid = new leapBox("mid", 56, 5, 78, 53, 5.25, 75, 4, "Healer").addLocation("Core")

let timer = 0
let timerlenght = 500

const clock = register("tick", () => {
     LeapAlert.draw()
     timer -= 50
     if (timer <= 0) {
          LeapAlert.dontdraw()
          timer = 0
          clock.unregister()
     }
}).unregister()

let othertimer = 0
const otherclock = register("tick", () => {
     PositionalAlerts.draw()
     othertimer -= 50
     if (othertimer <= 0) {
          PositionalAlerts.dontdraw()
          timer = 0
          otherclock.unregister()
     }
}).unregister()
register("command", () => {
     timer = 500
     clock.register()
}).setName("timer")

let leapt = []

let anounced = false

register("tick", () => {
     if (!leapModule.toggled) return
     if (!inLeapBox()) {
          leapt = []
          LeapAmount.dontdraw()

          anounced = false
          return
     }

     if (inLeapBox()[2] && anounced == false) {
          anounced = true
          if (PositionalAlertsModule.switches["Send in chat"] && PositionalAlertsModule.toggled) ChatLib.command(`At ${inLeapBox()[2]}`)
          // chat(`At ${inLeapBox()[2]}`)
     }

     r = 1
     g = 1
     b = 1
     a = 1
     LeapAmount.draw()
     LeapAmount.text["text"].text = `${leapt.length >= inLeapBox()[1] ? "&a" : "&c"}${leapt.length} / ${inLeapBox()[1]} Leaped`
})


const EntityPlayer = net.minecraft.entity.player.EntityPlayer

// Thanks @Noamm9 for helping me with the leap detection
register("packetReceived", packet => {
     if (!leapModule.toggled) return
     if (!Dungeons.inClear && !Dungeons.inp3) return
          const entityID = packet.func_149451_c()
          const entity = World.getWorld().func_73045_a(entityID)
          if (!entity) return
          if (!(entity instanceof EntityPlayer)) return
     
          const [pX, pY, pZ] = [Math.floor(packet.func_149449_d() / 32), Math.floor(packet.func_149448_e() / 32), Math.floor(packet.func_149446_f() / 32)]
          const playername = new Entity(entity).getName()

          if (distance2d(Player.getX(), Player.getZ(), pX, pZ) <= 2 && pY - 2 < Player.getY() && pY + 2 > Player.getY()) {
               if (leapModule.switches["Send in chat"]) chat(`&5${leapModule.switches["Show classes"] == true ? (typeof playerclasses[playername] == "undefined" ? "Unknown Player" : playerclasses[playername]) : playername} has leapt to you.`)
               if (inLeapBox() && !leapt.includes(playername)) {
                    leapt.push(playername)
                    if (leapt.length == inLeapBox()[1]) {
                         LeapAlert.text["text"].text = `&aEveryone leapt`
                         World.playSound("note.pling", 1, 2)
                         timer = 500
                         return
                    }

                    LeapAlert.text["text"].text = `&5${leapModule.switches["Show classes"] == true ? (typeof playerclasses[playername] == "undefined" ? "Unknown Player" : playerclasses[playername]) : playername} leapt`
                    World.playSound("random.orb", 1, 2)
                    timer = 500
                    clock.register()
               }
          }
     }
}).setFilteredClass(net.minecraft.network.play.server.S18PacketEntityTeleport)

function distance2d(x1, z1, x2, z2) {
     return Math.abs(Math.sqrt((x1 - x2) ** 2 + (z1 - z2) ** 2))
}

function inLeapBox() {
     if (!Dungeons.inBossRoom) return
     const px = Player.getX()
     const py = Player.getY()
     const pz = Player.getZ()

     for (let box of leapBox.all) {
          if (playerclasses[Player.getName()] !== box.dungeonclass) continue

          let minX = Math.min(box.x1, box.x2)
          let maxX = Math.max(box.x1, box.x2)

          let minY = Math.min(box.y1, box.y2)
          let maxY = Math.max(box.y1, box.y2)

          let minZ = Math.min(box.z1, box.z2)
          let maxZ = Math.max(box.z1, box.z2)

          if (px >= minX - 0.5 && px <= maxX + 0.5 && py >= minY && py <= maxY && pz >= minZ - 0.5 && pz <= maxZ + 0.5) {
               box.r = 1
               box.g = 1
               box.b = 1
               return [true, box.amount, box.location]
          } else {
               box.r = 0
               box.g = 0
               box.b = 0
          }
     }

     return false
}

let phase = false

register("renderWorld", () => {
     if (!Dungeons.inBossRoom || !leapModule.toggled || !leapModule.switches["Render Boxes"]) return
     leapBox.all.forEach(box => {
          if (playerclasses[Player.getName()] !== box.dungeonclass) return false
          //   chat(box.z1)
          const x1 = box.x1
          const y1 = box.y1
          const z1 = box.z1

          const x2 = box.x2
          const y2 = box.y2
          const z2 = box.z2

          const r = box.r
          const g = box.g
          const b = box.b
          const a = box.a

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
     })
     //  RenderLibV2.drawLine(58, 169.01, 40, 58, 169.01, 50, 1, 1, 1, 1, false, 2)
     //  RenderLibV2.drawLine(58, 169, 40, 58, 169, 50, 1, 1, 1, 1, false, 2)
})

let players = []
let playerclasses = {}
register("command", () => {
     getclasses()
}).setName("getclass")

register("chat", () => {
     playerclasses = {}
     getclasses()
     leapt = []
     spot = []
}).setCriteria("&e[NPC] &bMort&f: &rGood luck.&r")

function getclasses() {
     playerclasses = {}
     players.forEach(playername => {
          TabList.getNames().forEach(nm => {
               let regex = /\[\d+\]\s+([A-Za-z0-9_]+)\s+\(([A-Za-z_]+)/
               const clean = ChatLib.removeFormatting(nm).trim()

               let match1 = clean.match(regex)
               if (match1) {
                    let name = match1[1]
                    let playerClass = match1[2]
                    if (name == playername) {
                         playerclasses[playername] = playerClass
                    }
                    ChatLib.chat("Name: " + name + ", Class: " + playerClass)
               }
          })
     })
}

register("command", () => chat(playerclasses[Player.getName()])).setName("tes")

register("worldLoad", () => {
     players = []
     World.getAllPlayers().forEach(p => {
          if (p.getUUID().version() == 4) {
               players.push(p.getName())
          }
     })
})

register("command", (...args) => playerclasses[args[0]] = args[1]).setName("modify")

let spot = []

register("packetReceived", packet => {
     if (!PositionalAlertsModule.switches["Show on screen"] || !PositionalAlertsModule.toggled) return
     if (packet.func_149065_a(World.getWorld()) == null) return
     const mcEntity = packet.func_149065_a(World.getWorld())
     if (!mcEntity) return
     const ctEntity = new Entity(mcEntity)

     const username = ctEntity.getName()
     const [x, y, z] = [ctEntity.getX(), ctEntity.getY(), ctEntity.getZ()]

     if (!players.includes(username)) return
     if (!Dungeons.inBossRoom) return
     
     for (let box of leapBox.all) {
          if (playerclasses[username] !== box.dungeonclass) continue

          let minX = Math.min(box.x1, box.x2)
          let maxX = Math.max(box.x1, box.x2)

          let minY = Math.min(box.y1, box.y2)
          let maxY = Math.max(box.y1, box.y2)

          let minZ = Math.min(box.z1, box.z2)
          let maxZ = Math.max(box.z1, box.z2)

          if (x >= minX - 0.5 && x <= maxX + 0.5 && y >= minY && y <= maxY && z >= minZ - 0.5 && z <= maxZ + 0.5 && !spot.includes(box.name)) {
               // chat(`${username} is at ${box.location}`)
               if (playerclasses[username] == "Mage") leapt.push(username)
               otherclock.register()
               othertimer = 750
               PositionalAlerts.text["text"].text = `&a${username} is at ${box.location}`
               World.playSound("note.pling", 1, 2)

               spot.push(box.name)
               continue
          }
          
          if (!(x >= minX - 0.5 && x <= maxX + 0.5 && y >= minY && y <= maxY && z >= minZ - 0.5 && z <= maxZ + 0.5)) {
               // if (playerclasses[username] == "Mage") continue
               spot = spot.filter(player => player !== box.name)
          }
     }
}).setFilteredClass(net.minecraft.network.play.server.S14PacketEntity)
