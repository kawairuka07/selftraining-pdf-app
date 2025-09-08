const client = new Appwrite.Client()
  .setEndpoint("https://syd.cloud.appwrite.io/v1") // Appwrite Cloudのエンドポイント
  .setProject("68afeba40037d5aa345e"); // 作成したプロジェクトID

export const account = new Appwrite.Account(client);
export const databases = new Appwrite.Databases(client);
export const storage = new Appwrite.Storage(client);