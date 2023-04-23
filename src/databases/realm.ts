import * as Realm from "realm";
import { Order } from "./schemas/OrderSchema";

export const getRealm = async () =>
  await Realm.open({
    path: "realm-app",
    schema: [Order],
  });
