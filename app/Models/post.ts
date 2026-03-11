import { Model } from "@/vendor/db";
import User from "./user";

export default class Post extends Model<{
  id: number;
  title: string;
  content: string;
  user_id: number;
}> {
  protected = ["id"];
  table = "posts";
  schema = {
    id: "id",
    title: "string",
    content: "text",
    user_id: "integer",
  };
  casts = {
    id: "number",
    title: "string",
    content: "string",
    user_id: "number",
  };

  user() {
    return this.belongsTo(User);
  }
}
