export class OrderModel {
  constructor(
    public _id: string,
    public patrimony: string,
    public equipment: string,
    public description: string,
    public status: string,
    public created_at: Date
  ) {}
}
