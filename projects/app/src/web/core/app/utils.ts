import { AppSimpleEditFormType } from '/common/global/core/app/type';
import { ModuleItemType } from '/common/global/core/module/type';
import { POST } from '@/web/common/api/request';
import { chatModelList } from '@/web/common/system/staticData';
import { FlowNodeInputTypeEnum, FlowNodeTypeEnum } from '/common/global/core/module/node/constant';
import { ModuleInputKeyEnum } from '/common/global/core/module/constants';
import type { FormatForm2ModulesProps } from '/common/global/core/app/api.d';

export async function postForm2Modules(
  data: AppSimpleEditFormType,
  templateId = 'fastgpt-universal'
) {
  function userGuideTemplate(formData: AppSimpleEditFormType): ModuleItemType[] {
    return [
      {
        name: '用户引导',
        flowType: FlowNodeTypeEnum.userGuide,
        inputs: [
          {
            key: ModuleInputKeyEnum.welcomeText,
            type: FlowNodeInputTypeEnum.hidden,
            label: '开场白',
            value: formData.userGuide.welcomeText
          },
          {
            key: ModuleInputKeyEnum.variables,
            type: FlowNodeInputTypeEnum.hidden,
            label: '对话框变量',
            value: formData.userGuide.variables
          },
          {
            key: ModuleInputKeyEnum.questionGuide,
            type: FlowNodeInputTypeEnum.hidden,
            label: '问题引导',
            value: formData.userGuide.questionGuide
          },
          {
            key: ModuleInputKeyEnum.tts,
            type: FlowNodeInputTypeEnum.hidden,
            label: '语音播报',
            value: formData.userGuide.tts
          }
        ],
        outputs: [],
        position: {
          x: 447.98520778293346,
          y: 721.4016845336229
        },
        moduleId: 'userGuide'
      }
    ];
  }
  const maxToken =
    chatModelList.find((item) => item.model === data.aiSettings.model)?.maxResponse || 4000;

  const props: FormatForm2ModulesProps = {
    formData: data,
    chatModelMaxToken: maxToken,
    chatModelList
  };

  const modules = await POST<ModuleItemType[]>(`/core/app/form2Modules/${templateId}`, props);

  return [...userGuideTemplate(data), ...modules];
}
