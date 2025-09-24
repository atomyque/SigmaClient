import PogObject from "../../PogData"
const defaultcolor = Renderer.color(40, 40, 40, 255)
let toggledcolor = Renderer.color(208, 124, 188, 255)
const detailscolor = Renderer.color(34, 34, 34, 155)
const expandcolor = Renderer.color(34, 34, 34, 100)
import Font from "../../FontLib"
const fontb = new Font("SigmaClient/resources/MontserratSemibold.otf", 57)
const fontsb = new Font("SigmaClient/resources/MontserratMedium.otf", 57)
const color = Java.type("java.awt.Color")

function drawStringSemiBold(text, x, y, scale = 1, centeredx = false, centeredy = false) {
     const scl = 1 / 3
     const glbscale = scl * scale
     Renderer.retainTransforms(true)
     Renderer.scale(glbscale, glbscale)
     fontsb.drawString(text, x / glbscale - 0.75 / glbscale - (centeredx === true ? fontsb.getWidth(text) / 2 : 0), y / glbscale - (centeredy === true ? fontsb.getHeight(text) / 2 : 0), new java.awt.Color(1, 1, 1, 1))

     Renderer.retainTransforms(false)
}
function drawStringBold(text, x, y, scale = 1, centeredx = false, centeredy = false) {
     const scl = 1 / 3
     const glbscale = scl * scale
     Renderer.retainTransforms(true)
     Renderer.scale(glbscale, glbscale)
     fontb.drawString(text, x / glbscale - 0.75 / glbscale - (centeredx === true ? fontb.getWidth(text) / 2 : 0), y / glbscale - (centeredy === true ? fontb.getHeight(text) / 2 : 0), new java.awt.Color(1, 1, 1, 1))

     Renderer.retainTransforms(false)
}

let catscale = 2
let modulescale = 1.5
let settingsscale = 1.15
let sliding = false
let details = {}
let expand = {}
let expanded = []
let hoveredmodule = ""
let incrementamount = 0.5
let defaultscale = 0.65
let defaultslidelenght = 150

export class Module {
     static all = []
     static catorder = []

     constructor(category, name, description) {
          const existing = Module.all.find(mod => mod.name === name && mod.category === category)
          if (existing) {
               return existing
          }

          this.description = description
          this.category = category
          this.scale = defaultscale
          this.catx = undefined
          this.caty = undefined
          this.width = undefined
          this.height = 25 * defaultscale
          this.name = name
          this.toggled = false
          this.switches = {}
          this.sliders = {}
          this.color = {}
          this.selectors = {}
          this.buttons = {}
          this.textBox = {}
          this.separator = []
          this.paramorder = []
          this.indetails = false
          this.lastdetails = 0
          this.pos = undefined

          if (!Module.catorder.includes(this.category)) {
               Module.catorder.push(this.category)
          }
          Module.all.push(this)
     }

     addSwitch(switchName, state = false) {
          if (typeof switchName !== "string") {
               throw new Error("Switch name must be a string")
          }
          if (typeof state !== "boolean") {
               throw new Error("Switch default state must be a boolean")
          }

          this.switches[switchName] = state
          this.paramorder.push(switchName)
          return this
     }
     addTextBox(name, defaulttext) {
          if (typeof name !== "string") {
               throw new Error("Text Box name must be a string")
          }
          if (typeof defaulttext !== "string") {
               throw new Error("Default text must be a string")
          }
          this.textBox[name] = defaulttext
          this.paramorder.push(name)
          return this
     }
     addButton(name, fn) {
          if (typeof name !== "string") {
               throw new Error("Button name must be a string")
          }
          if (typeof fn !== "function") {
               throw new Error("Button fn must be a function")
          }
          this.buttons[name] = fn
          this.paramorder.push(name)
          return this
     }

     addSeparator(name) {
          if (typeof name !== "string") {
               throw new Error("Sperator name must be a string")
          }
          this.separator.push(name)
          this.paramorder.push(name)
          return this
     }

     flipSwitch(switchIndex) {
          if (typeof switchIndex !== "string" && typeof switchIndex !== "number") {
               throw new Error("Switch index must be a string or integer")
          }
          this.switches[switchIndex] = !this.switches[switchIndex]
          return this
     }

     getSwitch(switchIndex) {
          if (typeof switchIndex !== "string" && typeof switchIndex !== "number") {
               throw new Error("Switch index must be a string or integer")
          }

          return this.switches[switchIndex] ?? false
     }

     addSlider(name, value, minimum, maximum) {
          if (typeof name !== "string") {
               throw new Error("Slider name must be a string")
          }
          if (typeof value !== "number" || typeof minimum !== "number" || typeof maximum !== "number") {
               throw new Error("Values must be numbers")
          }
          if (minimum > maximum) {
               throw new Error("Minimum cannot be greater than maximum")
          }
          if (value < minimum || value > maximum) {
               throw new Error("Value must be between minimum and maximum")
          }

          this.paramorder.push(name)
          this.sliders[name] = { value, min: minimum, max: maximum }
          return this
     }

     addSelector(name, ...options) {
          this.paramorder.push(name)
          this.selectors[name] = { value: options[0], valuelist: options }
          return this
     }

     addColor(name, r, g, b, alpha, alphable = false) {
          this.paramorder.push(name)
          this.color[name] = { r, g, b, alpha, alphable }
          return this
     }

     getSlider(name) {
          return [this.sliders[name].value, this.sliders[name].min, this.sliders[name].max]
     }

     getTypeByName(name) {
          if (typeof name !== "string") {
               throw new Error("Name must be a string")
          }

          if (this.switches[name] !== undefined) return "switch"
          if (this.sliders[name] !== undefined) return "slider"
          if (this.buttons[name] !== undefined) return "button"
          if (this.separator.includes(name)) return "separator"
          if (this.textBox[name] !== undefined) return "textbox"
          if (this.color[name] !== undefined) return "color"
          if (this.selectors[name] !== undefined) return "selector"
          else return undefined
     }
     getByName(name) {
          if (typeof name !== "string") {
               throw new Error("Name must be a string")
          }

          if (this.switches[name] !== undefined) {
               return this.switches[name]
          }
          if (this.sliders[name] !== undefined) {
               return this.sliders[name]
          } else {
               return undefined
          }
     }
     getNameOrder() {
          return this.paramorder
     }

     getModulePos() {
          return [this.catx, this.caty + this.pos * this.height + this.height, this.width, this.height]
     }

     drawModule() {
          Renderer.drawRect(this.toggled == true ? toggledcolor : defaultcolor, this.catx, this.caty + this.pos * this.height + this.height, this.width, this.height)
          drawStringBold(this.name, Module.getSharedCategoryCoords(this.category)[0] + Module.getSharedCategoryCoords(this.category)[2] / 2, Module.getSharedCategoryCoords(this.category)[1] + this.pos * this.height + this.height + this.height / 2, modulescale * this.scale, true, true)
     }

     drawSettings() {
          this.getNameOrder().forEach((name, index) => {
               const scale = settingsscale * this.scale
               if (this.caty + this.pos * this.height + this.height + index * this.height + this.height + details[this.name] * this.height - this.getNameOrder().length * this.height < this.caty + this.pos * this.height + this.height) return
               Renderer.drawRect(
                    detailscolor,
                    this.catx,
                    this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                    this.width,
                    this.height
               )
               if (this.getTypeByName(name) == "switch") {
                    Renderer.drawRect(
                         this.getSwitch(name) == true ? toggledcolor : defaultcolor,
                         this.catx,
                         this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                         this.width - this.width * 0.97,
                         this.height
                    )

                    drawStringSemiBold(
                         name,
                         this.catx + (this.width - this.width * 0.97) * 1.3,
                         this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2.5 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                         scale,
                         false,
                         true
                    )
               }
               if (this.getTypeByName(name) == "slider") {
                    Renderer.retainTransforms(false)

                    const valuetostring = this.sliders[name].value.toFixed(this.sliders[name].max >= 100 ? 0 : this.sliders[name].max >= 10 ? 1 : this.sliders[name].max >= 1 ? 2 : 0).toString()
                    Renderer.drawRect(
                         defaultcolor,
                         this.catx,
                         this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 3 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                         this.width,
                         this.height - this.height / 0.8
                    )
                    // Renderer.drawRect(
                    //      defaultcolor,
                    //      this.catx + this.width - Renderer.getStringWidth(this.sliders[name].value.toFixed(this.sliders[name].max >= 100 ? 0 : this.sliders[name].max >= 10 ? 1 : this.sliders[name].max >= 1 ? 2 : 0)) * settingsscale * this.scale - 3 * settingsscale * this.scale,
                    //      this.caty +
                    //           this.pos * this.height +
                    //           index * this.height +
                    //           details[this.name] * this.height -
                    //           this.getNameOrder().length * this.height +
                    //           this.height * 3 +
                    //           this.height -
                    //           this.height / 0.8 +
                    //           (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                    //      Renderer.getStringWidth(this.sliders[name].value.toFixed(this.sliders[name].max >= 100 ? 0 : this.sliders[name].max >= 10 ? 1 : this.sliders[name].max >= 1 ? 2 : 0)) * settingsscale * this.scale + 3 * settingsscale * this.scale,
                    //      7.5 * settingsscale * this.scale
                    // )

                    Renderer.drawRect(
                         toggledcolor,
                         this.catx,
                         this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 3 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                         (this.width * (this.sliders[name].value - this.sliders[name].min)) / (this.sliders[name].max - this.sliders[name].min),
                         this.height - this.height / 0.8
                    )
                    drawStringSemiBold(
                         name,
                         this.catx + (this.width - this.width * 0.97) * 1.3,
                         this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2.5 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                         scale,
                         false,
                         true
                    )

                    const diff = (fontsb.getWidth(valuetostring) / 3) * scale
                    drawStringSemiBold(
                         valuetostring,
                         this.catx + this.width - diff,
                         this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2.5 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                         scale,
                         false,
                         true
                    )
               }
               if (this.getTypeByName(name) == "textbox") {
                    Renderer.retainTransforms(false)

                    Renderer.drawRect(
                         defaultcolor,
                         this.catx + this.width - (fontb.getWidth(this.textBox[name]) / 3) * scale - 1 * settingsscale * this.scale,
                         this.caty +
                              this.pos * this.height +
                              index * this.height +
                              details[this.name] * this.height -
                              this.getNameOrder().length * this.height +
                              this.height * 2 +
                              4 * settingsscale * this.scale +
                              (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                         (fontb.getWidth(this.textBox[name]) / 3) * scale + 1 * settingsscale * this.scale,
                         9 * settingsscale * this.scale
                    )

                    drawStringSemiBold(
                         name,
                         this.catx + (this.width - this.width * 0.97) * 1.3,
                         this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2.5 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                         scale,
                         false,
                         true
                    )

                    drawStringSemiBold(
                         this.textBox[name],
                         this.catx + this.width - (fontsb.getWidth(this.textBox[name]) / 3) * scale,
                         this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2.5 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                         scale,
                         false,
                         true
                    )
               }
               if (this.getTypeByName(name) == "button") {
                    drawStringSemiBold(
                         name,
                         this.catx + this.width / 2,
                         this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2.5 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                         scale,
                         true,
                         true
                    )
               }
               if (this.getTypeByName(name) == "selector") {
                    drawStringSemiBold(
                         this.selectors[name].value,
                         this.catx + this.width / 2,
                         this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2.5 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                         scale,
                         true,
                         true
                    )
                    if (!expanded.includes(this.name + name)) {
                         Renderer.drawLine(
                              Renderer.WHITE,
                              this.catx + 3 * this.scale,
                              this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0) + 3 * this.scale,
                              this.catx + 3 * this.scale + this.height / 2,
                              this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0) + this.height / 2,
                              2 * this.scale,
                              9
                         )
                         Renderer.drawLine(
                              Renderer.WHITE,
                              this.catx + 3 * this.scale,
                              this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 3 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0) - 3 * this.scale,
                              this.catx + 3 * this.scale + this.height / 2,
                              this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 3 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0) - this.height / 2,
                              2 * this.scale,
                              9
                         )
                    }

                    if (expanded.includes(this.name + name)) {
                         const filteredlist = this.selectors[name].valuelist.slice().filter(item => item !== this.selectors[name].value)
                         Renderer.drawLine(
                              Renderer.WHITE,
                              this.catx + 3 * this.scale,
                              this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0) + 3 * this.scale,
                              this.catx + 3 * this.scale + this.height / 3,
                              this.caty +
                                   this.pos * this.height +
                                   index * this.height +
                                   details[this.name] * this.height -
                                   this.getNameOrder().length * this.height +
                                   this.height * 2 +
                                   (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0) +
                                   this.height -
                                   3 * this.scale,
                              2 * this.scale,
                              9
                         )
                         Renderer.drawLine(
                              Renderer.WHITE,
                              this.catx + 3 * this.scale + this.height / 1.5,
                              this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0) + 3 * this.scale,
                              this.catx + 3 * this.scale + this.height / 3,
                              this.caty +
                                   this.pos * this.height +
                                   index * this.height +
                                   details[this.name] * this.height -
                                   this.getNameOrder().length * this.height +
                                   this.height * 2 +
                                   (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0) +
                                   this.height -
                                   3 * this.scale,
                              2 * this.scale,
                              9
                         )
                         Renderer.drawRect(
                              expandcolor,
                              this.catx,
                              this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 3 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                              this.width,
                              this.height * filteredlist.length
                         )
                         filteredlist.forEach((selectoritem, index) => {
                              drawStringSemiBold(
                                   selectoritem,
                                   this.catx + this.width / 2,
                                   this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 3.5 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                                   scale,
                                   true,
                                   true
                              )
                         })
                    }
               }
               if (this.getTypeByName(name) == "separator") {
                    Renderer.retainTransforms(false)
                    if (name == "") {
                         Renderer.drawRect(
                              defaultcolor,
                              this.catx,
                              this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2 + this.height / 2 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                              this.width,
                              (this.height / this.height) * 2.5
                         )
                    } else {
                         Renderer.drawRect(
                              defaultcolor,
                              this.catx,
                              this.caty +
                                   this.pos * this.height +
                                   index * this.height +
                                   details[this.name] * this.height -
                                   this.getNameOrder().length * this.height +
                                   this.height * 2 +
                                   this.height / 2 -
                                   (this.height / this.height) * 2.5 +
                                   (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                              this.width / 2 - Renderer.getStringWidth(name) / 2 - (this.width / this.width) * 2,
                              (this.height / this.height) * 2.5
                         )
                         Renderer.drawRect(
                              defaultcolor,
                              this.catx + this.width - (this.width / 2 - Renderer.getStringWidth(name) / 2 - (this.width / this.width) * 2),
                              this.caty +
                                   this.pos * this.height +
                                   index * this.height +
                                   details[this.name] * this.height -
                                   this.getNameOrder().length * this.height +
                                   this.height * 2 +
                                   this.height / 2 -
                                   (this.height / this.height) * 2.5 +
                                   (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                              this.width / 2 - Renderer.getStringWidth(name) / 2 - (this.width / this.width) * 2,
                              (this.height / this.height) * 2.5
                         )

                         Renderer.retainTransforms(true)
                         settingsscale = settingsscale * this.scale
                         Renderer.scale(settingsscale, settingsscale)
                         Renderer.drawString(
                              name,
                              Module.getSharedCategoryCoords(this.category)[0] / settingsscale - Renderer.getStringWidth(name) / 2 + this.width / 2 / settingsscale,
                              this.caty / settingsscale +
                                   (this.pos * this.height) / settingsscale +
                                   (index * this.height) / settingsscale +
                                   (details[this.name] * this.height) / settingsscale -
                                   (this.getNameOrder().length * this.height) / settingsscale +
                                   (this.height * 2) / settingsscale +
                                   5 +
                                   (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0) / settingsscale,
                              false
                         )
                         settingsscale = settingsscale / this.scale
                         Renderer.retainTransforms(false)
                    }
               }
               if (this.getTypeByName(name) == "color") {
                    Renderer.retainTransforms(false)
                    Renderer.drawRect(
                         Renderer.color(this.color[name].r, this.color[name].g, this.color[name].b, this.color[name].alpha),
                         this.catx + this.width - 32 * this.scale,
                         this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2 + 2 * this.scale + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                         30 * this.scale,
                         10 * this.scale
                    )
                    const hue = rgbToHsv(this.color[name].r, this.color[name].g, this.color[name].b).h * 360
                    const saturation = rgbToHsv(this.color[name].r, this.color[name].g, this.color[name].b).s
                    const brightness = rgbToHsv(this.color[name].r, this.color[name].g, this.color[name].b).v
                    const huecolor = new color(hsvToRgb(hue, 1, 1).r / 255, hsvToRgb(hue, 1, 1).g / 255, hsvToRgb(hue, 1, 1).b / 255)

                    if (expanded.includes(this.name + name)) {
                         Renderer.drawRect(
                              expandcolor,
                              this.catx,
                              this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 3 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                              this.width,
                              this.height * (this.color[name].alphable === true ? 7 : 6)
                         )
                         drawSvBox(
                              this.catx + 2 * this.scale,
                              this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 3 + 2 * this.scale + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                              this.width - 4 * this.scale,
                              this.height * 5 - 4 * this.scale,
                              huecolor
                         )

                         Renderer.drawRect(
                              Renderer.WHITE,
                              this.catx + saturation * (this.width - 4 * this.scale),
                              this.caty +
                                   this.pos * this.height +
                                   index * this.height +
                                   details[this.name] * this.height -
                                   this.getNameOrder().length * this.height -
                                   3 * this.scale +
                                   (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0) +
                                   this.height * 8 -
                                   brightness * (this.height * 5 - 4 * this.scale),
                              4 * this.scale * 2,
                              4 * this.scale * 2
                         )
                         Renderer.drawRect(
                              Renderer.BLACK,
                              this.catx + saturation * (this.width - 4 * this.scale),
                              this.caty +
                                   this.pos * this.height +
                                   index * this.height +
                                   details[this.name] * this.height -
                                   this.getNameOrder().length * this.height -
                                   3 * this.scale +
                                   (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0) +
                                   this.height * 8 -
                                   brightness * (this.height * 5 - 4 * this.scale),
                              1 * this.scale * 2,
                              4 * this.scale * 2
                         )
                         Renderer.drawRect(
                              Renderer.BLACK,
                              this.catx + saturation * (this.width - 4 * this.scale),
                              this.caty +
                                   this.pos * this.height +
                                   index * this.height +
                                   details[this.name] * this.height -
                                   this.getNameOrder().length * this.height -
                                   3 * this.scale +
                                   (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0) +
                                   this.height * 8 -
                                   brightness * (this.height * 5 - 4 * this.scale),
                              4 * this.scale * 2,
                              1 * this.scale * 2
                         )
                         Renderer.drawRect(
                              Renderer.BLACK,
                              this.catx + saturation * (this.width - 4 * this.scale),
                              this.caty +
                                   this.pos * this.height +
                                   index * this.height +
                                   details[this.name] * this.height -
                                   this.getNameOrder().length * this.height -
                                   3 * this.scale +
                                   (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0) +
                                   this.height * 8 -
                                   brightness * (this.height * 5 - 4 * this.scale) +
                                   6 * this.scale,
                              4 * this.scale * 2,
                              1 * this.scale * 2
                         )
                         Renderer.drawRect(
                              Renderer.BLACK,
                              this.catx + saturation * (this.width - 4 * this.scale) + 6 * this.scale,
                              this.caty +
                                   this.pos * this.height +
                                   index * this.height +
                                   details[this.name] * this.height -
                                   this.getNameOrder().length * this.height -
                                   3 * this.scale +
                                   (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0) +
                                   this.height * 8 -
                                   brightness * (this.height * 5 - 4 * this.scale),
                              1 * this.scale * 2,
                              4 * this.scale * 2
                         )

                         drawHueSlider(
                              this.catx + 2 * this.scale,
                              this.caty +
                                   this.pos * this.height +
                                   index * this.height +
                                   details[this.name] * this.height -
                                   this.getNameOrder().length * this.height +
                                   this.height * 2 +
                                   2 * this.scale +
                                   (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0) +
                                   this.height * 6,
                              this.width - 4 * this.scale,
                              this.height - 4 * this.scale
                         )

                         Renderer.drawRect(
                              Renderer.WHITE,
                              this.catx + 1 * this.scale + (hue / 360) * (this.width - 4 * this.scale),
                              this.caty +
                                   this.pos * this.height +
                                   index * this.height +
                                   details[this.name] * this.height -
                                   this.getNameOrder().length * this.height +
                                   this.height * 2 +
                                   1.5 * this.scale +
                                   (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0) +
                                   this.height * 6,
                              2 * this.scale,
                              this.height - 3 * this.scale
                         )
                         if (this.color[name].alphable) {
                              const clr = new color(this.color[name].r / 255, this.color[name].g / 255, this.color[name].b / 255, 1)
                              const transparentclr = new color(this.color[name].r / 255, this.color[name].g / 255, this.color[name].b / 255, 0)
                              drawGradient(
                                   this.catx + 2 * this.scale,
                                   this.caty +
                                        this.pos * this.height +
                                        index * this.height +
                                        details[this.name] * this.height -
                                        this.getNameOrder().length * this.height +
                                        this.height * 2 +
                                        2 * this.scale +
                                        (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0) +
                                        this.height * 7,
                                   this.width - 4 * this.scale,
                                   this.height - 4 * this.scale,
                                   transparentclr,
                                   clr,
                                   transparentclr,
                                   clr
                              )
                              Renderer.drawRect(
                                   Renderer.WHITE,
                                   this.catx + 1 * this.scale + (this.color[name].alpha / 255) * (this.width - 4 * this.scale),
                                   this.caty +
                                        this.pos * this.height +
                                        index * this.height +
                                        details[this.name] * this.height -
                                        this.getNameOrder().length * this.height +
                                        this.height * 2 +
                                        1.5 * this.scale +
                                        (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0) +
                                        this.height * 7,
                                   2 * this.scale,
                                   this.height - 3 * this.scale
                              )
                         }
                    }

                    drawStringSemiBold(
                         name,
                         this.catx + (this.width - this.width * 0.97) * 1.3,
                         this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2.5 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * this.height : 0),
                         scale,
                         false,
                         true
                    )
               }
          })
     }

     static drawCategory(category) {
          // if (this.getSharedCategoryCoords(category)[1] == undefined) this.setSharedCategoryX(category, 10)
          Renderer.drawRect(
               defaultcolor,
               this.getSharedCategoryCoords(category)[0],
               this.getSharedCategoryCoords(category)[1] - this.getSharedCategoryCoords(category)[3] * 1.25 + this.getSharedCategoryCoords(category)[3],
               this.getSharedCategoryCoords(category)[2],
               this.getSharedCategoryCoords(category)[3] * 1.25
          )

          catscale = catscale * Module.getSharedCategoryCoords(category)[4]
          drawStringBold(
               category,
               this.getSharedCategoryCoords(category)[0] + this.getSharedCategoryCoords(category)[2] / 2,
               this.getSharedCategoryCoords(category)[1] - this.getSharedCategoryCoords(category)[3] * 1.5 + this.getSharedCategoryCoords(category)[3] * 2 - 0.75 * catscale,
               catscale,
               true,
               true
          )
          catscale = catscale / Module.getSharedCategoryCoords(category)[4]
     }

     moduleanimation(end, duration, sign, module) {
          if (details[module] === undefined) details[module] = 0
          this.start = details[module]
          const incrementation = end / (duration / 10)

          const slide = register("step", () => {
               if (sign > 0) {
                    if (details[module] + incrementation >= this.start + end - incrementation) {
                         details[module] = this.start + end

                         slide.unregister()
                    } else details[module] = details[module] + incrementation
               }
               if (sign < 0) {
                    if (details[module] - incrementation <= this.start + end + incrementation) {
                         details[module] = this.start + end
                         sliding = false
                         slide.unregister()
                    } else details[module] = details[module] + incrementation
               }
          }).setFps(100)
     }
     slideanimation(end, duration, sign) {
          this.startpos = this.pos
          sliding = true
          const incrementation = end / (duration / 10)
          const starttime = Date.now()

          const slide = register("step", () => {
               if (sign > 0) {
                    if (this.pos + incrementation >= this.startpos + end + incrementation) {
                         this.pos = this.startpos + end
                         sliding = false
                         slide.unregister()
                    } else this.pos = this.pos + incrementation
               }
               if (sign < 0) {
                    if (this.pos - incrementation <= this.startpos + end - incrementation) {
                         this.pos = this.startpos + end
                         sliding = false
                         slide.unregister()
                    } else this.pos = this.pos + incrementation
               }
          }).setFps(100)
     }

     loadModules() {
          const currentmodule = data.modules.find(mod => mod.name === this.name && mod.category === this.category)
          if (!currentmodule) return

          if (!data.modules.some(mod => mod.name === this.name && mod.category === this.category)) {
               this.width = Module.getSharedCategoryCoords(currentmodule.category)[2]
               this.scale = Module.getSharedCategoryCoords(currentmodule.category)[3]
               this.height = Module.getSharedCategoryCoords(currentmodule.category)[4]
          }

          this.toggled = currentmodule.toggled
          this.paramorder.forEach(name => {
               if (this.getTypeByName(name) == "switch") {
                    if (typeof currentmodule.switches[name] == "undefined") return
                    this.switches[name] = currentmodule.switches[name]
               }
               if (this.getTypeByName(name) == "slider") {
                    if (typeof currentmodule.sliders[name] == "undefined") return
                    this.sliders[name].value = currentmodule.sliders[name].value
               }
               if (this.getTypeByName(name) == "color") {
                    if (typeof currentmodule.color[name] == "undefined") return
                    this.color[name] = currentmodule.color[name]
               }
               if (this.getTypeByName(name) == "textbox") {
                    if (typeof currentmodule.textBox[name] == "undefined") return
                    this.textBox[name] = currentmodule.textBox[name]
               }
               if (this.getTypeByName(name) == "selector") {
                    if (typeof currentmodule.selectors[name] == "undefined") return
                    this.selectors[name].value = currentmodule.selectors[name].value
               }
          })
          this.height = currentmodule.height
          this.width = currentmodule.width
          this.scale = currentmodule.scale
          this.catx = currentmodule.catx
          this.caty = currentmodule.caty
     }

     static getCategories() {
          return this.catorder
     }

     static putCategoryInFirst(category) {
          this.catorder = this.catorder.filter(cat => cat !== category)
          this.catorder.push(category)
     }

     static getCategoryContent(category) {
          return Module.all.filter(mod => mod.category === category)
     }

     static setSharedCategoryX(category, x) {
          Module.all.forEach(module => {
               if (module.category === category) {
                    module.catx = x
               }
          })
     }

     static setSharedCategoryY(category, y) {
          Module.all.forEach(module => {
               if (module.category === category) {
                    module.caty = y
               }
          })
     }

     static setSharedCategoryWidth(category, width) {
          Module.all.forEach(module => {
               if (module.category === category) {
                    module.width = width
               }
          })
     }

     static setSharedCategoryHeight(category, height) {
          Module.all.forEach(module => {
               if (module.category === category) {
                    module.height = height
               }
          })
     }
     static setSharedCategoryScale(category, scl) {
          Module.all.forEach(module => {
               if (module.category === category) {
                    module.scale = scl
               }
          })
     }

     static getSharedCategoryCoords(category) {
          const mod = Module.all.find(module => module.category === category)
          return mod ? [mod.catx, mod.caty, mod.width, mod.height, mod.scale] : [null, null, null, null, null]
     }

     static resetGui() {
          let lastcat = ""

          this.getCategories().forEach(category => {
               this.getCategoryContent(category).forEach((module, index) => {
                    if (index == 0) {
                         if ((fontb.getWidth(module.name) / 3) * modulescale >= (fontb.getWidth(category) / 3) * catscale) this.setSharedCategoryWidth(category, ((fontb.getWidth(module.name) / 3) * modulescale + 30 * modulescale) * this.getSharedCategoryCoords(category)[4])
                         else {
                              this.setSharedCategoryWidth(category, ((fontb.getWidth(category) / 3) * catscale + 6 * catscale) * this.getSharedCategoryCoords(category)[4])
                         }
                    }
               })
               this.setSharedCategoryScale(category, defaultscale)
               this.setSharedCategoryHeight(category, clickGui.sliders["Click Gui Height"].value * defaultscale * defaultscale)
               this.setSharedCategoryX(category, 10 + this.getSharedCategoryCoords(lastcat)[0] + this.getSharedCategoryCoords(lastcat)[2])
               this.setSharedCategoryY(category, 10)
               lastcat = category
          })
     }

     static getAll() {
          return Module.all
     }
}

let data = new PogObject("SigmaClient", { modules: [] }, "modulesData.json")

function saveModules() {
     const saveArray = Module.getAll().map(m => ({
          category: m.category,
          name: m.name,
          toggled: m.toggled,
          switches: m.switches,
          sliders: m.sliders,
          paramorder: m.paramorder,
          textBox: m.textBox,
          color: m.color,
          scale: m.scale,
          catx: m.catx,
          selectors: m.selectors,
          caty: m.caty,
          height: m.height,
          width: m.width
     }))
     data.modules = saveArray
     data.save()
}

register("worldUnload", () => {
     saveModules()
})

export const gui = new Gui()

register("command", () => {
     gui.open()
}).setName("open")

function sortmodules() {
     let lastcat = ""
     details = {}
     expand = {}
     expanded = []

     Module.getCategories().forEach(category => {
          let neu = 0
          Module.getCategoryContent(category).forEach((module, index) => {
               module.indetails = false
               module.pos = index
               if (index == 0) {
                    if ((fontb.getWidth(module.name) / 3) * modulescale >= (fontb.getWidth(category) / 3) * catscale) Module.setSharedCategoryWidth(category, ((fontb.getWidth(module.name) / 3) * modulescale + 30 * modulescale) * Module.getSharedCategoryCoords(category)[4])
                    else {
                         Module.setSharedCategoryWidth(category, ((fontb.getWidth(category) / 3) * catscale + 6 * catscale) * Module.getSharedCategoryCoords(category)[4])
                    }
               }
               const found = data.modules.some(mod => mod.name === module.name && mod.category === module.category)
               if (found) neu++
          })

          // if (!data.modules.find(mod => mod.name === module.name && mod.category === module.category)) return
          if (!(neu >= Module.getCategoryContent(category).length)) {
               Module.setSharedCategoryX(category, 10 * Module.getSharedCategoryCoords(category)[4] + Module.getSharedCategoryCoords(lastcat)[0] + Module.getSharedCategoryCoords(lastcat)[2])
               Module.setSharedCategoryY(category, 10)
          }
          lastcat = category
     })
}
register("worldLoad", () => {
     Module.getAll().sort((a, b) => fontb.getWidth(b.name) / 3 - fontb.getWidth(a.name) / 3)

     sortmodules()
     Module.all.forEach(e => {
          e.loadModules()
     })
})

let teststr = ""

const image = new Image.fromFile("./config/ChatTriggers/modules/SigmaClient/resources/sigma.png")

gui.registerDraw(() => {
     Renderer.retainTransforms(true)
     const scale = 0.1
     Renderer.scale(scale, scale)

     image.draw(Renderer.screen.getWidth() / scale - 60 / scale, Renderer.screen.getHeight() / scale - 60 / scale)
     Renderer.retainTransforms(false)
     Module.getCategories().forEach(category => {
          Module.drawCategory(category)
          Module.getCategoryContent(category).forEach(module => {
               if (details[module.name] !== 0) module.drawSettings(module.height)
               module.drawModule(module.height)
               if (hoveredmodule == module.name + category) {
                    Renderer.translate(0, 0, 1)
                    if (module.description?.length > 40) {
                         const splitindex = module.description.lastIndexOf(" ", 40)
                         const first = module.description.slice(0, splitindex)
                         const second = module.description.slice(splitindex + 1)

                         Renderer.drawRect(defaultcolor, module.catx + module.width + 3 * module.scale, module.caty + module.pos * module.height + module.height, (fontb.getWidth(first) / 3) * module.scale + 3, module.height)
                         Renderer.translate(0, 0, 2)
                         drawStringBold(first, module.catx + module.width + 6 * module.scale, module.caty + module.pos * module.height + module.height * 1 + 1 * module.scale, module.scale, false, false)
                         Renderer.translate(0, 0, 2)
                         drawStringBold(second, module.catx + module.width + 6 * module.scale, module.caty + module.pos * module.height + module.height * 1.5 + 1 * module.scale, module.scale, false, false)
                    } else {
                         const text = module.description == undefined ? "No description set." : module.description
                         Renderer.drawRect(defaultcolor, module.catx + module.width + 3 * module.scale, module.caty + module.pos * module.height + module.height, (fontb.getWidth(text) / 3) * module.scale + 3, module.height)
                         Renderer.translate(0, 0, 2)
                         drawStringBold(text, module.catx + module.width + 6 * module.scale, module.caty + module.pos * module.height + module.height * 1.5, module.scale, false, true)
                    }
               }
          })
     })
})

let b = 255

register("command", (...args) => (b = args)).setName("b")

// function drawcolorSpectre(width, height) {
//      const t = new Thread(() => {
//           let realWidth = Client.getMinecraft().field_71443_c
//           let guiWidth = Renderer.screen.getWidth()

//           let pixelSize = 1 / (realWidth / guiWidth)

//           Renderer.getRainbow(1, 10)
//           for (let r = 0; r <= 255; r += (255 / width) * 5) {
//                for (let g = 0; g <= 255; g += (255 / height) * 5) {
//                     Renderer.drawRect(Renderer.color(r, g, b, 255), ((r * pixelSize) / 255) * width, ((g * pixelSize) / 255) * height, pixelSize * 5, pixelSize * 5)
//                }
//           }
//      }).start()
// }

// register("renderOverlay", () => {
//      drawcolorSpectre(100, 100)
// })
// I will make that once I'm not lazy
function hovering(mx, my, x, y, width, height) {
     if (mx <= x + width && mx >= x && my <= y + height && my >= y) return true
     else return false
}

function fixmodules() {
     Module.getCategories().forEach(category => {
          Module.setSharedCategoryX(category, Module.getSharedCategoryCoords(category)[0])
          Module.setSharedCategoryY(category, Module.getSharedCategoryCoords(category)[1])
          Module.setSharedCategoryWidth(category, Module.getSharedCategoryCoords(category)[2])
          Module.setSharedCategoryHeight(category, Module.getSharedCategoryCoords(category)[3])
          Module.setSharedCategoryScale(category, Module.getSharedCategoryCoords(category)[4])
     })
}

gui.registerOpened(() => {
     sortmodules()
     fixmodules()
     descriptionhover.register()
     moduleclick.register()
     settingclick.register()
     categorymove.register()
})
gui.registerClosed(() => {
     saveModules()
     descriptionhover.unregister()
     moduleclick.unregister()
     settingclick.unregister()
     categorymove.unregister()
})
const moduleclick = register("clicked", (mx, my, button, down) => {
     Module.getCategories().forEach(category => {
          Module.getCategoryContent(category).forEach((module, index) => {
               if (hovering(mx, my, module.getModulePos()[0], module.getModulePos()[1], module.getModulePos()[2], module.getModulePos()[3]) && button == 0 && down) module.toggled = !module.toggled
               if (hovering(mx, my, module.getModulePos()[0], module.getModulePos()[1], module.getModulePos()[2], module.getModulePos()[3]) && button == 1 && down && !sliding) {
                    if (module.getNameOrder().length == 0) return

                    // defaultslidelenght = module.sliders["Sliding duration"].value
                    if (!module.indetails) {
                         module.moduleanimation(module.getNameOrder().length, defaultslidelenght, 1, module.name)
                         Module.getCategoryContent(category).forEach((m, idx) => {
                              if (idx <= index) return

                              m.slideanimation(module.getNameOrder().length, defaultslidelenght, 1)
                         })
                    }
                    if (module.indetails) {
                         let count = 0

                         Object.keys(module.color).forEach(c => {
                              if (!expanded.includes(module.name + c)) return

                              expand = Object.keys(expand).filter(key => key !== module.name + c)
                              expanded = expanded.filter(key => key !== module.name + c)
                              count += module.color[c].alphable === true ? 7 : 6
                         })
                         Object.keys(module.selectors).forEach(c => {
                              if (!expanded.includes(module.name + c)) return

                              expand = Object.keys(expand).filter(key => key !== module.name + c)
                              expanded = expanded.filter(key => key !== module.name + c)
                              count += module.selectors[c].valuelist.length - 1
                         })

                         // expand = {}
                         // expanded = []

                         // Module.getCategoryContent(module.category).forEach((mdl, i) => {
                         //      if (i <= index) return
                         //      mdl.pos += expanded.includes(module.name + ) ? -3 : 0
                         // })
                         module.moduleanimation(-module.getNameOrder().length, defaultslidelenght, -1, module.name)
                         Module.getCategoryContent(category).forEach((m, idx) => {
                              if (idx <= index) return
                              m.pos -= count

                              m.slideanimation(-module.getNameOrder().length, defaultslidelenght, -1)
                         })
                    }
                    module.indetails = !module.indetails
               }
          })
     })
}).unregister()

function sliderdrag(slidername) {
     register("clicked", (mx, my, button, down) => {
          if (!down) slide.unregister()
     })

     const slide = register("dragged", (dx, dy, mx, my, button) => {
          Module.getAll().forEach(module => {
               if (!module.indetails) return
               const moduleX = module.catx + module.width / 2

               module.getNameOrder().forEach((name, idx) => {
                    if (slidername != name) return
                    if ((mx / module.width - (moduleX - module.width / 2) / module.width) * (module.sliders[name].max - module.sliders[name].min) + module.sliders[name].min <= module.sliders[name].min) {
                         module.sliders[name].value = module.sliders[name].min
                         return
                    }
                    if ((mx / module.width - (moduleX - module.width / 2) / module.width) * (module.sliders[name].max - module.sliders[name].min) + module.sliders[name].min >= module.sliders[name].max) {
                         module.sliders[name].value = module.sliders[name].max
                         return
                    }
                    const moduleY = module.caty + module.pos * module.height + (idx + 1) * module.height
                    if (module.getTypeByName(name) === "slider") {
                         module.sliders[name].value = (mx / module.width - (moduleX - module.width / 2) / module.width) * (module.sliders[name].max - module.sliders[name].min) + module.sliders[name].min
                    }
               })
          })
     })
}

const settingclick = register("clicked", (mx, my, button, down) => {
     Module.getCategories().forEach(category => {
          Module.getCategoryContent(category).forEach((module, idx) => {
               if (!module.indetails) return

               module.getNameOrder().forEach((name, index) => {
                    if (expanded.includes(module.name + name) && module.getTypeByName(name) == "selector") {
                         const filteredlist = module.selectors[name].valuelist.slice().filter(item => item !== module.selectors[name].value)
                         filteredlist.forEach((slk, i) => {
                              if (
                                   hovering(
                                        mx,
                                        my,
                                        module.catx + 2 * module.scale,
                                        module.caty +
                                             module.pos * module.height +
                                             index * module.height +
                                             details[module.name] * module.height -
                                             module.getNameOrder().length * module.height +
                                             module.height * 3 +
                                             1 * module.scale +
                                             i * module.height +
                                             (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * module.height : 0),
                                        module.width,
                                        module.height
                                   ) &&
                                   button == 0 &&
                                   down
                              )
                                   module.selectors[name].value = slk
                         })
                    }
                    if (expanded.includes(module.name + name) && module.getTypeByName(name) == "color") {
                         if (
                              hovering(
                                   mx,
                                   my,
                                   module.catx + 2 * module.scale,
                                   module.caty +
                                        module.pos * module.height +
                                        index * module.height +
                                        details[module.name] * module.height -
                                        module.getNameOrder().length * module.height +
                                        module.height * 3 +
                                        1 * module.scale +
                                        (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * module.height : 0),
                                   module.width - 4 * module.scale,
                                   module.height * 5 - 4 * module.scale
                              ) &&
                              button == 0 &&
                              down
                         ) {
                              // const xm = (mx - module.catx - 1 * module.scale) / (module.width - 2 * module.scale)
                              // ChatLib.chat(xm)

                              const xm = (mx - module.catx - 1 * module.scale) / (module.width - 2 * module.scale)
                              const ym = Math.abs(
                                   1 -
                                        (my -
                                             (module.caty +
                                                  module.pos * module.height +
                                                  index * module.height +
                                                  details[module.name] * module.height -
                                                  module.getNameOrder().length * module.height +
                                                  module.height * 3 +
                                                  1 * module.scale +
                                                  (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * module.height : 0))) /
                                             (module.height * 5 - 4 * module.scale)
                              )
                              const h = rgbToHsv(module.color[name].r, module.color[name].g, module.color[name].b).h
                              const v = rgbToHsv(module.color[name].r, module.color[name].g, module.color[name].b).v

                              module.color[name].r = hsvToRgb(h * 360, xm, ym).r
                              module.color[name].g = hsvToRgb(h * 360, xm, ym).g
                              module.color[name].b = hsvToRgb(h * 360, xm, ym).b

                              // const clik = register("clicked", (mmx, mmy, button, down) => {
                              //      if (button === 0 && !down) {
                              //           drag.unregister()
                              //           clik.unregister()
                              //      }
                              // })
                              // const drag = register("dragged", (dx, dy, mmx, mmy, button) => {
                              //      let xmm = (mmx - module.catx - 1 * module.scale) / (module.width - 2 * module.scale)
                              //      let ymm = Math.abs(
                              //           1 -
                              //                (mmy -
                              //                     (module.caty +
                              //                          module.pos * module.height +
                              //                          index * module.height +
                              //                          details[module.name] * module.height -
                              //                          module.getNameOrder().length * module.height +
                              //                          module.height * 3 +
                              //                          1 * module.scale +
                              //                          (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * module.height : 0))) /
                              //                     (module.height * 5 - 4 * module.scale)
                              //      )

                              //      xmm = xmm = Math.max(0.005, Math.min(xmm, 1))
                              //      ymm = ymm = Math.max(0.005, Math.min(ymm, 1))

                              //      ChatLib.chat(xmm)
                              //      const H = rgbToHsv(module.color[name].r, module.color[name].g, module.color[name].b).h

                              //      module.color[name].r = hsvToRgb(H * 360, xmm, ymm).r
                              //      module.color[name].g = hsvToRgb(H * 360, xmm, ymm).g
                              //      module.color[name].b = hsvToRgb(H * 360, xmm, ymm).b
                              // })
                         }
                         if (
                              hovering(
                                   mx,
                                   my,
                                   module.catx + 2 * module.scale,
                                   module.caty +
                                        module.pos * module.height +
                                        index * module.height +
                                        details[module.name] * module.height -
                                        module.getNameOrder().length * module.height +
                                        module.height * 8 +
                                        1 * module.scale +
                                        (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * module.height : 0),
                                   module.width - 4 * module.scale,
                                   module.height - 4 * module.scale
                              ) &&
                              button == 0 &&
                              down
                         ) {
                              const xm = (mx - module.catx - 1 * module.scale) / (module.width - 2 * module.scale)

                              const s = rgbToHsv(module.color[name].r, module.color[name].g, module.color[name].b).s
                              const v = rgbToHsv(module.color[name].r, module.color[name].g, module.color[name].b).v
                              module.color[name].r = hsvToRgb(xm * 360, s, v).r
                              module.color[name].g = hsvToRgb(xm * 360, s, v).g
                              module.color[name].b = hsvToRgb(xm * 360, s, v).b

                              const clik = register("clicked", (mmx, mmy, button, down) => {
                                   if (button === 0 && !down) {
                                        drag.unregister()
                                        clik.unregister()
                                   }
                              })
                              const drag = register("dragged", (dx, dy, mmx, mmy, button) => {
                                   const xm = Math.max(0, Math.min((mmx - module.catx - 1 * module.scale) / (module.width - 2 * module.scale), 0.999))

                                   const s = rgbToHsv(module.color[name].r, module.color[name].g, module.color[name].b).s
                                   const v = rgbToHsv(module.color[name].r, module.color[name].g, module.color[name].b).v
                                   module.color[name].r = hsvToRgb(xm * 360, s, v).r
                                   module.color[name].g = hsvToRgb(xm * 360, s, v).g
                                   module.color[name].b = hsvToRgb(xm * 360, s, v).b
                              })
                         }
                         if (
                              hovering(
                                   mx,
                                   my,
                                   module.catx + 2 * module.scale,
                                   module.caty +
                                        module.pos * module.height +
                                        index * module.height +
                                        details[module.name] * module.height -
                                        module.getNameOrder().length * module.height +
                                        module.height * 9 +
                                        1 * module.scale +
                                        (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * module.height : 0),
                                   module.width - 4 * module.scale,
                                   module.height - 4 * module.scale
                              ) &&
                              button == 0 &&
                              down &&
                              module.color[name].alphable
                         ) {
                              const xm = (mx - module.catx - 1 * module.scale) / (module.width - 2 * module.scale)

                              module.color[name].alpha = xm * 255

                              const clik = register("clicked", (mmx, mmy, button, down) => {
                                   if (button === 0 && !down) {
                                        drag.unregister()
                                        clik.unregister()
                                   }
                              })
                              const drag = register("dragged", (dx, dy, mmx, mmy, button) => {
                                   const xm = Math.max(0, Math.min((mmx - module.catx - 1 * module.scale) / (module.width - 2 * module.scale), 1))

                                   module.color[name].alpha = xm * 255
                              })
                         }
                    }

                    if (
                         hovering(
                              mx,
                              my,
                              module.getModulePos()[0],
                              module.caty +
                                   module.pos * module.height +
                                   index * module.height +
                                   details[module.name] * module.height -
                                   module.getNameOrder().length * module.height +
                                   module.height * 2 +
                                   (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * module.height : 0),
                              module.getModulePos()[2],
                              module.getModulePos()[3]
                         ) &&
                         button == 0 &&
                         down
                    ) {
                         if (module.getTypeByName(name) == "switch") module.flipSwitch(name)
                         if (module.getTypeByName(name) == "slider") {
                              if (
                                   hovering(
                                        mx,
                                        my,
                                        module.catx + module.width - Renderer.getStringWidth(module.sliders[name].value.toFixed(module.sliders[name].max >= 100 ? 0 : module.sliders[name].max >= 10 ? 1 : module.sliders[name].max >= 1 ? 2 : 0)) * settingsscale * module.scale,
                                        module.caty +
                                             module.pos * module.height +
                                             index * module.height +
                                             details[module.name] * module.height -
                                             module.getNameOrder().length * module.height +
                                             module.height * 2 -
                                             1.5 * settingsscale * module.scale +
                                             (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * module.height : 0),
                                        Renderer.getStringWidth(module.sliders[name].value.toFixed(module.sliders[name].max >= 100 ? 0 : module.sliders[name].max >= 10 ? 1 : module.sliders[name].max >= 1 ? 2 : 0)),
                                        7.5 * settingsscale * module.scale
                                   )
                              ) {
                                   const startval = module.sliders[name].value
                                   let typedtext = module.sliders[name].value.toFixed(module.sliders[name].max >= 100 ? 0 : module.sliders[name].max >= 10 ? 1 : module.sliders[name].max >= 1 ? 2 : 0)

                                   const clik = register("clicked", (mmx, mmy, mmb, mmd) => {
                                        if (mmb === 0 && mmd) {
                                             clik.unregister()
                                             type.unregister()
                                        }
                                   })
                                   const type = register("guiKey", (char, keycode) => {
                                        if (keycode == 28) {
                                             type.unregister()
                                             if (isNaN(parseFloat(typedtext))) {
                                                  module.sliders[name].value = startval
                                                  return
                                             }
                                             module.sliders[name].value = parseFloat(typedtext.trim())

                                             return
                                        }
                                        if (keycode == 14 && !keyboard.isKeyDown(keyboard.KEY_LCONTROL)) {
                                             typedtext = typedtext.slice(0, -1)
                                             if (isNaN(parseFloat(typedtext))) {
                                                  module.sliders[name].value = module.sliders[name].min
                                                  return
                                             }
                                             module.sliders[name].value = parseFloat(typedtext)
                                             return
                                        }
                                        if (keycode == 14 && keyboard.isKeyDown(keyboard.KEY_LCONTROL)) {
                                             typedtext = typedtext.trim().split(" ").slice(0, -1).join(" ") + " "
                                             if (isNaN(parseFloat(typedtext))) {
                                                  module.sliders[name].value = module.sliders[name].min
                                                  return
                                             }
                                             module.sliders[name].value = parseFloat(typedtext)
                                             return
                                        }
                                        if (/^[0-9.]$/.test(char)) {
                                             typedtext += char
                                             if (parseFloat(typedtext) >= module.sliders[name].max) {
                                                  module.sliders[name].value = module.sliders[name].max
                                                  typedtext = module.sliders[name].max.toString()
                                                  return
                                             }
                                             if (parseFloat(typedtext) <= module.sliders[name].min) {
                                                  module.sliders[name].value = module.sliders[name].min
                                                  typedtext = module.sliders[name].min.toString()
                                                  return
                                             }
                                             module.sliders[name].value = parseFloat(typedtext)
                                        }
                                   })
                                   return
                              }
                              sliderdrag(name)
                              module.sliders[name].value = (mx / module.width - (module.catx + module.width / 2 - module.width / 2) / module.width) * (module.sliders[name].max - module.sliders[name].min) + module.sliders[name].min
                         }
                         if (module.getTypeByName(name) == "textbox") {
                              const scale = module.scale * settingsscale
                              if (
                                   hovering(
                                        mx,
                                        my,
                                        module.catx + module.width - (fontsb.getWidth(module.textBox[name]) / 3) * scale - 10 * scale,
                                        module.caty +
                                             module.pos * module.height +
                                             index * module.height +
                                             details[module.name] * module.height -
                                             module.getNameOrder().length * module.height +
                                             module.height * 2 +
                                             (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * module.height : 0),
                                        (fontsb.getWidth(module.textBox[name]) / 3) * scale + 10 * scale,
                                        10 * settingsscale * module.scale
                                   ) &&
                                   button == 0 &&
                                   down == true
                              ) {
                                   setTimeout(() => {
                                        const clik = register("clicked", (mmx, mmy, mmb, mmd) => {
                                             if (mmb === 0 && mmd) {
                                                  clik.unregister()
                                                  type.unregister()
                                             }
                                        })
                                   }, 100)

                                   const type = register("guiKey", (char, keycode) => {
                                        if (keycode == 28) {
                                             type.unregister()

                                             return
                                        }
                                        if (keycode == 14 && !keyboard.isKeyDown(keyboard.KEY_LCONTROL)) {
                                             module.textBox[name] = module.textBox[name].slice(0, -1)

                                             return
                                        }
                                        if (keycode == 14 && keyboard.isKeyDown(keyboard.KEY_LCONTROL)) {
                                             module.textBox[name] = module.textBox[name].trim().split(" ").slice(0, -1).join(" ") + " "

                                             return
                                        }
                                        if (/^[ -~]$/.test(char)) {
                                             module.textBox[name] += char
                                        }
                                   })
                                   return
                              }
                         }
                         if (module.getTypeByName(name) == "button") {
                              module.buttons[name]()
                         }
                         if (module.getTypeByName(name) == "selector") {
                              const amount = module.selectors[name].valuelist.length - 1

                              Module.getCategoryContent(module.category).forEach((mdl, i) => {
                                   if (i <= idx) return
                                   mdl.pos += expanded.includes(module.name + name) ? -amount : amount
                              })

                              module.paramorder.forEach((param, i) => {
                                   if (i - 1 < index) return
                                   if (Object.keys(expand).includes(module.name + param)) expand[module.name + param] += expanded.includes(module.name + name) ? -amount : amount
                                   else expand[module.name + param] = amount
                                   Object.keys(expand).includes(module.name + name)
                              })
                              if (expanded.includes(module.name + name)) {
                                   expanded = expanded.filter(yeah => yeah !== module.name + name)
                                   return
                              }
                              expanded.push(module.name + name)
                         }
                         if (module.getTypeByName(name) == "color") {
                              if (
                                   !hovering(
                                        mx,
                                        my,
                                        module.catx + module.width - 32 * module.scale,
                                        module.caty +
                                             module.pos * module.height +
                                             index * module.height +
                                             details[module.name] * module.height -
                                             module.getNameOrder().length * module.height +
                                             module.height * 2 +
                                             2 * module.scale +
                                             (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * module.height : 0),
                                        10 * module.scale * 3,
                                        10 * module.scale
                                   )
                              )
                                   return

                              // if (expanded.includes(module.name + name)) {
                              // expanded = expanded.filter(namee => namee !== module.name + name)

                              const amount = module.color[name].alphable === true ? 7 : 6

                              Module.getCategoryContent(module.category).forEach((mdl, i) => {
                                   if (i <= idx) return
                                   mdl.pos += expanded.includes(module.name + name) ? -amount : amount
                              })

                              module.paramorder.forEach((param, i) => {
                                   if (i - 1 < index) return
                                   if (Object.keys(expand).includes(module.name + param)) expand[module.name + param] += expanded.includes(module.name + name) ? -amount : amount
                                   else expand[module.name + param] = amount
                                   Object.keys(expand).includes(module.name + name)
                              })
                              if (expanded.includes(module.name + name)) {
                                   expanded = expanded.filter(yeah => yeah !== module.name + name)
                                   return
                              }
                              expanded.push(module.name + name)
                         }
                    }
               })
          })
     })
})

let draggingcategory
const categorydrag = register("dragged", (dx, dy, mx, my, button) => {
     if (button !== 0) return
     // if (Module.getSharedCategoryCoords(draggingcategory)[0] <= 0) {
     //      Module.setSharedCategoryX(draggingcategory, 0)
     // }
     // if (Module.getSharedCategoryCoords(draggingcategory)[0] + Module.getSharedCategoryCoords(draggingcategory)[2] >= Renderer.screen.getWidth()) {
     //      Module.setSharedCategoryX(draggingcategory, Renderer.screen.getWidth() - Module.getSharedCategoryCoords(draggingcategory)[2])
     // }
     // if (Module.getSharedCategoryCoords(draggingcategory)[0] <= 0) {
     //      Module.setSharedCategoryY(draggingcategory, 0)
     // }

     Module.setSharedCategoryX(draggingcategory, Module.getSharedCategoryCoords(draggingcategory)[0] + dx)
     Module.setSharedCategoryY(draggingcategory, Module.getSharedCategoryCoords(draggingcategory)[1] + dy)
}).unregister()
const categorymove = register("clicked", (mx, my, button, down) => {
     Module.getCategories().forEach(category => {
          if (hovering(mx, my, Module.getSharedCategoryCoords(category)[0], Module.getSharedCategoryCoords(category)[1] - Module.getSharedCategoryCoords(category)[3] / 2, Module.getSharedCategoryCoords(category)[2], Module.getSharedCategoryCoords(category)[3] * 1.5) && button == 0 && down) {
               draggingcategory = category
               Module.putCategoryInFirst(category)
               categorydrag.register()
          }
          if (!down && button == 0) {
               categorydrag.unregister()
               return
          }
     })
}).unregister()

let hovered = {}
let firsthovered = true

const descriptionhover = register("tick", () => {
     let hover
     Module.getCategories().forEach(category => {
          Module.getCategoryContent(category).forEach((module, index) => {
               const mx = Client.getMouseX()
               const my = Client.getMouseY()
               if (hovering(mx, my, module.getModulePos()[0], module.getModulePos()[1], module.getModulePos()[2], module.getModulePos()[3])) {
                    hover = module.name + category

                    if (firsthovered == false && module.name == hovered) return
                    hovered = module.name
                    firsthovered = false
                    let count = 0
                    const timer = register("step", () => {
                         count += 100

                         const mx = Client.getMouseX()
                         const my = Client.getMouseY()

                         if (!hovering(mx, my, module.getModulePos()[0], module.getModulePos()[1], module.getModulePos()[2], module.getModulePos()[3])) {
                              timer.unregister()
                              return
                         }
                         if (count > 500) {
                              hoveredmodule = module.name + category
                              timer.unregister()
                         }
                    }).setFps(10)
               }
          })
     })
     if (hover !== hoveredmodule) {
          hovered = ""
          hoveredmodule = ""
          firsthovered = true
     }
})

const keyboard = Java.type("org.lwjgl.input.Keyboard")

const scroll = register("scrolled", (mx, my, dirrection) => {
     Module.getCategories().forEach(category => {
          if (!hovering(mx, my, Module.getSharedCategoryCoords(category)[0], Module.getSharedCategoryCoords(category)[1] - Module.getSharedCategoryCoords(category)[3] / 2, Module.getSharedCategoryCoords(category)[2], Module.getSharedCategoryCoords(category)[3] * 1.5)) return
          if (dirrection > 0) {
               Module.setSharedCategoryWidth(category, Module.getSharedCategoryCoords(category)[2] + Module.getSharedCategoryCoords(category)[2] / 15)
               Module.setSharedCategoryHeight(category, Module.getSharedCategoryCoords(category)[3] + Module.getSharedCategoryCoords(category)[3] / 15)
               Module.setSharedCategoryScale(category, Module.getSharedCategoryCoords(category)[4] + Module.getSharedCategoryCoords(category)[4] / 15)
          }
          if (dirrection < 0) {
               Module.setSharedCategoryWidth(category, Module.getSharedCategoryCoords(category)[2] - Module.getSharedCategoryCoords(category)[2] / 15)
               Module.setSharedCategoryHeight(category, Module.getSharedCategoryCoords(category)[3] - Module.getSharedCategoryCoords(category)[3] / 15)
               Module.setSharedCategoryScale(category, Module.getSharedCategoryCoords(category)[4] - Module.getSharedCategoryCoords(category)[4] / 15)
          }
     })
})

const kb = new KeyBind("Open Sigma Click Gui", Keyboard.KEY_RCONTROL, "Sigma Client")

kb.registerKeyPress(() => {
     gui.open()
})

function preDraw() {
     GlStateManager.func_179103_j(GL11.GL_SMOOTH)
     GlStateManager.func_179147_l()
     GlStateManager.func_179120_a(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA, GL11.GL_ONE, GL11.GL_ONE_MINUS_SRC_ALPHA)
     GlStateManager.func_179090_x()
     GlStateManager.func_179129_p()
     GlStateManager.func_179140_f()
     GlStateManager.func_179118_c()
}

function postDraw() {
     GlStateManager.func_179098_w()
     GlStateManager.func_179084_k()
     GlStateManager.func_179089_o()
     GlStateManager.func_179141_d()
     GlStateManager.func_179117_G()
     GlStateManager.func_179103_j(GL11.GL_FLAT)
} // thanks noam

import { guiPiece } from "./draggableGuis"

export const clickGui = new Module("Misc", "Click Gui")
     .addSwitch("Simplified Name", false)
     .addSlider("Click Gui Height", 30, 18.5, 50)
     .addColor("Gui Color", 208, 124, 188, 255, false)
     .addButton("Move all Huds", () => {
          guiPiece.gui.open()
          setTimeout(() => {
               guiPiece.all.forEach(peice => {
                    peice.edit()
               })
          }, 1)
     })
     .addButton("Refresh Gui", () => {
          Module.resetGui()
     })

function rgbToHsv(r, g, b) {
     r /= 255
     g /= 255
     b /= 255

     const max = Math.max(r, g, b),
          min = Math.min(r, g, b)
     const delta = max - min

     let h = 0
     if (delta !== 0) {
          if (max === r) {
               h = ((g - b) / delta) % 6
          } else if (max === g) {
               h = (b - r) / delta + 2
          } else {
               h = (r - g) / delta + 4
          }
          h /= 6
          if (h < 0) h += 1
     }

     const s = max === 0 ? 0 : delta / max
     const v = max

     return { h, s, v } // h = 0–1, s = 0–1, v = 0–1
}

function hsvToRgb(h, s, v) {
     let r, g, b

     s = Math.max(0, Math.min(1, s))
     v = Math.max(0, Math.min(1, v))
     h = h % 360
     if (h < 0) h += 360

     if (s === 0) {
          r = g = b = v // gray
     } else {
          const hPrime = h / 60
          const i = Math.floor(hPrime)
          const f = hPrime - i
          const p = v * (1 - s)
          const q = v * (1 - s * f)
          const t = v * (1 - s * (1 - f))

          switch (i) {
               case 0:
                    r = v
                    g = t
                    b = p
                    break
               case 1:
                    r = q
                    g = v
                    b = p
                    break
               case 2:
                    r = p
                    g = v
                    b = t
                    break
               case 3:
                    r = p
                    g = q
                    b = v
                    break
               case 4:
                    r = t
                    g = p
                    b = v
                    break
               case 5:
                    r = v
                    g = p
                    b = q
                    break
          }
     }

     return {
          r: Math.round(r * 255),
          g: Math.round(g * 255),
          b: Math.round(b * 255)
     }
}

register("renderOverlay", () => {
     const colore = new color(1, 0, 0, 1)
     const black = new color(0, 0, 0, 1)
     const white = new color(1, 1, 1, 1)

     // drawSvBox(100, 100, colore)
     // drawHueSlider(100, 100 + 95)
})

register("tick", () => {
     toggledcolor = Renderer.color(clickGui.color["Gui Color"].r, clickGui.color["Gui Color"].g, clickGui.color["Gui Color"].b, 255)
})
function drawHueSlider(x, y, w, h) {
     // const segmentHeight = 90 / 6
     w /= 6
     let hue1, hue2, color1, color2

     for (let i = 0; i < 6; i++) {
          hue1 = (i * 360) / 6
          hue2 = ((i + 1) * 360) / 6
          color1 = new color(hsvToRgb(hue1, 1, 1).r / 255, hsvToRgb(hue1, 1, 1).g / 255, hsvToRgb(hue1, 1, 1).b / 255, 1)
          color2 = new color(hsvToRgb(hue2, 1, 1).r / 255, hsvToRgb(hue2, 1, 1).g / 255, hsvToRgb(hue2, 1, 1).b / 255, 1)
          drawGradient(x + i * w, y, w, h, color1, color2, color1, color2)
     }
}

let colorse = []

// function drawHue() {
//      for (let i = 0; i <= 360; i++) {
//           // chat(i)

//           // chat(i)
//           const { r, g, b } = hsvToRgb(i, 1, 1)
//           colorse[i] = { r, g, b }
//           // Renderer.drawRect(Renderer.color(r, g, b, 255), 100 + i, 100, 0.5, 20)
//      }
// }

function drawSvBox(x, y, w, h, currentHue) {
     const width = w
     const height = h
     const pureHueColor = Renderer.color(currentHue.getRed(), currentHue.getGreen(), currentHue.getBlue())
     Renderer.drawRect(pureHueColor, x, y, width, height)

     const white = new color(1, 1, 1, 1)
     const transparentWhite = new color(1, 1, 1, 0)
     drawGradient(x, y, width, height, white, transparentWhite, white, transparentWhite)

     const black = new color(0, 0, 0, 1)
     const transparentBlack = new color(0, 0, 0, 0)
     drawGradient(x, y, width, height, transparentBlack, transparentBlack, black, black)
}

function drawGradient(x, y, width, height, topLeft, topRight, bottomLeft, bottomRight) {
     const tessellator = net.minecraft.client.renderer.Tessellator.func_178181_a()
     const worldRenderer = tessellator.func_178180_c()
     const glStateManager = net.minecraft.client.renderer.GlStateManager

     glStateManager.func_179094_E()

     preDraw()

     worldRenderer.func_181668_a(7, net.minecraft.client.renderer.vertex.DefaultVertexFormats.field_181706_f)

     worldRenderer
          .func_181662_b(x, y + height, 0.0)
          .func_181669_b(bottomLeft.getRed(), bottomLeft.getGreen(), bottomLeft.getBlue(), bottomLeft.getAlpha())
          .func_181675_d()
     worldRenderer
          .func_181662_b(x + width, y + height, 0.0)
          .func_181669_b(bottomRight.getRed(), bottomRight.getGreen(), bottomRight.getBlue(), bottomRight.getAlpha())
          .func_181675_d()
     worldRenderer
          .func_181662_b(x + width, y, 0.0)
          .func_181669_b(topRight.getRed(), topRight.getGreen(), topRight.getBlue(), topRight.getAlpha())
          .func_181675_d()
     worldRenderer.func_181662_b(x, y, 0.0).func_181669_b(topLeft.getRed(), topLeft.getGreen(), topLeft.getBlue(), topLeft.getAlpha()).func_181675_d()
     tessellator.func_78381_a()

     postDraw()
     glStateManager.func_179121_F()
}
