import { Module } from "../gui/ClickGui"
import { guiPiece } from "../gui/draggableGuis"
import { title } from "./utils/utils"
let questionned = false
const QuizTimerModule = new Module("Dungeons", "Quiz Timer", "Displays a timer of how many seconds are remaining for the next question to spawn.")
     .addSwitch("Only Show Timer", false)
     .addSwitch("Question Ready Title", true)
     .addButton("Move Hud", () => {
          QuizTimerHud.edit()
          guiPiece.gui.open()
     })
const QuizTimerHud = new guiPiece("Quiz Timer", Renderer.screen.getWidth() / 2, 50, 3).addText("text", "&5Quiz &7: &f4.15s", 0, 0, 1, true, true)

let ticks = 0

register("chat", () => {
     questionned = true
     ticks = 11 * 20
}).setCriteria("[STATUE] Oruo the Omniscient: I am Oruo the Omniscient. I have lived many lives. I have learned all there is to know.")

register("chat", player => {
     if (player != Player.getName()) return
     questionned = true
     ticks = 7 * 20
}).setCriteria("[STATUE] Oruo the Omniscient: ${player} answered Question ${question} correctly!")

register("chat", player => {
     QuizTimerHud.dontdraw()
}).setCriteria("[STATUE] Oruo the Omniscient: ${player} answered the final question correctly!")

register("packetReceived", () => {
     if (!QuizTimerModule.toggled) return QuizTimerHud.dontdraw()
     if (ticks <= 0) {
          if (!questionned) return
          if (QuizTimerModule.switches["Question Ready Title"]) title("&aQuestion Ready!", true, 0, 245, 0, "random.orb", 1, 2)
          questionned = false
          return (QuizTimerHud.text["text"].text = QuizTimerModule.switches["Only Show Timer"] == true ? `&aReady` : `&5Quiz &7: &aReady`)
     }
     ticks--
     QuizTimerHud.draw()
     QuizTimerHud.text["text"].text = QuizTimerModule.switches["Only Show Timer"] ? `&c${(ticks / 20).toFixed(2)}s` : `&5Quiz &7: &c${(ticks / 20).toFixed(2)}s`
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)

register("worldUnload", () => {
     questionned = false
     QuizTimerHud.dontdraw()
})
