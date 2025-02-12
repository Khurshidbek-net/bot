import { Action, Command, Ctx, Hears, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { CarService } from "./car.service";


@Update()
export class CarUpdate {
  constructor(private readonly carService: CarService){}

  @Command('car')
  async onCar(@Ctx() ctx: Context) {
    await this.carService.OnCar(ctx);
  }

  @Hears("➕ Yangi mashina qo'shish")
  async OnCommandNewCar(ctx: Context){
    await this.carService.OnCommandNewCar(ctx);
  }

  @Hears("🚗 Mening mashinalarim")
  async OnMyCars(ctx: Context) {
    await this.carService.OnMyCars(ctx);
  }

  @Action(/^car_+\d+/)
  async OnClickCar(ctx: Context) {
    await this.carService.OnClickCar(ctx);
  }

  @Action(/^delcar_+\d+/)
  async OnDeleteCar(ctx: Context) {
    await this.carService.OnDeleteCar(ctx);
  }
}