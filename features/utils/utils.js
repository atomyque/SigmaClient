import { clickGui } from "../../gui/ClickGui"

export const colors = ["&4", "&c", "&6", "&e", "&2", "&a", "&b", "&3", "&1", "&9", "&d", "&5", "&f", "&7", "&8", "&0"]
export function chat(titletext) {
     ChatLib.chat(`&8[${clickGui.switches["Simplified Name"] == true ? "&f&lΣ&r" : "&f&lSigma &r&fClient"}&8]&r ${titletext}`)
}
export function playSound(sound, volume, pitch) {
     Player.getPlayer().func_85030_a(sound, volume, pitch)
}

let titletext
let titlescale
let titlecolor
let titleshadow
const titlerenderer = register("renderOverlay", () => {
     Renderer.retainTransforms(true)
     Renderer.scale(titlescale, titlescale)
     Renderer.colorize(titlecolor[0], titlecolor[1], titlecolor[2], 255)
     Renderer.drawString(titletext, Renderer.screen.getWidth() / 2 / titlescale - Renderer.getStringWidth(titletext) / 2, Renderer.screen.getHeight() / 2 / titlescale - 15, titleshadow)
     Renderer.retainTransforms(false)
}).unregister()
export function title(text, shadow = true, r, g, b, sound = "", volume = 1, pitch = 1, scale = 3, duration = 750) {
     titletext = text
     titlescale = scale
     titlecolor = [r, g, b]
     titleshadow = shadow

     titlerenderer.register()
     if (sound !== "") playSound(sound, volume, pitch)
     setTimeout(() => {
          if (text != titletext) return
          titlerenderer.unregister()
     }, duration)
}
