// const mcitem = net.minecraft.init.Items

// let lastinventory = {}

// register("packetSent", packet => {
//      const itemm = Player.getContainer()?.getItems()
//      const containerr = Player?.getContainer()
//      itemm.forEach(iteme => {
//           if (iteme == null) return
//           const slot = containerr.indexOf(iteme)
//           ChatLib.chat(slot)
//           lastinventory[slot] = iteme
//      })

//      // const svtick = register("packetReceived", () => {
//      setTimeout(() => {
//           const item = Player.getContainer()?.getItems()
//           const container = Player?.getContainer()
//           ChatLib.chat("opk")
//           item?.forEach(iteme => {
//                if (iteme == null) return
//                const slot = container.indexOf(iteme)
//                ChatLib.chat(slot)
//                // ChatLib.chat(iteme.getName() + "    " + lastinventory[slot].getName())
//                if (lastinventory[slot] !== iteme) ChatLib.chat(iteme.getName())
//           })
//           // svtick.unregister()
//      }, 300)

//      // }).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)
// }).setFilteredClass(net.minecraft.network.play.client.C0EPacketClickWindow)

// // register("packetReceived", () => {}).setFilteredClass()

// const ItemStack = Java.type("net.minecraft.item.ItemStack")

// let items = []
// // register("tick", () => {
// //      let container = Player?.getContainer()
// //      let invSlots = Player.getContainer()?.getItems()

// //      invSlots?.forEach(item => {
// //           if (item == null) return
// //           const slot = container.indexOf(item)
// //           items.push(slot)
// //           // ChatLib.chat(item.getName())
// //           if (slot >= 54 || items.includes(slot)) return
// //           container.indexOf(item)
// //           Player.getPlayer().field_71070_bA?.func_75141_a(slot, new ItemStack(item.getItem()))
// //           let Item = Player.getContainer().getStackInSlot(item.slot)
// //           Item.setDamage(item.getDamage())
// //           Item.setName(item.getName())
// //           Item.setLore(newLore(item.getLore()))
// //      })
// // })
