import { Module } from "../gui/ClickGui"
import { guiPiece } from "../gui/draggableGuis"

const RagAlert = new Module("Dungeons", "Ragnarok Alert", "Alerts you when you should cast Ragnarok at p5.")
     .addTextBox("Hud Text", "&lRagnarok!")
     .addColor("Hud Color", 255, 75, 75, 255, true)
     .addButton("Move Hud", () => {
          ragAlertHud.edit()
          guiPiece.gui.open()
     })
const ragAlertHud = new guiPiece("Ragnarok Alert", Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2 - 20, 3).addText(
     "text",
     RagAlert.textBox["Hud Text"],
     0,
     0,
     1,
     true,
     true,
     RagAlert.color["Hud Color"].r,
     RagAlert.color["Hud Color"].g,
     RagAlert.color["Hud Color"].b,
     RagAlert.color["Hud Color"].alpha
)

register("chat", () => {
     playSound("note.pling", 1.0, 2.0)

     if (!RagAlert.toggled) return

     ragAlertHud.draw()

     setTimeout(() => {
          ragAlertHud.dontdraw()
     }, 1250)
}).setCriteria("[BOSS] Wither King: I no longer wish to fight, but I know that will not stop you.")

function notepling() {} //props to ct for being weird
