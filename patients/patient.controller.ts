import { Request, Response } from 'express';
import Product from '../patients/patient.model';
import IProduct from '../patients/patient.interface';

class ProductController {

  public getProducts = async (req: Request, res: Response): Promise<Response> => {
    const products: IProduct[] = await Product.find();
    return res.status(200).json({products});
  }

  public getPatientByDni = async (req: Request, res: Response): Promise<Response> => {
    try{
      const id: string = req.params.id;
      const product: IProduct | null = await Product.findOne({_id: id});
      return res.status(200).json(product);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }

  }

  public createProduct = async (req: Request, res: Response): Promise<Response> => {
    const { name, barcode, costPrice, salePrice, description, image } = req.body;
    const newProduct: IProduct = new Product({
      name, 
      barcode, 
      costPrice, 
      salePrice, 
      description, 
      image
    });
    try{
      await newProduct.save();
      return res.status(200).json({ newProduct });

    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public updateProduct = async (req: Request, res: Response) => {
    try{
      const id: string = req.params.id;
      const { name, barcode, costPrice, salePrice, description, image } = req.body;
      await Product.findByIdAndUpdate(id, {
        name,
        barcode,
        costPrice,
        salePrice,
        description,
        image
      });
      const product = await Product.findOne({_id: id});
      return res.status(200).json(product);
    } catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public deleteProduct =  async (req: Request, res: Response): Promise<Response> => {
    try{

      const { id } = req.params;
      await Product.findByIdAndDelete(id);
      return res.status(200).json('deleted');
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }
}

export default new ProductController();
