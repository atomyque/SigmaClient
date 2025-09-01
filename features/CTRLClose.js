import { clickGui, Module } from "../gui/ClickGui"
import { chat } from "./utils/utils"

const CTRLClose = new Module("Misc", "Control Close", "Closes the selected menus when pressing the control key.").addSwitch("Equipment", true).addSwitch("Wardrobe", true)
const WardrobeKeybins = new Module("Misc", "Wardrobe Keybinds", "Allows you to press number keys to switch armor in the wardrobe.").addSwitch("Always Close Menu")

const keyboard = Java.type("org.lwjgl.input.Keyboard")
register("packetReceived", packet => {
     if (!CTRLClose.toggled || !CTRLClose.switches["Equipment"]) return
     const inventory = Player.getInventory()
     if (packet.func_179840_c().func_150254_d() == "§rYour Equipment and Stats§r") {
          Client.scheduleTask(1, () => {
               register("guiClosed", () => {
                    click.unregister()
               })
               const click = register("packetSent", () => {
                    if (keyboard.isKeyDown(keyboard.KEY_LCONTROL)) {
                         const closeafter = register("packetReceived", packet => {
                              Client.scheduleTask(1, () => {
                                   if (packet.func_179840_c().func_150254_d() == "§rYour Equipment and Stats§r") {
                                        Player.getPlayer().func_71053_j()
                                   }
                              })
                              closeafter.unregister()
                         }).setFilteredClass(net.minecraft.network.play.server.S2DPacketOpenWindow)
                    }
                    click.unregister()
               }).setFilteredClass(net.minecraft.network.play.client.C0EPacketClickWindow)
          })
     }
}).setFilteredClass(net.minecraft.network.play.server.S2DPacketOpenWindow)

const wdkeybinds = register("packetReceived", packet => {
     if (!WardrobeKeybins.toggled) return
     if (packet.func_179840_c().func_150254_d() == "§rWardrobe (1/2)§r") {
          Client.scheduleTask(1, () => {
               register("guiClosed", () => {
                    key.unregister()
               })
               const key = register("guiKey", (char, keycode) => {
                    if (keycode < 2 || keycode > 10) return
                    let container = Player.getContainer()
                    const slot = keycode - 1
                    container.click(35 + slot, false)
                    if (keyboard.isKeyDown(keyboard.KEY_LCONTROL) || WardrobeKeybins.switches["Always Close Menu"]) {
                         if (!WardrobeKeybins.switches["Always Close Menu"] && (!CTRLClose.toggled || !CTRLClose.switches["Wardrobe"])) return
                         if (packet.func_179840_c().func_150254_d() == "§rWardrobe (1/2)§r") {
                              Client.scheduleTask(1, () => {
                                   Player.getPlayer().func_71053_j()
                              })
                         }
                         key.unregister()
                    }
               })
          })
     }
}).setFilteredClass(net.minecraft.network.play.server.S2DPacketOpenWindow)

// register("packetReceived", packet => {
//      chat(Player.getPlayer().field_70118_ct)
//      // Player.asPlayerMP()
//      // chat(packet.func_148942_f())
//      // World.ChatLib.chat(packet.func_149062_c())
// }).setFilteredClass(net.minecraft.network.play.server.S14PacketEntity)

// register("packetReceived", packet => {
//      if (packet.func_149065_a(World.getWorld()) === null) {
//           return
//      }
//      let str = packet.func_149065_a(World.getWorld()).toString()
//      let coordsMatch = str.match(/x=(-?\d+(\.\d+)?), y=(-?\d+(\.\d+)?), z=(-?\d+(\.\d+)?)/)

//      // Match text between the first ' and '/
//      let match = str.match(/'\s*([^']+)'\/\d+/)

//      let x
//      let y
//      let z

//      if (match) {
//           let username = match[1]
//           World.getAllPlayers().forEach(e => {
//                e.getName()
//                if (e.getName() == username) {
//                     x = e.getX() + packet.func_149062_c() / 32
//                     y = e.getY() + packet.func_149061_d() / 32
//                     z = e.getZ() + packet.func_149064_e() / 32

//                     if (Player.getX() < x + 0.25 && Player.getX() > x - 0.25 && Player.getY() < y + 0.25 && Player.getY() > y - 0.25 && Player.getZ() < z + 0.25 && Player.getZ() > z - 0.25) chat("Player leapt")
//                     // ea = e.getX() + packet.func_149062_c() / 32
//                }
//           })
//      }
// }).setFilteredClass(net.minecraft.network.play.server.S14PacketEntity.S17PacketEntityLookMove)

// register("packetReceived", packet => {
//      if (packet.class.getSimpleName() == "S32PacketConfirmTransaction" || packet.class.getSimpleName() == "S2APacketParticles" || packet.class.getSimpleName() == "S1CPacketEntityMetadata" || packet.class.getSimpleName() == "S04PacketEntityEquipment") return

//      chat(packet.class.getSimpleName())
// })

// register("packetReceived", packet => {
//      // World.getAllPlayers().forEach(e => {
//      //      if (e.getName() == "NoamIsSad") chat(e.getEntity().func_145782_y())
//      // })

//      const x = packet.func_149449_d() / 32
//      const y = packet.func_149448_e() / 32
//      const z = packet.func_149446_f() / 32
//      if (packet.func_149451_c() == 830577) {
//           chat(`x = ${x} y = ${y} z = ${z}`)
//      }
// }).setFilteredClass(net.minecraft.network.play.server.S18PacketEntityTeleport)

// register("packetReceived", packet => {
//      const entityID = packet.func_149451_c()
//      const entity = World.getWorld().func_73045_a(entityID)
//      if (!entity) return
//      if (entity instanceof net.minecraft.entity.player.EntityPlayer) {
//           let [pX, pY, pZ] = [packet.func_149449_d() / 32, packet.func_149448_e() / 32, packet.func_149446_f() / 32]

//           if (Math.floor(pX) == Math.floor(Player.getX()) && Math.floor(pY) == Math.floor(Player.getY()) && Math.floor(pZ) == Math.floor(Player.getZ())) {
//                ChatLib.chat("got leaped")
//           }
//      }
// }).setFilteredClass(net.minecraft.network.play.server.S18PacketEntityTeleport)
