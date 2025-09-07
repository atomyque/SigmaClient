import { Module } from "../gui/ClickGui"

const MenuMiddleClick = new Module("Skyblock", "Menu Middle Click", "Middle clicks instead of clicking in pet menu.").addSwitch("Pet Menu", false).addSwitch("Equipment Menu", false).addSwitch("Trade Menu", false).addSwitch("Booster Cookie Menu", false)

register("guiMouseClick", (mx, my, mb, gui, event) => {
     const screen = Client.getMinecraft().field_71462_r
     const container = Player.getContainer()
     if (!MenuMiddleClick.toggled || screen == null) return
     if (
          (container?.getName()?.includes("Pets") && MenuMiddleClick.switches["Pet Menu"]) ||
          (container?.getName()?.includes("Your Equipment and Stats") && MenuMiddleClick.switches["Equipment Menu"]) ||
          (container?.getName()?.includes("Trades") && MenuMiddleClick.switches["Trade Menu"]) ||
          (container?.getName()?.includes("Booster Cookie") && MenuMiddleClick.switches["Booster Cookie Menu"])
     )
          middleclick(event)
})

function middleclick(event) {
     cancel(event)
     const container = Player.getContainer()
     const slot = Client.currentGui?.getSlotUnderMouse()?.getIndex()

     container.click(slot, false, "MIDDLE")
}
