import { AppSimpleEditConfigTemplateType } from '/common/global/core/app/type';
import { GET } from '/common/service/common/api/plusRequest';

export async function getSimpleTemplatesFromPlus(): Promise<AppSimpleEditConfigTemplateType[]> {
  try {
    if (!global.systemEnv.pluginBaseUrl) return [];

    return GET<AppSimpleEditConfigTemplateType[]>('/core/app/getSimpleTemplates');
  } catch (error) {
    return [];
  }
}
