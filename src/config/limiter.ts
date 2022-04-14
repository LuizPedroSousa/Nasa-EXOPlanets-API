import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60000,
  max: 100,
});

export { limiter };
