import { Router, Request, Response } from 'express';

const router: Router = Router();

/* GET home page. */
router.get('/', (req: Request, res: Response): void => {
  res.render('index', { title: 'Express' });
});

export default router;
