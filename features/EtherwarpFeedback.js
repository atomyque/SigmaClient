import { playSound } from "./utils/utils"
import { simEtherwarp } from "../../BloomCore/utils/Utils"
import Vector3 from "../../BloomCore/utils/Vector3"
import { Module } from "../gui/ClickGui"
let teleported = false

const EtherwarpFeedback = new Module("Skyblock", "Etherwarp Feedback", "Plays the sound if you click a valid etherwarp block.").addSwitch("Disable Original Sound", true).addTextBox("Sound", "random.orb").addSlider("Volume", 1, 0, 1).addSlider("Pitch", 1, 0, 2)
register("playerInteract", action => {
     if (!EtherwarpFeedback.toggled) return
     if (action.toString() !== "RIGHT_CLICK_EMPTY" || !Player?.getHeldItem()?.getName()?.includes("Aspect of the Void") || !Player.isSneaking()) return

     //copied @UnclaimedBloom6 's thing for etherwarp target since ifdk how bloomcore thing works
     const x0 = Player.getX()
     const y0 = Player.getY() + 1.54
     const z0 = Player.getZ()

     const lookVec = Vector3.fromPitchYaw(Player.getPitch(), Player.getYaw()).multiply(61)

     const x1 = x0 + lookVec.x
     const y1 = y0 + lookVec.y
     const z1 = z0 + lookVec.z
     if (simEtherwarp(x0, y0, z0, x1, y1, z1) == null) return
     teleported = true
     playSound(EtherwarpFeedback.textBox["Sound"].trim(), EtherwarpFeedback.sliders["Volume"].value, EtherwarpFeedback.sliders["Pitch"].value)
})

register("soundPlay", (pos, name, volume, pitch, cat, event) => {
     if (!EtherwarpFeedback.toggled || !EtherwarpFeedback.switches["Disable Original Sound"]) return

     if (name == "mob.enderdragon.hit" && volume == 1 && pitch == 0.5396825671195984) cancel(event)

     if (teleported) return
     World.playSound(EtherwarpFeedback.textBox["Sound"].trim(), EtherwarpFeedback.sliders["Volume"].value, EtherwarpFeedback.sliders["Pitch"].value)
     teleported = false
})
