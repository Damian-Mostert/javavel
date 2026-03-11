import { Migration, Schema } from "@/vendor/db";

export default class AuthMigration extends Migration {
  protected table = "users";
  async up(Schema: Schema) {
    Schema.table(this.table, (table) => {
      table.id("id").increments().primary();
      table.string("username").notNullable().unique();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
      table.timestamps();
    });
  }
  async down(Schema: Schema) {
    Schema.dropIfExists(this.table);
  }
}
