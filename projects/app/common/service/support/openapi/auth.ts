import { ERROR_ENUM } from '/common/global/common/error/errorCode';
import { updateApiKeyUsedTime } from './tools';
import { MongoOpenApi } from './schema';
import { POST } from '../../common/api/plusRequest';
import type { OpenApiSchema } from '/common/global/support/openapi/type';

export type AuthOpenApiLimitProps = { openApi: OpenApiSchema };

export async function authOpenApiKey({ apikey }: { apikey: string }) {
  if (!apikey) {
    return Promise.reject(ERROR_ENUM.unAuthApiKey);
  }
  try {
    const openApi = await MongoOpenApi.findOne({ apiKey: apikey });
    if (!openApi) {
      return Promise.reject(ERROR_ENUM.unAuthApiKey);
    }

    // auth limit
    if (global.feConfigs?.isPlus) {
      await POST('/support/openapi/authLimit', { openApi } as AuthOpenApiLimitProps);
    }

    updateApiKeyUsedTime(openApi._id);

    return {
      apikey,
      userId: String(openApi.userId),
      teamId: String(openApi.teamId),
      tmbId: String(openApi.tmbId),
      appId: openApi.appId || ''
    };
  } catch (error) {
    return Promise.reject(error);
  }
}
