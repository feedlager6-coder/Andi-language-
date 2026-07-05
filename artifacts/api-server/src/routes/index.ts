import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import userDataRouter from "./user-data";
import wordsRouter from "./words";
import lessonsRouter from "./lessons";
import exercisesRouter from "./exercises";
import flashcardsRouter from "./flashcards";
import progressRouter from "./progress";
import statsRouter from "./stats";
import morphologyRouter from "./morphology";
import grammarRouter from "./grammar";
import phrasesRouter from "./phrases";
import translateRouter from "./translate";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(userDataRouter);
router.use(morphologyRouter);
router.use(wordsRouter);
router.use(lessonsRouter);
router.use(exercisesRouter);
router.use(flashcardsRouter);
router.use(progressRouter);
router.use(statsRouter);
router.use(grammarRouter);
router.use(phrasesRouter);
router.use(translateRouter);

export default router;
