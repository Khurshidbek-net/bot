import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bot } from './models/bot.model';
import { InjectBot } from 'nestjs-telegraf';
import { BOT_NAME } from '../app.consts';
import { Context, Markup, Telegraf } from 'telegraf';
import { Address } from './models/address.model';
import { Car } from './models/car.model';

@Injectable()
export class BotService {

  constructor(
    @InjectModel(Bot) private botModel: typeof Bot,
    @InjectModel(Address) private addressModel: typeof Address,
    @InjectModel(Car) private carModel: typeof Car,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) { }

  async start(ctx: Context) {
    const user_id = ctx.from?.id;
    const user = await this.botModel.findByPk(user_id);
    if (!user) {
      await this.botModel.create(
        {
          user_id,
          username: ctx.from?.username,
          first_name: ctx.from?.first_name,
          last_name: ctx.from?.last_name,
          language: ctx.from?.language_code
        });

      await ctx.reply(`Iltimos, 📞 <b>Telefon raqamingizni yuboring</b> tugmasini bosing`, {
        parse_mode: "HTML",
        ...Markup.keyboard([[Markup.button.contactRequest("📞 Telefon raqamingizni yuborish")]]).resize().oneTime()
      })
    } else if (!user.status) {
      await ctx.reply(`Iltimos, 📞 <b>Telefon raqamingizni yuboring</b> tugmasini bosing`, {
        parse_mode: "HTML",
        ...Markup.keyboard([[Markup.button.contactRequest("📞 Telefon raqamingizni yuborish")]]).resize().oneTime()
      });
    } else {
      await this.bot.telegram.sendChatAction(user_id!, 'typing');

      await ctx.reply(`Ushbu bot Skidkachi foydalanuvchilarini faollashtirish uchun ishlab chiqilgan`, {
        parse_mode: "HTML",
        ...Markup.removeKeyboard()
      })
    }
  }

  async onContact(ctx: Context) {
    if ('contact' in ctx.message!) {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);

      if (!user) {
        await ctx.reply(`Iltimos, <b>Start</b> tugmasini bosing`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]]).resize().oneTime()
        });
      } else if (ctx.message!.contact.user_id !== user_id) {
        await ctx.reply(`Iltimos, 📞 <b>Shaxsiy raqamingizni yuboring</b> tugmasini bosing`, {
          parse_mode: "HTML",
          ...Markup.keyboard([[Markup.button.contactRequest("📞 Telefon raqamingizni yuborish")]]).resize().oneTime()
        });
      } else {
        user.phone_number = ctx.message.contact.phone_number;
        user.status = true;
        await user?.save();

        await ctx.reply(`Tabriklayman sizning hisobinzgiz faollashtirildi`, {
          parse_mode: "HTML",
          ...Markup.removeKeyboard()
        })
      }

    }
  }

  async onStop(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (user && user.status) {
        user.status = false;
        user.phone_number = "";
        await user.save();
        await ctx.reply(`Sizning hisobingiz muvoffaqiyatli o'chirildi`, {
          parse_mode: "HTML",
          ...Markup.removeKeyboard()
        });
      }
    } catch (error) {
      console.log("OnStop Error ", error)
    }
  }

  async onText(ctx: Context) {
    try {
      if ("text" in ctx.message!) {
        const user_id = ctx.from?.id;
        const user = await this.botModel.findByPk(user_id);

        if (!user || !user.status) {
          await ctx.reply(`Iltimos, avval ro'yxatdan o'ting`, {
            parse_mode: "HTML",
            ...Markup.keyboard([
              ["/start"]
            ]).resize()
          });
        } else {
          const address = await this.addressModel.findOne({
            where: { user_id },
            order: [["id", "DESC"]]
          });

          const car = await this.carModel.findOne({
            where: { user_id },
            order: [["id", "DESC"]]
          });

          // Car
          if (car && car.last_state !== "finish") {
            if (car.last_state == "car_number") {
              car.car_number = ctx.message.text;
              car.last_state = "car_model";
              await car.save();
              await ctx.reply(`Mashina modelini kiriting`, {
                parse_mode: "HTML",
                ...Markup.removeKeyboard()
              })
            } else if (car.last_state == "car_model") {
              car.model = ctx.message.text;
              car.last_state = "year";
              await car.save();
              await ctx.reply(`Mashina yilini kiriting`, {
                parse_mode: "HTML",
                ...Markup.removeKeyboard()
              })
            }
            else if (car.last_state == "year") {
              car.year = ctx.message.text;
              car.last_state = "color";
              await car.save();
              await ctx.reply(`Mashina rangini kiriting`, {
                parse_mode: "HTML",
                ...Markup.removeKeyboard()
              })
            }
            else if (car.last_state == "color") {
              car.color = ctx.message.text;
              car.last_state = "finish";
              await car.save();
              await ctx.reply(`Mashina saqlandi`, {
                parse_mode: "HTML",
                ...Markup.keyboard([
                  ["🚗 Mening mashinalarim", "➕ Yangi mashina qo'shish"]
                ]).resize()
              })
            }
          }

          // Address
          if (address && address.last_state !== "finish") {
            if (address.last_state == "name") {
              address.name = ctx.message.text;
              address.last_state = "address";
              await address.save();
              await ctx.reply(`Manzilni kiriting`, {
                parse_mode: "HTML",
                ...Markup.removeKeyboard()
              })
            } else if (address.last_state == "address") {
              address.address = ctx.message.text;
              address.last_state = "location";
              await address.save();
              await ctx.reply(`Lokatsiyani jo'nating`, {
                parse_mode: "HTML",
                ...Markup.keyboard([[Markup.button.locationRequest("📍 Manzilni yuboring")]]).resize()
              })
            }
          }
        }
      }
    } catch (error) {
      console.log("OnText error: ", error)
    }
  }

  async onLocation(ctx: Context) {
    try {
      if ("location" in ctx.message!) {
        const user_id = ctx.from?.id;
        const user = await this.botModel.findByPk(user_id);

        if (!user || !user.status) {
          await ctx.reply(`Iltimos, avval ro'yxatdan o'ting`, {
            parse_mode: "HTML",
            ...Markup.keyboard([
              ["/start"]
            ]).resize()
          });
        } else {
          const address = await this.addressModel.findOne({
            where: { user_id },
            order: [["id", "DESC"]]
          });

          if (address && address.last_state == "location") {
            address.location = `${ctx.message.location.latitude},${ctx.message.location.longitude}`
            address.last_state = "finish"
            await address.save();
            await ctx.reply("Manzil saqlandi", {
              parse_mode: 'HTML',
              ...Markup.keyboard([
                ["📍 Mening manzillarim", "➕ Yangi manzil qo'shish"]
              ]).resize()
            })
          }
        }
      }
    } catch (error) {
      console.log("OnLocation Error ", error)
    }
  }



}
