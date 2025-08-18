export default new (class Dngs {
     constructor() {
          this.inp3 = false
          this.inBossRoom = false
          this.whats = 0
          this.inClear = false

          register("chat", () => {
               this.inp3 = true
               this.whats = 1
          }).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")
          register("chat", () => {
               this.inp3 = false
               this.whats = 0
          }).setCriteria("[BOSS] Goldor: You have done it, you destroyed the factory…")
          register("chat", () => {
               this.inBossRoom = true
               this.inClear = false
          }).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!")

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

          register("worldUnload", () => {
               this.inp3 = false
               this.inBossRoom = false
               this.inClear = false
          })

          // getClass() {
          //      let index = TabList?.getNames()?.findIndex(line => line?.includes(Player.getName()))
          //      if (index == -1) return
          //      let match = TabList?.getNames()
          //           [index]?.removeFormatting()
          //           .match(/.+ \((.+) .+\)/)
          //      if (!match) return "EMPTY"
          //      return match[1]
          // }
     }
})()
