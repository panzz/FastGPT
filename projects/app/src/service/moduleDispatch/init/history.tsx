import { ModuleInputKeyEnum } from '/common/global/core/module/constants';
import type { ChatItemType } from '/common/global/core/chat/type.d';
import type { ModuleDispatchProps } from '@/types/core/chat/type';
export type HistoryProps = ModuleDispatchProps<{
  maxContext: number;
  [ModuleInputKeyEnum.history]: ChatItemType[];
}>;

export const dispatchHistory = (props: Record<string, any>) => {
  const {
    inputs: { maxContext = 5, history = [] }
  } = props as HistoryProps;

  return {
    history: maxContext > 0 ? history.slice(-maxContext) : []
  };
};
