import * as Realm from "realm";

class Order extends Realm.Object<Order> {
  _id!: string;
  name!: string;

  static schema = {
    name: "Order",

    properties: {
      _id: "objectId",
      patrimony: "string",
      equipment: "string",
      description: "string",
      status: "string",
      created_at: "date",
    },

    primaryKey: "_id",
  };
}

export { Order };
