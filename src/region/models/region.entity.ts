import { DataTypes } from "sequelize";
import { Column, HasMany, Model, Table } from "sequelize-typescript";
import { District } from "../../district/models/district.model";
import { Store } from "../../store/models/store.entity";
import { User } from "../../user/models/user.model";

interface IRegionCreationAttr {
  name: string;
}


@Table({ tableName: "region" })
export class Region extends Model<Region, IRegionCreationAttr> {
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


  @HasMany(() => District)
  districts: District[]

  @HasMany(() => User)
  users: User[]


  @HasMany(() => Store)
  stores: Store[]
}
