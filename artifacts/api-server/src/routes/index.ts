import { Router, type IRouter } from "express";
import healthRouter from "./health";
import wordsRouter from "./words";
import lessonsRouter from "./lessons";
import exercisesRouter from "./exercises";
import flashcardsRouter from "./flashcards";
import progressRouter from "./progress";
import statsRouter from "./stats";
import morphologyRouter from "./morphology";
import grammarRouter from "./grammar";

const router: IRouter = Router();

router.use(healthRouter);
router.use(morphologyRouter);
router.use(wordsRouter);
router.use(lessonsRouter);
router.use(exercisesRouter);
router.use(flashcardsRouter);
router.use(progressRouter);
router.use(statsRouter);
router.use(grammarRouter);

export default router;
