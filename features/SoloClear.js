import { Module } from "../gui/ClickGui"
import { guiPiece } from "../gui/draggableGuis"
import Dungeons from "./utils/Dungeons"
import { title } from "./utils/utils"
const SecretCycleTimer = new guiPiece("Secret Cycle Timer", Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2 + 10, 1).addText("text", "&a17", 0, 0, 1, true, true)
const SoloClear = new Module("Dungeons", "Solo Clear", "Module for misc solo clear stuff.")
     .addSwitch("Puzzle Count title", true)
     .addSwitch("Secret Cycle Timer", false)
     .addButton("Move Secret Cycle Timer", () => {
          SecretCycleTimer.edit()
          guiPiece.gui.open()
     })

let tries = 0

const puzzlecheck = register("packetReceived", () => {
     tries--
     if (tries <= 0 || !SoloClear.switches["Puzzle Count title"] || !SoloClear.toggled) return puzzlecheck.unregister()
     TabList.getNames().forEach(line => {
          if (!line.includes("§b§lPuzzles: §r§f(")) return
          const puzzlecount = line.match(/\((\d+)\)/)
          if (!puzzlecount) return
          const color = puzzlecount[1] == 2 ? "&a" : puzzlecount[1] == 3 ? "&6" : puzzlecount[1] > 3 ? "&c" : ""
          title(`${color}${puzzlecount[1]} Puzzles`, true, 0, 0, 0, "random.orb", 1, 2 / (puzzlecount[1] - 1))
          puzzlecheck.unregister()
     })
})
     .setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)
     .unregister()

let tick = 0
let color = "a"
const secrettick = register("packetReceived", () => {
     if (!SoloClear.toggled || !SoloClear.switches["Secret Cycle Timer"] || !Dungeons.inClear) return SecretCycleTimer.dontdraw()

     SecretCycleTimer.draw()
     SecretCycleTimer.text["text"].text = `&${color}${tick}`
     color = tick <= 5 ? "c" : tick <= 10 ? "6" : "a"
     if (tick > 0) return tick--
     tick = 20
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)

register("packetReceived", packet => {
     if (packet.func_149307_h() != 2) return
     tick = 20
}).setFilteredClass(net.minecraft.network.play.server.S3EPacketTeams)

register("worldLoad", () => {
     puzzlecheck.register()
     tries = 100
})
