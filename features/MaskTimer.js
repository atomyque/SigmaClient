import { guiPiece } from "../gui/draggableGuis"
import Dungeons from "./utils/Dungeons"
import { Module } from "../gui/ClickGui"

let spiritactive = false
let bonzoactive = false
let phoenixactive = false

let bonzotimer = 0
let spirittimer = 0
let phoenixtimer = 0

let bonzoinvtimer = 0
let spiritinvtimer = 0
let phoenixinvtimer = 0

let spirittext = ""
let bonzotext = ""
let phoenixtext = ""
const maskTimerGui = new guiPiece("maskTimer", 10, 150, 1).addText("Spirit Text", "&dSpirit &f : &a✔", 0, 0, 1, false).addText("Bonzo Text", "&dBonzo &f : &a✔", 0, 10, 1, false).addText("Phoenix Text", "&dPhoenix &f : &a✔", 0, 20, 1, false)
const maskTimerModule = new Module("Dungeons", "Mask Timer Hud").addSwitch("Toggle Everywhere", false).addButton("Move Display", () => {
     guiPiece.gui.open()
     maskTimerGui.edit()
})

register("tick", () => {
     if (maskTimerModule.toggled && (Dungeons.inBossRoom || maskTimerModule.switches["Toggle Everywhere"] == true)) {
          maskTimerGui.draw()
     } else maskTimerGui.dontdraw()
})

register("packetReceived", packet => {
     const inventory = Player.getInventory()
     Client.scheduleTask(1, () => {
          if (Player.getContainer().getName() == "Your Equipment and Stats") {
               closeafter.register()
               if (!Player.getContainer().getStackInSlot(11).getName().includes("Spirit Mask") && !Player.getContainer().getStackInSlot(11).getName().includes("Bonzo's Mask")) {
                    spiritactive = false
                    bonzoactive = false
                    return
               }

               if (Player.getContainer().getStackInSlot(11).getName().includes("Bonzo's Mask")) {
                    spiritactive = false
                    bonzoactive = true
                    return
               }
               if (Player.getContainer().getStackInSlot(11).getName().includes("Spirit Mask")) {
                    spiritactive = true
                    bonzoactive = false
               }
          }
     })
}).setFilteredClass(net.minecraft.network.play.server.S2DPacketOpenWindow)

register("chat", (level, pet) => {
     if (pet.includes("Phoenix")) {
          phoenixactive = true
          phoenixlvl = level
          return
     }

     phoenixactive = false
}).setCriteria("Autopet equipped your [Lvl ${level}] ${pet}! VIEW RULE")

register("chat", pet => {
     if (pet.includes("Phoenix")) {
          phoenixactive = true
          return
     }

     phoenixactive = false
}).setCriteria("You summoned your ${pet}!")

register("chat", () => {
     Client.showTitle("&dBonzo's Mask used!", "", 10, 10, 10)
     bonzoinvtimer = 3 * 20
     bonzotimer = 180 * 20
}).setCriteria("Your Bonzo's Mask saved your life!")

register("chat", () => {
     Client.showTitle("&dBonzo's Mask used!", "", 10, 10, 10)
     bonzoinvtimer = 3 * 20
     bonzotimer = 180 * 20
}).setCriteria("Your ⚚ Bonzo's Mask saved your life!")

register("chat", () => {
     Client.showTitle("&dSpirit Mask used!", "", 10, 10, 10)
     spiritinvtimer = 3 * 20
     spirittimer = 30 * 20
}).setCriteria("Second Wind Activated! Your Spirit Mask saved your life!")

register("chat", () => {
     Client.showTitle("&dPhoenix Pet used!", "", 10, 10, 10)
     if (phoenixlvl) phoenixinvtimer = 4 * 20
     else phoenixinvtimer = 4 * 20
     phoenixtimer = 60 * 20
}).setCriteria("Your Phoenix Pet saved you from certain death!")

const S32PacketConfirmTransaction = Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction")
const timer = register("packetReceived", () => {
     if (bonzotimer >= 0) bonzotimer--
     if (spirittimer >= 0) spirittimer--
     if (phoenixtimer >= 0) phoenixtimer--

     if (bonzoinvtimer >= 0) bonzoinvtimer--
     if (spiritinvtimer >= 0) spiritinvtimer--
     if (phoenixinvtimer >= 0) phoenixinvtimer--

     const sspirit = (spirittimer / 20).toFixed(2)
     const sbonzo = (bonzotimer / 20).toFixed(2)
     const sphoenix = (phoenixtimer / 20).toFixed(2)

     const sspiritinv = (spiritinvtimer / 20).toFixed(2)
     const sbonzoinv = (bonzoinvtimer / 20).toFixed(2)
     const sphoenixinv = (phoenixinvtimer / 20).toFixed(2)

     const fspirit = sspirit >= 15 ? `&c${sspirit}s` : sspirit >= 7.5 ? `&6${sspirit}s` : sspirit > 0.75 ? `&e${sspirit}s` : `&a✔`
     const fbonzo = sbonzo >= 90 ? `&c${sbonzo}s` : sbonzo >= 45 ? `&6${sbonzo}s` : sbonzo > 0.75 ? `&e${sbonzo}s` : `&a✔`
     const fphoenix = sphoenix >= 30 ? `&c${sphoenix}s` : sphoenix >= 15 ? `&6${sphoenix}s` : sphoenix > 0.75 ? `&e${sphoenix}s` : `&a✔`

     spirittext = `${spiritactive ? "&d&l" : "&d"}Spirit &f: ${fspirit} &d${sspiritinv >= 0 ? "(" + sspiritinv + "s)" : ""}`
     bonzotext = `${bonzoactive ? "&d&l" : "&d"}Bonzo &f: ${fbonzo} &d${sbonzoinv >= 0 ? "(" + sbonzoinv + "s)" : ""}`
     phoenixtext = `${phoenixactive ? "&d&l" : "&d"}Phoenix &f: ${fphoenix} &d${sphoenixinv >= 0 ? "(" + sphoenixinv + "s)" : ""}`

     maskTimerGui.text["Spirit Text"].text = spirittext
     maskTimerGui.text["Bonzo Text"].text = bonzotext
     maskTimerGui.text["Phoenix Text"].text = phoenixtext
}).setFilteredClass(S32PacketConfirmTransaction)
