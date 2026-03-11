import { Model } from "@/vendor/db";
export default class User extends Model<user> {
  protected = ["id", "password"];
  table = "users";
  schema = {
    id: "id",
    first_name: "string",
    last_name: "string",
    email: "string",
  };
  casts = {
    id: "number",
    first_name: "string",
    last_name: "string",
    email: "string",
  };
}

