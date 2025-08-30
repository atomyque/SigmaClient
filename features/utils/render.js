export function drawCircleQuarter(xpos, ypos, radius, location, red, green, blue, alpha) {
     GL11.glDisable(GL11.GL_CULL_FACE)
     GL11.glDisable(GL11.GL_TEXTURE_2D)

     GL11.glEnable(GL11.GL_BLEND)

     GL11.glBegin(GL11.GL_TRIANGLE_FAN)

     const x = xpos
     const y = ypos
     const r = radius
     GL11.glVertex2d(x, y)
     switch (location) {
          case "tl":
               for (let i = 180; i <= 270; i++) {
                    GL11.glColor4f(red, green, blue, alpha)
                    // GlStateManager.
                    GL11.glVertex2d(r * Math.cos((Math.PI * i) / 180) + x, r * Math.sin((Math.PI * i) / 180) + y)
               }
               break

          case "tr":
               for (let i = 270; i <= 360; i++) {
                    GL11.glColor4f(red, green, blue, alpha)
                    GL11.glVertex2d(r * Math.cos((Math.PI * i) / 180) + x, r * Math.sin((Math.PI * i) / 180) + y)
               }
               break
          case "br":
               for (let i = 0; i <= 90; i++) {
                    GL11.glColor4f(red, green, blue, alpha)
                    GL11.glVertex2d(r * Math.cos((Math.PI * i) / 180) + x, r * Math.sin((Math.PI * i) / 180) + y)
               }
               break
          case "bl":
               for (let i = 90; i <= 180; i++) {
                    GL11.glColor4f(red, green, blue, alpha)
                    GL11.glVertex2d(r * Math.cos((Math.PI * i) / 180) + x, r * Math.sin((Math.PI * i) / 180) + y)
               }
               break
     }

     GL11.glEnd()

     GL11.glEnable(GL11.GL_TEXTURE_2D)
     GL11.glEnable(GL11.GL_CULL_FACE)
}
