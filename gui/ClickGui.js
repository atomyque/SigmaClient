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
     // Renderer.retainTransforms(true)
     Renderer.scale(glbscale, glbscale)
     fontsb.drawString(text, x / glbscale - 0.75 / glbscale - (centeredx === true ? fontsb.getWidth(text) / 2 : 0), y / glbscale - (centeredy === true ? fontsb.getHeight(text) / 2 : 0), new java.awt.Color(1, 1, 1, 1))
     Renderer.retainTransforms(false)
     Renderer.retainTransforms(true)
}
function drawStringBold(text, x, y, scale = 1, centeredx = false, centeredy = false, r = 1, g = 1, b = 1, alpha = 1) {
     const scl = 1 / 3
     const glbscale = scl * scale
     // Renderer.retainTransforms(true)
     Renderer.scale(glbscale, glbscale)
     fontb.drawString(text, x / glbscale - 0.75 / glbscale - (centeredx === true ? fontb.getWidth(text) / 2 : 0), y / glbscale - (centeredy === true ? fontb.getHeight(text) / 2 : 0), new java.awt.Color(r, g, b, alpha))
     Renderer.retainTransforms(false)
     Renderer.retainTransforms(true)
}

let catscale = 2
let modulescale = 1.5
let settingsscale = 1.2
let sliding = false
let details = {}
let expand = {}
let expanded = []
let hoveredmodule = ""
let moduleheight = 12.5
let defaultslidelenght = 150

export class Module {
     static all = []
     static catorder = []
     static categorypos = {}

     constructor(category, name, description) {
          const existing = Module.all.find(mod => mod.name === name && mod.category === category)
          if (existing) {
               return existing
          }

          this.description = description
          this.category = category
          this.name = name
          this.toggled = false

          /**
           * @type {this.switches}
           */
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

     addSlider(name, value, minimum, maximum, fn) {
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
          this.sliders[name] = { value, min: minimum, max: maximum, fn }
          return this
     }

     addSelector(name, ...options) {
          this.paramorder.push(name)
          this.selectors[name] = { value: options[0], valuelist: options }
          return this
     }

     addColor(name, r, g, b, alpha, alphable = false, fn) {
          this.paramorder.push(name)
          this.color[name] = { r, g, b, alpha, alphable, fn }
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

     drawModule() {
          const scale = Module.categorypos[this.category].scale
          const x = Module.categorypos[this.category].x
          const y = Module.categorypos[this.category].y
          const height = moduleheight * scale
          const width = Module.categorypos[this.category].width * scale
          Renderer.drawRect(this.toggled == true ? toggledcolor : defaultcolor, x, y + this.pos * height + height, width, height)
          drawStringBold(this.name, x + width / 2, y + this.pos * height + height * 1.5, scale, true, true)
     }

     drawSettings() {
          this.getNameOrder().forEach((name, index) => {
               const scale = 0.7 * Module.categorypos[this.category].scale
               const scl = Module.categorypos[this.category].scale
               const x = Module.categorypos[this.category].x
               const y = Module.categorypos[this.category].y
               const height = moduleheight * Module.categorypos[this.category].scale
               const width = Module.categorypos[this.category].width * Module.categorypos[this.category].scale
               if (y + this.pos * height + height + index * height + height + details[this.name] * height - this.getNameOrder().length * height < y + this.pos * height + height) return
               const translate = () => Renderer.translate(x, y + this.pos * height + index * height + details[this.name] * height - this.getNameOrder().length * height + height * 2 + (Object.keys(expand).includes(this.name + name) ? expand[this.name + name] * height : 0))
               translate()
               Renderer.drawRect(detailscolor, 0, 0, width, height)
               switch (this.getTypeByName(name)) {
                    case "switch":
                         Renderer.drawRect(this.getSwitch(name) == true ? toggledcolor : defaultcolor, 0, 0, width - width * 0.97, height)
                         drawStringSemiBold(name, (width - width * 0.97) * 1.3, height / 2, scale, false, true)
                         break
                    case "slider":
                         const valuetostring = this.sliders[name].value.toFixed(this.sliders[name].max >= 100 ? 0 : this.sliders[name].max >= 10 ? 1 : this.sliders[name].max >= 1 ? 2 : 0).toString()
                         const valuewidth = (fontsb.getWidth(valuetostring) / 3) * scale
                         Renderer.drawRect(defaultcolor, 0, height, width, height - height / 0.8)
                         Renderer.drawRect(toggledcolor, 0, height, (width * (this.sliders[name].value - this.sliders[name].min)) / (this.sliders[name].max - this.sliders[name].min), height - height / 0.8)
                         drawStringSemiBold(valuetostring, width - valuewidth, height / 2, scale, false, true)
                         translate()
                         drawStringSemiBold(name, (width - width * 0.97) * 1.3, height / 2, scale, false, true)
                         break
                    case "textbox":
                         Renderer.drawRect(defaultcolor, width - (fontb.getWidth(this.textBox[name]) / 3) * scale - 1 * settingsscale * scl, 4 * scale, (fontb.getWidth(this.textBox[name]) / 3) * scale + 1 * settingsscale * scl, 9 * settingsscale * scl)
                         drawStringSemiBold(name, (width - width * 0.97) * 1.3, height / 2, scale, false, true)
                         translate()
                         drawStringSemiBold(this.textBox[name], width - (fontsb.getWidth(this.textBox[name]) / 3) * scale, height / 2, scale, false, true)
                         break
                    case "button":
                         drawStringSemiBold(name, width / 2, height / 2, scale, true, true)
                         break
                    case "selector":
                         if (!expanded.includes(this.name + name)) {
                              Renderer.drawLine(Renderer.WHITE, 3 * scl, 3 * scl, 3 * scl + height / 2, height / 2, 2 * scl, 9)
                              Renderer.drawLine(Renderer.WHITE, 3 * scl, height - 3 * scl, 3 * scl + height / 2, height / 2, 2 * scl, 9)
                         }
                         if (expanded.includes(this.name + name)) {
                              const filteredlist = this.selectors[name].valuelist.slice().filter(item => item !== this.selectors[name].value)
                              Renderer.drawLine(Renderer.WHITE, 3 * scl, 3 * scl, 3 * scl + height / 3, height - 3 * scl, 2 * scl, 9)
                              Renderer.drawLine(Renderer.WHITE, 3 * scl + height / 1.5, 3 * scl, 3 * scl + height / 3, height - 3 * scl, 2 * scl, 9)
                              Renderer.drawRect(expandcolor, 0, height, width, height * filteredlist.length)
                              filteredlist.forEach((selectoritem, index) => {
                                   drawStringSemiBold(selectoritem, width / 2, height * 1.5 + height * index, scale, true, true)
                                   translate()
                              })
                         }
                         drawStringSemiBold(this.selectors[name].value, width / 2, height / 2, scale, true, true)
                         break
                    case "color":
                         const hue = rgbToHsv(this.color[name].r, this.color[name].g, this.color[name].b).h * 360
                         const saturation = rgbToHsv(this.color[name].r, this.color[name].g, this.color[name].b).s
                         const brightness = rgbToHsv(this.color[name].r, this.color[name].g, this.color[name].b).v
                         const huecolor = new color(hsvToRgb(hue, 1, 1).r / 255, hsvToRgb(hue, 1, 1).g / 255, hsvToRgb(hue, 1, 1).b / 255)
                         Renderer.drawRect(Renderer.color(this.color[name].r, this.color[name].g, this.color[name].b, this.color[name].alpha), width - 32 * scl, height / 2 - 5 * scl, 30 * scl, 10 * scl)
                         if (expanded.includes(this.name + name)) {
                              Renderer.drawRect(expandcolor, 0, height, width, height * (this.color[name].alphable === true ? 7 : 6))
                              drawSvBox(2 * scl, height + 2 * scl, width - 4 * scl, height * 5 - 4 * scl, huecolor)
                              Renderer.drawRect(Renderer.WHITE, saturation * (width - 4 * scl), height - 4 * scl + height * 5 - brightness * (height * 5 - 4 * scl), 8 * scl, 4 * scl * 2)
                              Renderer.drawRect(Renderer.BLACK, saturation * (width - 4 * scl), height - 4 * scl + height * 5 - brightness * (height * 5 - 4 * scl), scl * 2, 4 * scl * 2)
                              Renderer.drawRect(Renderer.BLACK, saturation * (width - 4 * scl) + 6 * scl, height - 4 * scl + height * 5 - brightness * (height * 5 - 4 * scl), scl * 2, 4 * scl * 2)
                              Renderer.drawRect(Renderer.BLACK, saturation * (width - 4 * scl), height - 4 * scl + height * 5 - brightness * (height * 5 - 4 * scl), 4 * scl * 2, 1 * scl * 2)
                              Renderer.drawRect(Renderer.BLACK, saturation * (width - 4 * scl), height - 4 * scl + height * 5 - brightness * (height * 5 - 4 * scl) + 6 * scl, 4 * scl * 2, 1 * scl * 2)
                              drawHueSlider(2 * scl, height * 6, width - 4 * scl, height - 4 * scl)
                              Renderer.drawRect(Renderer.WHITE, scl + (hue / 360) * (width - 4 * scl), height * 6, 2 * scl, height - 4 * scl)
                              if (this.color[name].alphable) {
                                   const clr = new color(this.color[name].r / 255, this.color[name].g / 255, this.color[name].b / 255, 1)
                                   const transparentclr = new color(this.color[name].r / 255, this.color[name].g / 255, this.color[name].b / 255, 0)
                                   drawGradient(2 * scl, height * 7 + 2 * scl, width - 4 * scl, height - 4 * scl, transparentclr, clr, transparentclr, clr)
                                   Renderer.drawRect(Renderer.WHITE, scl + (this.color[name].alpha / 255) * (width - 4 * scl), height * 7 + 2 * scl, 2 * scl, height - 4 * scl)
                              }
                         }
                         drawStringSemiBold(name, (width - width * 0.97) * 1.3, height / 2, scale, false, true)
                         break
               }
               //TODO Separator
          })
     }

     static drawCategory(category) {
          const pos = this.categorypos[category]
          Renderer.drawRect(defaultcolor, pos.x, pos.y - moduleheight * 1.15 * pos.scale + moduleheight * pos.scale, pos.width * pos.scale, moduleheight * 1.2 * pos.scale)

          catscale = catscale * pos.scale

          drawStringBold(category, pos.x + (pos.width * pos.scale) / 2, pos.y - moduleheight * pos.scale * 1.5 + moduleheight * pos.scale * 2 - 0.75 * 1.2, 1.2, true, true)
          catscale = catscale / pos.scale
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
          if (!data.catpos) return
          Object.keys(data.catpos).forEach(name => {
               Module.categorypos[name].x = data.catpos[name].x
               Module.categorypos[name].y = data.catpos[name].y
               Module.categorypos[name].scale = data.catpos[name].scale
          })
     }

     static categoryPositions() {
          let lastcategory = ""
          let width = []
          this.catorder.forEach((category, index) => {
               if ((fontb.getWidth(this.getCategoryContent(category)[0].name) / 3) * modulescale >= (fontb.getWidth(category) / 3) * catscale) width[index] = (category, ((fontb.getWidth(this.getCategoryContent(category)[0].name) / 3) * modulescale + 30 * modulescale) * 0.65)
               else width[index] = (category, ((fontb.getWidth(category) / 3) * catscale + 6 * catscale) * 0.65)

               // if (Object.keys(this.categorypos).includes(category)) {

               if (index == 0) this.categorypos[category] = { x: 10, y: 10, width: width[index], scale: 1 }
               // }}
               else this.categorypos[category] = { x: 10 + this.categorypos[lastcategory].x + width[index - 1], y: 10, width: width[index], scale: 1 }
               // }
               lastcategory = category
          })
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

     static resetGui() {
          let lastcat = ""
          this.categoryPositions()
     }

     static getAll() {
          return Module.all
     }
}

let data = new PogObject("SigmaClient", { modules: [], catpos: {} }, "modulesData.json")

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
          selectors: m.selectors
     }))
     let catposarray = {}
     Object.keys(Module.categorypos).forEach(m => {
          catposarray[m] = { x: Module.categorypos[m].x, y: Module.categorypos[m].y, scale: Module.categorypos[m].scale }
     })
     data.catpos = catposarray
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
     details = {}
     expand = {}
     expanded = []

     Module.getCategories().forEach(category => {
          Module.getCategoryContent(category).forEach((module, index) => {
               module.indetails = false
               module.pos = index
          })
     })
}
register("worldLoad", () => {
     Module.getAll().sort((a, b) => fontb.getWidth(b.name) / 3 - fontb.getWidth(a.name) / 3)

     Module.categoryPositions()

     sortmodules()
     Module.all.forEach(module => {
          module.loadModules()
          Object.keys(module.color).forEach(color => {
               module.color[color]?.fn()
          })
          Object.keys(module.sliders).forEach(sliders => {
               module.sliders[sliders]?.fn()
          })
     })
})

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
               if (details[module.name] !== 0) module.drawSettings(height)
               module.drawModule(height)
               if (hoveredmodule != module.name + category) return
               const scale = Module.categorypos[category].scale
               const x = Module.categorypos[category].x
               const y = Module.categorypos[category].y
               const height = moduleheight * scale
               const width = Module.categorypos[category].width * scale
               Renderer.translate(0, 0, 1)
               if (module.description?.length > 40) {
                    const splitindex = module.description.lastIndexOf(" ", 40)
                    const first = module.description.slice(0, splitindex)
                    const second = module.description.slice(splitindex + 1)

                    Renderer.drawRect(defaultcolor, x + width + 3 * scale, y + module.pos * height + height, (fontb.getWidth(first) / 3) * scale * 0.8 + 3, height)
                    Renderer.translate(0, 0, 2)
                    drawStringBold(first, x + width + 6 * scale, y + module.pos * height + height * 1, scale * 0.8, false, false)
                    Renderer.translate(0, 0, 2)
                    drawStringBold(second, x + width + 6 * scale, y + module.pos * height + height * 1.5, scale * 0.8, false, false)
               } else {
                    const text = module.description == undefined ? "No description set." : module.description
                    Renderer.drawRect(defaultcolor, x + width + 3 * scale, y + module.pos * height + height, (fontb.getWidth(text) / 3) * scale * 0.8 + 3, height)
                    Renderer.translate(0, 0, 2)
                    drawStringBold(text, x + width + 6 * scale, y + module.pos * height + height * 1.5, scale * 0.8, false, true)
               }
          })
     })
})

function hovering(mx, my, x, y, width, height) {
     if (mx <= x + width && mx >= x && my <= y + height && my >= y) return true
     else return false
}

gui.registerOpened(() => {
     sortmodules()
     scroll.register()
     descriptionhover.register()
     moduleclick.register()
     settingclick.register()
     categorymove.register()
})
gui.registerClosed(() => {
     // saveModules()
     scroll.unregister()
     descriptionhover.unregister()
     moduleclick.unregister()
     settingclick.unregister()
     categorymove.unregister()
})
const moduleclick = register("clicked", (mx, my, button, down) => {
     Module.getCategories().forEach(category => {
          Module.getCategoryContent(category).forEach((module, index) => {
               const x = Module.categorypos[category].x
               const width = Module.categorypos[category].width * Module.categorypos[category].scale
               const height = moduleheight * Module.categorypos[category].scale
               const scale = Module.categorypos[category].scale
               const moduley = Module.categorypos[category].y + module.pos * height + height
               if (hovering(mx, my, x, moduley, width, height) && button == 0 && down) module.toggled = !module.toggled
               if (hovering(mx, my, x, moduley, width, height) && button == 1 && down && !sliding) {
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
               const x = Module.categorypos[module.category].x
               const y = Module.categorypos[module.category].y
               const width = Module.categorypos[module.category].width * Module.categorypos[module.category].scale
               const height = moduleheight * Module.categorypos[module.category].scale

               const moduleX = x + width / 2

               module.getNameOrder().forEach((name, idx) => {
                    if (slidername != name) return
                    if ((mx / width - (moduleX - width / 2) / width) * (module.sliders[name].max - module.sliders[name].min) + module.sliders[name].min <= module.sliders[name].min) {
                         module.sliders[name].value = module.sliders[name].min
                         module.sliders[name]?.fn()
                         return
                    }
                    if ((mx / width - (moduleX - width / 2) / width) * (module.sliders[name].max - module.sliders[name].min) + module.sliders[name].min >= module.sliders[name].max) {
                         module.sliders[name].value = module.sliders[name].max
                         module.sliders[name]?.fn()
                         return
                    }
                    const moduleY = y + module.pos * height + (idx + 1) * height
                    if (module.getTypeByName(name) === "slider") {
                         module.sliders[name].value = (mx / width - (moduleX - width / 2) / width) * (module.sliders[name].max - module.sliders[name].min) + module.sliders[name].min
                         module.sliders[name]?.fn()
                    }
               })
          })
     })
}

const settingclick = register("clicked", (mx, my, button, down) => {
     Module.getCategories().forEach(category => {
          Module.getCategoryContent(category).forEach((module, idx) => {
               if (!module.indetails) return
               const x = Module.categorypos[category].x
               const y = Module.categorypos[category].y
               const width = Module.categorypos[category].width * Module.categorypos[category].scale
               const height = moduleheight * Module.categorypos[category].scale
               const scale = Module.categorypos[category].scale

               module.getNameOrder().forEach((name, index) => {
                    if (expanded.includes(module.name + name) && module.getTypeByName(name) == "selector") {
                         const filteredlist = module.selectors[name].valuelist.slice().filter(item => item !== module.selectors[name].value)
                         filteredlist.forEach((slk, i) => {
                              if (
                                   hovering(
                                        mx,
                                        my,
                                        x + 2 * scale,
                                        y + module.pos * height + index * height + details[module.name] * height - module.getNameOrder().length * height + height * 3 + 1 * scale + i * height + (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * height : 0),
                                        width,
                                        height
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
                                   x + 2 * scale,
                                   y + module.pos * height + index * height + details[module.name] * height - module.getNameOrder().length * height + height * 3 + 1 * scale + (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * height : 0),
                                   width - 4 * scale,
                                   height * 5 - 4 * scale
                              ) &&
                              button == 0 &&
                              down
                         ) {
                              // const xm = (mx - x - 1 * scale) / (width - 2 * scale)
                              // ChatLib.chat(xm)

                              const xm = (mx - x - 1 * scale) / (width - 2 * scale)
                              const ym = Math.abs(
                                   1 -
                                        (my - (y + module.pos * height + index * height + details[module.name] * height - module.getNameOrder().length * height + height * 3 + 1 * scale + (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * height : 0))) /
                                             (height * 5 - 4 * scale)
                              )
                              const h = rgbToHsv(module.color[name].r, module.color[name].g, module.color[name].b).h
                              const v = rgbToHsv(module.color[name].r, module.color[name].g, module.color[name].b).v

                              module.color[name].r = hsvToRgb(h * 360, xm, ym).r
                              module.color[name].g = hsvToRgb(h * 360, xm, ym).g
                              module.color[name].b = hsvToRgb(h * 360, xm, ym).b
                              module.color[name]?.fn()

                              // const clik = register("clicked", (mmx, mmy, button, down) => {
                              //      if (button === 0 && !down) {
                              //           drag.unregister()
                              //           clik.unregister()
                              //      }
                              // })
                              // const drag = register("dragged", (dx, dy, mmx, mmy, button) => {
                              //      let xmm = (mmx - x - 1 * scale) / (width - 2 * scale)
                              //      let ymm = Math.abs(
                              //           1 -
                              //                (mmy -
                              //                     (y +
                              //                          module.pos * height +
                              //                          index * height +
                              //                          details[module.name] * height -
                              //                          module.getNameOrder().length * height +
                              //                          height * 3 +
                              //                          1 * scale +
                              //                          (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * height : 0))) /
                              //                     (height * 5 - 4 * scale)
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
                                   x + 2 * scale,
                                   y + module.pos * height + index * height + details[module.name] * height - module.getNameOrder().length * height + height * 8 + 1 * scale + (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * height : 0),
                                   width - 4 * scale,
                                   height - 4 * scale
                              ) &&
                              button == 0 &&
                              down
                         ) {
                              const xm = (mx - x - 1 * scale) / (width - 2 * scale)

                              const s = rgbToHsv(module.color[name].r, module.color[name].g, module.color[name].b).s
                              const v = rgbToHsv(module.color[name].r, module.color[name].g, module.color[name].b).v
                              module.color[name].r = hsvToRgb(xm * 360, s, v).r
                              module.color[name].g = hsvToRgb(xm * 360, s, v).g
                              module.color[name].b = hsvToRgb(xm * 360, s, v).b
                              module.color[name]?.fn()

                              const clik = register("clicked", (mmx, mmy, button, down) => {
                                   if (button === 0 && !down) {
                                        drag.unregister()
                                        clik.unregister()
                                   }
                              })
                              const drag = register("dragged", (dx, dy, mmx, mmy, button) => {
                                   const xm = Math.max(0, Math.min((mmx - x - 1 * scale) / (width - 2 * scale), 0.999))

                                   const s = rgbToHsv(module.color[name].r, module.color[name].g, module.color[name].b).s
                                   const v = rgbToHsv(module.color[name].r, module.color[name].g, module.color[name].b).v
                                   module.color[name].r = hsvToRgb(xm * 360, s, v).r
                                   module.color[name].g = hsvToRgb(xm * 360, s, v).g
                                   module.color[name].b = hsvToRgb(xm * 360, s, v).b
                                   module.color[name]?.fn()
                              })
                         }
                         if (
                              hovering(
                                   mx,
                                   my,
                                   x + 2 * scale,
                                   y + module.pos * height + index * height + details[module.name] * height - module.getNameOrder().length * height + height * 9 + 1 * scale + (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * height : 0),
                                   width - 4 * scale,
                                   height - 4 * scale
                              ) &&
                              button == 0 &&
                              down &&
                              module.color[name].alphable
                         ) {
                              const xm = (mx - x - 1 * scale) / (width - 2 * scale)

                              module.color[name].alpha = xm * 255
                              module.color[name]?.fn()

                              const clik = register("clicked", (mmx, mmy, button, down) => {
                                   if (button === 0 && !down) {
                                        drag.unregister()
                                        clik.unregister()
                                   }
                              })
                              const drag = register("dragged", (dx, dy, mmx, mmy, button) => {
                                   const xm = Math.max(0, Math.min((mmx - x - 1 * scale) / (width - 2 * scale), 1))

                                   module.color[name].alpha = xm * 255
                                   module.color[name]?.fn()
                              })
                         }
                    }

                    if (
                         hovering(mx, my, x, y + module.pos * height + index * height + details[module.name] * height - module.getNameOrder().length * height + height * 2 + (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * height : 0), width, height) &&
                         button == 0 &&
                         down
                    ) {
                         if (module.getTypeByName(name) == "switch") module.flipSwitch(name)
                         if (module.getTypeByName(name) == "slider") {
                              if (
                                   hovering(
                                        mx,
                                        my,
                                        x + width - Renderer.getStringWidth(module.sliders[name].value.toFixed(module.sliders[name].max >= 100 ? 0 : module.sliders[name].max >= 10 ? 1 : module.sliders[name].max >= 1 ? 2 : 0)) * settingsscale * scale,
                                        y + module.pos * height + index * height + details[module.name] * height - module.getNameOrder().length * height + height * 2 - 1.5 * settingsscale * scale + (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * height : 0),
                                        Renderer.getStringWidth(module.sliders[name].value.toFixed(module.sliders[name].max >= 100 ? 0 : module.sliders[name].max >= 10 ? 1 : module.sliders[name].max >= 1 ? 2 : 0)),
                                        7.5 * settingsscale * scale
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
                              module.sliders[name].value = (mx / width - (x + width / 2 - width / 2) / width) * (module.sliders[name].max - module.sliders[name].min) + module.sliders[name].min
                              module.sliders[name]?.fn()
                         }
                         if (module.getTypeByName(name) == "textbox") {
                              const scale = scale * settingsscale
                              if (
                                   hovering(
                                        mx,
                                        my,
                                        x + width - (fontsb.getWidth(module.textBox[name]) / 3) * scale - 10 * scale,
                                        y + module.pos * height + index * height + details[module.name] * height - module.getNameOrder().length * height + height * 2 + (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * height : 0),
                                        (fontsb.getWidth(module.textBox[name]) / 3) * scale + 10 * scale,
                                        10 * settingsscale * scale
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
                                        x + width - 32 * scale,
                                        y + module.pos * height + index * height + details[module.name] * height - module.getNameOrder().length * height + height * 2 + 2 * scale + (Object.keys(expand).includes(module.name + name) ? expand[module.name + name] * height : 0),
                                        10 * scale * 3,
                                        10 * scale
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
     Module.categorypos[draggingcategory].x += dx
     Module.categorypos[draggingcategory].y += dy
}).unregister()
const categorymove = register("clicked", (mx, my, button, down) => {
     Module.getCategories().forEach(category => {
          const scale = Module.categorypos[category].scale
          const x = Module.categorypos[category].x
          const y = Module.categorypos[category].y
          const height = moduleheight * scale
          const width = Module.categorypos[category].width * scale
          if (hovering(mx, my, x, y - height / 2, width, height * 1.5) && button == 0 && down) {
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
               const scale = Module.categorypos[module.category].scale
               const height = moduleheight * scale
               const width = Module.categorypos[module.category].width * scale
               const x = Module.categorypos[module.category].x
               const y = Module.categorypos[module.category].y + module.pos * height + height
               if (hovering(mx, my, x, y, width, height)) {
                    hover = module.name + category

                    if (firsthovered == false && module.name == hovered) return
                    hovered = module.name
                    firsthovered = false
                    let count = 0
                    const timer = register("step", () => {
                         count += 100

                         const mx = Client.getMouseX()
                         const my = Client.getMouseY()

                         if (!hovering(mx, my, x, y, width, height)) {
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
}).unregister()

const keyboard = Java.type("org.lwjgl.input.Keyboard")

const scroll = register("scrolled", (mx, my, dirrection) => {
     Module.getCategories().forEach(category => {
          const x = Module.categorypos[category].x
          const y = Module.categorypos[category].y
          const width = Module.categorypos[category].width * Module.categorypos[category].scale
          const height = moduleheight * Module.categorypos[category].scale
          if (!hovering(mx, my, x, y - height / 2, width, height * 1.5)) return
          if (dirrection > 0) {
               Module.categorypos[category].scale += Module.categorypos[category].scale / 15
          }
          if (dirrection < 0) {
               Module.categorypos[category].scale -= Module.categorypos[category].scale / 15
          }
     })
}).unregister()

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
} // thanks noamm

import { guiPiece } from "./draggableGuis"
export const clickGui = new Module("Misc", "Click Gui")
     .addSwitch("Simplified Name", false)
     .addSlider("Click Gui Height", 12.5, 10, 20, () => {
          moduleheight = clickGui.sliders["Click Gui Height"].value
     })
     .addColor("Gui Color", 208, 124, 188, 255, false, () => {
          toggledcolor = Renderer.color(clickGui.color["Gui Color"].r, clickGui.color["Gui Color"].g, clickGui.color["Gui Color"].b, 255)
     })
     .addSwitch("Toggled Modules List", false)
     .addSelector("Module List Position", "Top Right", "Top Left", "Bottom Right", "Bottom Left")
     .addSlider("Module List Scale", 1, 0.1, 1.5)
     .addSlider("Module List Spacing", 10, 7.8, 20)
     .addColor("Modules List Color", 255, 30, 30, 255)
     .addSwitch("Rainbow!!", true)
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

function drawHueSlider(x, y, w, h) {
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

function toggledModulesOrder() {
     let toggledmodules = []
     Module.all.forEach(module => {
          if (!module.toggled) return
          toggledmodules.push(module.name)
     })
     return toggledmodules
}
register("renderOverlay", () => {
     if (!clickGui.switches["Toggled Modules List"]) return
     Renderer.retainTransforms(true)
     Renderer.colorize(clickGui.color["Gui Color"].r, clickGui.color["Gui Color"].g, clickGui.color["Gui Color"].b, 255)
     toggledModulesOrder().forEach((module, index) => {
          const color = clickGui.switches["Rainbow!!"] ? hsvToRgb(hue360(i + index * 4), 1, 1) : clickGui.color["Modules List Color"]
          const spacing = clickGui.sliders["Module List Spacing"].value
          const scale = clickGui.sliders["Module List Scale"].value
          switch (clickGui.selectors["Module List Position"].value) {
               case "Top Right":
                    drawStringBold(module, Renderer.screen.getWidth() - (fontb.getWidth(module) / 3) * scale - 4.5 * scale, 4.5 * scale + index * spacing * scale, scale, false, false, color.r / 255, color.g / 255, color.b / 255)
                    break
               case "Top Left":
                    drawStringBold(module, 4.5 * scale, 4.5 * scale + index * spacing * scale, scale, false, false, color.r / 255, color.g / 255, color.b / 255)
                    break
               case "Bottom Left":
                    drawStringBold(module, 4.5 * scale, Renderer.screen.getHeight() - 12 * scale - index * spacing * scale, scale, false, false, color.r / 255, color.g / 255, color.b / 255)
                    break
               case "Bottom Right":
                    drawStringBold(module, Renderer.screen.getWidth() - (fontb.getWidth(module) / 3) * scale - 4.5 * scale, Renderer.screen.getHeight() - 12 * scale - index * spacing * scale, scale, false, false, color.r / 255, color.g / 255, color.b / 255)
                    break
          }
     })
     Renderer.retainTransforms(false)
})

let i = 0
register("step", () => {
     i++
     if (i >= 360) i = 0
}).setFps(60)

function hue360(hue) {
     if (hue > 360) return hue - 360
     return hue
}
