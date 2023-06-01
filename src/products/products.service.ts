import {
  NotFoundException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, ObjectId } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { CsrfService } from 'src/csrf/csrf.service';
import { RemoveProductInput } from './dto/remove-product.input';
import { ProductFindOptions } from './dto/product-find-options.input';
import { createWriteStream, unlink } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { CreateRatingInput } from './dto/create-rating.input';
import { GetRatingInput } from './dto/get-rating.input';
import { ToggleVoteInput } from './dto/toggle-vote.input';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly csrfService: CsrfService,
  ) {}
  async create(createProductInput: CreateProductInput, user: User) {
    await this.csrfService.verifyToken(createProductInput.token, user._id);
    const product = this.productModel.create({
      ...createProductInput,
      images: createProductInput.images,
      userId: user._id,
    });
    return product;
    // const { createReadStream, filename} = await createProductInput.image;
    // if(!(filename.endsWith("jpg") ||filename.endsWith("png")||filename.endsWith("jpeg"))){
    //   throw new BadRequestException("Image only")
    // }
    // const salt = randomBytes(16).toString("hex")
    // const uniqueUrlName = "a" + salt + "-" + filename;
    // return new Promise(resolve =>{
    //   createReadStream().pipe(createWriteStream(join(process.cwd(), `./src/upload/${uniqueUrlName}`))).on("finish",()=>{
    //     console.log("Hello Create Product")
    //        const product = this.productModel.create({
    //         ...createProductInput,
    //         imageUrl:uniqueUrlName,
    //         userId: user._id,
    //        })
    //        resolve(product)
    //   })
    // })
  }

  async addRating(
    { rating, title, productId, stars }: CreateRatingInput,
    user: User,
  ) {
    const date = new Date();
    const product = await this.findById(productId);
    if (!product) {
      throw new BadRequestException('No Product Found!');
    }
    product.ratings.push({
      rating,
      userId: user._id,
      stars,
      createdAt: date,
      title,
      upvote: [],
      downvote: [],
    });
    await product.save();
    const populatedProduct = await product.populate({
      path: 'ratings.userId',
      select: 'username avatar',
    });
    console.log('Hello Worldd');
    return populatedProduct;
  }

  async getRatings({ limit, productId, skip }: GetRatingInput) {
    if (limit <= 0) {
      limit = 1;
    }
    const product = await this.productModel.findById(productId, {
      ratings: { $slice: [skip, limit] },
    });
    const populatedProduct = await product.populate({
      path: 'ratings.userId',
      select: 'username avatar ',
    });
    // console.log(populatedProduct.ratings);
    return populatedProduct;
  }
  async toggleUpvoteRating(
    { productId, ratingId }: ToggleVoteInput,
    user: User,
  ) {
    const product = await this.findById(productId);
    let populatedProduct = await product.populate({
      path: 'ratings.userId',
      select: 'username avatar ',
    });
    const ratingIndex = populatedProduct.ratings.findIndex(
      (rating) => rating._id.toString() === ratingId.toString(),
    );
    const rating = populatedProduct.ratings.find(
      (rating) => rating._id.toString() === ratingId.toString(),
    );
    const userAlreadyUpvote = rating.upvote.findIndex(
      (userId) => userId.toString() === user._id.toString(),
    );
    const userAlreadyDownvote = rating.downvote.findIndex(
      (userId) => userId.toString() === user._id.toString(),
    );
    if (userAlreadyDownvote >= 0) {
      populatedProduct.ratings[ratingIndex].downvote = populatedProduct.ratings[
        ratingIndex
      ].downvote.filter((userId) => userId.toString() !== user._id.toString());
    }
    if (userAlreadyUpvote < 0) {
      populatedProduct.ratings[ratingIndex].upvote.push(user._id.toString());
    } else {
      populatedProduct.ratings[ratingIndex].upvote = populatedProduct.ratings[
        ratingIndex
      ].upvote.filter((userId) => userId.toString() !== user._id.toString());
    }
    return populatedProduct.save();
  }

  async toggleDownvoteRating(
    { productId, ratingId }: ToggleVoteInput,
    user: User,
  ) {
    const product = await this.findById(productId);
    let populatedProduct = await product.populate({
      path: 'ratings.userId',
      select: 'username avatar ',
    });
    const ratingIndex = populatedProduct.ratings.findIndex(
      (rating) => rating._id.toString() === ratingId.toString(),
    );
    const rating = populatedProduct.ratings.find(
      (rating) => rating._id.toString() === ratingId.toString(),
    );
    const userAlreadyDownVote = rating.downvote.findIndex(
      (userId) => userId.toString() === user._id.toString(),
    );
    const userAlreadyUpVote = rating.upvote.findIndex(
      (userId) => userId.toString() === user._id.toString(),
    );

    if (userAlreadyUpVote >= 0) {
      populatedProduct.ratings[ratingIndex].upvote = populatedProduct.ratings[
        ratingIndex
      ].upvote.filter((userId) => userId.toString() !== user._id.toString());
    }
    if (userAlreadyDownVote < 0) {
      populatedProduct.ratings[ratingIndex].downvote.push(user._id.toString());
    } else {
      populatedProduct.ratings[ratingIndex].downvote = populatedProduct.ratings[
        ratingIndex
      ].downvote.filter((userId) => userId.toString() !== user._id.toString());
    }
    return populatedProduct.save();
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
    if (!product) {
      throw new BadRequestException('No product Found!');
    }
    if (product.userId !== user._id)
      throw new BadRequestException('Not your products fools');
    return product.images.forEach((image) => {
      return unlink(join(process.cwd(), `./src/upload/${image}`), () => {
        return this.productModel.findByIdAndDelete(
          removeProductInput.productId,
        );
      });
    });
  }
}
