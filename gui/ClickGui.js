import PogObject from "../../PogData"
const defaultcolor = Renderer.color(40, 40, 40, 255)
const toggledcolor = Renderer.color(208, 124, 188, 255)
const detailscolor = Renderer.color(34, 34, 34, 155)

let catscale = 2
let modulescale = 1.5
let settingsscale = 1
let sliding = false
let details = {}
let incrementamount = 0.5
let defaultscale = 0.65
let defaultslidelenght = 150

export class Module {
     static all = []
     static catorder = []

     constructor(category, name) {
          const existing = Module.all.find(mod => mod.name === name && mod.category === category)
          if (existing) {
               return existing
          }

          this.category = category
          this.scale = defaultscale
          this.catx = undefined
          this.caty = undefined
          this.width = undefined
          this.height = 15 * defaultscale
          this.name = name
          this.toggled = false
          this.switches = {}
          this.sliders = {}
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

     addSwitch(switchName, state) {
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

     getSlider(name) {
          return [this.sliders[name].value, this.sliders[name].min, this.sliders[name].max]
     }

     getTypeByName(name) {
          if (typeof name !== "string") {
               throw new Error("Name must be a string")
          }

          if (this.switches[name] !== undefined) {
               return "switch"
          }
          if (this.sliders[name] !== undefined) {
               return "slider"
          }
          if (this.buttons[name] !== undefined) {
               return "button"
          }
          if (this.separator.includes(name)) {
               return "separator"
          }
          if (this.textBox[name] !== undefined) {
               return "textbox"
          } else {
               return undefined
          }
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
          Renderer.retainTransforms(false)
          Renderer.drawRect(this.toggled == true ? toggledcolor : defaultcolor, this.catx, this.caty + this.pos * this.height + this.height, this.width, this.height)

          Renderer.retainTransforms(true)
          modulescale = modulescale * this.scale
          Renderer.scale(modulescale, modulescale)
          Renderer.drawString(
               this.name,
               Module.getSharedCategoryCoords(this.category)[0] / modulescale + Module.getSharedCategoryCoords(this.category)[2] / 2 / modulescale - Renderer.getStringWidth(this.name) / 2,
               Module.getSharedCategoryCoords(this.category)[1] / modulescale + (this.pos * this.height) / modulescale + this.height / modulescale - 4 + this.height / 2 / modulescale,
               false
          )
          modulescale = modulescale / this.scale
          Renderer.retainTransforms(false)
     }

     drawSettings() {
          this.getNameOrder().forEach((name, index) => {
               if (this.caty + this.pos * this.height + this.height + index * this.height + this.height + details[this.name] * this.height - this.getNameOrder().length * this.height < this.caty + this.pos * this.height + this.height) return
               Renderer.drawRect(detailscolor, this.catx, this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2, this.width, this.height)
               if (this.getTypeByName(name) == "switch") {
                    Renderer.retainTransforms(false)
                    Renderer.drawRect(
                         this.getSwitch(name) == true ? toggledcolor : defaultcolor,
                         this.catx,
                         this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2,
                         this.width - this.width * 0.96,
                         this.height
                    )

                    Renderer.retainTransforms(true)
                    settingsscale = settingsscale * this.scale
                    Renderer.scale(settingsscale, settingsscale)
                    Renderer.drawString(
                         name,
                         Module.getSharedCategoryCoords(this.category)[0] / settingsscale + (this.width - this.width * 0.96) / settingsscale + 1.5,
                         this.caty / settingsscale + (this.pos * this.height) / settingsscale + (index * this.height) / settingsscale + (details[this.name] * this.height) / settingsscale - (this.getNameOrder().length * this.height) / settingsscale + (this.height * 2) / settingsscale + 4,
                         false
                    )
                    settingsscale = settingsscale / this.scale
                    Renderer.retainTransforms(false)
               }
               if (this.getTypeByName(name) == "slider") {
                    Renderer.retainTransforms(false)

                    const valuetostring = this.sliders[name].value.toFixed(this.sliders[name].max >= 100 ? 0 : this.sliders[name].max >= 10 ? 1 : this.sliders[name].max >= 1 ? 2 : 0)
                    Renderer.drawRect(defaultcolor, this.catx, this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 3 + this.height - this.height / 0.8, this.width, this.height - this.height / 0.8)
                    Renderer.drawRect(
                         defaultcolor,
                         this.catx + this.width - Renderer.getStringWidth(this.sliders[name].value.toFixed(this.sliders[name].max >= 100 ? 0 : this.sliders[name].max >= 10 ? 1 : this.sliders[name].max >= 1 ? 2 : 0)) * settingsscale * this.scale - 3 * settingsscale * this.scale,
                         this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2,
                         Renderer.getStringWidth(this.sliders[name].value.toFixed(this.sliders[name].max >= 100 ? 0 : this.sliders[name].max >= 10 ? 1 : this.sliders[name].max >= 1 ? 2 : 0)) * settingsscale * this.scale + 3 * settingsscale * this.scale,
                         7.5 * settingsscale * this.scale
                    )

                    Renderer.drawRect(
                         toggledcolor,
                         this.catx,
                         this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 3 + (this.height - this.height / 0.8),
                         (this.width * (this.sliders[name].value - this.sliders[name].min)) / (this.sliders[name].max - this.sliders[name].min) + 1.25 * this.scale,
                         this.height - this.height / 0.8
                    )

                    Renderer.retainTransforms(true)
                    settingsscale = settingsscale * this.scale
                    Renderer.scale(settingsscale, settingsscale)
                    Renderer.drawString(
                         name,
                         Module.getSharedCategoryCoords(this.category)[0] / settingsscale + (this.width - this.width * 0.96) / settingsscale + 1.5,
                         this.caty / settingsscale + (this.pos * this.height) / settingsscale + (index * this.height) / settingsscale + (details[this.name] * this.height) / settingsscale - (this.getNameOrder().length * this.height) / settingsscale + (this.height * 2) / settingsscale + 1.25,
                         false
                    )
                    Renderer.drawString(
                         valuetostring,
                         Module.getSharedCategoryCoords(this.category)[0] / settingsscale + this.width / settingsscale - Renderer.getStringWidth(valuetostring) - 1.5,
                         this.caty / settingsscale + (this.pos * this.height) / settingsscale + (index * this.height) / settingsscale + (details[this.name] * this.height) / settingsscale - (this.getNameOrder().length * this.height) / settingsscale + (this.height * 2) / settingsscale + 1.25,
                         false
                    )
                    settingsscale = settingsscale / this.scale
                    Renderer.retainTransforms(false)
               }
               if (this.getTypeByName(name) == "textbox") {
                    Renderer.retainTransforms(false)

                    Renderer.drawRect(
                         defaultcolor,
                         this.catx + this.width - Renderer.getStringWidth(this.textBox[name]) * settingsscale * this.scale - 3 * settingsscale * this.scale,
                         this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2 + 4 * settingsscale * this.scale,
                         Renderer.getStringWidth(this.textBox[name]) * settingsscale * this.scale + 3 * settingsscale * this.scale,
                         7.5 * settingsscale * this.scale
                    )

                    Renderer.retainTransforms(true)
                    settingsscale = settingsscale * this.scale
                    Renderer.scale(settingsscale, settingsscale)
                    Renderer.drawString(
                         name,
                         Module.getSharedCategoryCoords(this.category)[0] / settingsscale + (this.width - this.width * 0.96) / settingsscale + 1.5,
                         this.caty / settingsscale + (this.pos * this.height) / settingsscale + (index * this.height) / settingsscale + (details[this.name] * this.height) / settingsscale - (this.getNameOrder().length * this.height) / settingsscale + (this.height * 2) / settingsscale + 4,
                         false
                    )
                    Renderer.drawString(
                         this.textBox[name],
                         Module.getSharedCategoryCoords(this.category)[0] / settingsscale + this.width / settingsscale - Renderer.getStringWidth(this.textBox[name]) - 1.5,
                         this.caty / settingsscale + (this.pos * this.height) / settingsscale + (index * this.height) / settingsscale + (details[this.name] * this.height) / settingsscale - (this.getNameOrder().length * this.height) / settingsscale + (this.height * 2) / settingsscale + 4,
                         false
                    )
                    settingsscale = settingsscale / this.scale
                    Renderer.retainTransforms(false)
               }
               if (this.getTypeByName(name) == "button") {
                    Renderer.retainTransforms(false)

                    Renderer.retainTransforms(true)
                    settingsscale = settingsscale * this.scale

                    Renderer.scale(settingsscale, settingsscale)
                    Renderer.drawString(
                         name,
                         Module.getSharedCategoryCoords(this.category)[0] / settingsscale - Renderer.getStringWidth(name) / 2 + this.width / 2 / settingsscale,
                         this.caty / settingsscale + (this.pos * this.height) / settingsscale + (index * this.height) / settingsscale + (details[this.name] * this.height) / settingsscale - (this.getNameOrder().length * this.height) / settingsscale + (this.height * 2) / settingsscale + 4,
                         false
                    )
                    settingsscale = settingsscale / this.scale
                    Renderer.retainTransforms(false)
               }
               if (this.getTypeByName(name) == "separator") {
                    Renderer.retainTransforms(false)
                    if (name == "") {
                         Renderer.drawRect(defaultcolor, this.catx, this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2 + this.height / 2, this.width, (this.height / this.height) * 2.5)
                    } else {
                         Renderer.drawRect(
                              defaultcolor,
                              this.catx,
                              this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2 + this.height / 2 - (this.height / this.height) * 2.5,
                              this.width / 2 - Renderer.getStringWidth(name) / 2 - (this.width / this.width) * 2,
                              (this.height / this.height) * 2.5
                         )
                         Renderer.drawRect(
                              defaultcolor,
                              this.catx + this.width - (this.width / 2 - Renderer.getStringWidth(name) / 2 - (this.width / this.width) * 2),
                              this.caty + this.pos * this.height + index * this.height + details[this.name] * this.height - this.getNameOrder().length * this.height + this.height * 2 + this.height / 2 - (this.height / this.height) * 2.5,
                              this.width / 2 - Renderer.getStringWidth(name) / 2 - (this.width / this.width) * 2,
                              (this.height / this.height) * 2.5
                         )

                         Renderer.retainTransforms(true)
                         settingsscale = settingsscale * this.scale
                         Renderer.scale(settingsscale, settingsscale)
                         Renderer.drawString(
                              name,
                              Module.getSharedCategoryCoords(this.category)[0] / settingsscale - Renderer.getStringWidth(name) / 2 + this.width / 2 / settingsscale,
                              this.caty / settingsscale + (this.pos * this.height) / settingsscale + (index * this.height) / settingsscale + (details[this.name] * this.height) / settingsscale - (this.getNameOrder().length * this.height) / settingsscale + (this.height * 2) / settingsscale + 5,
                              false
                         )
                         settingsscale = settingsscale / this.scale
                         Renderer.retainTransforms(false)
                    }
               }
          })
     }

     static drawCategory(category) {
          Renderer.retainTransforms(false)
          Renderer.drawRect(
               defaultcolor,
               this.getSharedCategoryCoords(category)[0],
               this.getSharedCategoryCoords(category)[1] - this.getSharedCategoryCoords(category)[3] * 1.5 + this.getSharedCategoryCoords(category)[3],
               this.getSharedCategoryCoords(category)[2],
               this.getSharedCategoryCoords(category)[3] * 1.5
          )

          Renderer.retainTransforms(true)
          catscale = catscale * Module.getSharedCategoryCoords(category)[4]
          Renderer.scale(catscale, catscale)
          Renderer.drawString(
               category,
               this.getSharedCategoryCoords(category)[0] / catscale + this.getSharedCategoryCoords(category)[2] / 2 / catscale - Renderer.getStringWidth(category) / 2,
               this.getSharedCategoryCoords(category)[1] / catscale + 2 - (this.getSharedCategoryCoords(category)[3] * 1.5) / catscale + this.getSharedCategoryCoords(category)[3] / catscale,
               false
          )
          catscale = catscale / Module.getSharedCategoryCoords(category)[4]
          Renderer.retainTransforms(false)
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
          })
          this.width = currentmodule.width
          this.scale = currentmodule.scale
          this.height = currentmodule.height
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
                         if (Renderer.getStringWidth(module.name) * modulescale >= Renderer.getStringWidth(category) * catscale) this.setSharedCategoryWidth(category, (Renderer.getStringWidth(module.name) * modulescale + 2 * modulescale) * defaultscale)
                         else {
                              this.setSharedCategoryWidth(category, (Renderer.getStringWidth(category) * catscale + 2 * catscale) * defaultscale)
                         }
                    }
               })
               this.setSharedCategoryScale(category, defaultscale)
               this.setSharedCategoryHeight(category, 15 * defaultscale)
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
          scale: m.scale,
          catx: m.catx,
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

register("worldLoad", () => {
     Module.getAll().sort((a, b) => Renderer.getStringWidth(b.name) - Renderer.getStringWidth(a.name))
     let lastcat = ""
     Module.getCategories().forEach(category => {
          Module.getCategoryContent(category).forEach((module, index) => {
               module.pos = index

               if (index == 0) {
                    if (Renderer.getStringWidth(module.name) * modulescale >= Renderer.getStringWidth(category) * catscale) Module.setSharedCategoryWidth(category, (Renderer.getStringWidth(module.name) * modulescale + 2 * modulescale) * Module.getSharedCategoryCoords(category)[4])
                    else {
                         Module.setSharedCategoryWidth(category, (Renderer.getStringWidth(category) * catscale + 2 * catscale) * Module.getSharedCategoryCoords(category)[4])
                    }
               }
          })

          // if (!data.modules.find(mod => mod.name === module.name && mod.category === module.category)) return
          Module.setSharedCategoryX(category, 10 * Module.getSharedCategoryCoords(category)[4] + Module.getSharedCategoryCoords(lastcat)[0] + Module.getSharedCategoryCoords(lastcat)[2])
          Module.setSharedCategoryY(category, 10)

          lastcat = category
     })

     Module.all.forEach(e => {
          e.loadModules()
     })
})

let teststr = ""
const image = new Image("sigma.png")

// Usage:

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
//           // ChatLib.chat((255 / width) * 5)
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

gui.registerOpened(() => {
     moduleclick.register()
     settingclick.register()
     categorymove.register()
})
gui.registerClosed(() => {
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
                         module.moduleanimation(-module.getNameOrder().length, defaultslidelenght, -1, module.name)
                         Module.getCategoryContent(category).forEach((m, idx) => {
                              if (idx <= index) return

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
          Module.getCategoryContent(category).forEach((module, index) => {
               if (!module.indetails) return
               module.getNameOrder().forEach((name, index) => {
                    if (
                         hovering(mx, my, module.getModulePos()[0], module.caty + module.pos * module.height + index * module.height + details[module.name] * module.height - module.getNameOrder().length * module.height + module.height * 2, module.getModulePos()[2], module.getModulePos()[3]) &&
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
                                        module.caty + module.pos * module.height + index * module.height + details[module.name] * module.height - module.getNameOrder().length * module.height + module.height * 2 - 1.5 * settingsscale * module.scale,
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
                                        print(char)
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
                              if (
                                   hovering(
                                        mx,
                                        my,
                                        module.catx + module.width - Renderer.getStringWidth(module.textBox[name]) * settingsscale * module.scale,
                                        module.caty + module.pos * module.height + index * module.height + details[module.name] * module.height - module.getNameOrder().length * module.height + module.height * 2 - 1.5 * settingsscale * module.scale,
                                        Renderer.getStringWidth(module.textBox[name]),
                                        7.5 * settingsscale * module.scale
                                   )
                              ) {
                                   const clik = register("clicked", (mmx, mmy, mmb, mmd) => {
                                        if (mmb === 0 && mmd) {
                                             clik.unregister()
                                             type.unregister()
                                        }
                                   })
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
                                        print(char)
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

export const clickGui = new Module("Misc", "Click Gui").addSwitch("Simplified Name", false)
