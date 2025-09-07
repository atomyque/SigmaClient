import { Module } from "../gui/ClickGui"
import { title } from "./utils/utils"

const CryptReminder = new Module("Dungeons", "Crypt Reminder", "Notifies you of how many crypts are needed to have all crypts.").addSwitch("Show Title", true).addSwitch("Send In Party Chat", true).addSlider("Alert Timestamp (seconds)", 45, 5, 120)

let time

register("chat", () => {
     setTimeout(() => {
          remindCrypt()
     }, 1000 * CryptReminder.sliders["Alert Timestamp (seconds)"].value)
}).setCriteria("[NPC] Mort: Good luck.")

register("command", () => {
     remindCrypt()
}).setName("ngigerniggerniggerniggenrigger")

function remindCrypt() {
     if (!CryptReminder.toggled) return
     TabList.getNames().forEach(line => {
          const cleanline = ChatLib.removeFormatting(line)
          if (!cleanline.includes("Crypts:")) return
          const crypts = cleanline.match(/Crypts:\s*(\d+)/)
          if (!crypts) return
          const cryptamount = parseInt(crypts[1].toString().trim())
          if (CryptReminder.switches["Show Title"]) title(cryptamount >= 5 ? `&aCrypts Done` : `&c${5 - cryptamount} Crypt${5 - cryptamount == 1 ? "" : "s"} Missing`, true, 0, 0, 0, "random.orb", 1, 2)
          if (CryptReminder.switches["Send In Party Chat"] && cryptamount < 5) ChatLib.command(`pc [Σ] ${5 - cryptamount} Crypt${5 - cryptamount == 1 ? " is" : "s Are"} Missing!`)
     })
}
