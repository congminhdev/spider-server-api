import UserSchema, { IUserSchema } from './user.schema';
import ProductSchema, { IProductSchema } from './product.schema';
import FileSchema, { IFileSchema } from './file.schema';
import FavoriteSchema, { IFavoriteSchema } from './favorite.schema';
import CategorySchema, { ICategorySchema } from './category.schema';
import { ISchema } from './root.schema';
import LogSchema, { ILogSchema } from './log.schema';
// export interface
export {
    IUserSchema,
    ISchema,
    ILogSchema,
    IProductSchema,
    IFileSchema,
    IFavoriteSchema,
    ICategorySchema
}
// export schema
export {
    UserSchema,
    LogSchema,
    ProductSchema,
    FileSchema,
    FavoriteSchema,
    CategorySchema
}