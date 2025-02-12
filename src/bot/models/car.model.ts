import { Column, DataType, Model, Table } from "sequelize-typescript";

interface ICarCreationAttr{
  user_id:number | undefined;
  car_number: string | undefined;
  model: string | undefined;
  color: string | undefined;
  year: string | undefined;
  last_state: string;
}


@Table({ tableName: "car" })
export class Car extends Model<Car, ICarCreationAttr>{
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number

  @Column({
    type: DataType.INTEGER,
  })
  user_id: number | undefined; 

  @Column({
    type: DataType.STRING,
  })
  car_number: string | undefined; 

  @Column({
    type: DataType.STRING,
  })
  model: string | undefined;

  @Column({
    type: DataType.STRING,
  })
  color: string | undefined;

  @Column({
    type: DataType.STRING,
  })
  year: string | undefined;

  @Column({
    type: DataType.STRING,
  })
  last_state: string;
}