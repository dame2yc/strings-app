import { Client } from "pg";
import {loadEnvConfig} from '@next/env';
import {faker} from '@faker-js/faker'
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
  //트랜잭션(Transaction)은 데이터베이스에서 일련의 작업을 수행하는 논리적인 작업 단위를 의미
  await client.connect();
  console.log('conn 시작 ', )
    try{
      await client.query("begin") // 트랜잭션을 시작하고 데이터베이스 연산을 원자적으로 처리

      for(let i=0;i<numUsers;i++){
        await client.query("insert into public.users (username,password,avatar) values ($1,$2,$3)",[faker.internet.userName(),"password",faker.image.avatar()])
      }

      await client.query("commit") // 트랜잭션에 수행된 작업을 적용
    }catch(error){
      await client.query("rollback"); //쿼리를 실행하여 트랜잭션을 롤백
    console.log('conn 에러 ', )
    }finally{
      await client.end()
      console.log('conn 종료 ', )
    }
}
const numUsers = parseInt(process.argv[2])||10;
console.log(`loading ${numUsers} fake users`);

loadFakeData(numUsers);