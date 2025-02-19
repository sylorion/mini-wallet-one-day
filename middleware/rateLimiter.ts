import rateLimit from "express-rate-limit";

export const limiter= rateLimit({
    max:20,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again after 1 hour"
})