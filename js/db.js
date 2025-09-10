import { databases } from "./config.js";

const DATABASE_ID = "68b0ebfe000ff7419980"; //データベースID
const COLLECTION_ID = "exercise_history"; // 作成済みコレクション

// データ保存
export async function saveExercisesData(selectedExerciseArray, pdfFileId) {
  for (const exercise of selectedExerciseArray) {
    try {
      const res = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        "unique()", // ドキュメントID自動生成
          {
            exerciseName: exercise.id, // idをexerciseNameとして保存
            counts: exercise.counts,
            description: exercise.description,
            date: new Date().toISOString(),
            pdfFileId: pdfFileId
          }
      );
      console.log("保存成功:", res);
    } catch (error) {
      console.error("保存失敗:", error.message);
    }
  }
}