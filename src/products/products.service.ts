import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { CsrfService } from 'src/csrf/csrf.service';
import { RemoveProductInput } from './dto/remove-product.input';
import { ProductFindOptions } from './dto/product-find-options.input';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly csrfService: CsrfService,
  ) {}
  async create(createProductInput: CreateProductInput, { _id }: User) {
    await this.csrfService.verifyToken(createProductInput.token, _id);
    return this.productModel.create({ ...createProductInput, userId: _id });
  }

  find(productFindOptions: ProductFindOptions) {
    return this.productModel
      .find()
      .skip(productFindOptions.skip)
      .limit(productFindOptions.limit);
  }

  findAllOfUsers(user: User) {
    return this.productModel.find({ userId: user._id });
  }
  findByTitle(title: string) {
    const regex = new RegExp(`\\b${title}\\b`, 'i');
    return this.productModel.find({
      title: regex,
    });
  }

  findById(id: string) {
    return this.productModel.findById(id);
  }

  async update(updateProductInput: UpdateProductInput, user: User) {
    await this.csrfService.verifyToken(updateProductInput.token, user._id);
    const product = await this.findById(updateProductInput._id);
    if (!product) {
      throw new BadRequestException('Product not found!');
    }
    if (product.userId !== user._id)
      throw new BadRequestException('Not your products fools');
    return this.productModel.findByIdAndUpdate(
      updateProductInput._id,
      updateProductInput,
    );
  }

  async remove(removeProductInput: RemoveProductInput, user: User) {
    await this.csrfService.verifyToken(removeProductInput.token, user._id);

    const product = await this.findById(removeProductInput.productId);
    if (!product) {
      throw new BadRequestException('Product not found!');
    }
    if (product.userId !== user._id)
      throw new BadRequestException('Not your products fools');
    return this.productModel.findByIdAndDelete(removeProductInput.productId);
  }
}
