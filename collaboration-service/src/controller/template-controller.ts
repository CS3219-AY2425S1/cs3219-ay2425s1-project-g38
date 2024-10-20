import { Request, Response } from 'express';



export const templateController = {
  home: (req: Request, res: Response) => {
    res.send('Welcome to Collaboration Service!');
  },
};
