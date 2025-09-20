import { Module } from "../gui/ClickGui"

let parties = []
let ok = {}
let classlist = []

//BIG BIG Shoutout to @shaweel for making the search bar make calculations

const partyFinderHighlight = new Module("Dungeons", "Party Finder Highlight", "Gives you visual clues in the party finder.").addSwitch("Show Party Size", true).addSwitch("Manual Class Selection", false)
const rdrslot = register("renderSlot", slot => {
     if (!partyFinderHighlight.toggled) return
     if (slot.getInventory().getName() !== "Party Finder") return
     if (ok[slot.getIndex()] >= 1 && partyFinderHighlight.switches["Show Party Size"]) {
          Renderer.translate(0, 0, 255)
          Renderer.drawString(ok[slot.getIndex()], slot.getDisplayX() + 11, slot.getDisplayY() + 9, true)
     }

     const found = parties.includes(slot.getIndex())
     if (found) {
          Renderer.drawRect(Renderer.color(0, 255, 0, 100), slot.getDisplayX(), slot.getDisplayY(), 16, 16)
     }
}).unregister()
const defaultcolor = Renderer.color(20, 20, 20, 255)
register("guiRender", () => {
     const container = Player?.getContainer()
     if (container?.getName() !== "Party Finder" || !partyFinderHighlight.switches["Manual Class Selection"]) return
     drawButton(9, Renderer.screen.getHeight() / 2 - 40, 18, 18, "Healer")
     new Item("minecraft:potion").setDamage(16421).draw(10, Renderer.screen.getHeight() / 2 - 40, 1)

     drawButton(9, Renderer.screen.getHeight() / 2 - 20, 18, 18, "Mage")
     new Item("minecraft:blaze_rod").draw(10, Renderer.screen.getHeight() / 2 - 20, 1)

     drawButton(9, Renderer.screen.getHeight() / 2, 18, 18, "Berserk")
     new Item("minecraft:iron_sword").draw(10, Renderer.screen.getHeight() / 2, 1)

     drawButton(9, Renderer.screen.getHeight() / 2 + 20, 18, 18, "Archer")
     new Item("minecraft:bow").draw(10, Renderer.screen.getHeight() / 2 + 20, 1)

     drawButton(9, Renderer.screen.getHeight() / 2 + 40, 18, 18, "Tank")
     new Item("minecraft:leather_chestplate").draw(10, Renderer.screen.getHeight() / 2 + 40, 1)
})

function drawButton(x, y, width, height, name) {
     const color = classlist.includes(name) == true ? (white = Renderer.color(255, 255, 255, 255)) : (darkwhite = Renderer.color(150, 150, 150, 255))

     Renderer.drawRect(defaultcolor, x, y, width, height)
     Renderer.drawLine(color, x, y, x + width, y, 1, 6)
     Renderer.drawLine(color, x, y + height - 0.5, x + width, y + height - 0.5, 1, 6)
     Renderer.drawLine(color, x + 0.5, y, x + 0.5, y + height, 1, 6)
     Renderer.drawLine(color, x + width - 0.5, y, x + width - 0.5, y + height, 1, 6)
}
register("guiMouseClick", (mx, my, mb) => {
     const container = Player?.getContainer()
     if (container?.getName() !== "Party Finder" || !partyFinderHighlight.switches["Manual Class Selection"]) return
     if (hovering(mx, my, 10, Renderer.screen.getHeight() / 2 - 40, 18, 18)) toggleClass("Healer")
     if (hovering(mx, my, 10, Renderer.screen.getHeight() / 2 - 20, 18, 18)) toggleClass("Mage")
     if (hovering(mx, my, 10, Renderer.screen.getHeight() / 2, 18, 18)) toggleClass("Berserk")
     if (hovering(mx, my, 10, Renderer.screen.getHeight() / 2 + 20, 18, 18)) toggleClass("Archer")
     if (hovering(mx, my, 10, Renderer.screen.getHeight() / 2 + 40, 18, 18)) toggleClass("Tank")
})
function toggleClass(classname) {
     if (classlist.includes(classname)) {
          classlist = classlist.filter(item => item !== classname)
          Client.scheduleTask(2, () => {
               fetchParties()
          })
          return
     }
     classlist.push(classname)
     Client.scheduleTask(2, () => {
          fetchParties()
     })
}

function hovering(mx, my, x, y, width, height) {
     if (mx <= x + width && mx >= x && my <= y + height && my >= y) return true
     else return false
}
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
     if (!packet.func_179840_c().func_150254_d() == "§rParty Finder§r") return
     rdrslot.register()
     Client.scheduleTask(2, () => {
          fetchParties()
     })
}).setFilteredClass(net.minecraft.network.play.server.S2DPacketOpenWindow)

function fetchParties() {
     const container = Player?.getContainer()
     parties = []
     pbparties = []
     ok = {}
     for (let i = 10; i < 35; i++) {
          if (!container?.getStackInSlot(i)?.getName()?.includes("Party")) continue
          let hasclass = false
          let found = []
          container
               ?.getStackInSlot(i)
               ?.getLore()
               ?.slice(7, 12)
               ?.forEach(s => {
                    if (s.endsWith(")")) {
                         if (ok[i] >= 1) ok[i]++
                         else ok[i] = 1
                    }
                    if (s.includes(`§e${pfclass}§b`) && !partyFinderHighlight.switches["Manual Class Selection"]) {
                         hasclass = true
                         return
                    }
                    if (partyFinderHighlight.switches["Manual Class Selection"]) {
                         classlist.forEach(classname => {
                              if (s.includes(classname) && !found.includes(classname)) found.push(classname)
                         })
                    }
               })
          if (partyFinderHighlight.switches["Manual Class Selection"] && found.length != classlist.length) parties.push(i)
          if (!partyFinderHighlight.switches["Manual Class Selection"] && !hasclass) parties.push(i)
     }
}
