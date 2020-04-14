import { Request, Response, Router } from 'express';
class PublicRoutes{

  constructor(private router: Router = Router()){}

  // deefine your public routes inside of routes function
  public routes(): Router{
    // this.router.get('home', (req: Request, res: Response): Response => { return res.send('Welcome home') } ) // example
    return this.router;
  }
}

const publicRoutes: PublicRoutes = new PublicRoutes();
export default publicRoutes.routes();
