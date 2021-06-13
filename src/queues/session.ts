import Queue from "bull";
import { Repository, getRepository } from "typeorm";
import { Refresh } from "../entity";
import { logger } from "../helpers/errorHandling";

interface Payload {
  refreshToken: string;
}

export const sessionQueue = new Queue<Payload>("session:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});
sessionQueue.process(async (job) => {
  const refreshRepository: Repository<Refresh> = getRepository(Refresh);
  const refresh: Refresh = await refreshRepository.findOne({
    where: { refreshToken: job.data.refreshToken }
  });
  logger.error("Start Deleting")

  if (refresh !== undefined) {
    try {
      await refreshRepository.delete(refresh);
    } catch (e) {
      logger.error(`couldn't expire session for user with email: ${refresh.email}`)
    }
  }
});


