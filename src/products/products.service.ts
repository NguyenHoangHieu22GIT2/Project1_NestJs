import {
  NotFoundException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { CsrfService } from 'src/csrf/csrf.service';
import { RemoveProductInput } from './dto/remove-product.input';
import { ProductFindOptions } from './dto/product-find-options.input';
import { Rating, RatingInput } from './entities/rating.type';
// import { GraphQLUpload, FileUpload } from 'graphql-upload/GraphQLUpload.mjs';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly csrfService: CsrfService,
  ) {}
  async create(createProductInput: CreateProductInput, user: User) {
    await this.csrfService.verifyToken(createProductInput.token, user._id);
    return this.productModel.create({
      ...createProductInput,
      userId: user._id,
    });
  }

  async addRating({ comment, productId, stars }: RatingInput, user: User) {
    const date = new Date();
    const product = await this.findById(productId);
    if (!product) {
      throw new BadRequestException('No Product Found!');
    }
    product.ratings.push({
      comment,
      userId: user._id,
      stars,
      createdAt: date,
    });
    return product.save();
  }

  find(productFindOptions: ProductFindOptions) {
    const filters: FilterQuery<Product> = {};
    if (productFindOptions.words) {
      filters.$text = {
        $search: productFindOptions.words,
      };
    }
    return this.productModel
      .find(filters)
      .sort({ _id: -1 })
      .skip(productFindOptions.skip)
      .limit(productFindOptions.limit);
  }

  async findRecommendedProducts(productFindOptions: ProductFindOptions) {
    return this.productModel
      .find({
        _id: { $ne: productFindOptions.productId },
      })
      .sort({ _id: -1 })
      .skip(productFindOptions.skip)
      .limit(productFindOptions.limit);
  }

  findNumberOfAllProducts(productFindOptions: ProductFindOptions) {
    const filters: FilterQuery<Product> = {};

    if (productFindOptions.words) {
      filters.$text = {
        $search: productFindOptions.words,
      };
    }
    return this.productModel.find(filters).count();
  }

  findAllOfUsers(user: User) {
    return this.productModel.find({ userId: user._id });
  }

  async findById(id: string) {
    if (mongoose.isValidObjectId(id)) {
      const result = await this.productModel.findById(id);
      return result;
    }
  }

  async update(updateProductInput: UpdateProductInput, user: User) {
    await this.csrfService.verifyToken(updateProductInput.token, user._id);
    const product = await this.findById(updateProductInput._id);
    if (product.userId !== user._id)
      throw new BadRequestException('Not your products fools');
    return this.productModel.findByIdAndUpdate(
      updateProductInput._id,
      updateProductInput,
    );
  }

  async getCartItems(userId: string) {
    const products = await this.productModel.aggregate([
      { $project: { _id: 1 } },
    ]);
    console.log(products);
    return products;
  }

  async remove(removeProductInput: RemoveProductInput, user: User) {
    await this.csrfService.verifyToken(removeProductInput.token, user._id);

    const product = await this.findById(removeProductInput.productId);
    if ('message' in product) {
      throw new BadRequestException('Product not found!');
    }
    if (product.userId !== user._id)
      throw new BadRequestException('Not your products fools');
    return this.productModel.findByIdAndDelete(removeProductInput.productId);
  }
}
