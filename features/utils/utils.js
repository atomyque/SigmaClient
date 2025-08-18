import { clickGui } from "../../gui/ClickGui"

export function chat(text) {
     ChatLib.chat(`&8[${clickGui.switches["Simplified Name"] == true ? "&f&lΣ&r" : "&f&lSigma &r&fClient"}&8]&r ${text}`)
}
