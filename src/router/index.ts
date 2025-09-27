import { Router } from "express";
import userRouter from "../modules/user/user.router";
import authRouter from "../modules/auth/auth.router";
import contactRouter from "../modules/contact/contact.router";
import reviewRouter from "../modules/review/review.router";
import galleryRouter from "../modules/gallery/gallery.router";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/contact",
    route: contactRouter,
  },
  {
    path: "/review",
    route: reviewRouter,
  },
  {
    path: "/gallery",
    route: galleryRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
