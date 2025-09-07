import { chat } from "./utils"

let playerclasses = {}
export default new (class Dngs {
     constructor() {
          this.playerclasses = {}
          this.inDungeon = false

          this.inClear = false

          this.inBossRoom = false

          this.inp1 = false
          this.inp2 = false
          this.inp3 = false
          this.inp5 = false

          this.whats = 0

          register("chat", () => {
               this.inp1 = false
               this.inp2 = true
          }).setCriteria("[BOSS] Storm: Pathetic Maxor, just like expected.")
          register("chat", () => {
               this.inp3 = true
               this.inp2 = false
               this.whats = 1
          }).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")
          register("chat", () => {
               this.inp3 = false
               this.whats = 0
          }).setCriteria("The Core entrance is opening!")
          register("chat", () => {
               this.inp1 = true
               this.inBossRoom = true
               this.inClear = false
          }).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!")
          register("chat", () => {
               this.inDungeon = true
          }).setCriteria("You are not allowed to use Potion Effects while in Dungeon, therefore all active effects have been paused and stored. They will be restored when you leave Dungeon!")
          register("chat", () => {
               this.inp5 = true
               this.inp3 = false
          }).setCriteria("[BOSS] Necron: Sometimes when you have a problem, you just need to destroy it all and start again.")
          register("chat", () => {
               this.inDungeon = true
          }).setCriteria("${player} is now ready!")
          register("chat", message => {
               const stage = message.match(/\((\d+)\/(\d+)\)/)

               if (stage) {
                    if (stage[1] == stage[2]) {
                         if (this.whats == 2 && stage[1] == 7) return
                         if (stage[1] != 7 && this.whats != 2) return
                         if (this.whats + 1 > 5) return
                         this.whats = this.whats + 1
                    }
               }
          })
               .setCriteria("${message}")
               .setContains()

          register("chat", () => {
               this.inClear = true
          }).setCriteria("&e[NPC] &bMort&f: &rHere, I found this map when I first entered the dungeon.&r")

          register("chat", () => {
               this.getclasses()
          }).setCriteria("[NPC] Mort: Good luck.")

          register("worldUnload", () => {
               this.inp3 = false
               this.inp1 = false
               this.inBossRoom = false
               this.inClear = false
               this.inDungeon = false
               this.inp5 = false
          })
     }
     getclasses() {
          this.playerclasses = {}
          // players.forEach(playername => {
          TabList.getNames().forEach(nm => {
               let regex = /\[\d+\]\s+([A-Za-z0-9_]+)(?:\s+.)*\s+\(([A-Za-z_]+)/ //chat gpt regex
               const clean = ChatLib.removeFormatting(nm).trim()

               let match1 = clean.match(regex)
               if (match1) {
                    let name = match1[1]
                    let playerClass = match1[2]
                    if (name) {
                         this.playerclasses[name] = playerClass
                    }
               }
          })
          // })
     }
     getPlayerClass(player) {
          if (this.playerclasses[player] == undefined) return "Unknown Player"
          return this.playerclasses[player]
     }
})()
