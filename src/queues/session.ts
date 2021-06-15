import Queue from "bull";
import { Repository, getRepository } from "typeorm";
import { Session } from "../entity";
import { logger } from "../helpers/errorHandling";
import redis from "redis";
import JWTR from "jwt-redis";

interface Payload {
  jti: string;
}

export const sessionQueue = new Queue<Payload>("session:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

sessionQueue.process(async (job) => {
  const sessionRepository: Repository<Session> = getRepository(Session);
  const session: Session = await sessionRepository.findOne({
    where: { jti: job.data.jti },
  });
  // JWT REDIS FOR TOKEN
  const redisClient = redis.createClient();
  const jwtr = new JWTR(redisClient);
  logger.error(`start delete user with session jti: ${session.jti}`);
  if (session !== undefined) {
    try {
      session.loginStatus = false;
      await sessionRepository.save(session);
      await jwtr.destroy(job.data.jti);
    } catch (e) {
      logger.error(`couldn't expire session: ${session.jti}`);
    }
  }
});
