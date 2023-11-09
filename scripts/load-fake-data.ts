import { Client } from "pg";
import {loadEnvConfig} from '@next/env';

const projectDir = process.cwd(); //현재 dir 경로 가져오기 위함
loadEnvConfig(projectDir); //env 파일 가져오기 위함

async function loadFakeData(numUsers: number = 10){
  console.log(`excuting loaded fake data ${numUsers} users`);

  const client = new Client({
    user:process.env.POSTGRES_USER,
    host:process.env.POSTGRES_HOST,
    database:process.env.POSTGRES_NAME,
    password:process.env.POSTGRES_PASSWORD,
    port:parseInt(process.env.POSTGRES_PORT!) //!는 해당 표현식이 null 또는 undefined가 아니라고 컴파일러에 전달
  });
  await client.connect();
  console.log('여기는?')
  const res =await client.query("select 1");
  console.log(res);
  await client.end();
}
loadFakeData();