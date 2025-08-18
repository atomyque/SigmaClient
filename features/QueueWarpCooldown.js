import { chat } from "./utils/utils"

let warped = 0
let command = false

register("chat", player => {
     warped = Date.now()
     ticking.register()
})
     .setCriteria("${player} entered The Catacombs, Floor VII!")
     .setContains()

const ticking = register("tick", () => {
     if (Date.now() - warped > 30000 && command) {
          ChatLib.command("joininstance CATACOMBS_FLOOR_SEVEN")
          command = false
          ticking.unregister()
     }
})

register("command", () => {
     if (Date.now() - warped > 30000) {
          ChatLib.command("joininstance CATACOMBS_FLOOR_SEVEN")
          return
     }
     command = true
     chat(`Joining new instance in ${(30 - (Date.now() - warped) / 1000).toFixed(2)}s.`)
}).setName("qf7")
