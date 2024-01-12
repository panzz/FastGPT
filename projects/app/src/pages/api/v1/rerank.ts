import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '/common/service/common/response';
import { authCert } from '/common/service/support/permission/auth/common';
import { withNextCors } from '/common/service/common/middle/cors';
import { pushReRankBill } from '@/service/support/wallet/bill/push';
import { connectToDatabase } from '@/service/mongo';
import { authTeamBalance } from '@/service/support/permission/auth/bill';
import { PostReRankProps, PostReRankResponse } from '/common/global/core/ai/api';
import { reRankRecall } from '@/service/core/ai/rerank';

export default withNextCors(async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  let { query, inputs } = req.body as PostReRankProps;
  try {
    await connectToDatabase();
    const { teamId, tmbId } = await authCert({
      req,
      authApiKey: true
    });
    await authTeamBalance(teamId);

    // max 150 length
    inputs = inputs.slice(0, 150);

    const result = await reRankRecall({ query, inputs });

    pushReRankBill({
      teamId,
      tmbId,
      source: 'api'
    });

    jsonRes<PostReRankResponse>(res, {
      data: result
    });
  } catch (err) {
    console.log(err);
    jsonRes<PostReRankResponse>(res, {
      data: inputs.map((input) => ({
        id: input.id
      }))
    });
  }
});
