import PogObject from "../../PogData"

const keyboard = Java.type("org.lwjgl.input.Keyboard")

export class guiPiece {
     static gui = new Gui()
     static all = []

     constructor(name, x, y, scale) {
          this.name = name
          this.x = x
          this.y = y
          this.floorx = 0
          this.floory = 0
          this.maxx = 0
          this.maxy = 0
          this.scale = scale
          this.boundwidth = 0
          this.boundheight = 0
          this.editing = false
          this.smallestx = 0
          this.smallesty = 0
          this.biggesttextx = 0
          this.biggesttexty = 0

          this.rect = {}
          this.text = {}
          guiPiece.all.push(this)
     }

     addText(name, text, xoffset, yoffset, scale, centered) {
          this.text[name] = { text, xoffset, yoffset, scale, centered }
          return this
     }
     addRect(name, xoffset, yoffset, width, height, color) {
          this.rect[name] = { xoffset, yoffset, width, height, color }
          return this
     }

     draw() {
          this.render.register()
     }
     dontdraw() {
          this.render.unregister()
     }

     click = register("clicked", (mx, my, button, down) => {
          if (!this.editing == true || !guiPiece.gui.isOpen()) {
               this.click.unregister()
               this.drag.unregister()
               return
          }
          if (this.hovering(mx, my, this.smallestx, this.smallesty, this.biggesttextx - this.smallestx, this.biggesttexty - this.smallesty) && down && button == 0) this.drag.register()
          if (!down && button == 0) this.drag.unregister()
     }).unregister()
     drag = register("dragged", (dx, dy, mx, my, button) => {
          if (button == 0) {
               this.x += dx
               this.y += dy
          }
     }).unregister()

     scroll = register("scrolled", (mx, my, dirrection) => {
          if (!this.editing == true || !guiPiece.gui.isOpen()) {
               this.scroll.unregister()
               return
          }

          //   if (hovering(mx, my, this.floorx, this.floory, this.maxx - this.floorx, this.maxy - this.floory)) {
          if (dirrection > 0) {
               this.scale *= 1.15
          }
          if (dirrection < 0) this.scale /= 1.15
          //   }
     })

     boundingBox() {
          this.smallestx = Renderer.screen.getWidth()
          this.biggesttextx = 0

          this.smallesty = Renderer.screen.getHeight()
          this.biggesttexty = 0
          Object.keys(this.text).forEach(name => {
               const text = this.text[name].text
               const x = this.text[name].xoffset
               const y = this.text[name].yoffset
               const scale = this.text[name].scale
               const stringWidth = Renderer.getStringWidth(this.text[name].text) * this.text[name].scale
               const centered = this.text[name].centered
               // this.x / scl + this.text[name].xoffset - (this.text[name].centered == true ? Renderer.getStringWidth(this.text[name].text) / 2 : 0), this.y / scl + this.text[name].yoffset - 4.5, false)
               if (this.x + x * scale * this.scale - (centered == true ? stringWidth / 2 : 0) * this.scale < this.smallestx) this.smallestx = this.x + x * scale * this.scale - (centered == true ? stringWidth / 2 : 0) * this.scale - 5 * this.scale
               if (this.x + x * scale * this.scale + (centered == true ? stringWidth / 2 : stringWidth / 2) * this.scale * 2 > this.biggesttextx) this.biggesttextx = this.x + x * scale * this.scale + (centered == true ? stringWidth / 2 : stringWidth / 2) * this.scale * 2 + 5 * this.scale
               if (this.y + y * scale * this.scale - 4.5 * this.scale * scale < this.smallesty) this.smallesty = this.y + y * scale * this.scale - 4.5 * scale * this.scale
               if (this.y + y * scale * this.scale + 4.5 * this.scale * scale > this.biggesttexty) this.biggesttexty = this.y + y * scale * this.scale + 4.5 * scale * this.scale
          })
          Object.keys(this.rect).forEach(name => {
               const x = this.rect[name].xoffset
               const y = this.rect[name].yoffset
               const width = this.rect[name].width
               const height = this.rect[name].height

               if (this.x + x * this.scale < this.smallestx) this.smallestx = this.x + x * this.scale - 5 * this.scale
               if (this.x + x * this.scale + width * this.scale > this.biggesttextx) this.biggesttextx = this.x + x * this.scale + width * this.scale + 5 * this.scale
               if (this.y + y * this.scale < this.smallesty) this.smallesty = this.y + y * this.scale - 5 * this.scale
               if (this.y + y * this.scale + height * this.scale > this.biggesttexty) this.biggesttexty = this.y + y * this.scale + height * this.scale + 5 * this.scale
          })
          this.boundcenter = (this.biggesttextx - this.smallestx) / 2
     }

     edit() {
          this.boundingBox()
          this.editing = true
          //   this.boundingBox()

          this.click.register()
          this.scroll.register()
          const close = guiPiece.gui.registerClosed(() => {
               this.editing = false
               this.click.unregister()
               this.drag.unregister()
               this.scroll.unregister()
               close.unregister()
          })
     }

     static editall() {
          this.all.forEach(piece => {
               piece.edit()
          })
     }
     hovering(mx, my, x, y, width, height) {
          if (mx <= x + width && mx >= x && my <= y + height && my >= y) return true
          else return false
     }

     render = register("renderOverlay", () => {
          this.boundingBox()
          if (this.editing && guiPiece.gui.isOpen()) {
               Renderer.retainTransforms(false)
               Renderer.drawRect(Renderer.color(0, 0, 0, 50), this.smallestx, this.smallesty, this.biggesttextx - this.smallestx, this.biggesttexty - this.smallesty)
          }

          Object.keys(this.text).forEach(name => {
               Renderer.retainTransforms(true)
               //    ChatLib.chat(scl)
               const scl = this.scale
               Renderer.scale(scl, scl)

               Renderer.drawString(this.text[name].text, this.x / scl + this.text[name].xoffset - (this.text[name].centered == true ? Renderer.getStringWidth(this.text[name].text) / 2 : 0), this.y / scl + this.text[name].yoffset - 4.5, false)
               Renderer.retainTransforms(false)
          })
          Object.keys(this.rect).forEach(name => {
               Renderer.retainTransforms(true)
               const scl = this.scale
               Renderer.scale(scl, scl)

               Renderer.drawRect(this.rect[name].color, this.x / scl + this.rect[name].xoffset, this.y / scl + this.rect[name].yoffset, this.rect[name].width, this.rect[name].height)
               Renderer.retainTransforms(false)
          })
          Renderer.retainTransforms(false)
     }).unregister()

     loadGui() {
          const currentgui = data.gui.find(gui => gui.name === this.name)
          if (!currentgui) return

          this.x = currentgui.x
          this.y = currentgui.y
          this.scale = currentgui.scale
     }
}

register("command", () => {
     guiPiece.gui.open()
     guiPiece.editall()
}).setName("edit")

let data = new PogObject("SigmaClient", { gui: [] }, "gui.json")

register("worldLoad", () => {
     guiPiece.all.forEach(gui => {
          gui.loadGui()
     })
})

function saveGui() {
     const saveArray = guiPiece.all.map(m => ({
          name: m.name,
          x: m.x,
          y: m.y,
          scale: m.scale
     }))
     data.gui = saveArray
     data.save()
}

register("worldUnload", () => {
     saveGui()
})
