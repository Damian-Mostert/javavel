import {
  CmsResource,
  ID,
  Text,
  BelongsTo,
  Number,
  Date,
  DateTime,
  BelongsToMany,
  HasMany,
} from "@/vendor/cms";
import userModel from "../Models/userModel";

class userCmsResource extends CmsResource<user> {
  static group = "Users";
  static model = userModel;
  static title = "name";
  static search = ["id", "name", "email"];

  fields(request: any) {
    return [
      ID.make("User ID", "id").sortable(),

      Text.make("Name").rules("required").sortable().searchable(),

      Text.make("Email").rules("required", "email").sortable().searchable(),

      DateTime.make("Created At").onlyOnDetail(),
      DateTime.make("Updated At").onlyOnDetail(),
    ];
  }

  cards(request: any) {
    return [];
  }

  filters(request: any) {
    return [];
  }

  lenses(request: any) {
    return [];
  }

  actions(request: any) {
    return [];
  }
}

export default userCmsResource;
