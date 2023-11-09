import {faker} from '@faker-js/faker';
import bcrypt from "bcrypt";
import { getClient } from "@/db";


async function loadFakeData(numUsers: number = 10){
  console.log(`excuting loaded fake data ${numUsers} users`);

  const client = await getClient();
  //트랜잭션(Transaction)은 데이터베이스에서 일련의 작업을 수행하는 논리적인 작업 단위를 의미
  await client.connect();
  console.log('conn 시작 ', )
    try{
      await client.query("begin") // 트랜잭션을 시작하고 데이터베이스 연산을 원자적으로 처리

      for(let i=0;i<numUsers;i++){
        const saltRounds = 10;
        const hash = await bcrypt.hash("strings123", saltRounds);
        await client.query("insert into public.users (username,password,avatar) values ($1,$2,$3)",[faker.internet.userName(),hash,faker.image.avatar()])
      }
      const res = await client.query("select id from public.users order by created_at desc limit $1",[numUsers])
      console.log(res.rows);
      for (const row of res.rows) {
        for (let i = 0; i < Math.ceil(Math.random() * 50); i++) {
          await client.query(
            "insert into public.posts (user_id, content) values ($1, $2)",
            [row.id, faker.lorem.sentence()]
          );
        }
      }
  
      for (const row1 of res.rows) {
        for (const row2 of res.rows) {
          if (row1.id != row2.id) {
            if (Math.random() > 0.5) {
              await client.query(
                "insert into follows (user_id, follower_id) values ($1, $2)",
                [row1.id, row2.id]
              );
            }
          }
        }
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