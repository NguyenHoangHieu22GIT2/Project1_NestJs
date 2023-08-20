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
import { ProductCountInput } from './dto/product-count.input';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly csrfService: CsrfService,
  ) {}

  async getHasSoldDate(user: User) {
    const products = await this.productModel.find({ userId: user._id });
    const date = new Date();
    const dateYears: { year: number; solds: number }[] = [];
    const dateMonths: { month: number; solds: number }[] = [];
    const dateDays: { day: number; solds: number }[] = [];
    for (let i = 0; i < 31; i++) {
      if (i < 5) {
        dateYears.push({ year: date.getFullYear() - i, solds: 0 });
      }
      if (i < 12) {
        dateMonths.push({ month: i + 1, solds: 0 });
      }
      // 31 ngay: 1,3,5,7,8,10,12
      // 30 ngay: 4,6,7,11
      // 29 ngay: 2
      // _1 2 _3 _4 _5 _6 _7 _8 9 _10 11 _12
      switch (date.getMonth() + 1) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          if (i < 31) {
            dateDays.push({ day: i + 1, solds: 0 });
          }
          break;
        case 4:
        case 6:
        case 9:
        case 11:
          if (i < 30) {
            dateDays.push({ day: i + 1, solds: 0 });
          }
          break;
        case 2:
          if (i < 28) {
            dateDays.push({ day: i + 1, solds: 0 });
          }
          break;
      }
    }
    // console.log(dateYears, dateMonths, dateDays);
    products.forEach((product) => {
      product.hasSold.forEach((sold) => {
        if (sold.date.getFullYear() >= date.getFullYear() - 5) {
          dateYears.forEach((year, index) => {
            if (sold.date.getFullYear() == year.year) {
              dateYears[index].solds += sold.quantity;
            }
          });
        }
        if (sold.date.getFullYear() === date.getFullYear()) {
          dateMonths.forEach((month, index) => {
            if (sold.date.getMonth() + 1 == month.month) {
              dateMonths[index].solds += sold.quantity;
            }
          });
        }
        if (sold.date.getFullYear() === date.getFullYear()) {
          dateDays.forEach((day, index) => {
            if (sold.date.getDate() == day.day) {
              dateDays[index].solds += sold.quantity;
            }
          });
        }
      });
    });
    return {
      dateYears,
      dateMonths,
      dateDays,
    };
  }

  async addHasSold(
    productId: string,
    date: Date,
    quantity: number,
    user: User,
  ) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new BadRequestException('No Product Found to be Ordered');
    }
    product.hasSold.push({
      date,
      quantity,
      userId: user._id,
    });
    return product.save();
  }

  async create(createProductInput: CreateProductInput, user: User) {
    // await this.csrfService.verifyToken(createProductInput.token, user._id);
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
    let ableToRate = false;
    const product = await this.findById(productId);
    for (let index = 0; index < product.hasSold.length; index++) {
      const sold = product.hasSold[index];
      if (sold.userId.toString() === user._id.toString()) {
        ableToRate = true;
        break;
      }
    }
    // product.hasSold.forEach(sold=>{
    //   if(sold.userId.toString() === user._id.toString()) {
    //     ableToRate = true;
    //     return;
    //   }
    // })
    if (!product) {
      throw new BadRequestException('No Product Found!');
    }
    if (!ableToRate) {
      throw new BadRequestException('You need to buy before rating.');
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

    return populatedProduct;
  }

  async getRatings({ limit, productId, skip, stars = 5 }: GetRatingInput) {
    if (limit <= 0) {
      limit = 1;
    }
    const product = await this.productModel.findById(productId, {
      ratings: { $slice: [skip, limit] },
    });
    if (!product) {
      throw new BadRequestException('No Product Found!');
    }
    const populatedProduct = await product.populate({
      path: 'ratings.userId',
      select: 'username avatar ',
    });
    // console.log(populatedProduct.ratings);
    return populatedProduct;
  }

  async getRatingCounts(productId: string) {
    const productRatingsCount = (await this.productModel.findById(productId))
      .ratings.length;
    return productRatingsCount;
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

  findNumberOfAllProducts(productCountInput: ProductCountInput) {
    const filters: FilterQuery<Product> = {};

    if (productCountInput.words) {
      filters.$text = {
        $search: productCountInput.words,
      };
    }
    if (productCountInput.userId) {
      filters.userId = productCountInput.userId;
    }
    return this.productModel.find(filters).count();
  }

  findAllOfUsers(userId: string) {
    if (mongoose.isValidObjectId(userId))
      return this.productModel.find({ userId });
    else throw new BadRequestException('No User Found!');
  }

  async findById(id: string) {
    if (mongoose.isValidObjectId(id)) {
      const product = await this.productModel.findById(id);
      if (product) {
        // await product.populate({
        //   path: 'userId',
        // });
        return product;
      } else {
        throw new BadRequestException('No Product Found!');
      }
    } else {
      throw new BadRequestException('No Product Found!');
    }
  }

  async update(updateProductInput: UpdateProductInput, user: User) {
    await this.csrfService.verifyToken(updateProductInput.token, user._id);
    const product = await this.findById(updateProductInput._id);
    if (product.userId.toString() !== user._id.toString())
      throw new BadRequestException('Not your products fools');
    const images = product.images;
    Object.assign(product, updateProductInput);

    if (updateProductInput.images.length > 0) {
      product.images.forEach((image) => {
        unlink(join(process.cwd(), `./src/upload/${image}`), () => {});
      });
    } else {
      product.images = images;
    }
    return product.save();
    // return this.productModel.findByIdAndUpdate(
    //   updateProductInput._id,
    //   updateProductInput,
    // );
  }

  async getCartItems(userId: string) {
    const products = await this.productModel.aggregate([
      { $project: { _id: 1 } },
    ]);
    return products;
  }

  async remove(removeProductInput: RemoveProductInput, user: User) {
    await this.csrfService.verifyToken(removeProductInput.token, user._id);

    const product = await this.findById(removeProductInput.productId);
    if (!product) {
      throw new BadRequestException('No product Found!');
    }
    if (product.userId.toString() !== user._id.toString()) {
      throw new BadRequestException('Not your products fools');
    }
    product.images.forEach((image) => {
      unlink(join(process.cwd(), `./src/upload/${image}`), () => {});
    });
    return this.productModel.findByIdAndDelete(removeProductInput.productId);
  }
}
