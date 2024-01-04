import React, { useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import MyModal from '@/components/MyModal';
import { Box, Button, ModalBody, ModalFooter, Textarea } from '@chakra-ui/react';
import type { FetchResultItem } from '/common/global/common/plugin/types/pluginRes.d';
import { useRequest } from '@/web/common/hooks/useRequest';
import { postFetchUrls } from '@/web/common/plugin/api';
import MyRadio from '@/components/common/MyRadio';

export enum FetchTypeEnum {
  axios = 'axios',
  puppeteer = 'pupet'
}

const UrlFetchModal = ({
  onClose,
  onSuccess
}: {
  onClose: () => void;
  onSuccess: (e: FetchResultItem[]) => void;
}) => {
  const { t } = useTranslation();
  const UrlLIst = useRef<HTMLTextAreaElement>(null);
  const Header = useRef<HTMLTextAreaElement>(null);
  const [fetchType, setFetchType] = useState<`${FetchTypeEnum}`>(FetchTypeEnum.axios);

  const { mutate, isLoading } = useRequest({
    mutationFn: async () => {
      const val = UrlLIst.current?.value || '';
      const urls = val.split('\n').filter((e) => e);
      // console.debug('mutationFn> val:%o., urls:%o', val, urls);

      const headerStr = Header.current?.value || '';
      const headers = headerStr.split('\n').filter((e) => e);
      // console.debug('mutationFn> headerStr:%o., headers:%o', headerStr, headers);

      const fetchtype = fetchType?.value || FetchTypeEnum.axios;
      console.debug('mutationFn> fetchtype:%o', fetchtype);
      const res = await postFetchUrls(urls, headers, fetchType);

      onSuccess(res);
      onClose();
    },
    errorToast: '获取链接失败'
  });

  return (
    <MyModal
      iconSrc={`${process.env.BASE_PATH}/imgs/modal/network.svg`}
      title={
        <Box>
          <Box>{t('file.Fetch Url')}</Box>
          <Box fontWeight={'normal'} fontSize={'sm'} color={'myGray.500'} mt={1}>
            目前仅支持读取静态链接，请注意检查结果
          </Box>
        </Box>
      }
      // top={'15vh'}
      isOpen
      onClose={onClose}
      w={'600px'}
    >
      <ModalBody>
        <MyRadio
          gridTemplateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
          list={[
            {
              title: '使用Axios',
              desc: '使用Axios处理普通静态页面',
              value: FetchTypeEnum.axios
            },
            {
              title: '使用Puppeteer',
              desc: '模拟Chrome处理前后端分离的页面',
              value: FetchTypeEnum.puppeteer
            }
          ]}
          value={fetchType}
          onChange={(e) => setFetchType(e as `${FetchTypeEnum}`)}
        />
        <Box fontWeight={'normal'} fontSize={'sm'} color={'myGray.500'} mt={1}>
          链接地址
        </Box>
        <Textarea
          ref={UrlLIst}
          rows={12}
          whiteSpace={'nowrap'}
          resize={'both'}
          placeholder={'最多10个链接，每行一个。'}
        />
        <Box fontWeight={'normal'} fontSize={'sm'} color={'myGray.500'} mt={1}>
          Header信息
        </Box>
        <Textarea
          ref={Header}
          rows={12}
          whiteSpace={'nowrap'}
          resize={'both'}
          style={{
            marginTop: '4px'
          }}
          placeholder={'请求的Header信息，JSON格式。'}
        />
      </ModalBody>
      <ModalFooter>
        <Button variant={'base'} mr={4} onClick={onClose}>
          取消
        </Button>
        <Button isLoading={isLoading} onClick={mutate}>
          确认
        </Button>
      </ModalFooter>
    </MyModal>
  );
};

export default UrlFetchModal;
