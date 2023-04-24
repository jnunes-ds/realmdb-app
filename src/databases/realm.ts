import Realm from "realm";
import { OrderSchema } from "./schemas/OrderSchema";

export const getRealm = async () =>
  await Realm.open({
    path: "realm-db-app",
    schema: [OrderSchema],
  });
