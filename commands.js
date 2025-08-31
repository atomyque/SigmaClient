import { leapplayeratyou } from "./features/LeapAlerts"
import Dungeons from "./features/utils/Dungeons"
import { chat } from "./features/utils/utils"
import { gui } from "./gui/ClickGui"

const commands = ["debug"]
const debug = ["startp3", "endp3", "startboss", "endboss", "leap", "startp5", "endP5"]

register("command", (...args) => {
     if (args[0] !== undefined) {
          if (args[0].toLowerCase() == "debug") {
               if (args.length <= 1) return chat("Please enter an argument in debug")
               switch (args[1]) {
                    case "startp3":
                         chat("P3 Started.")
                         ChatLib.command("ct sim [BOSS] Goldor: Who dares trespass into my domain?", true)

                         return
                    case "endp3":
                         ChatLib.command("ct sim The Core entrance is opening!", true)
                         chat("P3 Ended.")
                         return
                    case "startboss":
                         chat("Boss Started.")
                         ChatLib.command("ct sim [BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!", true)
                         return
                    case "endboss":
                         chat("Boss Ended.")
                         Dungeons.inBossRoom = false
                         return
                    case "leap":
                         if (args.length < 3) return chat("Please Enter a player name")
                         chat(`Leapt ${args[2]} to you.`)
                         leapplayeratyou(args[2])
                         return
                    case "startp5":
                         chat("P5 Started.")
                         ChatLib.command("ct sim &r&4[BOSS] Necron&r&c: &r&cSometimes when you have a problem, you just need to destroy it all and start again.&r", true)
                         return
                    case "endp5":
                         chat("P5 Ended")
                         Dungeons.inp5 = false
                         return
                    default:
                         chat("Enter a valid argument.")
               }
          }
          return
     }
     gui.open()
})
     .setTabCompletions(args => {
          if (args.length === 1 && args[0] !== undefined) return commands.filter(cmd => cmd.startsWith(args[0] || ""))
          if (args.length === 2 && args[0] == "debug") return debug.filter(cmd => cmd.startsWith(args[1] || ""))
          return []
     })
     .setName("sigma")
     .setAliases("sigmaclient")
