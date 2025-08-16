export function e() {
     ChatLib.chat("e")
}

export const awaitSlots = (fn, slots) => {
     let count = 0

     const listener = register("packetReceived", packet => {
          count++
          if (count >= slots) {
               // chat("executing")
               fn()
               //    close.unregister()
               listener.unregister()
          }
     }).setFilteredClass(net.minecraft.network.play.server.S2FPacketSetSlot)
     //  const guiclose = register("packetReceived", () => {
     //       ChatLib.chat("a")
     //       listener.unregister()
     //       guiclose.unregister()
     //  }).setFilteredClass(net.minecraft.network.play.server.S2DPacketOpenWindow)
}
