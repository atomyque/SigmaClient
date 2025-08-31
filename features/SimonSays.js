// import RenderLibV2 from "../../RenderLibV2"

// let lanterncord = {}
// let animation = false
// let clicks = 0
// let first = false
// let second = false
// register("renderOverlay", () => {
//      Renderer.drawString(animation.toString(), 100, 100, true)
// })

// register("playerInteract", (action, pos, event) => {
//      if (action.toString() == "RIGHT_CLICK_BLOCK") {
//           if (Player.lookingAt().getX() == 110 && Player.lookingAt().getY() == 121 && Player.lookingAt().getZ() == 91) {
//                lanterncord = {}
//                first = true
//                clicks = 0
//                nigg.register()
//           }
//           if (Object.keys(lanterncord).length < 1) return
//           if (lanterncord[0].x - 1 == Player.lookingAt().getX() && lanterncord[0].y == Player.lookingAt().getY() && lanterncord[0].z == Player.lookingAt().getZ()) {
//                deletefirst()
//                ChatLib.chat("hi")
//           } else {
//                if (Player.isSneaking()) return
//                cancel(event)
//           }
//      }
// })
// let clickedbuttons = {}

// register("packetReceived", (packet, event) => {
//      ChatLib.chat("bro")
//      ChatLib.chat(packet.func_179827_b().func_177958_n())
// }).setFilteredClass(net.minecraft.network.play.server.S23PacketBlockChange)

// const nigg = register("packetReceived", () => {
//      let found = false

//      //  for (let i = 0; i < 4; i++) {
//      //       let dupe = false
//      //       for (let int = 0; int < 4; int++) {
//      //            if (World.getBlockAt(110, 120 + int, 92 + i).isPowered()) {
//      //                 Object.keys(clickedbuttons).forEach(element => {
//      //                      const y = clickedbuttons[element].y
//      //                      const z = clickedbuttons[element].z
//      //                      if (y == 120 + int && z == 92 + i) {
//      //                           dupe = true
//      //                      }
//      //                 })
//      //                 if (!dupe) {
//      //                      clickedbuttons[Object.keys(clickedbuttons).length] = { x: 110, y: 120 + int, z: 92 + i }
//      //                 }
//      //            }
//      //       }
//      //  }

//      for (let i = 0; i < 4; i++) {
//           for (let int = 0; int < 4; int++) {
//                let dupe = false
//                if (World.getBlockAt(111, 120 + int, 92 + i).type.getName() == "Sea Lantern") {
//                     Object.keys(lanterncord).forEach(element => {
//                          const y = lanterncord[element].y
//                          const z = lanterncord[element].z

//                          if (y == 120 + int && z == 92 + i) dupe = true
//                     })
//                     found = true
//                     if (!dupe) lanterncord[Object.keys(lanterncord).length] = { x: 111, y: 120 + int, z: 92 + i }
//                     if (Object.keys(lanterncord).length >= 1) {
//                          animation = true
//                     }
//                }
//                if (i == 3 && int == 3 && !found && first && Object.keys(lanterncord).length !== 0) {
//                     animation = false
//                     first = false
//                     second = true
//                     if (Object.keys(lanterncord).length == 3) deletefirst()
//                }
//           }
//      }
// })
//      .setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)
//      .unregister()

// function deletefirst() {
//      const keys = Object.keys(lanterncord)
//           .map(Number)
//           .sort((a, b) => a - b)

//      for (let i = 1; i < keys.length; i++) {
//           lanterncord[i - 1] = lanterncord[i]
//      }
//      delete lanterncord[keys[keys.length - 1]]
// }

// register("command", () => {
//      Object.keys(lanterncord).forEach(element => {
//           ChatLib.chat(lanterncord[element].z)
//      })
// }).setName("pintblocks")

// register("renderWorld", () => {
//      Object.keys(lanterncord).forEach(lantern => {
//           const x1 = lanterncord[lantern]?.x
//           const y1 = lanterncord[lantern]?.y + 0.35
//           const z1 = lanterncord[lantern]?.z + 0.3

//           const x2 = lanterncord[lantern]?.x - 0.125
//           const y2 = lanterncord[lantern]?.y + 0.625
//           const z2 = lanterncord[lantern]?.z + 0.7

//           const r = 1
//           const g = 1
//           const b = 1
//           const a = 1
//           const phase = false

//           Tessellator.drawString((parseInt(lantern) + 1).toString(), x1 - Math.abs(x2 - x1), y1 + Math.abs(y2 - y1), z1 + Math.abs(z2 - z1) / 2, Renderer.WHITE, false, 0.03, false)

//           RenderLibV2.drawLine(x1, y1 + 0.01, z1, x1, y1 + 0.01, z2, r, g, b, a, phase, 3)
//           RenderLibV2.drawLine(x2, y1 + 0.01, z1, x2, y1 + 0.01, z2, r, g, b, a, phase, 3)
//           RenderLibV2.drawLine(x1, y1 + 0.01, z1, x2, y1 + 0.01, z1, r, g, b, a, phase, 3)
//           RenderLibV2.drawLine(x1, y1 + 0.01, z2, x2, y1 + 0.01, z2, r, g, b, a, phase, 3)
//           // First Layer

//           RenderLibV2.drawLine(x1, y2, z1, x1, y2, z2, r, g, b, a, phase, 3)
//           RenderLibV2.drawLine(x2, y2, z1, x2, y2, z2, r, g, b, a, phase, 3)
//           RenderLibV2.drawLine(x1, y2, z1, x2, y2, z1, r, g, b, a, phase, 3)
//           RenderLibV2.drawLine(x1, y2, z2, x2, y2, z2, r, g, b, a, phase, 3)
//           //Second Layer

//           RenderLibV2.drawLine(x1, y1 + 0.01, z1, x1, y2, z1, r, g, b, a, phase, 3)
//           RenderLibV2.drawLine(x2, y1 + 0.01, z1, x2, y2, z1, r, g, b, a, phase, 3)
//           RenderLibV2.drawLine(x1, y1 + 0.01, z2, x1, y2, z2, r, g, b, a, phase, 3)
//           RenderLibV2.drawLine(x2, y1 + 0.01, z2, x2, y2, z2, r, g, b, a, phase, 3)
//      })
//      //  RenderLibV2.drawLine(58, 169.01, 40, 58, 169.01, 50, 1, 1, 1, 1, false, 2)
//      //  RenderLibV2.drawLine(58, 169, 40, 58, 169, 50, 1, 1, 1, 1, false, 2)
// })
