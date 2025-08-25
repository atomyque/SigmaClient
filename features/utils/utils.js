import { clickGui } from "../../gui/ClickGui"

export const colors = ["&4", "&c", "&6", "&e", "&2", "&a", "&b", "&3", "&1", "&9", "&d", "&5", "&f", "&7", "&8", "&0"]
export function chat(text) {
     ChatLib.chat(`&8[${clickGui.switches["Simplified Name"] == true ? "&f&lΣ&r" : "&f&lSigma &r&fClient"}&8]&r ${text}`)
}

function preDraw() {
     GlStateManager.shadeModel(GL_SMOOTH)
     GlStateManager.enableBlend()
     GlStateManager.tryBlendFuncSeparate(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA, GL_ONE, GL_ONE_MINUS_SRC_ALPHA)
     GlStateManager.disableTexture2D()
     GlStateManager.disableCull()
     GlStateManager.disableLighting()
     GlStateManager.disableAlpha()
}

function postDraw() {
     GlStateManager.enableTexture2D()
     GlStateManager.disableBlend()
     GlStateManager.enableCull()
     GlStateManager.enableAlpha()
     GlStateManager.resetColor()
     GlStateManager.shadeModel(GL_FLAT)
} // thanks noam
