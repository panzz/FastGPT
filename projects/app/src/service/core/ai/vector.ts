import { getAIApi } from '/common/service/core/ai/config';

export type GetVectorProps = {
  model: string;
  input: string | string[];
};

// text to vector
export async function getVectorsByText({
  model = 'text-embedding-ada-002',
  input
}: GetVectorProps) {
  try {
    if (typeof input === 'string' && !input) {
      return Promise.reject({
        code: 500,
        message: 'input is empty'
      });
    } else if (Array.isArray(input)) {
      for (let i = 0; i < input.length; i++) {
        if (!input[i]) {
          return Promise.reject({
            code: 500,
            message: 'input array is empty'
          });
        }
      }
    }

    const targetModels = global.vectorModels.filter((modelObj: any) => modelObj.model === model);
    let targetUser = undefined;
    if (targetModels?.length) {
      if (targetModels[0].location === 'azure') {
        targetUser = {
          // key: '',
          baseUrl: `${process.env.AZURE_OPENAI_BASE_URL}${
            targetModels[0].model || process.env.AZURE_CHAT_MODEL
          }`,
          location: targetModels[0].location
        };
      } else if (targetModels[0].location === 'ludp') {
        targetUser = {
          // key: '',
          baseUrl: `${process.env.LUDP_API_URL}`,
          key: `${process.env.LUDP_API_KEY}`,
          location: targetModels[0].location
        };
      }
    }

    // 获取 chatAPI
    const ai = getAIApi(targetUser);

    // 把输入的内容转成向量
    const result = await ai.embeddings
      .create({
        model,
        input
      })
      .then(async (res) => {
        if (!res.data) {
          return Promise.reject('Embedding API 404');
        }
        if (!res?.data?.[0]?.embedding) {
          console.log(res?.data);
          // @ts-ignore
          return Promise.reject(res.data?.err?.message || 'Embedding API Error');
        }
        return {
          tokenLen: res.usage.total_tokens || 0,
          vectors: await Promise.all(res.data.map((item) => unityDimensional(item.embedding)))
        };
      });

    return result;
  } catch (error) {
    console.log(`Embedding Error`, error);

    return Promise.reject(error);
  }
}

function unityDimensional(vector: number[]) {
  if (vector.length > 1536) return Promise.reject('向量维度不能超过 1536');
  let resultVector = vector;
  const vectorLen = vector.length;

  const zeroVector = new Array(1536 - vectorLen).fill(0);

  return resultVector.concat(zeroVector);
}
