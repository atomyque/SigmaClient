import { clickGui } from "../../gui/ClickGui"

export const colors = ["&4", "&c", "&6", "&e", "&2", "&a", "&b", "&3", "&1", "&9", "&d", "&5", "&f", "&7", "&8", "&0"]
export function chat(text) {
     ChatLib.chat(`&8[${clickGui.switches["Simplified Name"] == true ? "&f&lΣ&r" : "&f&lSigma &r&fClient"}&8]&r ${text}`)
}
export function playSound(sound, volume, pitch) {
     Player.getPlayer().func_85030_a(sound, volume, pitch)
}
