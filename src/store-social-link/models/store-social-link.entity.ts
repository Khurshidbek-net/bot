import { DataTypes } from "sequelize";
import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { SocialLink } from "../../social-link/models/social-link.entity";
import { Store } from "../../store/models/store.entity";

interface IStoreSocialLinkCreationAttb {
  url: string;
  description: string;
  socialLinkId: number
}

@Table({ tableName: "storeSocialLink" })
export class StoreSocialLink extends Model<StoreSocialLink, IStoreSocialLinkCreationAttb> {
  @Column({
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataTypes.STRING
  })
  url: string;

  @Column({
    type: DataTypes.STRING
  })
  description: string;

  @ForeignKey(() => SocialLink)
  @Column({
    type: DataTypes.INTEGER
  })
  socialLinkId: number

  @BelongsTo(() => SocialLink)
  socialLink: SocialLink

  @HasMany(() => Store)
  stores: Store[]
}
