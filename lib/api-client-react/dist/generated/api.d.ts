import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { ActivityEntry, AnalyzeWordInput, AuthSuccess, AuthUserEnvelope, CaseParadigmsResponse, CountEntry, ErrorEnvelope, Exercise, ExerciseInput, ExerciseResult, ExerciseSubmission, Favorite, FavoriteInput, Flashcard, FlashcardReview, GetActivityFeedParams, GetDueFlashcardsParams, GetGrammarDrillsParams, GrammarDrill, HealthStatus, HistoryEntry, HistoryEntryInput, Lesson, LessonCompletionResult, LessonDetail, LessonInput, LessonUpdate, ListExercisesParams, ListMyTranslationHistoryParams, ListPhrasesParams, ListWordsParams, LoginInput, LogoutSuccess, MorphologicalAnalysis, NounClassesResponse, Phrase, PhraseInput, PhraseList, PhraseUpdate, ProgressSummary, RegisterInput, StatsSummary, TranslateInput, TranslationResult, UserSettings, UserSettingsInput, UserStatsRecord, Word, WordFormsResponse, WordInput, WordList, WordUpdate } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListWordsUrl: (params?: ListWordsParams) => string;
/**
 * @summary List dictionary words
 */
export declare const listWords: (params?: ListWordsParams, options?: RequestInit) => Promise<WordList>;
export declare const getListWordsQueryKey: (params?: ListWordsParams) => readonly ["/api/words", ...ListWordsParams[]];
export declare const getListWordsQueryOptions: <TData = Awaited<ReturnType<typeof listWords>>, TError = ErrorType<unknown>>(params?: ListWordsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listWords>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listWords>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListWordsQueryResult = NonNullable<Awaited<ReturnType<typeof listWords>>>;
export type ListWordsQueryError = ErrorType<unknown>;
/**
 * @summary List dictionary words
 */
export declare function useListWords<TData = Awaited<ReturnType<typeof listWords>>, TError = ErrorType<unknown>>(params?: ListWordsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listWords>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateWordUrl: () => string;
/**
 * @summary Create a new word
 */
export declare const createWord: (wordInput: WordInput, options?: RequestInit) => Promise<Word>;
export declare const getCreateWordMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createWord>>, TError, {
        data: BodyType<WordInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createWord>>, TError, {
    data: BodyType<WordInput>;
}, TContext>;
export type CreateWordMutationResult = NonNullable<Awaited<ReturnType<typeof createWord>>>;
export type CreateWordMutationBody = BodyType<WordInput>;
export type CreateWordMutationError = ErrorType<unknown>;
/**
* @summary Create a new word
*/
export declare const useCreateWord: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createWord>>, TError, {
        data: BodyType<WordInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createWord>>, TError, {
    data: BodyType<WordInput>;
}, TContext>;
export declare const getGetRandomWordUrl: () => string;
/**
 * @summary Get a random word of the day
 */
export declare const getRandomWord: (options?: RequestInit) => Promise<Word>;
export declare const getGetRandomWordQueryKey: () => readonly ["/api/words/random"];
export declare const getGetRandomWordQueryOptions: <TData = Awaited<ReturnType<typeof getRandomWord>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRandomWord>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRandomWord>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRandomWordQueryResult = NonNullable<Awaited<ReturnType<typeof getRandomWord>>>;
export type GetRandomWordQueryError = ErrorType<unknown>;
/**
 * @summary Get a random word of the day
 */
export declare function useGetRandomWord<TData = Awaited<ReturnType<typeof getRandomWord>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRandomWord>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAnalyzeWordUrl: () => string;
/**
 * @summary Morphological analysis of an Andi word (rule-based, preliminary)
 */
export declare const analyzeWord: (analyzeWordInput: AnalyzeWordInput, options?: RequestInit) => Promise<MorphologicalAnalysis>;
export declare const getAnalyzeWordMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof analyzeWord>>, TError, {
        data: BodyType<AnalyzeWordInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof analyzeWord>>, TError, {
    data: BodyType<AnalyzeWordInput>;
}, TContext>;
export type AnalyzeWordMutationResult = NonNullable<Awaited<ReturnType<typeof analyzeWord>>>;
export type AnalyzeWordMutationBody = BodyType<AnalyzeWordInput>;
export type AnalyzeWordMutationError = ErrorType<unknown>;
/**
* @summary Morphological analysis of an Andi word (rule-based, preliminary)
*/
export declare const useAnalyzeWord: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof analyzeWord>>, TError, {
        data: BodyType<AnalyzeWordInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof analyzeWord>>, TError, {
    data: BodyType<AnalyzeWordInput>;
}, TContext>;
export declare const getGetWordUrl: (id: number) => string;
/**
 * @summary Get a word by ID
 */
export declare const getWord: (id: number, options?: RequestInit) => Promise<Word>;
export declare const getGetWordQueryKey: (id: number) => readonly [`/api/words/${number}`];
export declare const getGetWordQueryOptions: <TData = Awaited<ReturnType<typeof getWord>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWord>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getWord>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetWordQueryResult = NonNullable<Awaited<ReturnType<typeof getWord>>>;
export type GetWordQueryError = ErrorType<void>;
/**
 * @summary Get a word by ID
 */
export declare function useGetWord<TData = Awaited<ReturnType<typeof getWord>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWord>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateWordUrl: (id: number) => string;
/**
 * @summary Update a word
 */
export declare const updateWord: (id: number, wordUpdate: WordUpdate, options?: RequestInit) => Promise<Word>;
export declare const getUpdateWordMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateWord>>, TError, {
        id: number;
        data: BodyType<WordUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateWord>>, TError, {
    id: number;
    data: BodyType<WordUpdate>;
}, TContext>;
export type UpdateWordMutationResult = NonNullable<Awaited<ReturnType<typeof updateWord>>>;
export type UpdateWordMutationBody = BodyType<WordUpdate>;
export type UpdateWordMutationError = ErrorType<unknown>;
/**
* @summary Update a word
*/
export declare const useUpdateWord: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateWord>>, TError, {
        id: number;
        data: BodyType<WordUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateWord>>, TError, {
    id: number;
    data: BodyType<WordUpdate>;
}, TContext>;
export declare const getDeleteWordUrl: (id: number) => string;
/**
 * @summary Delete a word
 */
export declare const deleteWord: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteWordMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteWord>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteWord>>, TError, {
    id: number;
}, TContext>;
export type DeleteWordMutationResult = NonNullable<Awaited<ReturnType<typeof deleteWord>>>;
export type DeleteWordMutationError = ErrorType<unknown>;
/**
* @summary Delete a word
*/
export declare const useDeleteWord: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteWord>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteWord>>, TError, {
    id: number;
}, TContext>;
export declare const getGetWordFormsUrl: (id: number) => string;
/**
 * @summary Get declined/conjugated forms of a word
 */
export declare const getWordForms: (id: number, options?: RequestInit) => Promise<WordFormsResponse>;
export declare const getGetWordFormsQueryKey: (id: number) => readonly [`/api/words/${number}/forms`];
export declare const getGetWordFormsQueryOptions: <TData = Awaited<ReturnType<typeof getWordForms>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWordForms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getWordForms>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetWordFormsQueryResult = NonNullable<Awaited<ReturnType<typeof getWordForms>>>;
export type GetWordFormsQueryError = ErrorType<unknown>;
/**
 * @summary Get declined/conjugated forms of a word
 */
export declare function useGetWordForms<TData = Awaited<ReturnType<typeof getWordForms>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWordForms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListLessonsUrl: () => string;
/**
 * @summary List all lessons
 */
export declare const listLessons: (options?: RequestInit) => Promise<Lesson[]>;
export declare const getListLessonsQueryKey: () => readonly ["/api/lessons"];
export declare const getListLessonsQueryOptions: <TData = Awaited<ReturnType<typeof listLessons>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listLessons>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listLessons>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListLessonsQueryResult = NonNullable<Awaited<ReturnType<typeof listLessons>>>;
export type ListLessonsQueryError = ErrorType<unknown>;
/**
 * @summary List all lessons
 */
export declare function useListLessons<TData = Awaited<ReturnType<typeof listLessons>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listLessons>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateLessonUrl: () => string;
/**
 * @summary Create a lesson
 */
export declare const createLesson: (lessonInput: LessonInput, options?: RequestInit) => Promise<Lesson>;
export declare const getCreateLessonMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createLesson>>, TError, {
        data: BodyType<LessonInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createLesson>>, TError, {
    data: BodyType<LessonInput>;
}, TContext>;
export type CreateLessonMutationResult = NonNullable<Awaited<ReturnType<typeof createLesson>>>;
export type CreateLessonMutationBody = BodyType<LessonInput>;
export type CreateLessonMutationError = ErrorType<unknown>;
/**
* @summary Create a lesson
*/
export declare const useCreateLesson: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createLesson>>, TError, {
        data: BodyType<LessonInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createLesson>>, TError, {
    data: BodyType<LessonInput>;
}, TContext>;
export declare const getGetLessonUrl: (id: number) => string;
/**
 * @summary Get lesson by ID
 */
export declare const getLesson: (id: number, options?: RequestInit) => Promise<LessonDetail>;
export declare const getGetLessonQueryKey: (id: number) => readonly [`/api/lessons/${number}`];
export declare const getGetLessonQueryOptions: <TData = Awaited<ReturnType<typeof getLesson>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLesson>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLesson>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLessonQueryResult = NonNullable<Awaited<ReturnType<typeof getLesson>>>;
export type GetLessonQueryError = ErrorType<void>;
/**
 * @summary Get lesson by ID
 */
export declare function useGetLesson<TData = Awaited<ReturnType<typeof getLesson>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLesson>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateLessonUrl: (id: number) => string;
/**
 * @summary Update a lesson
 */
export declare const updateLesson: (id: number, lessonUpdate: LessonUpdate, options?: RequestInit) => Promise<Lesson>;
export declare const getUpdateLessonMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateLesson>>, TError, {
        id: number;
        data: BodyType<LessonUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateLesson>>, TError, {
    id: number;
    data: BodyType<LessonUpdate>;
}, TContext>;
export type UpdateLessonMutationResult = NonNullable<Awaited<ReturnType<typeof updateLesson>>>;
export type UpdateLessonMutationBody = BodyType<LessonUpdate>;
export type UpdateLessonMutationError = ErrorType<unknown>;
/**
* @summary Update a lesson
*/
export declare const useUpdateLesson: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateLesson>>, TError, {
        id: number;
        data: BodyType<LessonUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateLesson>>, TError, {
    id: number;
    data: BodyType<LessonUpdate>;
}, TContext>;
export declare const getListExercisesUrl: (params?: ListExercisesParams) => string;
/**
 * @summary List exercises
 */
export declare const listExercises: (params?: ListExercisesParams, options?: RequestInit) => Promise<Exercise[]>;
export declare const getListExercisesQueryKey: (params?: ListExercisesParams) => readonly ["/api/exercises", ...ListExercisesParams[]];
export declare const getListExercisesQueryOptions: <TData = Awaited<ReturnType<typeof listExercises>>, TError = ErrorType<unknown>>(params?: ListExercisesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listExercises>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listExercises>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListExercisesQueryResult = NonNullable<Awaited<ReturnType<typeof listExercises>>>;
export type ListExercisesQueryError = ErrorType<unknown>;
/**
 * @summary List exercises
 */
export declare function useListExercises<TData = Awaited<ReturnType<typeof listExercises>>, TError = ErrorType<unknown>>(params?: ListExercisesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listExercises>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateExerciseUrl: () => string;
/**
 * @summary Create an exercise
 */
export declare const createExercise: (exerciseInput: ExerciseInput, options?: RequestInit) => Promise<Exercise>;
export declare const getCreateExerciseMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createExercise>>, TError, {
        data: BodyType<ExerciseInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createExercise>>, TError, {
    data: BodyType<ExerciseInput>;
}, TContext>;
export type CreateExerciseMutationResult = NonNullable<Awaited<ReturnType<typeof createExercise>>>;
export type CreateExerciseMutationBody = BodyType<ExerciseInput>;
export type CreateExerciseMutationError = ErrorType<unknown>;
/**
* @summary Create an exercise
*/
export declare const useCreateExercise: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createExercise>>, TError, {
        data: BodyType<ExerciseInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createExercise>>, TError, {
    data: BodyType<ExerciseInput>;
}, TContext>;
export declare const getSubmitExerciseUrl: (id: number) => string;
/**
 * @summary Submit an answer to an exercise
 */
export declare const submitExercise: (id: number, exerciseSubmission: ExerciseSubmission, options?: RequestInit) => Promise<ExerciseResult>;
export declare const getSubmitExerciseMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitExercise>>, TError, {
        id: number;
        data: BodyType<ExerciseSubmission>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof submitExercise>>, TError, {
    id: number;
    data: BodyType<ExerciseSubmission>;
}, TContext>;
export type SubmitExerciseMutationResult = NonNullable<Awaited<ReturnType<typeof submitExercise>>>;
export type SubmitExerciseMutationBody = BodyType<ExerciseSubmission>;
export type SubmitExerciseMutationError = ErrorType<unknown>;
/**
* @summary Submit an answer to an exercise
*/
export declare const useSubmitExercise: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitExercise>>, TError, {
        id: number;
        data: BodyType<ExerciseSubmission>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof submitExercise>>, TError, {
    id: number;
    data: BodyType<ExerciseSubmission>;
}, TContext>;
export declare const getGetDueFlashcardsUrl: (params?: GetDueFlashcardsParams) => string;
/**
 * @summary Get flashcards due for review
 */
export declare const getDueFlashcards: (params?: GetDueFlashcardsParams, options?: RequestInit) => Promise<Flashcard[]>;
export declare const getGetDueFlashcardsQueryKey: (params?: GetDueFlashcardsParams) => readonly ["/api/flashcards/due", ...GetDueFlashcardsParams[]];
export declare const getGetDueFlashcardsQueryOptions: <TData = Awaited<ReturnType<typeof getDueFlashcards>>, TError = ErrorType<unknown>>(params?: GetDueFlashcardsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDueFlashcards>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDueFlashcards>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDueFlashcardsQueryResult = NonNullable<Awaited<ReturnType<typeof getDueFlashcards>>>;
export type GetDueFlashcardsQueryError = ErrorType<unknown>;
/**
 * @summary Get flashcards due for review
 */
export declare function useGetDueFlashcards<TData = Awaited<ReturnType<typeof getDueFlashcards>>, TError = ErrorType<unknown>>(params?: GetDueFlashcardsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDueFlashcards>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getReviewFlashcardUrl: (wordId: number) => string;
/**
 * @summary Record a flashcard review result
 */
export declare const reviewFlashcard: (wordId: number, flashcardReview: FlashcardReview, options?: RequestInit) => Promise<Flashcard>;
export declare const getReviewFlashcardMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reviewFlashcard>>, TError, {
        wordId: number;
        data: BodyType<FlashcardReview>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof reviewFlashcard>>, TError, {
    wordId: number;
    data: BodyType<FlashcardReview>;
}, TContext>;
export type ReviewFlashcardMutationResult = NonNullable<Awaited<ReturnType<typeof reviewFlashcard>>>;
export type ReviewFlashcardMutationBody = BodyType<FlashcardReview>;
export type ReviewFlashcardMutationError = ErrorType<unknown>;
/**
* @summary Record a flashcard review result
*/
export declare const useReviewFlashcard: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reviewFlashcard>>, TError, {
        wordId: number;
        data: BodyType<FlashcardReview>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof reviewFlashcard>>, TError, {
    wordId: number;
    data: BodyType<FlashcardReview>;
}, TContext>;
export declare const getGetProgressUrl: () => string;
/**
 * @summary Get current user progress summary
 */
export declare const getProgress: (options?: RequestInit) => Promise<ProgressSummary>;
export declare const getGetProgressQueryKey: () => readonly ["/api/progress"];
export declare const getGetProgressQueryOptions: <TData = Awaited<ReturnType<typeof getProgress>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProgress>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProgress>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProgressQueryResult = NonNullable<Awaited<ReturnType<typeof getProgress>>>;
export type GetProgressQueryError = ErrorType<unknown>;
/**
 * @summary Get current user progress summary
 */
export declare function useGetProgress<TData = Awaited<ReturnType<typeof getProgress>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProgress>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetStatsSummaryUrl: () => string;
/**
 * @summary Get platform-wide statistics
 */
export declare const getStatsSummary: (options?: RequestInit) => Promise<StatsSummary>;
export declare const getGetStatsSummaryQueryKey: () => readonly ["/api/stats/summary"];
export declare const getGetStatsSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getStatsSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStatsSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStatsSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStatsSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getStatsSummary>>>;
export type GetStatsSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get platform-wide statistics
 */
export declare function useGetStatsSummary<TData = Awaited<ReturnType<typeof getStatsSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStatsSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetActivityFeedUrl: (params?: GetActivityFeedParams) => string;
/**
 * @summary Get recent learning activity
 */
export declare const getActivityFeed: (params?: GetActivityFeedParams, options?: RequestInit) => Promise<ActivityEntry[]>;
export declare const getGetActivityFeedQueryKey: (params?: GetActivityFeedParams) => readonly ["/api/stats/activity", ...GetActivityFeedParams[]];
export declare const getGetActivityFeedQueryOptions: <TData = Awaited<ReturnType<typeof getActivityFeed>>, TError = ErrorType<unknown>>(params?: GetActivityFeedParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getActivityFeed>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getActivityFeed>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetActivityFeedQueryResult = NonNullable<Awaited<ReturnType<typeof getActivityFeed>>>;
export type GetActivityFeedQueryError = ErrorType<unknown>;
/**
 * @summary Get recent learning activity
 */
export declare function useGetActivityFeed<TData = Awaited<ReturnType<typeof getActivityFeed>>, TError = ErrorType<unknown>>(params?: GetActivityFeedParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getActivityFeed>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetCaseParadigmsUrl: () => string;
/**
 * @summary Get Andi case system with paradigms
 */
export declare const getCaseParadigms: (options?: RequestInit) => Promise<CaseParadigmsResponse>;
export declare const getGetCaseParadigmsQueryKey: () => readonly ["/api/grammar/cases"];
export declare const getGetCaseParadigmsQueryOptions: <TData = Awaited<ReturnType<typeof getCaseParadigms>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCaseParadigms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCaseParadigms>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCaseParadigmsQueryResult = NonNullable<Awaited<ReturnType<typeof getCaseParadigms>>>;
export type GetCaseParadigmsQueryError = ErrorType<unknown>;
/**
 * @summary Get Andi case system with paradigms
 */
export declare function useGetCaseParadigms<TData = Awaited<ReturnType<typeof getCaseParadigms>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCaseParadigms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetNounClassesUrl: () => string;
/**
 * @summary Get Andi noun class (grammatical gender) system
 */
export declare const getNounClasses: (options?: RequestInit) => Promise<NounClassesResponse>;
export declare const getGetNounClassesQueryKey: () => readonly ["/api/grammar/classes"];
export declare const getGetNounClassesQueryOptions: <TData = Awaited<ReturnType<typeof getNounClasses>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getNounClasses>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getNounClasses>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetNounClassesQueryResult = NonNullable<Awaited<ReturnType<typeof getNounClasses>>>;
export type GetNounClassesQueryError = ErrorType<unknown>;
/**
 * @summary Get Andi noun class (grammatical gender) system
 */
export declare function useGetNounClasses<TData = Awaited<ReturnType<typeof getNounClasses>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getNounClasses>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListPhrasesUrl: (params?: ListPhrasesParams) => string;
/**
 * @summary List phrasebank entries
 */
export declare const listPhrases: (params?: ListPhrasesParams, options?: RequestInit) => Promise<PhraseList>;
export declare const getListPhrasesQueryKey: (params?: ListPhrasesParams) => readonly ["/api/phrases", ...ListPhrasesParams[]];
export declare const getListPhrasesQueryOptions: <TData = Awaited<ReturnType<typeof listPhrases>>, TError = ErrorType<unknown>>(params?: ListPhrasesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPhrases>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPhrases>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPhrasesQueryResult = NonNullable<Awaited<ReturnType<typeof listPhrases>>>;
export type ListPhrasesQueryError = ErrorType<unknown>;
/**
 * @summary List phrasebank entries
 */
export declare function useListPhrases<TData = Awaited<ReturnType<typeof listPhrases>>, TError = ErrorType<unknown>>(params?: ListPhrasesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPhrases>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreatePhraseUrl: () => string;
/**
 * @summary Create a phrase
 */
export declare const createPhrase: (phraseInput: PhraseInput, options?: RequestInit) => Promise<Phrase>;
export declare const getCreatePhraseMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPhrase>>, TError, {
        data: BodyType<PhraseInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createPhrase>>, TError, {
    data: BodyType<PhraseInput>;
}, TContext>;
export type CreatePhraseMutationResult = NonNullable<Awaited<ReturnType<typeof createPhrase>>>;
export type CreatePhraseMutationBody = BodyType<PhraseInput>;
export type CreatePhraseMutationError = ErrorType<unknown>;
/**
* @summary Create a phrase
*/
export declare const useCreatePhrase: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPhrase>>, TError, {
        data: BodyType<PhraseInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createPhrase>>, TError, {
    data: BodyType<PhraseInput>;
}, TContext>;
export declare const getListPhraseCategoriesUrl: () => string;
/**
 * @summary List phrase categories with counts
 */
export declare const listPhraseCategories: (options?: RequestInit) => Promise<CountEntry[]>;
export declare const getListPhraseCategoriesQueryKey: () => readonly ["/api/phrases/categories"];
export declare const getListPhraseCategoriesQueryOptions: <TData = Awaited<ReturnType<typeof listPhraseCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPhraseCategories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPhraseCategories>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPhraseCategoriesQueryResult = NonNullable<Awaited<ReturnType<typeof listPhraseCategories>>>;
export type ListPhraseCategoriesQueryError = ErrorType<unknown>;
/**
 * @summary List phrase categories with counts
 */
export declare function useListPhraseCategories<TData = Awaited<ReturnType<typeof listPhraseCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPhraseCategories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetPhraseUrl: (id: number) => string;
/**
 * @summary Get a phrase by ID
 */
export declare const getPhrase: (id: number, options?: RequestInit) => Promise<Phrase>;
export declare const getGetPhraseQueryKey: (id: number) => readonly [`/api/phrases/${number}`];
export declare const getGetPhraseQueryOptions: <TData = Awaited<ReturnType<typeof getPhrase>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPhrase>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPhrase>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPhraseQueryResult = NonNullable<Awaited<ReturnType<typeof getPhrase>>>;
export type GetPhraseQueryError = ErrorType<void>;
/**
 * @summary Get a phrase by ID
 */
export declare function useGetPhrase<TData = Awaited<ReturnType<typeof getPhrase>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPhrase>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdatePhraseUrl: (id: number) => string;
/**
 * @summary Update a phrase
 */
export declare const updatePhrase: (id: number, phraseUpdate: PhraseUpdate, options?: RequestInit) => Promise<Phrase>;
export declare const getUpdatePhraseMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePhrase>>, TError, {
        id: number;
        data: BodyType<PhraseUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updatePhrase>>, TError, {
    id: number;
    data: BodyType<PhraseUpdate>;
}, TContext>;
export type UpdatePhraseMutationResult = NonNullable<Awaited<ReturnType<typeof updatePhrase>>>;
export type UpdatePhraseMutationBody = BodyType<PhraseUpdate>;
export type UpdatePhraseMutationError = ErrorType<unknown>;
/**
* @summary Update a phrase
*/
export declare const useUpdatePhrase: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePhrase>>, TError, {
        id: number;
        data: BodyType<PhraseUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updatePhrase>>, TError, {
    id: number;
    data: BodyType<PhraseUpdate>;
}, TContext>;
export declare const getRequestPhraseAudioUrl: (id: number) => string;
/**
 * @summary Mark a phrase's audio as requested from native speakers
 */
export declare const requestPhraseAudio: (id: number, options?: RequestInit) => Promise<Phrase>;
export declare const getRequestPhraseAudioMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestPhraseAudio>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof requestPhraseAudio>>, TError, {
    id: number;
}, TContext>;
export type RequestPhraseAudioMutationResult = NonNullable<Awaited<ReturnType<typeof requestPhraseAudio>>>;
export type RequestPhraseAudioMutationError = ErrorType<unknown>;
/**
* @summary Mark a phrase's audio as requested from native speakers
*/
export declare const useRequestPhraseAudio: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestPhraseAudio>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof requestPhraseAudio>>, TError, {
    id: number;
}, TContext>;
export declare const getRequestWordAudioUrl: (id: number) => string;
/**
 * @summary Mark a word's audio as requested from native speakers
 */
export declare const requestWordAudio: (id: number, options?: RequestInit) => Promise<Word>;
export declare const getRequestWordAudioMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestWordAudio>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof requestWordAudio>>, TError, {
    id: number;
}, TContext>;
export type RequestWordAudioMutationResult = NonNullable<Awaited<ReturnType<typeof requestWordAudio>>>;
export type RequestWordAudioMutationError = ErrorType<unknown>;
/**
* @summary Mark a word's audio as requested from native speakers
*/
export declare const useRequestWordAudio: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestWordAudio>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof requestWordAudio>>, TError, {
    id: number;
}, TContext>;
export declare const getTranslateTextUrl: () => string;
/**
 * @summary Translate a Russian sentence into Andi with confidence scoring (draft, not machine translation)
 */
export declare const translateText: (translateInput: TranslateInput, options?: RequestInit) => Promise<TranslationResult>;
export declare const getTranslateTextMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof translateText>>, TError, {
        data: BodyType<TranslateInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof translateText>>, TError, {
    data: BodyType<TranslateInput>;
}, TContext>;
export type TranslateTextMutationResult = NonNullable<Awaited<ReturnType<typeof translateText>>>;
export type TranslateTextMutationBody = BodyType<TranslateInput>;
export type TranslateTextMutationError = ErrorType<unknown>;
/**
* @summary Translate a Russian sentence into Andi with confidence scoring (draft, not machine translation)
*/
export declare const useTranslateText: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof translateText>>, TError, {
        data: BodyType<TranslateInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof translateText>>, TError, {
    data: BodyType<TranslateInput>;
}, TContext>;
export declare const getGetGrammarDrillsUrl: (params?: GetGrammarDrillsParams) => string;
/**
 * @summary Get grammar drill exercises
 */
export declare const getGrammarDrills: (params?: GetGrammarDrillsParams, options?: RequestInit) => Promise<GrammarDrill[]>;
export declare const getGetGrammarDrillsQueryKey: (params?: GetGrammarDrillsParams) => readonly ["/api/grammar/drills", ...GetGrammarDrillsParams[]];
export declare const getGetGrammarDrillsQueryOptions: <TData = Awaited<ReturnType<typeof getGrammarDrills>>, TError = ErrorType<unknown>>(params?: GetGrammarDrillsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGrammarDrills>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGrammarDrills>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetGrammarDrillsQueryResult = NonNullable<Awaited<ReturnType<typeof getGrammarDrills>>>;
export type GetGrammarDrillsQueryError = ErrorType<unknown>;
/**
 * @summary Get grammar drill exercises
 */
export declare function useGetGrammarDrills<TData = Awaited<ReturnType<typeof getGrammarDrills>>, TError = ErrorType<unknown>>(params?: GetGrammarDrillsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGrammarDrills>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetCurrentAuthUserUrl: () => string;
/**
 * @summary Get the currently authenticated user
 */
export declare const getCurrentAuthUser: (options?: RequestInit) => Promise<AuthUserEnvelope>;
export declare const getGetCurrentAuthUserQueryKey: () => readonly ["/api/auth/user"];
export declare const getGetCurrentAuthUserQueryOptions: <TData = Awaited<ReturnType<typeof getCurrentAuthUser>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCurrentAuthUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCurrentAuthUser>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCurrentAuthUserQueryResult = NonNullable<Awaited<ReturnType<typeof getCurrentAuthUser>>>;
export type GetCurrentAuthUserQueryError = ErrorType<unknown>;
/**
 * @summary Get the currently authenticated user
 */
export declare function useGetCurrentAuthUser<TData = Awaited<ReturnType<typeof getCurrentAuthUser>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCurrentAuthUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getRegisterUserUrl: () => string;
/**
 * @summary Register a new user with username and password
 */
export declare const registerUser: (registerInput: RegisterInput, options?: RequestInit) => Promise<AuthSuccess>;
export declare const getRegisterUserMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof registerUser>>, TError, {
        data: BodyType<RegisterInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof registerUser>>, TError, {
    data: BodyType<RegisterInput>;
}, TContext>;
export type RegisterUserMutationResult = NonNullable<Awaited<ReturnType<typeof registerUser>>>;
export type RegisterUserMutationBody = BodyType<RegisterInput>;
export type RegisterUserMutationError = ErrorType<ErrorEnvelope>;
/**
* @summary Register a new user with username and password
*/
export declare const useRegisterUser: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof registerUser>>, TError, {
        data: BodyType<RegisterInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof registerUser>>, TError, {
    data: BodyType<RegisterInput>;
}, TContext>;
export declare const getLoginUserUrl: () => string;
/**
 * @summary Login with username and password
 */
export declare const loginUser: (loginInput: LoginInput, options?: RequestInit) => Promise<AuthSuccess>;
export declare const getLoginUserMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof loginUser>>, TError, {
        data: BodyType<LoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof loginUser>>, TError, {
    data: BodyType<LoginInput>;
}, TContext>;
export type LoginUserMutationResult = NonNullable<Awaited<ReturnType<typeof loginUser>>>;
export type LoginUserMutationBody = BodyType<LoginInput>;
export type LoginUserMutationError = ErrorType<ErrorEnvelope>;
/**
* @summary Login with username and password
*/
export declare const useLoginUser: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof loginUser>>, TError, {
        data: BodyType<LoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof loginUser>>, TError, {
    data: BodyType<LoginInput>;
}, TContext>;
export declare const getLogoutUserUrl: () => string;
/**
 * @summary Logout and clear session
 */
export declare const logoutUser: (options?: RequestInit) => Promise<LogoutSuccess>;
export declare const getLogoutUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logoutUser>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof logoutUser>>, TError, void, TContext>;
export type LogoutUserMutationResult = NonNullable<Awaited<ReturnType<typeof logoutUser>>>;
export type LogoutUserMutationError = ErrorType<unknown>;
/**
* @summary Logout and clear session
*/
export declare const useLogoutUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logoutUser>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof logoutUser>>, TError, void, TContext>;
export declare const getListMyFavoritesUrl: () => string;
/**
 * @summary List the current user's favorite words and phrases
 */
export declare const listMyFavorites: (options?: RequestInit) => Promise<Favorite[]>;
export declare const getListMyFavoritesQueryKey: () => readonly ["/api/me/favorites"];
export declare const getListMyFavoritesQueryOptions: <TData = Awaited<ReturnType<typeof listMyFavorites>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyFavorites>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMyFavorites>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMyFavoritesQueryResult = NonNullable<Awaited<ReturnType<typeof listMyFavorites>>>;
export type ListMyFavoritesQueryError = ErrorType<unknown>;
/**
 * @summary List the current user's favorite words and phrases
 */
export declare function useListMyFavorites<TData = Awaited<ReturnType<typeof listMyFavorites>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyFavorites>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAddMyFavoriteUrl: () => string;
/**
 * @summary Add a word or phrase to favorites
 */
export declare const addMyFavorite: (favoriteInput: FavoriteInput, options?: RequestInit) => Promise<Favorite>;
export declare const getAddMyFavoriteMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addMyFavorite>>, TError, {
        data: BodyType<FavoriteInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addMyFavorite>>, TError, {
    data: BodyType<FavoriteInput>;
}, TContext>;
export type AddMyFavoriteMutationResult = NonNullable<Awaited<ReturnType<typeof addMyFavorite>>>;
export type AddMyFavoriteMutationBody = BodyType<FavoriteInput>;
export type AddMyFavoriteMutationError = ErrorType<unknown>;
/**
* @summary Add a word or phrase to favorites
*/
export declare const useAddMyFavorite: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addMyFavorite>>, TError, {
        data: BodyType<FavoriteInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addMyFavorite>>, TError, {
    data: BodyType<FavoriteInput>;
}, TContext>;
export declare const getRemoveMyFavoriteUrl: (itemType: "word" | "phrase", itemId: number) => string;
/**
 * @summary Remove a favorite
 */
export declare const removeMyFavorite: (itemType: "word" | "phrase", itemId: number, options?: RequestInit) => Promise<void>;
export declare const getRemoveMyFavoriteMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeMyFavorite>>, TError, {
        itemType: "word" | "phrase";
        itemId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeMyFavorite>>, TError, {
    itemType: "word" | "phrase";
    itemId: number;
}, TContext>;
export type RemoveMyFavoriteMutationResult = NonNullable<Awaited<ReturnType<typeof removeMyFavorite>>>;
export type RemoveMyFavoriteMutationError = ErrorType<unknown>;
/**
* @summary Remove a favorite
*/
export declare const useRemoveMyFavorite: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeMyFavorite>>, TError, {
        itemType: "word" | "phrase";
        itemId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof removeMyFavorite>>, TError, {
    itemType: "word" | "phrase";
    itemId: number;
}, TContext>;
export declare const getListMyTranslationHistoryUrl: (params?: ListMyTranslationHistoryParams) => string;
/**
 * @summary List the current user's translation history
 */
export declare const listMyTranslationHistory: (params?: ListMyTranslationHistoryParams, options?: RequestInit) => Promise<HistoryEntry[]>;
export declare const getListMyTranslationHistoryQueryKey: (params?: ListMyTranslationHistoryParams) => readonly ["/api/me/history", ...ListMyTranslationHistoryParams[]];
export declare const getListMyTranslationHistoryQueryOptions: <TData = Awaited<ReturnType<typeof listMyTranslationHistory>>, TError = ErrorType<unknown>>(params?: ListMyTranslationHistoryParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyTranslationHistory>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMyTranslationHistory>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMyTranslationHistoryQueryResult = NonNullable<Awaited<ReturnType<typeof listMyTranslationHistory>>>;
export type ListMyTranslationHistoryQueryError = ErrorType<unknown>;
/**
 * @summary List the current user's translation history
 */
export declare function useListMyTranslationHistory<TData = Awaited<ReturnType<typeof listMyTranslationHistory>>, TError = ErrorType<unknown>>(params?: ListMyTranslationHistoryParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyTranslationHistory>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAddMyHistoryEntryUrl: () => string;
/**
 * @summary Save a translation to history
 */
export declare const addMyHistoryEntry: (historyEntryInput: HistoryEntryInput, options?: RequestInit) => Promise<HistoryEntry>;
export declare const getAddMyHistoryEntryMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addMyHistoryEntry>>, TError, {
        data: BodyType<HistoryEntryInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addMyHistoryEntry>>, TError, {
    data: BodyType<HistoryEntryInput>;
}, TContext>;
export type AddMyHistoryEntryMutationResult = NonNullable<Awaited<ReturnType<typeof addMyHistoryEntry>>>;
export type AddMyHistoryEntryMutationBody = BodyType<HistoryEntryInput>;
export type AddMyHistoryEntryMutationError = ErrorType<unknown>;
/**
* @summary Save a translation to history
*/
export declare const useAddMyHistoryEntry: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addMyHistoryEntry>>, TError, {
        data: BodyType<HistoryEntryInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addMyHistoryEntry>>, TError, {
    data: BodyType<HistoryEntryInput>;
}, TContext>;
export declare const getClearMyTranslationHistoryUrl: () => string;
/**
 * @summary Clear the current user's translation history
 */
export declare const clearMyTranslationHistory: (options?: RequestInit) => Promise<void>;
export declare const getClearMyTranslationHistoryMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof clearMyTranslationHistory>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof clearMyTranslationHistory>>, TError, void, TContext>;
export type ClearMyTranslationHistoryMutationResult = NonNullable<Awaited<ReturnType<typeof clearMyTranslationHistory>>>;
export type ClearMyTranslationHistoryMutationError = ErrorType<unknown>;
/**
* @summary Clear the current user's translation history
*/
export declare const useClearMyTranslationHistory: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof clearMyTranslationHistory>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof clearMyTranslationHistory>>, TError, void, TContext>;
export declare const getGetMySettingsUrl: () => string;
/**
 * @summary Get the current user's settings
 */
export declare const getMySettings: (options?: RequestInit) => Promise<UserSettings>;
export declare const getGetMySettingsQueryKey: () => readonly ["/api/me/settings"];
export declare const getGetMySettingsQueryOptions: <TData = Awaited<ReturnType<typeof getMySettings>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMySettings>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMySettings>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMySettingsQueryResult = NonNullable<Awaited<ReturnType<typeof getMySettings>>>;
export type GetMySettingsQueryError = ErrorType<unknown>;
/**
 * @summary Get the current user's settings
 */
export declare function useGetMySettings<TData = Awaited<ReturnType<typeof getMySettings>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMySettings>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateMySettingsUrl: () => string;
/**
 * @summary Update the current user's settings
 */
export declare const updateMySettings: (userSettingsInput: UserSettingsInput, options?: RequestInit) => Promise<UserSettings>;
export declare const getUpdateMySettingsMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMySettings>>, TError, {
        data: BodyType<UserSettingsInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMySettings>>, TError, {
    data: BodyType<UserSettingsInput>;
}, TContext>;
export type UpdateMySettingsMutationResult = NonNullable<Awaited<ReturnType<typeof updateMySettings>>>;
export type UpdateMySettingsMutationBody = BodyType<UserSettingsInput>;
export type UpdateMySettingsMutationError = ErrorType<unknown>;
/**
* @summary Update the current user's settings
*/
export declare const useUpdateMySettings: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMySettings>>, TError, {
        data: BodyType<UserSettingsInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMySettings>>, TError, {
    data: BodyType<UserSettingsInput>;
}, TContext>;
export declare const getGetMyStatsUrl: () => string;
/**
 * @summary Get the current user's learning stats
 */
export declare const getMyStats: (options?: RequestInit) => Promise<UserStatsRecord>;
export declare const getGetMyStatsQueryKey: () => readonly ["/api/me/stats"];
export declare const getGetMyStatsQueryOptions: <TData = Awaited<ReturnType<typeof getMyStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMyStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMyStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMyStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getMyStats>>>;
export type GetMyStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get the current user's learning stats
 */
export declare function useGetMyStats<TData = Awaited<ReturnType<typeof getMyStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMyStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetMyCompletedLessonsUrl: () => string;
/**
 * @summary Get the IDs of lessons the current user has completed
 */
export declare const getMyCompletedLessons: (options?: RequestInit) => Promise<number[]>;
export declare const getGetMyCompletedLessonsQueryKey: () => readonly ["/api/me/lessons/completed"];
export declare const getGetMyCompletedLessonsQueryOptions: <TData = Awaited<ReturnType<typeof getMyCompletedLessons>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMyCompletedLessons>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMyCompletedLessons>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMyCompletedLessonsQueryResult = NonNullable<Awaited<ReturnType<typeof getMyCompletedLessons>>>;
export type GetMyCompletedLessonsQueryError = ErrorType<unknown>;
/**
 * @summary Get the IDs of lessons the current user has completed
 */
export declare function useGetMyCompletedLessons<TData = Awaited<ReturnType<typeof getMyCompletedLessons>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMyCompletedLessons>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCompleteMyLessonUrl: (id: number) => string;
/**
 * @summary Mark a lesson as completed for the current user
 */
export declare const completeMyLesson: (id: number, options?: RequestInit) => Promise<LessonCompletionResult>;
export declare const getCompleteMyLessonMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof completeMyLesson>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof completeMyLesson>>, TError, {
    id: number;
}, TContext>;
export type CompleteMyLessonMutationResult = NonNullable<Awaited<ReturnType<typeof completeMyLesson>>>;
export type CompleteMyLessonMutationError = ErrorType<unknown>;
/**
* @summary Mark a lesson as completed for the current user
*/
export declare const useCompleteMyLesson: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof completeMyLesson>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof completeMyLesson>>, TError, {
    id: number;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map