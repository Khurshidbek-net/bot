import { DataTypes } from "sequelize";
import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "../../user/models/user.model";
import { StoreSocialLink } from "../../store-social-link/models/store-social-link.entity";
import { District } from "../../district/models/district.model";
import { Region } from "../../region/models/region.entity";
import { StoreSubscribe } from "../../store-subscribe/models/store-subscribe.entity";
import { Discount } from "../../discount/models/discount.model";

interface IStoreCreationAttr {
  name: string;
  location: string;
  phone: string;
  ownerId: number;
  storeSocialLink: number;
  districtId: number;
  regionId: number;
}



@Table({ tableName: 'store' })
export class Store extends Model<Store, IStoreCreationAttr> {
  @Column({
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataTypes.STRING
  })
  name: string;

  @Column({
    type: DataTypes.STRING
  })
  location: string;

  @Column({
    type: DataTypes.STRING
  })
  phone: string;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.INTEGER
  })
  ownerId: number;

  @ForeignKey(() => StoreSocialLink)
  @Column({
    type: DataTypes.INTEGER
  })
  storeSocialLink: number;


  @ForeignKey(() => District)
  @Column({
    type: DataTypes.INTEGER
  })
  districtId: number;

  @ForeignKey(() => Region)
  @Column({
    type: DataTypes.INTEGER
  })
  regionId: number;


  @BelongsTo(() => User)
  owner: User

  @BelongsTo(() => StoreSocialLink)
  socialLink: StoreSocialLink

  @BelongsTo(() => Region)
  region: Region

  @BelongsTo(() => District)
  district: District

  @HasMany(() => StoreSubscribe)
  subscription: StoreSubscribe

  @HasMany(() => Discount)
  discounts: Discount[]
  
}
