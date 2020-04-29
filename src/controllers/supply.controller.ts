import { Request, Response } from 'express';
import Supply from '../models/supply.model';
import ISupply from '../interfaces/supply.interface';
import { BaseController } from '../interfaces/classes/base-controllers.interface';

class SupplyController implements BaseController{

  public index = async (req: Request, res: Response): Promise<Response> => {
    const supplies: ISupply[] = await Supply.find();
    return res.status(200).json({supplies});
  }

  public create = async (req: Request, res: Response): Promise<Response> => {
    const { id, name, unity, sex, image } = req.body;
    const newSupply: ISupply = new Supply({
      id,
      name,
      unity,
      sex,
      image
    });
    try{
      await newSupply.save();
      return res.status(200).json({ newSupply });
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public show = async (req: Request, res: Response): Promise<Response> => {
    try{
      const id: string = req.params.id;
      const supply: ISupply | null = await Supply.findOne({_id: id});
      return res.status(200).json(supply);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public update = async (req: Request, res: Response) => {
    try{
      const _id: string = req.params.id;
      const { id, name, unity, sex, image } = req.body;
      await Supply.findByIdAndUpdate(_id, {
        id,
        name,
        unity,
        sex,
        image
      });
      const supply = await Supply.findOne({_id: id});
      return res.status(200).json(supply);
    } catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public delete =  async (req: Request, res: Response): Promise<Response> => {
    try{

      const { id } = req.params;
      await Supply.findByIdAndDelete(id);
      return res.status(200).json('deleted');
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public getByName = async (req: Request, res: Response): Promise<Response> => {
    try{
      const { supplyName } = req.query;
      let target: string = decodeURIComponent(supplyName);
      target = target.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const supplies: ISupply[] = await Supply.find({name: { $regex: new RegExp( target, "ig")}  }).select('name').limit(10);
      return res.status(200).json(supplies);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

}

export default new SupplyController();
