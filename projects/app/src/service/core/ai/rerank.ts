import { PostReRankProps, PostReRankResponse } from '/common/global/core/ai/api';
import { POST } from '@/service/common/api/request';

export function reRankRecall({ query, inputs }: PostReRankProps) {
  const model = global.reRankModels[0];

  if (!model || !model?.requestUrl) {
    return Promise.reject('no rerank model');
  }

  let start = Date.now();
  return POST<PostReRankResponse>(
    model.requestUrl,
    {
      query,
      inputs
    },
    {
      headers: {
        Authorization: `Bearer ${model.requestAuth}`
      }
    }
  ).finally(() => {
    console.log('rerank time:', Date.now() - start);
  });
}
