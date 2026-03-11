type Request = any;

export abstract class Field<T = any> {
  protected label: string;
  protected attribute: string;
  protected validationRules: string[] = [];
  protected isNullable = false;
  protected isSortable = false;
  protected hideOnIndex = false;
  protected hideOnDetail = false;
  protected hideOnForms = false;
  protected defaultValue?: T;

  constructor(label: string, attribute?: string) {
    this.label = label;
    this.attribute = attribute || label.toLowerCase().replace(/\s+/g, '_');
  }

  rules(...rules: string[]): this {
    this.validationRules.push(...rules);
    return this;
  }

  nullable(): this {
    this.isNullable = true;
    return this;
  }

  sortable(): this {
    this.isSortable = true;
    return this;
  }

  hideFromIndex(): this {
    this.hideOnIndex = true;
    return this;
  }

  onlyOnDetail(): this {
    this.hideOnIndex = true;
    this.hideOnForms = true;
    return this;
  }

  default(value: T): this {
    this.defaultValue = value;
    return this;
  }

  searchable(): this {
    return this;
  }

  getValue(resource: any): any {
    return resource[this.attribute] ?? this.defaultValue;
  }

  toArray(resource: any): Record<string, any> {
    return {
      label: this.label,
      attribute: this.attribute,
      value: this.getValue(resource),
      sortable: this.isSortable,
      nullable: this.isNullable,
      rules: this.validationRules,
    };
  }
}

export class ID extends Field<number> {
  constructor(label: string = 'ID', attribute: string = 'id') {
    super(label, attribute);
  }

  static make(label?: string, attribute?: string): ID {
    return new ID(label, attribute);
  }
}

export class Text extends Field<string> {
  constructor(label: string, attribute?: string) {
    super(label, attribute);
  }

  static make(label: string, attribute?: string): Text {
    return new Text(label, attribute);
  }
}

export class Number extends Field<number> {
  private minValue?: number;
  private maxValue?: number;
  private stepValue?: number;

  constructor(label: string, attribute?: string) {
    super(label, attribute);
  }

  static make(label: string, attribute?: string): Number {
    return new Number(label, attribute);
  }

  min(value: number): this {
    this.minValue = value;
    return this;
  }

  max(value: number): this {
    this.maxValue = value;
    return this;
  }

  step(value: number): this {
    this.stepValue = value;
    return this;
  }
}

export class Date extends Field<string> {
  constructor(label: string, attribute?: string) {
    super(label, attribute);
  }

  static make(label: string, attribute?: string): Date {
    return new Date(label, attribute);
  }
}

export class DateTime extends Field<string> {
  constructor(label: string, attribute?: string) {
    super(label, attribute);
  }

  static make(label: string, attribute?: string): DateTime {
    return new DateTime(label, attribute);
  }
}

export class BelongsTo extends Field {
  private relatedResource?: typeof CmsResource;

  constructor(label: string, attribute?: string, resource?: typeof CmsResource) {
    super(label, attribute);
    this.relatedResource = resource;
  }

  static make(label: string, attribute?: string, resource?: typeof CmsResource): BelongsTo {
    return new BelongsTo(label, attribute, resource);
  }

  getValue(resource: any): any {
    const value = super.getValue(resource);
    if (value && this.relatedResource) {
      return new (this.relatedResource as any)(value).toArray();
    }
    return value;
  }
}

export class HasMany extends Field {
  private relatedResource?: typeof CmsResource;

  constructor(label: string, attribute?: string, resource?: typeof CmsResource) {
    super(label, attribute);
    this.relatedResource = resource;
  }

  static make(label: string, attribute?: string, resource?: typeof CmsResource): HasMany {
    return new HasMany(label, attribute, resource);
  }

  getValue(resource: any): any {
    const value = super.getValue(resource);
    if (Array.isArray(value) && this.relatedResource) {
      return value.map(item => new (this.relatedResource as any)(item).toArray());
    }
    return value || [];
  }
}

export class BelongsToMany extends Field {
  private relatedResource?: typeof CmsResource;

  constructor(label: string, attribute?: string, resource?: typeof CmsResource) {
    super(label, attribute);
    this.relatedResource = resource;
  }

  static make(label: string, attribute?: string, resource?: typeof CmsResource): BelongsToMany {
    return new BelongsToMany(label, attribute, resource);
  }

  getValue(resource: any): any {
    const value = super.getValue(resource);
    if (Array.isArray(value) && this.relatedResource) {
      return value.map(item => new (this.relatedResource as any)(item).toArray());
    }
    return value || [];
  }
}

export abstract class CmsResource<T = any> {
  static group?: string;
  static model?: any;
  static title: string = 'id';
  static search: string[] = [];

  constructor(protected resource: T) {}

  abstract fields(request: Request): Field[];

  cards(request: Request): any[] {
    return [];
  }

  filters(request: Request): any[] {
    return [];
  }

  lenses(request: Request): any[] {
    return [];
  }

  actions(request: Request): any[] {
    return [];
  }

  toArray(request?: Request): Record<string, any> {
    const fields = this.fields(request || {});
    const result: Record<string, any> = {};

    fields.forEach(field => {
      const fieldData = field.toArray(this.resource);
      result[fieldData.attribute] = fieldData.value;
    });

    return result;
  }

  toJson(request?: Request): string {
    return JSON.stringify(this.toArray(request));
  }

  static collection<T>(resources: T[]): CmsResourceCollection<T> {
    return new CmsResourceCollection(resources, this as any);
  }
}

export class CmsResourceCollection<T> {
  constructor(
    private resources: T[],
    private resourceClass: new (resource: T) => CmsResource<T>
  ) {}

  toArray(request?: Request): Record<string, any>[] {
    return this.resources.map(resource => 
      new this.resourceClass(resource).toArray(request)
    );
  }

  toJson(request?: Request): string {
    return JSON.stringify(this.toArray(request));
  }
}
