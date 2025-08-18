import { awaitSlots } from "./utils/Server"
import { Module } from "../gui/ClickGui"
import { chat } from "./utils/utils"

let parties = []
let pbparties = []

const partyFinderHighlight = new Module("Dungeons", "Party Finder Highlight").addSlider("PB required", 6, 3, 9)
const rdrslot = register("renderSlot", slot => {
     // if (!partyFinderHighlight.toggled) return
     if (slot.getInventory().getName() !== "Party Finder") {
          return
     }
     const found = parties.includes(slot.getIndex())
     if (found) {
          Renderer.drawRect(Renderer.color(0, 255, 0, 60), slot.getDisplayX(), slot.getDisplayY(), 16, 16)
     }
     // const foundpb = pbparties.includes(slot.getIndex())
     // if (foundpb) {
     //      Renderer.drawRect(Renderer.color(255, 255, 255, 255), slot.getDisplayX(), slot.getDisplayY(), 12, 16)
     // }
}).unregister()

let pfclass = "Berserker"
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
               pbparties = []
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

// register("packetReceived", packet => {
//      if (!partyFinderHighlight.toggled) return

//      if (packet.func_179840_c().func_150254_d() == "§rParty Finder§r") {
//           pbparties = []

//           rdrslot.register()
//           Client.scheduleTask(2, () => {
//                for (let i = 10; i < 34; i++) {
//                     const container = Player.getContainer()
//                     let partytime = 0
//                     ChatLib.chat(i)
//                     const match0 = container
//                          .getStackInSlot(i)
//                          .getLore()[3]
//                          .match(/§5§o§7§7Note: §f(.+)$/)
//                     if (match0) {
//                          //   ChatLib.chat(match0[1])
//                          if (match0[1].includes(":")) {
//                               const matchsmc = match0[1].match(/(\d+):(\d+)/)
//                               if (matchsmc) {
//                                    partytime = parseInt(matchsmc[1] + matchsmc[2])
//                               }
//                          } else {
//                               const match1 = match0[1].match(/(\d+)/)
//                               if (match1) {
//                                    partytime = parseInt(match1[1])
//                               }
//                          }
//                          if (partytime > 300 || partytime < 600) {
//                               pbparties.push(i)
//                          }
//                     }
//                }
//           })
//      }
// }).setFilteredClass(net.minecraft.network.play.server.S2DPacketOpenWindow)

// register("guiOpened", () => {
//      // if (!Settings.PartyFinderOutline) return
//      setTimeout(() => {
//           pboutline.register()
//      }, 1)
// })
// register("guiClosed", () => {
//      pboutline.unregister()
// })

// const pboutline = register("renderSlot", slot => {
//      if (slot.getItem() === null) return
//      if (slot.getInventory().getName() !== "Party Finder") return
//      if (slot.getIndex() < 10 || slot.getIndex() > 34) return

//      if (!slot.getItem().getName().includes("Party")) return
//      let partytime = null
//      const match0 = slot
//           .getItem()
//           .getLore()[3]
//           .match(/§5§o§7§7Note: §f(.+)$/)
//      if (match0) {
//           //   ChatLib.chat(match0[1])
//           if (match0[1].includes(":")) {
//                const matchsmc = match0[1].match(/(\d+):(\d+)/)
//                if (matchsmc) {
//                     partytime = parseInt(matchsmc[1] + matchsmc[2])
//                }
//           } else {
//                const match1 = match0[1].match(/(\d+)/)
//                if (match1) {
//                     partytime = parseInt(match1[1])
//                }
//           }
//           if (partytime < 100 || partytime > Settings.PartyFinderOutlineRequirement) return
//           const color = Renderer.color(0, 255, 0, 255)
//           Renderer.drawRect(color, slot.getDisplayX() - 1, slot.getDisplayY() - 1, 18, 1)
//           Renderer.drawRect(color, slot.getDisplayX() - 1, slot.getDisplayY() + 16, 18, 1)
//           Renderer.drawRect(color, slot.getDisplayX() - 1, slot.getDisplayY() - 1, 1, 18)
//           Renderer.drawRect(color, slot.getDisplayX() + 16, slot.getDisplayY() - 1, 1, 18)
//      }
// }).unregister()
