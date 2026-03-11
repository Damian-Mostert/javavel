import { Model } from "@/vendor/db";
import Post from "./post";

export default class User extends Model<{
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}> {
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

  posts() {
    return this.hasMany(Post);
  }
}

