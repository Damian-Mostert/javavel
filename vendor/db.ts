export {};

export type ColumnType =
  | "id"
  | "string"
  | "text"
  | "integer"
  | "bigInteger"
  | "boolean"
  | "date"
  | "dateTime"
  | "timestamp"
  | "json"
  | "uuid"
  | "float"
  | "decimal";

export abstract class Relation<
  Parent extends Model<any>,
  Related extends Model<any>,
  Result,
> {
  constructor(
    public parent: Parent,
    public related: new () => Related,
  ) {}

  abstract get(): Promise<Result>;
}

export class HasOne<
  Parent extends Model<any>,
  Related extends Model<any>,
> extends Relation<Parent, Related, Related | null> {
  get(): Promise<Related | null> {
    return Promise.resolve(null);
  }
}

export class HasMany<
  Parent extends Model<any>,
  Related extends Model<any>,
> extends Relation<Parent, Related, Related[]> {
  get(): Promise<Related[]> {
    return Promise.resolve([]);
  }
}

export class BelongsTo<
  Parent extends Model<any>,
  Related extends Model<any>,
> extends Relation<Parent, Related, Related | null> {
  get(): Promise<Related | null> {
    return Promise.resolve(null);
  }
}

export class BelongsToMany<
  Parent extends Model<any>,
  Related extends Model<any>,
> extends Relation<Parent, Related, Related[]> {
  get(): Promise<Related[]> {
    return Promise.resolve([]);
  }
}

export class HasOneThrough<
  Parent extends Model<any>,
  Through extends Model<any>,
  Related extends Model<any>,
> extends Relation<Parent, Related, Related | null> {
  constructor(
    parent: Parent,
    public through: new () => Through,
    related: new () => Related,
  ) {
    super(parent, related);
  }

  get(): Promise<Related | null> {
    return Promise.resolve(null);
  }
}

export class HasManyThrough<
  Parent extends Model<any>,
  Through extends Model<any>,
  Related extends Model<any>,
> extends Relation<Parent, Related, Related[]> {
  constructor(
    parent: Parent,
    public through: new () => Through,
    related: new () => Related,
  ) {
    super(parent, related);
  }

  get(): Promise<Related[]> {
    return Promise.resolve([]);
  }
}

export class MorphOne<
  Parent extends Model<any>,
  Related extends Model<any>,
> extends Relation<Parent, Related, Related | null> {
  get(): Promise<Related | null> {
    return Promise.resolve(null);
  }
}

export class MorphMany<
  Parent extends Model<any>,
  Related extends Model<any>,
> extends Relation<Parent, Related, Related[]> {
  get(): Promise<Related[]> {
    return Promise.resolve([]);
  }
}

export class MorphTo<Parent extends Model<any>> {
  constructor(public parent: Parent) {}

  get(): Promise<Model<any> | null> {
    return Promise.resolve(null);
  }
}

export class MorphToMany<
  Parent extends Model<any>,
  Related extends Model<any>,
> extends Relation<Parent, Related, Related[]> {
  get(): Promise<Related[]> {
    return Promise.resolve([]);
  }
}

export class MorphedByMany<
  Parent extends Model<any>,
  Related extends Model<any>,
> extends Relation<Parent, Related, Related[]> {
  get(): Promise<Related[]> {
    return Promise.resolve([]);
  }
}

export abstract class Model<T extends Record<string, any>> {
  schema?: Partial<Record<keyof T, ColumnType | ValidatorString>>;
  protected?: (keyof T | string)[];
  casts?: Partial<Record<keyof T, string>>;
  table?: string;
  attributes!: T;

  constructor(data?: Partial<T>) {
    if (data) {
      this.attributes = data as T;
    }
  }

  /* ---------------- Query ---------------- */

  where<K extends keyof T>(key: K, value: T[K]): this {
    return this;
  }

  orWhere<K extends keyof T>(key: K, value: T[K]): this {
    return this;
  }

  first(): Promise<T | null> {
    return Promise.resolve(null);
  }

  get(): Promise<T[]> {
    return Promise.resolve([]);
  }

  create(data: Partial<T>): Promise<T> {
    return Promise.resolve(data as T);
  }

  update(data: Partial<T>): Promise<void> {
    return Promise.resolve();
  }

  delete(): Promise<void> {
    return Promise.resolve();
  }

  /* ---------------- Relationships ---------------- */

  hasOne<R extends Model<any>>(related: new () => R): HasOne<this, R> {
    return new HasOne(this, related);
  }

  hasMany<R extends Model<any>>(related: new () => R): HasMany<this, R> {
    return new HasMany(this, related);
  }

  belongsTo<R extends Model<any>>(related: new () => R): BelongsTo<this, R> {
    return new BelongsTo(this, related);
  }

  belongsToMany<R extends Model<any>>(
    related: new () => R,
  ): BelongsToMany<this, R> {
    return new BelongsToMany(this, related);
  }

  hasOneThrough<TModel extends Model<any>, R extends Model<any>>(
    through: new () => TModel,
    related: new () => R,
  ): HasOneThrough<this, TModel, R> {
    return new HasOneThrough(this, through, related);
  }

  hasManyThrough<TModel extends Model<any>, R extends Model<any>>(
    through: new () => TModel,
    related: new () => R,
  ): HasManyThrough<this, TModel, R> {
    return new HasManyThrough(this, through, related);
  }

  morphOne<R extends Model<any>>(related: new () => R): MorphOne<this, R> {
    return new MorphOne(this, related);
  }

  morphMany<R extends Model<any>>(related: new () => R): MorphMany<this, R> {
    return new MorphMany(this, related);
  }

  morphTo(): MorphTo<this> {
    return new MorphTo(this);
  }

  morphToMany<R extends Model<any>>(
    related: new () => R,
  ): MorphToMany<this, R> {
    return new MorphToMany(this, related);
  }

  morphedByMany<R extends Model<any>>(
    related: new () => R,
  ): MorphedByMany<this, R> {
    return new MorphedByMany(this, related);
  }
}

class ColumnBuilder {
  constructor(
    public name: string,
    public type: ColumnType,
  ) {}

  nullable(): this {
    return this;
  }

  notNullable(): this {
    return this;
  }

  increments(): this {
    return this;
  }

  unique(): this {
    return this;
  }

  index(): this {
    return this;
  }

  default(value: any): this {
    return this;
  }

  unsigned(): this {
    return this;
  }

  primary(): this {
    return this;
  }

  references(table: string, column: string = "id"): this {
    return this;
  }

  onDelete(action: "cascade" | "restrict" | "set null"): this {
    return this;
  }

  onUpdate(action: "cascade" | "restrict" | "set null"): this {
    return this;
  }
}

export type BlueprintCallback = (table: Blueprint) => void;

export class Blueprint {
  constructor(public tableName: string) {}

  id(name: string = "id") {
    return new ColumnBuilder(name, "id");
  }

  uuid(name: string) {
    return new ColumnBuilder(name, "uuid");
  }

  string(name: string, length: number = 255) {
    return new ColumnBuilder(name, "string");
  }

  text(name: string) {
    return new ColumnBuilder(name, "text");
  }

  integer(name: string) {
    return new ColumnBuilder(name, "integer");
  }

  bigInteger(name: string) {
    return new ColumnBuilder(name, "bigInteger");
  }

  boolean(name: string) {
    return new ColumnBuilder(name, "boolean");
  }

  json(name: string) {
    return new ColumnBuilder(name, "json");
  }

  float(name: string) {
    return new ColumnBuilder(name, "float");
  }

  decimal(name: string, precision = 8, scale = 2) {
    return new ColumnBuilder(name, "decimal");
  }

  date(name: string) {
    return new ColumnBuilder(name, "date");
  }

  dateTime(name: string) {
    return new ColumnBuilder(name, "dateTime");
  }

  timestamp(name: string) {
    return new ColumnBuilder(name, "timestamp");
  }

  timestamps() {
    this.timestamp("created_at");
    this.timestamp("updated_at");
  }

  softDeletes() {
    this.timestamp("deleted_at").nullable();
  }
}

export abstract class Schema {
  abstract create(table: string, callback: BlueprintCallback): Promise<void>;

  abstract table(table: string, callback: BlueprintCallback): Promise<void>;

  abstract drop(table: string): Promise<void>;

  abstract dropIfExists(table: string): Promise<void>;

  abstract rename(from: string, to: string): Promise<void>;

  abstract hasTable(table: string): Promise<boolean>;

  abstract hasColumn(table: string, column: string): Promise<boolean>;
}

export abstract class Migration {
  abstract up(schema: Schema): Promise<void>;
  abstract down(schema: Schema): Promise<void>;
}
