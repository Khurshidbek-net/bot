import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bot } from './models/bot.model';
import { InjectBot } from 'nestjs-telegraf';
import { BOT_NAME } from '../app.consts';
import { Context, Markup, Telegraf } from 'telegraf';
import { Address } from './models/address.model';

@Injectable()
export class AddressService {


  constructor(
    @InjectModel(Bot) private botModel: typeof Bot,
    @InjectModel(Address) private addressModel: typeof Address,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) { }

  async OnAddress(ctx: Context) {
    try {
      await ctx.reply(`Foydalanuvchi manzillari`, {
        parse_mode: "HTML",
        ...Markup.keyboard([
          ["📍 Mening manzillarim", "➕ Yangi manzil qo'shish"]
        ]).resize()
      });
    } catch (error) {
      console.log("OnAddress Error ", error)
    }
  }

  async OnCommandNewAddress(ctx: Context) {
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
      await this.addressModel.create({ user_id, last_state: "name" });
      await ctx.reply(`Yangi manzil nomini kiriting (<b>Uyim, Ishxonam</b>):`, {
        parse_mode: "HTML",
        ...Markup.removeKeyboard(),
      });
    }
  }

  async OnMyAddresses(ctx: Context) {
    try {
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
        const addresses = await this.addressModel.findAll({ where: { user_id, last_state: "finish" } });

        if (addresses.length == 0) {
          await ctx.reply("Manzillar mavjud emas", {
            parse_mode: 'HTML',
            ...Markup.keyboard([
              ["➕ Yangi manzil qo'shish"]
            ]).resize()
          })
        }

        addresses.forEach(async (address) => {
          await ctx.replyWithHTML(`<b>Manzil nomi:</b> ${address.name}\n<b>Nanzil: </b> ${address.address}`, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Manzilni ko'rish",
                    callback_data: `loc_${address.id}`
                  },
                  {
                    text: "Manzilni o'chirish",
                    callback_data: `del_${address.id}`
                  }
                ]
              ]
            }
          })
        })
      }
    } catch (error) {
      console.log("OnMyAddresses error: ", error)
    }

  }


  async OnClickLocation(ctx: Context) {
    try {

      const contextAction = ctx.callbackQuery!["data"]
      const addressId = contextAction.split("_")[1];

      const address = await this.addressModel.findByPk(addressId);

      if (address) {
        await ctx.replyWithLocation(
          Number(address?.location?.split(",")[0]),
          Number(address?.location?.split(",")[1]),
        )
      }else{
        await ctx.reply("Manzil mavjud emas", {
          parse_mode: 'HTML',
          ...Markup.keyboard([
            ["📍 Mening manzillarim"]
          ]).resize()
        })
      }


      
    } catch (error) {
      console.log("OnClickLocation Error ", error)
    }
  }

  async OnDeleteLocation(ctx: Context) {
    try {

      const contextAction = ctx.callbackQuery!["data"]
      const addressId = contextAction.split("_")[1];

      const address = await this.addressModel.destroy({ where: { id: addressId } });

      await ctx.reply("Manzil o'chirildi");

    } catch (error) {
      console.log("OnDeleteLocation Error ", error)
    }
  }

}
