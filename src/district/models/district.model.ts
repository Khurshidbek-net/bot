import { DataTypes } from "sequelize";
import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Region } from "../../region/models/region.entity";
import { Store } from "../../store/models/store.entity";

interface IDistrictCreationAttr {
  name: string;
  regionId: number;
}

@Table({ tableName: "district" })
export class District extends Model<District, IDistrictCreationAttr> {
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

  @ForeignKey(() => Region)
  @Column({
    type: DataTypes.INTEGER
  })
  regionId: number;


  @BelongsTo(() => Region)
  region: Region

  @HasMany(() => Store)
  stores: Store[]
}
