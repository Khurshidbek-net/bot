export class CreateDiscountDto {
  storeId: number;
  title: string;
  description: string;
  discountPercent: number;
  startDate: Date;
  endDate: Date;
  categoryId: number;
  discountValue: number;
  specialLink: string;
  isActive: boolean;
  discountTypeId: number;
}
