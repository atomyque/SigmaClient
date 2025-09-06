import { Module } from "../gui/ClickGui"
import { guiPiece } from "../gui/draggableGuis"
const defaultcolor = Renderer.color(20, 20, 20, 255)

let typedtext = ""

const keyboard = Java.type("org.lwjgl.input.Keyboard")
const SearchBar = new Module("Misc", "Search Bar", "Highlights the items containing what you put in the search bar.").addSwitch("Double Click To Highlight").addColor("Highlight Color", 0, 225, 0, 150, true)
let highlight = false

const type = register("guiKey", (char, keycode, gui, event) => {
     if (!SearchBar.toggled) return
     const screen = Client.getMinecraft().field_71462_r
     let found = false
     guis.forEach(guiname => {
          if (!screen?.toString()?.toLowerCase()?.includes(guiname)) return
          found = true
     })
     if (!found) return
     if (keycode == 28) {
          type.unregister()

          return
     }
     if (keycode == 14 && !keyboard.isKeyDown(keyboard.KEY_LCONTROL)) {
          typedtext = typedtext.slice(0, -1)

          return
     }
     if (keycode == 14 && keyboard.isKeyDown(keyboard.KEY_LCONTROL)) {
          typedtext = typedtext.trim().split(" ").slice(0, -1).join(" ") + " "

          return
     }
     if (!/^[\x20-\x7E]*$/.test(char)) return
     typedtext += char
     cancel(event)
}).unregister()

register("guiClosed", () => {
     type.unregister()
     blinkingbar.unregister()
     bar = false
})

// register("renderOverlay", () => {})

let lastclick = 0

register("renderItemOverlayIntoGui", (item, x, y, event) => {
     if (!SearchBar.toggled) return
     if (!highlight && SearchBar.switches["Double Click To Highlight"]) return
     if (!item.getName().toLowerCase().includes(typedtext.trim()) || typedtext.trim() == "") return
     const screen = Client.getMinecraft().field_71462_r
     let found = false
     guis.forEach(guiname => {
          if (!screen?.toString()?.toLowerCase()?.includes(guiname)) return
          found = true
     })
     if (!found) return

     const color = Renderer.color(SearchBar.color["Highlight Color"].r, SearchBar.color["Highlight Color"].g, SearchBar.color["Highlight Color"].b, SearchBar.color["Highlight Color"].alpha)
     Renderer.drawRect(color, x, y, 16, 16)
})

const guis = ["inventory", "container", "chest"]

let y = Renderer.screen.getHeight() - 25
const darkwhite = Renderer.color(150, 150, 150, 255)
const white = Renderer.color(255, 255, 255, 255)

const bordercolor = () => {
     if (!highlight && SearchBar.switches["Double Click To Highlight"]) {
          return darkwhite
     }
     return white
}

register("postGuiRender", () => {
     if (!SearchBar.toggled) return
     y = Renderer.screen.getHeight() - 25
     const screen = Client.getMinecraft().field_71462_r
     let found = false
     guis.forEach(guiname => {
          if (!screen?.toString()?.toLowerCase()?.includes(guiname)) return
          found = true
     })
     if (!found) return

     let minus = 0
     while (Renderer.getStringWidth(typedtext.trim().slice(0, typedtext.trim().length - minus)) > 144) {
          minus++
          bar = false
     }
     Renderer.retainTransforms(true)
     Renderer.drawRect(defaultcolor, Renderer.screen.getWidth() / 2 - 75, y, 150, 20)
     Renderer.drawLine(bordercolor(), Renderer.screen.getWidth() / 2 - 75, y, Renderer.screen.getWidth() / 2 + 75, y, 1, 6)
     Renderer.drawLine(bordercolor(), Renderer.screen.getWidth() / 2 - 75, y + 19.5, Renderer.screen.getWidth() / 2 + 75, y + 19.5, 1, 6)
     Renderer.drawLine(bordercolor(), Renderer.screen.getWidth() / 2 - 74.5, y, Renderer.screen.getWidth() / 2 - 74.5, y + 20, 1, 6)
     Renderer.drawLine(bordercolor(), Renderer.screen.getWidth() / 2 + 74.5, y, Renderer.screen.getWidth() / 2 + 74.5, y + 20, 1, 6)
     Renderer.drawString(minus > 0 ? typedtext.trim().slice(0, typedtext.trim().length - minus - 1) + "..." : typedtext.trim(), Renderer.screen.getWidth() / 2 - 72, y + 5.5, true)
     if (bar) Renderer.drawRect(Renderer.WHITE, Renderer.screen.getWidth() / 2 - 72 + Renderer.getStringWidth(typedtext.trim()), y + 3.5, 1, 12)
     Renderer.retainTransforms(false)
})
register("guiMouseClick", (mx, my, mb, gui) => {
     if (!SearchBar.toggled) return
     const screen = Client.getMinecraft().field_71462_r

     let found = false
     guis.forEach(guiname => {
          if (!screen?.toString()?.toLowerCase()?.includes(guiname)) return
          found = true
     })
     if (!found) return

     if (hovering(mx, my, Renderer.screen.getWidth() / 2 - 75, y, 150, 20) && mb == 0) {
          if (Date.now() - lastclick < 750) {
               highlight = !highlight
               lastclick = 0
          } else lastclick = Date.now()
          blinkingbar.register()
          bar = true
          type.register()
     }
     if (hovering(mx, my, Renderer.screen.getWidth() / 2 - 75, y, 150, 20) && mb == 1) {
          typedtext = ""
     }
     if (!hovering(mx, my, Renderer.screen.getWidth() / 2 - 75, y, 150, 20)) {
          type.unregister()
          blinkingbar.unregister()
          bar = false
     }
})

let bar = false

const blinkingbar = register("step", () => {
     bar = !bar
})
     .setDelay(1)
     .unregister()

function hovering(mx, my, x, y, width, height) {
     if (mx <= x + width && mx >= x && my <= y + height && my >= y) return true
     else return false
}
