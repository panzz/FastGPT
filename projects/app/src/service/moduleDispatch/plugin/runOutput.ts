import type { moduleDispatchResType } from '/common/global/core/chat/type.d';
import type { ModuleDispatchProps } from '@/types/core/chat/type';
import { ModuleOutputKeyEnum } from '/common/global/core/module/constants';

export type PluginOutputProps = ModuleDispatchProps<{
  [key: string]: any;
}>;
export type PluginOutputResponse = {
  [ModuleOutputKeyEnum.responseData]: moduleDispatchResType;
};

export const dispatchPluginOutput = (props: PluginOutputProps): PluginOutputResponse => {
  const { inputs } = props;

  return {
    responseData: {
      price: 0,
      pluginOutput: inputs
    }
  };
};
