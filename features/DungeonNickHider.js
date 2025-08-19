import { playerclasses } from "./LeapAlerts"
import Dungeons from "./utils/Dungeons"
import { chat } from "./utils/utils"

const RenderLivingEventSpecialsPre = net.minecraftforge.client.event.RenderLivingEvent$Specials$Pre
const EntityPlayer = net.minecraft.entity.player.EntityPlayer

register(RenderLivingEventSpecialsPre, event => {
     if (!Dungeons.inDungeon) return
     if (event.entity instanceof EntityPlayer) {
          // cancel(event)
          World.getAllPlayers().forEach(player => {
               if (player.getUUID().version() !== 4) return

               if (event.entity != player) cancel(event)

               // if (player.getName() == Player.getName()) return
               // Tessellator.drawString(playerclasses[player.name], player.getX(), player.getY() + player.getEyeHeight() + 0.7, player.getZ(), Renderer.WHITE, true, 0.025, false)
          })
     }
})

register("chat", (message, event) => {
     let str = message
     let count = 0

     Object.keys(playerclasses).forEach(name => {
          if (!str.includes(name)) return
          count++
          while (str.includes(name)) str = str.replace(name, playerclasses[name])
     })
     if (count == 0) return

     cancel(event)
     ChatLib.chat(str)
}).setCriteria("${message}&r")
