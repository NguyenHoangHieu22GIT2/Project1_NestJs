import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ProductsService } from 'src/products/products.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User, UserDocument } from './entities/user.entity';
import { CsrfService } from 'src/csrf/csrf.service';
import { GetCartItems } from './dto/get-cart-items.input';

function checkUser(user: UserDocument) {
  if (!user) throw new NotFoundException('User not found!');
  return user;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productService: ProductsService,
    private readonly csrfService: CsrfService,
  ) { }
  async create(createUserInput: CreateUserInput) {
    return this.userModel.create({ ...createUserInput });
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async findByToken(token: string) {
    const user = await this.userModel.findOne({ token });
    return user;
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }

  async update(id: string, updateUserInput: Partial<UpdateUserInput>) {
    const user = await this.findById(id);

    return this.userModel.findByIdAndUpdate(id, { ...updateUserInput });
  }

  async remove(id: string) {
    const user = await this.findById(id);

    return this.userModel.findByIdAndDelete(id);
  }

  async addToCart(productId: string, user: User, token: string) {

    await this.csrfService.verifyToken(token, user._id);
    const product = await this.productService.findById(productId);
    user.addToCart(product._id);
    return product;
  }

  async getCartItems(user: UserDocument) {
    return (await this.findById(user._id)).populate("cart.items.productId");
  }
  async removeItemFromCart(productId: string, quantity: number, user: User) {
    const product = await this.productService.findById(productId);

    user.removeItemFromCart(product._id, quantity);
    return product;
  }
}
