import { Action, Command, Ctx, Hears, On, Start, Update } from "nestjs-telegraf";
import { Context, Markup } from "telegraf";
import { BotService } from "./bot.service";


@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) { }
  @Start()
  async onStart(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
  }

  @On('contact')
  async onContact(@Ctx() ctx: Context) {
    await this.botService.onContact(ctx);
  }

  @Command('stop')
  async onStop(@Ctx() ctx: Context) {
    await this.botService.onStop(ctx);
  }

  @On("location")
  async onLocation(@Ctx() ctx: Context) {
    await this.botService.onLocation(ctx);
  }


  @On("text")
  async onText(@Ctx() ctx: Context) {
    await this.botService.onText(ctx);
  }

  @On("message")
  async onMessage(@Ctx() ctx: Context) {
    console.log("Unhandled message")
  }














  // @On("photo")
  // async onPhoto(@Ctx() ctx: Context) {

  //   if ("photo" in ctx.message!) {
  //     console.log(ctx.message!.photo)
  //     await ctx.replyWithPhoto(String(ctx.message.photo[ctx.message.photo.length - 1].file_id))
  //   }
  // }

  // @On("video")
  // async onVideo(@Ctx() ctx: Context) {

  //   if ("video" in ctx.message!) {
  //     console.log(ctx.message!.video)
  //     await ctx.replyWithHTML(String(ctx.message.video.duration))
  //   }
  // }

  // @On("sticker")
  // async onSticker(@Ctx() ctx: Context) {

  //   if ("sticker" in ctx.message!) {
  //     console.log(ctx.message!.sticker)
  //     await ctx.replyWithHTML(String(ctx.message.sticker.emoji))
  //   }
  // }

  // @On("animation")
  // async onAnimation(@Ctx() ctx: Context) {

  //   if ("animation" in ctx.message!) {
  //     console.log(ctx.message!.animation)
  //     await ctx.replyWithHTML(String(ctx.message.animation.duration))
  //   }
  // }

  // @On("contact")
  // async onContact(@Ctx() ctx: Context) {

  //   if ("contact" in ctx.message!) {
  //     console.log(ctx.message!.contact)
  //     await ctx.replyWithHTML(String(ctx.message.contact.phone_number))
  //     await ctx.replyWithHTML(String(ctx.message.contact.vcard))
  //   }
  // }

  //
  // @On("voice")
  // async onVoice(@Ctx() ctx: Context) {

  //   if ("voice" in ctx.message!) {
  //     console.log(ctx.message!.voice)
  //     await ctx.replyWithHTML(String(ctx.message.voice.duration))
  //     await ctx.replyWithAudio(String(ctx.message.voice.file_id))
  //   }
  // }


  // @On("invoice")
  // async onInvoice(@Ctx() ctx: Context) {

  //   if ("invoice" in ctx.message!) {
  //     console.log(ctx.message!.invoice)
  //     await ctx.replyWithHTML(String(ctx.message.invoice.currency))
  //     await ctx.replyWithHTML(String(ctx.message.invoice.description))
  //   }
  // }

  // @On("document")
  // async onDocument(@Ctx() ctx: Context) {

  //   if ("document" in ctx.message!) {
  //     console.log(ctx.message!.document)
  //     await ctx.replyWithHTML(String(ctx.message.document.file_name))
  //     await ctx.replyWithDocument(String(ctx.message.document.file_id))
  //   }
  // }


  // // @On("passport_data")
  // // async onDocument(@Ctx() ctx: Context) {

  // //   if ("document" in ctx.message!) {
  // //     console.log(ctx.message!.document)
  // //     await ctx.replyWithHTML(String(ctx.message.document.file_name))
  // //     await ctx.replyWithDocument(String(ctx.message.document.file_id))
  // //   }
  // // }

  // @Hears("hi")
  // async onHear(@Ctx() ctx: Context) {
  //   console.log(ctx.message)
  //   await ctx.replyWithHTML("salomcha")

  // }


  // @Command('help')
  // async onHelp(@Ctx() ctx: Context) {
  //   console.log(ctx.message)
  //   await ctx.replyWithHTML("Kuting.....")

  // }

  // @Command('inline')
  // async onInlineCommand(@Ctx() ctx: Context) {
  //   const inlineKeyboard = [
  //     [{
  //       text: "Button 1",
  //       callback_data: "button_1"
  //     },
  //     {
  //       text: "Button 2",
  //       callback_data: "button_2"
  //     },
  //     {
  //       text: "Button 3",
  //       callback_data: "button_3"
  //     }
  //     ],
  //     [{
  //       text: "Button 4",
  //       callback_data: "button_4"
  //     },
  //     {
  //       text: "Button 5",
  //       callback_data: "button_5"
  //     }
  //     ],
  //     [{
  //       text: "Button 6",
  //       callback_data: "button_6"
  //     }
  //     ]
  //   ]

  //   // textsiz tugmalarni chiqarib bo'lmaydi

  //   await ctx.reply("Inline Keyboard: Quyidagilardan birini tanlang", {
  //     reply_markup: {
  //       inline_keyboard: inlineKeyboard
  //     }
  //   })

  // }

  // @Action("button_1")
  // async onButton_1(@Ctx() ctx: Context) {
  //   await ctx.replyWithHTML("<b>Button 1 bosildi</b>")
  // }


  // @Action(/^button_+[1-9]/)
  // async onButtonActionAny(@Ctx() ctx: Context) {
  //   const actionText = ctx.callbackQuery!["data"]

  //   const buttonId = actionText.split("_")[1]

  //   console.log(actionText)
  //   await ctx.replyWithHTML(`<b>Button ${buttonId} bosildi</b>`);

  // }


  // @Command("main")
  // async onMainButton(@Ctx() ctx: Context) {

  //   await ctx.replyWithHTML(`<b>Kerakmi tugmani bosing</b>`, {
  //     ...Markup.keyboard([
  //       [Markup.button.contactRequest("📞 Telefon raqam")],
  //       [Markup.button.locationRequest("📍 Manzil")],
  //       [
  //         "B1", "B11"
  //       ],
  //       [
  //         "B2", "B22", "B222"
  //       ],
  //       [
  //         "B3", "B33", "B333"
  //       ],
  //       [
  //         "B4"
  //       ],
  //       [
  //         "B5"
  //       ],
  //     ],
  //   )
  //   });

  // }

  // @Hears(/^B+\d+$/)
  // async onMainButtons(@Ctx() ctx: Context) {
  //   if("text" in ctx.message!){
  //     await ctx.replyWithHTML(`<b>${ctx.message.text} bosildi</b>`)
  //   }
  // }








  // // oxirida turadi



}