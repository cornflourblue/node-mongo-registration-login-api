import { Router } from 'express';

class IndexRoutes {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes(): void {
        this.router.get('/', (req, res) => res.send('home') );
    }
}

const indexRoutes = new IndexRoutes();

export default indexRoutes.router;