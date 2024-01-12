import { useQuery } from '@tanstack/react-query';

export const getMd = async (url: string) => {
  const response = await fetch(`${process.env.BASE_PATH}/docs/${url}`);
  const textContent = await response.text();
  return textContent;
};

export const useMarkdown = ({ url }: { url: string }) => {
  const { data = '' } = useQuery([url], () => getMd(url));

  return {
    data
  };
};
