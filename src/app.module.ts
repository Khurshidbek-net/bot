import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import { User } from './user/models/user.model';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { BotModule } from './bot/bot.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { BOT_NAME } from './app.consts';
import { Bot } from './bot/models/bot.model';
import { DiscountTypeModule } from './discount-type/discount-type.module';
import { DiscountType } from './discount-type/models/discount-type.model';
import { CategoryModule } from './category/category.module';
import { DistrictModule } from './district/district.module';
import { SocialLinkModule } from './social-link/social-link.module';
import { SocialLink } from './social-link/models/social-link.entity';
import { District } from './district/models/district.model';
import { RegionModule } from './region/region.module';
import { Region } from './region/models/region.entity';
import { AdminModule } from './admin/admin.module';
import { Admin } from './admin/models/admin.model';
import { AuthAdminModule } from './auth-admin/auth-admin.module';
import { Address } from './bot/models/address.model';
import { StoreSocialLinkModule } from './store-social-link/store-social-link.module';
import { StoreSocialLink } from './store-social-link/models/store-social-link.entity';
import { StoreModule } from './store/store.module';
import { Store } from './store/models/store.entity';
import { StoreSubscribeModule } from './store-subscribe/store-subscribe.module';
import { StoreSubscribe } from './store-subscribe/models/store-subscribe.entity';
import { DiscountModule } from './discount/discount.module';
import { Discount } from './discount/models/discount.model';
import { Category } from './category/models/category.model';
import { PhotoModule } from './photo/photo.module';
import { Photo } from './photo/models/photo.entity';
import { FavouriteModule } from './favourite/favourite.module';
import { Favourite } from './favourite/models/favourite.entity';
import { ReviewModule } from './review/review.module';
import { Review } from './review/models/review.entity';
import { Car } from './bot/models/car.model';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),

    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      useFactory: ()=>({
        token: process.env.BOT_TOKEN || "undefined",
        middlewares: [],
        include: [BotModule],
      
      })
    }),


    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      username: process.env.POSTGRES_USER,
      port: Number(process.env.POSTGRES_PORT),
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Bot, DiscountType, SocialLink, District, Region, Photo, Favourite,
        Admin, Address, StoreSocialLink, Store, StoreSubscribe, Discount, Category, Review, Car],
      autoLoadModels: true,
      sync: { alter: true },
      logging: false  
    }),
    UserModule,
    AuthModule,
    MailModule,
    BotModule,
    DiscountTypeModule,
    CategoryModule,
    DistrictModule,
    SocialLinkModule,
    RegionModule,
    AdminModule,
    AuthAdminModule,
    StoreSocialLinkModule,
    StoreModule,
    StoreSubscribeModule,
    DiscountModule,
    PhotoModule,
    FavouriteModule,
    ReviewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
