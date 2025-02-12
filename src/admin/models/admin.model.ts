import { DataTypes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

interface IAdminCreationAttr {
  email: string;
  username: string;
  password: string;
  isCreator: boolean;
}


@Table({ tableName: "admin" })
export class Admin extends Model<Admin, IAdminCreationAttr> {
  @Column({
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataTypes.STRING,
    unique: true
  })
  email: string;

  @Column({
    type: DataTypes.STRING,
    unique: true
  })
  username: string;

  @Column({
    type: DataTypes.STRING
  })
  password: string;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false
  })
  isActive: boolean;

  @Column({
    type: DataTypes.BOOLEAN
  })
  isCreator: boolean;

  @Column({
    type: DataTypes.STRING
  })
  hashedRefreshToken: string | null;
}
