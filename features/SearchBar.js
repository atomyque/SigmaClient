import { Module } from "../gui/ClickGui"
import { guiPiece } from "../gui/draggableGuis"
const defaultcolor = Renderer.color(20, 20, 20, 255)

let typedtext = ""
let showntext = ""
let lasttyped = 0

const keyboard = Java.type("org.lwjgl.input.Keyboard")
const SearchBar = new Module("Misc", "Search Bar", "Highlights the items containing what you put in the search bar.").addSwitch("Double Click To Highlight").addColor("Highlight Color", 0, 225, 0, 150, true)
let highlight = false

function formatLargeNumber(num) {
     sign = Math.sign(num)
     num = Math.abs(num)
     num = String(num)
     numLen = num.length
     if (numLen < 4) return num
     itter = 0
     numArray = []
     for (char of num) {
          numArray.push(char)
     }
     amount = 0
     for (char of num) {
          itter += 1
          if (numLen % 3 == itter % 3 && itter != numLen) {
               numArray.splice(itter + amount, 0, ",")
               amount++
          }
     }
     if (sign == -1) {
          num = "-"
     } else {
          num = ""
     }
     for (char of numArray) {
          num += char
     }
     return num
}

function isNum(n) {
     n.replaceAll("*", "")
     n.replaceAll("/", "")
     n.replaceAll("+", "")
     n.replaceAll("-", "")
     if (n.endsWith("k")) {
          n = n.split("k")[0]
     }
     if (n.endsWith("m")) {
          n = n.split("m")[0]
     }
     if (n.endsWith("b")) {
          n = n.split("b")[0]
     }
     if (n.endsWith("t")) {
          n = n.split("t")[0]
     }
     if (Number(n) == NaN) return false
     return true
}

function calculate() {
     try {
          calc = typedtext
          calcSplitted = calc.split(/([+\-*/])/)
          calc = ""
          for (num of calcSplitted) {
               if (num.endsWith("k") && isNum(num)) {
                    num = "(" + num.replace("k", "*1000)")
               }
               if (num.endsWith("m") && isNum(num)) {
                    num = "(" + num.replace("m", "*1000000)")
               }
               if (num.endsWith("b") && isNum(num)) {
                    num = "(" + num.replace("b", "*1000000000)")
               }
               if (num.endsWith("t") && isNum(num)) {
                    num = "(" + num.replace("t", "*1000000000000)")
               }
               calc += num
          }
          ans = "&a = " + formatLargeNumber(eval(calc))
          if (ans != "&a = NaN") {
               showntext = typedtext
               showntext += ans
               return
          }
          if (ans == "&a = NaN") {
               showntext = typedtext
          }
     } catch (error) {
          showntext = typedtext
          return
     }
}
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

          calculate()
          return
     }
     if (keycode == 14 && !keyboard.isKeyDown(keyboard.KEY_LCONTROL)) {
          typedtext = typedtext.slice(0, -1)
          let first = true
          const clickeddate = Date.now()
          const remove = register("step", () => {
               if (Date.now() - clickeddate < 500) return
               if (first) return (first = false)
               if (!keyboard.isKeyDown(keyboard.KEY_BACK)) return remove.unregister()
               typedtext = typedtext.slice(0, -1)
               calculate()
          }).setFps(30)

          calculate()
          return
     }
     if (keycode == 14 && keyboard.isKeyDown(keyboard.KEY_LCONTROL)) {
          typedtext = typedtext.trim().split(" ").slice(0, -1).join(" ") + " "
          typedtext = typedtext.trim()

          calculate()
          return
     }
     if (!/^[\x20-\x7E]*$/.test(char)) return

     let first = true
     const clickeddate = Date.now()
     lasttyped = clickeddate

     const remove = register("step", () => {
          if (Date.now() - clickeddate < 500) return
          if (first) return (first = false)
          if (!keyboard.isKeyDown(eval("keyboard." + "KEY_" + keyboard.getKeyName(keycode))) || lasttyped != clickeddate) return remove.unregister()
          typedtext += char
          calculate()
     }).setFps(30)
     typedtext += char
     cancel(event)
     calculate()
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

const width = 200
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
     while (Renderer.getStringWidth(typedtext.trim().slice(0, typedtext.trim().length - minus)) > width - 6) {
          minus++
          bar = false
     }
     Renderer.retainTransforms(true)
     Renderer.drawRect(defaultcolor, Renderer.screen.getWidth() / 2 - width / 2, y, width, 20)
     Renderer.drawLine(bordercolor(), Renderer.screen.getWidth() / 2 - width / 2, y, Renderer.screen.getWidth() / 2 + width / 2, y, 1, 6)
     Renderer.drawLine(bordercolor(), Renderer.screen.getWidth() / 2 - width / 2, y + 19.5, Renderer.screen.getWidth() / 2 + width / 2, y + 19.5, 1, 6)
     Renderer.drawLine(bordercolor(), Renderer.screen.getWidth() / 2 - (width / 2 - 0.5), y, Renderer.screen.getWidth() / 2 - (width / 2 - 0.5), y + 20, 1, 6)
     Renderer.drawLine(bordercolor(), Renderer.screen.getWidth() / 2 + (width / 2 - 0.5), y, Renderer.screen.getWidth() / 2 + (width / 2 - 0.5), y + 20, 1, 6)
     Renderer.drawString(minus > 0 ? showntext.slice(0, showntext.length - minus - 1) + "..." : showntext, Renderer.screen.getWidth() / 2 - width / 2 + 3, y + 5.5, true)
     if (bar) Renderer.drawRect(Renderer.WHITE, Renderer.screen.getWidth() / 2 - width / 2 + 3 + Renderer.getStringWidth(typedtext), y + 3.5, 1, 12)
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

     if (hovering(mx, my, Renderer.screen.getWidth() / 2 - width / 2, y, 150, 20) && mb == 0) {
          if (Date.now() - lastclick < 300) {
               highlight = !highlight
               lastclick = 0
          } else lastclick = Date.now()
          blinkingbar.register()
          bar = true
          type.register()
     }
     if (hovering(mx, my, Renderer.screen.getWidth() / 2 - width / 2, y, 150, 20) && mb == 1) {
          typedtext = ""
     }
     if (!hovering(mx, my, Renderer.screen.getWidth() / 2 - width / 2, y, 150, 20)) {
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
