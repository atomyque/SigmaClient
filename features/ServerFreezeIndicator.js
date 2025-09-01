import { Module } from "../gui/ClickGui"
import { guiPiece } from "../gui/draggableGuis"

let lasttick = Date.now()

const ServerFreezeIndicatorModule = new Module("Misc", "Server Freeze Indicator", "Shows how long the server has been lagging for after a certain threshold.").addSlider("Threshold", 500, 150, 2000).addButton("Move Display", () => {
     guiPiece.gui.open()
     ServerFreezeIndicatorGui.edit()
})
const ServerFreezeIndicatorGui = new guiPiece("Server Freeze Indicator", Renderer.screen.getWidth() / 2 + 2, Renderer.screen.getHeight() / 2 + 30, 2).addText("Tick", "&c500ms", 0, 0, 1, true)
register("packetReceived", () => {
     lasttick = Date.now()
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)

register("renderOverlay", () => {
     if (!ServerFreezeIndicatorModule.toggled) return
     if (Server.getIP().toLowerCase().includes("hypixel") || Server.getIP().toLowerCase().includes("catgirl"))
          if (Date.now() - lasttick > ServerFreezeIndicatorModule.sliders["Threshold"].value) {
               ServerFreezeIndicatorGui.draw()
               ServerFreezeIndicatorGui.text["Tick"].text = `&c${Date.now() - lasttick}ms`
          } else ServerFreezeIndicatorGui.dontdraw()
})
