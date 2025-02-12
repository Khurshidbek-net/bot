import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bot } from './models/bot.model';
import { InjectBot } from 'nestjs-telegraf';
import { BOT_NAME } from '../app.consts';
import { Context, Markup, Telegraf } from 'telegraf';
import { Address } from './models/address.model';
import { Car } from './models/car.model';

@Injectable()
export class CarService {


  constructor(
    @InjectModel(Bot) private botModel: typeof Bot,
    @InjectModel(Car) private carModel: typeof Car,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) { }

  async OnCar(ctx: Context) {
    try {
      await ctx.reply(`Foydalanuvchi mashilari`, {
        parse_mode: "HTML",
        ...Markup.keyboard([
          ["🚗 Mening mashinalarim", "➕ Yangi mashina qo'shish"]
        ]).resize()
      });
    } catch (error) {
      console.log("OnCar Error ", error)
    }
  }

  async OnCommandNewCar(ctx: Context) {
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
      await this.carModel.create({ user_id, last_state: "car_number" });
      await ctx.reply(`Mashina raqamini kiriting (<b>01 H 111 KA</b>):`, {
        parse_mode: "HTML",
        ...Markup.removeKeyboard(),
      });

    }
  }

  async OnMyCars(ctx: Context) {
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
        const cars = await this.carModel.findAll({ where: { user_id, last_state: "finish" } });

        if (cars.length == 0) {
          await ctx.reply("Mashinalar mavjud emas", {
            parse_mode: 'HTML',
            ...Markup.keyboard([
              ["➕ Yangi mashina qo'shish"]
            ]).resize()
          })
        }

        cars.forEach(async (car) => {
          await ctx.replyWithHTML(`<b>Model:</b> ${car.model}\n<b>Raqam: </b> ${car.car_number}`, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Mashinani ko'rish",
                    callback_data: `car_${car.id}`
                  },
                  {
                    text: "Mashinani o'chirish",
                    callback_data: `delcar_${car.id}`
                  }
                ]
              ]
            }
          })
        })
      }
    } catch (error) {
      console.log("OnMyCars error: ", error)
    }

  }

  async OnClickCar(ctx: Context) {
    try {

      const contextAction = ctx.callbackQuery!["data"]
      const carId = contextAction.split("_")[1];

      const car = await this.carModel.findByPk(carId);

      if (car) {
        await ctx.replyWithHTML(
          `<b>🚗 Model:</b> ${car.model}\n<b>🔢 Raqam: </b> ${car.car_number}\n<b>📆 Yil: </b> ${car.year}\n<b>🎨 Rangi: </b> ${car.color}`,
          {
            parse_mode: 'HTML',
            ...Markup.keyboard([
              ["🚗 Mening mashinalarim"]
            ]).resize()
          }
        )
      }else{
        await ctx.reply("Mashina mavjud emas", {
          parse_mode: 'HTML',
          ...Markup.keyboard([
            ["🚗 Mening mashinalarim"]
          ]).resize()
        })
      }


      
    } catch (error) {
      console.log("OnClickLocation Error ", error)
    }
  }

  async OnDeleteCar(ctx: Context) {
    try {

      const contextAction = ctx.callbackQuery!["data"]
      const carId = contextAction.split("_")[1];

      const car = await this.carModel.destroy({ where: { id: carId } });

      await ctx.reply("Mashina o'chirildi");

    } catch (error) {
      console.log("OnDeleteCar Error ", error)
    }
  }
}
