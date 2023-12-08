/* 
  get plugin preview modules 
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '/common/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { getPluginPreviewModule } from '/common/service/core/plugin/controller';
import { authPluginCanUse } from '/common/service/support/permission/auth/plugin';
import { FlowModuleTemplateType } from '/common/global/core/module/type';
import { authCert } from '/common/service/support/permission/auth/common';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const { id } = req.query as { id: string };
    await connectToDatabase();
    const { teamId, tmbId } = await authCert({ req, authToken: true });
    await authPluginCanUse({ id, teamId, tmbId });

    jsonRes<FlowModuleTemplateType>(res, {
      data: await getPluginPreviewModule({ id })
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
