import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '/common/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { authCert } from '/common/service/support/permission/auth/common';
import { MongoPlugin } from '/common/service/core/plugin/schema';
import { FlowNodeTypeEnum } from '/common/global/core/module/node/constant';
import { FlowModuleTemplateType } from '/common/global/core/module/type';
import { ModuleTemplateTypeEnum } from '/common/global/core/module/constants';
import { GET } from '/common/service/common/api/plusRequest';
import type { PluginTemplateType } from '/common/global/core/plugin/type.d';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    await connectToDatabase();
    const { teamId } = await authCert({ req, authToken: true });

    const [userPlugins, plusPlugins] = await Promise.all([
      MongoPlugin.find({ teamId }).lean(),
      GET<PluginTemplateType[]>('/core/plugin/getTemplates')
    ]);

    const data: FlowModuleTemplateType[] = [
      ...userPlugins.map((plugin) => ({
        id: String(plugin._id),
        templateType: ModuleTemplateTypeEnum.personalPlugin,
        flowType: FlowNodeTypeEnum.pluginModule,
        avatar: plugin.avatar,
        name: plugin.name,
        intro: plugin.intro,
        showStatus: false,
        inputs: [],
        outputs: []
      })),
      ...(global.communityPlugins?.map((plugin) => ({
        id: plugin.id,
        templateType: ModuleTemplateTypeEnum.communityPlugin,
        flowType: FlowNodeTypeEnum.pluginModule,
        avatar: plugin.avatar,
        name: plugin.name,
        intro: plugin.intro,
        showStatus: true,
        inputs: [],
        outputs: []
      })) || [])
    ];

    jsonRes<FlowModuleTemplateType[]>(res, {
      data
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
