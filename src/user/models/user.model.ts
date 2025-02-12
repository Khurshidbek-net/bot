import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Store } from "../../store/models/store.entity";
import { StoreSubscribe } from "../../store-subscribe/models/store-subscribe.entity";
import { Favourite } from "../../favourite/models/favourite.entity";
import { Region } from "../../region/models/region.entity";
import { Review } from "../../review/models/review.entity";


interface IUserCreationAttr{
  name:string;
  phone:string;
  email:string;
  activation_link: string;
  hashed_password:string;
  regionId: number;
}


@Table({tableName: 'user'})
export class User extends Model<User, IUserCreationAttr>{
  @ApiProperty({
    example: 1,
    description: "User Id"
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataType.STRING(30),
    allowNull: false
  })
  name: string;

  @ForeignKey(() => Region)
  @Column({
    type: DataType.INTEGER
  })
  regionId: number;

  @Column({
    type: DataType.STRING(20),
    unique: true
  })
  phone: string;


  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  email: string;


  @Column({
    type: DataType.STRING,
    defaultValue:false
  })
  is_active: boolean;


  @Column({
    type: DataType.STRING
  })
  hashed_password: string;


  @Column({
    type: DataType.STRING,
    defaultValue: false
  })
  is_owner: boolean;


  @Column({
    type: DataType.STRING
  })
  hashed_refresh_token: string | null;

  @Column({
    type: DataType.STRING
  })
  activation_link: string;


  @HasMany(() => Store)
  stores: Store[]

  @HasMany(() => StoreSubscribe)
  subscription: StoreSubscribe

  @HasMany(() => Favourite)
  favourites: Favourite[]

  @HasMany(() => Review)
  reviews: Review
  
  @BelongsTo(() => Region)
  region: Region
}
