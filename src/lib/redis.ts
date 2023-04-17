type TCommand = 'zrange' | 'sismember' | 'get' | 'smembers';

interface IData<R> {
  result: R;
}

type TFetchRedis = <R>(
  command: TCommand,
  ...args: (string | number)[]
) => Promise<R>;

export const fetchRedis: TFetchRedis = async <R>(
  command: TCommand,
  ...args: (string | number)[]
) => {
  console.log(args, 'args');
  const query = args.join('/');
  const commandUrl = `${process.env.UPSTASH_REDIS_REST_URL}/${command}/${query}`;
  const res = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Error executing command: ${res.statusText}`);
  }

  const data: IData<R> = await res.json();
  return data.result;
};
