import { MongoPlugin } from './schema';
import { FlowModuleTemplateType } from '/common/global/core/module/type';
import { FlowNodeTypeEnum } from '/common/global/core/module/node/constant';
import { formatPluginToPreviewModule } from '/common/global/core/module/utils';
import { PluginType2TemplateTypeMap, PluginTypeEnum } from '/common/global/core/plugin/constants';
import type { PluginTemplateType } from '/common/global/core/plugin/type.d';

/* 
  plugin id rule:
  personal: id
  community: community-id
  commercial: commercial-id
*/

export async function splitCombinePluginId(id: string) {
  const splitRes = id.split('-');
  if (splitRes.length === 1 && id.length === 24) {
    return {
      type: PluginTypeEnum.personal,
      pluginId: id
    };
  }

  const [type, pluginId] = id.split('-') as [`${PluginTypeEnum}`, string];
  if (!type || !pluginId) return Promise.reject('pluginId not found');

  return { type, pluginId: id };
}
/* format plugin modules to plugin preview module */
export async function getPluginPreviewModule({
  id
}: {
  id: string;
}): Promise<FlowModuleTemplateType> {
  // classify
  const { type, pluginId } = await splitCombinePluginId(id);

  const plugin = await (async () => {
    if (type === PluginTypeEnum.community) {
      return global.communityPlugins?.find((plugin) => plugin.id === pluginId);
    }
    if (type === PluginTypeEnum.personal) {
      const item = await MongoPlugin.findById(id);
      if (!item) return undefined;
      return {
        id: String(item._id),
        name: item.name,
        avatar: item.avatar,
        intro: item.intro,
        type: PluginTypeEnum.personal,
        modules: item.modules
      };
    }
  })();

  if (!plugin) return Promise.reject('plugin not found');
  return {
    id: plugin.id,
    templateType: PluginType2TemplateTypeMap[plugin.type],
    flowType: FlowNodeTypeEnum.pluginModule,
    avatar: plugin.avatar,
    name: plugin.name,
    intro: plugin.intro,
    showStatus: true,
    ...formatPluginToPreviewModule(plugin.id, plugin.modules)
  };
}

export async function getPluginRuntimeById(id: string): Promise<PluginTemplateType> {
  const { type, pluginId } = await splitCombinePluginId(id);

  const plugin = await (async () => {
    if (type === PluginTypeEnum.community) {
      return global.communityPlugins?.find((plugin) => plugin.id === pluginId);
    }
    if (type === PluginTypeEnum.personal) {
      const item = await MongoPlugin.findById(id);
      if (!item) return undefined;
      return {
        id: String(item._id),
        name: item.name,
        avatar: item.avatar,
        intro: item.intro,
        type: PluginTypeEnum.personal,
        modules: item.modules
      };
    }
  })();

  if (!plugin) return Promise.reject('plugin not found');

  return {
    id: plugin.id,
    type: plugin.type,
    name: plugin.name,
    avatar: plugin.avatar,
    intro: plugin.intro,
    modules: plugin.modules
  };
}
