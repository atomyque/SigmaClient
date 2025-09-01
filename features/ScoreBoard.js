import { Module } from "../gui/ClickGui"
import { drawCircleQuarter } from "./utils/render"

const customScoreboard = new Module("Render", "Custom Scoreboard", "Lets you customize the sidebar.").addSwitch("Show background").addSwitch("Text Shadow").addTextBox("Footer", "&f&lSigma Client")

let scoreboard = []
let header = ""

register("renderScoreboard", event => {
     scoreboard = []
     header = Scoreboard.getTitle().replace("§B§L CO-OP", "")
     // print(header)
     Scoreboard.getLines(false).forEach((e, i) => {
          const line = e.toString().replace("§", "&")

          if (i == Scoreboard.getLines(false).length - 1) return
          scoreboard.push(line)
     })
     if (customScoreboard.toggled && scoreboard.length > 0) cancel(event)
})
register("renderOverlay", () => {
     if (!customScoreboard.toggled || scoreboard.length <= 0) return
     const color = Java.type("java.awt.Color")
     const lenghtsort = scoreboard.slice().sort((a, b) => Renderer.getStringWidth(b) - Renderer.getStringWidth(a))

     const x = Renderer.screen.getWidth() - Renderer.getStringWidth(lenghtsort[0]) - 3
     const y = Renderer.screen.getHeight() / 2 - (scoreboard.length + 2) * 5
     if (customScoreboard.switches["Show background"]) {
          drawCircleQuarter(x + 7, y, 10, "tl", 0, 0, 0, 0.3)
          drawCircleQuarter(x + Renderer.getStringWidth(lenghtsort[0]) - 7, y, 10, "tr", 0, 0, 0, 0.3)
          drawCircleQuarter(x + 7, y + scoreboard.length * 10, 10, "bl", 0, 0, 0, 0.3)
          drawCircleQuarter(x + Renderer.getStringWidth(lenghtsort[0]) - 7, y + scoreboard.length * 10, 10, "br", 0, 0, 0, 0.3)
          Renderer.drawRect(Renderer.color(0, 0, 0, 255 * 0.3), x - 3, y, Renderer.getStringWidth(lenghtsort[0]) + 6, scoreboard.length * 10)
          Renderer.drawRect(Renderer.color(0, 0, 0, 255 * 0.3), x - 3 + 10, y - 10, Renderer.getStringWidth(lenghtsort[0]) + 6 - 20, 10)
          Renderer.drawRect(Renderer.color(0, 0, 0, 255 * 0.3), x - 3 + 10, y + scoreboard.length * 10, Renderer.getStringWidth(lenghtsort[0]) + 6 - 20, 10)
     }

     const shadow = customScoreboard.switches["Text Shadow"]
     Renderer.drawString(header, x + Renderer.getStringWidth(lenghtsort[0]) / 2 - Renderer.getStringWidth(header) / 2, y - 10 + 1.5, shadow)
     Renderer.drawString(customScoreboard.textBox["Footer"], x + Renderer.getStringWidth(lenghtsort[0]) / 2 - Renderer.getStringWidth(customScoreboard.textBox["Footer"]) / 2, y + scoreboard.length * 10 + 1, shadow)
     scoreboard.forEach((line, i) => {
          Renderer.drawString(line, x, y + i * 10, shadow)
     })
})
