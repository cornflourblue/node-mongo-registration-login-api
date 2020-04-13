import { Request, Response, Router } from 'express';
import secretController from '../controllers/secret.controller';

class PublicRoutes{

  constructor(private router: Router = Router()){}

  // deefine your public routes inside of routes function
  public routes(): Router{
    // this.router.get('home', (req: Request, res: Response): Response => { return res.send('Welcome home') } ) // example
    this.router.post('/set-permissions-role', secretController.assignPermissionsToRole);
    this.router.post('/create-permission', secretController.newPermission);
    return this.router;
  }
}

const publicRoutes: PublicRoutes = new PublicRoutes();
export default publicRoutes.routes();
