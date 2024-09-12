import {
  S3ClientConfig,
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  GetObjectCommandInput,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

export type T_UploadFileParams = {
  multiple?: boolean;
  files: any;
  key?: string;
};

export type T_GetParams = {
  key: string;
};

export class FileService {
  private s3ProviderClient: S3Client;
  private config: S3ClientConfig;
  private AWS_REGION1: string;
  private AWS_ACCESS_KEY1: string;
  private AWS_SECRET_ACCESS_KEY1: string;
  private BUCKET_NAME: string;

  constructor() {
    this.AWS_REGION1 = process.env.AWS_REGION1 || "";
    this.AWS_ACCESS_KEY1 = process.env.AWS_ACCESS_KEY1 || "";
    this.AWS_SECRET_ACCESS_KEY1 = process.env.AWS_SECRET_ACCESS_KEY1 || "";
    this.BUCKET_NAME = "breeders-link";

    this.config = {
      region: this.AWS_REGION1,
      credentials: {
        accessKeyId: this.AWS_ACCESS_KEY1,
        secretAccessKey: this.AWS_SECRET_ACCESS_KEY1,
      },
    };

    this.s3ProviderClient = new S3Client(this.config);
  }

  async upload(uploadFileParams: T_UploadFileParams) {
    const { files, key, multiple = false } = uploadFileParams;
    const randomId = randomUUID();
    const fileContent = Buffer.from(
      multiple ? files?.files?.data : files?.file?.data,
      "binary"
    );
    const params: PutObjectCommandInput = {
      Bucket: this.BUCKET_NAME,
      Key: key ? key : randomId,
      Body: fileContent,
    };
    const command = new PutObjectCommand(params);
    const result = await this.s3ProviderClient.send(command);
    return {
      ...result,
      key: key ? key : randomId,
    };
  }

  async get(getParams: T_GetParams) {
    const { key } = getParams;
    const params: GetObjectCommandInput = {
      Bucket: this.BUCKET_NAME,
      Key: key,
    };
    const command = new GetObjectCommand(params);
    const getObjectResult = await this.s3ProviderClient.send(command);
    const fileBase64 = await getObjectResult.Body?.transformToString("base64");
    return Buffer.from(fileBase64 as string, "base64");
  }
}
