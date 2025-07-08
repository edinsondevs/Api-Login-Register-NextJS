import { NextApiRequest, NextApiResponse } from 'next';
import { swaggerSpec } from '@/src/lib/swagger';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(swaggerSpec);
};

export default handler;
