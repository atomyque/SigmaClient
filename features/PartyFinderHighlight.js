import { awaitSlots } from "./utils/Server"
import { Module } from "../gui/ClickGui"

let parties = []

const partyFinderHighlight = new Module("Dungeons", "Party Finder Highlight")
const rdrslot = register("renderSlot", slot => {
     if (!partyFinderHighlight.toggled) return
     if (slot.getInventory().getName() !== "Party Finder") {
          return
     }
     const found = parties.includes(slot.getIndex())
     if (found) {
          Renderer.drawRect(Renderer.color(0, 255, 0, 60), slot.getDisplayX(), slot.getDisplayY(), 16, 16)
     }
}).unregister()

let pfclass = "Healer"

register("packetReceived", packet => {
     if (!partyFinderHighlight.toggled) return
     if (packet.func_179840_c().func_150254_d() == "§rCatacombs Gate§r") {
          Client.scheduleTask(2, () => {
               const container = Player.getContainer()
               const match = container
                    .getStackInSlot(45)
                    .getLore()[3]
                    .match(/§5§o§aCurrently Selected: §b(\w+)/)

               if (match) {
                    pfclass = match[1]
                    classFound = true
               }
          })
     }
     if (packet.func_179840_c().func_150254_d() == "§rParty Finder§r") {
          rdrslot.register()
          Client.scheduleTask(2, () => {
               //    Client.scheduleTask(3, () => {
               const container = Player.getContainer()
               parties = []
               for (let i = 10; i < 34; i++) {
                    if (container.getStackInSlot(i) !== null && container.getStackInSlot(i).getName().includes("Party")) {
                         let hasclass = false
                         container
                              .getStackInSlot(i)
                              .getLore()
                              .slice(7, 12)
                              .forEach(s => {
                                   if (s.includes(`§e${pfclass}§b`)) {
                                        hasclass = true
                                        return
                                   }
                              })
                         if (!hasclass) {
                              parties.push(i)
                         }
                    }
               }
               //    })
          })
     }
}).setFilteredClass(net.minecraft.network.play.server.S2DPacketOpenWindow)
