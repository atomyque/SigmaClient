import { Module } from "../gui/ClickGui"

let getSlotAtPositionMethod = net.minecraft.client.gui.inventory.GuiContainer.class.getDeclaredMethod("func_146975_c", [java.lang.Integer.TYPE, java.lang.Integer.TYPE])
getSlotAtPositionMethod.setAccessible(true)

const MiddleClickPetMenu = new Module("Skyblock", "Middle Click Pet Menu", "Middle clicks instead of clicking in pet menu.")

register("guiMouseClick", (mx, my, mb, gui, event) => {
     //  cancel(event)
     const screen = Client.getMinecraft().field_71462_r
     const container = Player.getContainer()
     if (!MiddleClickPetMenu.toggled || screen == null || !container?.getName()?.includes("Pets")) return
     cancel(event)
     const slot = getSlotAtPositionMethod.invoke(screen, new java.lang.Integer(mx), new java.lang.Integer(my))?.getSlotIndex()
     container.click(slot, false, "MIDDLE")
})
