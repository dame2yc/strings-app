import { Client } from "pg";
import {loadEnvConfig} from '@next/env';
const projectDir = process.cwd(); //현재 dir 경로 가져오기 위함
loadEnvConfig(projectDir); //env 파일 가져오기 위함

export async function getClient() {
  const client = new Client({
    user:process.env.POSTGRES_USER,
    host:process.env.POSTGRES_HOST,
    database:process.env.POSTGRES_NAME,
    password:process.env.POSTGRES_PASSWORD,
    port:parseInt(process.env.POSTGRES_PORT!) //!는 해당 표현식이 null 또는 undefined가 아니라고 컴파일러에 전달
  });

  return client;
}