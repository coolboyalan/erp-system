import httpStatus from "http-status";
import { verifyToken } from "#utils/jwt";
import { session } from "#middlewares/requestSession";

export async function authentication(req, res, next) {
  try {
    let token = req.headers["authorization"];

    if (!token) {
      throw {
        status: false,
        message: "Please login",
        httpStatus: httpStatus.UNAUTHORIZED,
      };
    }

    token = token.split(" ")[1];

    const payload = verifyToken({ token });

    session.set("userType", payload.userType);
    session.set("payload", payload);

    next();
  } catch (err) {
    next(err);
  }
}
