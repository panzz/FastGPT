import { sseResponseEventEnum } from '/common/service/common/response/constant';
import { responseWrite } from '/common/service/common/response';
import { textAdaptGptResponse } from '@/utils/adapt';
import type { ModuleDispatchProps } from '@/types/core/chat/type';
import { ModuleOutputKeyEnum } from '/common/global/core/module/constants';
export type AnswerProps = ModuleDispatchProps<{
  text: string;
}>;
export type AnswerResponse = {
  [ModuleOutputKeyEnum.answerText]: string;
};

export const dispatchAnswer = (props: Record<string, any>): AnswerResponse => {
  const {
    res,
    detail,
    stream,
    inputs: { text = '' }
  } = props as AnswerProps;

  const formatText = typeof text === 'string' ? text : JSON.stringify(text, null, 2);

  if (stream) {
    responseWrite({
      res,
      event: detail ? sseResponseEventEnum.answer : undefined,
      data: textAdaptGptResponse({
        text: `\n${formatText}`
      })
    });
  }

  return {
    answerText: formatText
  };
};
