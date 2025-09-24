import { Module } from "../gui/ClickGui"
import { drawCircleQuarter } from "./utils/render"

const customScoreboard = new Module("Misc", "Custom Scoreboard", "Lets you customize the sidebar.").addSwitch("Show background", true).addSwitch("Text Shadow", true).addTextBox("Footer", "&f&lSigma Client").addSlider("Roundness", 10, 0, 10).addSwitch("Round All Corners", false)

let scoreboard = []
let header = ""

register("renderScoreboard", event => {
     scoreboard = []
     header = Scoreboard.getTitle().replace("§B§L CO-OP", "")
     // print(header)
     Scoreboard.getLines(false).forEach((e, i) => {
          const line = e.toString().replace("§", "&")

          // print(ChatLib.removeFormatting(line))
          if (ChatLib.removeFormatting(line).includes("www.hypixel.ne")) return
          scoreboard.push(line)
     })
     if (customScoreboard.toggled && scoreboard.length > 0) cancel(event)
})
register("renderOverlay", () => {
     if (!customScoreboard.toggled || scoreboard.length <= 0) return
     const color = Java.type("java.awt.Color")
     const lenghtsort = scoreboard.slice().sort((a, b) => Renderer.getStringWidth(b) - Renderer.getStringWidth(a))
     let width
     if (Renderer.getStringWidth(customScoreboard.textBox["Footer"]) > Renderer.getStringWidth(lenghtsort[0])) width = Renderer.getStringWidth(customScoreboard.textBox["Footer"]) + 6
     else width = Renderer.getStringWidth(lenghtsort[0])
     const x = Renderer.screen.getWidth() - width - 3
     const y = Renderer.screen.getHeight() / 2 - (scoreboard.length + 2) * 5
     if (customScoreboard.switches["Show background"]) {
          const roundness = customScoreboard.sliders["Roundness"].value
          const roundnessdifference = 10 - roundness
          const allrounded = customScoreboard.switches["Round All Corners"]
          const roundedwidth = allrounded == true ? -10 - roundness + roundnessdifference : 0

          drawCircleQuarter(x + 7 - roundnessdifference, y - 10 + roundness, roundness, "tl", 0, 0, 0, 0.3)
          drawCircleQuarter(x + 7 - roundnessdifference, y + scoreboard.length * 10 + 10 - roundness, roundness, "bl", 0, 0, 0, 0.3)
          if (allrounded) {
               drawCircleQuarter(x + width - 7 + roundnessdifference, y - roundnessdifference, roundness, "tr", 0, 0, 0, 0.3)
               drawCircleQuarter(x + width - 7 + roundnessdifference, y + scoreboard.length * 10 + roundnessdifference, roundness, "br", 0, 0, 0, 0.3)
          }
          Renderer.drawRect(Renderer.color(0, 0, 0, 255 * 0.3), x - 3, y - roundnessdifference, width + 6, scoreboard.length * 10 + roundnessdifference * 2)
          Renderer.drawRect(Renderer.color(0, 0, 0, 255 * 0.3), x - 3 + 10 - roundnessdifference, y - 10, width + 6 + roundedwidth, 10 - roundnessdifference)
          Renderer.drawRect(Renderer.color(0, 0, 0, 255 * 0.3), x - 3 + 10 - roundnessdifference, y + scoreboard.length * 10 + roundnessdifference, width + 6 + roundedwidth, 10 - roundnessdifference)
     }

     const shadow = customScoreboard.switches["Text Shadow"]
     Renderer.drawString(header, x + width / 2 - Renderer.getStringWidth(header) / 2, y - 10 + 1.5, shadow)
     Renderer.drawString(customScoreboard.textBox["Footer"], x + width / 2 - Renderer.getStringWidth(customScoreboard.textBox["Footer"]) / 2, y + scoreboard.length * 10 + 1, shadow)
     scoreboard.forEach((line, i) => {
          Renderer.drawString(line, x, y + i * 10, shadow)
     })
})
