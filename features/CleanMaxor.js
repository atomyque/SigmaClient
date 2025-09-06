import { gui, Module } from "../gui/ClickGui"
import { guiPiece } from "../gui/draggableGuis"
import Dungeons from "./utils/Dungeons"
import { title } from "./utils/utils"

const CleanMaxorModule = new Module("Dungeons", "Clean Maxor", "Adds indicators for actions done in maxor.")
     .addSwitch("Change Name For Classes", false)
     .addSwitch("Pick Up Title", true)
     .addColor("Pick Up Title Color", 0, 245, 0, 255, false)
     .addColor("Main Color", 0, 255, 0, 255, true)
     .addColor("Subtitle Color", 0, 170, 0, 255, true)
     .addButton("Move Hud", () => {
          CleanMaxorHud.edit()
          gui.open()
     })
const CleanMaxorHud = new guiPiece("Clean Maxor Hud", Renderer.screen.getWidth() / 2, 100, 1).addText("text", "1/2", 0, 0, 2, true, true, 0, 245, 0, 255).addText("subtext", "Mage", 0, 12, 1, true, true, 0, 170, 0, 255)

register("tick", () => {
     if (!Dungeons.inp1 || !CleanMaxorModule.toggled) return CleanMaxorHud.dontdraw()
     CleanMaxorHud.draw()
})

let crystalindex = 0

register("chat", () => {
     crystalindex += 1
     CleanMaxorHud.text["subtext"].text = ""
     CleanMaxorHud.text["text"].text = `${Math.min(crystalindex, 2)}/2`
}).setCriteria("${amount}/2 Energy Crystals are now active!")

register("chat", () => {
     crystalindex = 0
     CleanMaxorHud.text["text"].text = `0/2`
}).setCriteria("The Energy Laser is charging up!")

register("chat", player => {
     if (!Dungeons.inp1 || !CleanMaxorModule.toggled || !CleanMaxorModule.switches["Pick Up Title"]) return
     if (player == Player.getName()) title("Picked Up Crystal!", true, CleanMaxorModule.color["Pick Up Title Color"].r, CleanMaxorModule.color["Pick Up Title Color"].g, CleanMaxorModule.color["Pick Up Title Color"].b, "random.orb", 1, 2)
     if (CleanMaxorModule.switches["Change Name For Classes"]) return (CleanMaxorHud.text["subtext"].text = Dungeons.getPlayerClass(player))
     CleanMaxorHud.text["subtext"].text = player
}).setCriteria("${player} picked up an Energy Crystal!")

register("packetReceived", (packet, event) => {
     if (packet.func_179807_a().toString() !== "TITLE" || !(packet?.func_179805_b()?.includes("Crystal") || packet?.func_179805_b()?.includes("Laser"))) return

     cancel(event)
}).setFilteredClass(net.minecraft.network.play.server.S45PacketTitle)

register("worldUnload", () => {
     crystalindex = 0
     CleanMaxorHud.text["text"].text = `0/2`
     CleanMaxorHud.text["subtext"].text = ""
})
