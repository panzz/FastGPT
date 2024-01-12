import { POST } from '/common/service/common/api/plusRequest';
import { SendInformProps } from '/common/global/support/user/inform/type';

export function sendOneInform(data: SendInformProps) {
  if (!global.systemEnv.pluginBaseUrl) return;
  return POST('/support/user/inform/create', data);
}
