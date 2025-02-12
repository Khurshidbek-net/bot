import { Action, Command, Ctx, Hears, Update } from "nestjs-telegraf";
import { Context, Markup } from "telegraf";
import { AddressService } from "./address.service";


@Update()
export class AddressUpdate {
  constructor(private readonly addressService: AddressService){}

  @Command('address')
  async onAddress(@Ctx() ctx: Context) {
    await this.addressService.OnAddress(ctx);
  }

  @Hears("➕ Yangi manzil qo'shish")
  async OnCommandNewAddress(ctx: Context){
    await this.addressService.OnCommandNewAddress(ctx);
  }

  @Hears("📍 Mening manzillarim")
  async OnMyAddresses(ctx: Context) {
    await this.addressService.OnMyAddresses(ctx);
  }

  @Action(/^loc_+\d+/)
  async OnClickLocation(ctx: Context) {
    await this.addressService.OnClickLocation(ctx);
  }

  @Action(/^del_+\d+/)
  async OnDeleteLocation(ctx: Context) {
    await this.addressService.OnDeleteLocation(ctx);
  }
}