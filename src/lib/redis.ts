type TCommand = 'zrange' | 'sismember' | 'get' | 'smembers';
interface IData {
  result: string | number;
}

export const fetchRedis = async (
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

  const data: IData = await res.json();
  return data.result;
};
