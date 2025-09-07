import { Module } from "../gui/ClickGui"
import { chat } from "./utils/utils"

const CouldntFind = new Module("Dungeons", "Couldn't Find Notifier", `Sends a message in chat when you get "Couldn't Find Player"`)

const itemdetect = register("tick", () => {
     if (!CouldntFind.toggled) return
     const container = Player.getContainer()
     const itemname = container?.getStackInSlot(13)?.getName()
     if (itemname == undefined) return
     itemdetect.unregister()
     if (ChatLib.removeFormatting(itemname) !== "Couldn't find players!") return

     let unfoudplayers = []
     for (lore of container.getStackInSlot(13).getLore().slice(5)) {
          if (lore == "§5§o") break
          unfoudplayers.push(ChatLib.removeFormatting(lore).replace(" - ", ""))
     }
     chat(`Couldn't Find : ${unfoudplayers.join(", ")}`)
     ChatLib.command(`pc [Σ] Couldn't Find : ${unfoudplayers.join(", ")}`)
})

const open = register("guiOpened", () => {
     setTimeout(() => {
          itemdetect.register()
     }, 1)
})
register("guiClosed", () => {
     itemdetect.unregister()
})
