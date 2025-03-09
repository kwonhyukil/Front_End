import { createUsersTable } from "../models/usersModel.js";
import { createScheduleTable } from "../models/scheduleModel.js";
import { createNoticesTable } from "../models/noticesModel.js";
import { createEventsTable } from "../models/eventsModel.js";
import { createUsersTable } from "../models/User.js";
import { createRegistrationsTable } from "../models/registrationsModel.js";

/**
 * ✅ 모든 테이블을 자동으로 생성하는 함수
 */
export async function initializeDatabase() {
  console.log("🔄 데이터베이스 테이블 확인 중...");

  await createUsersTable();
  await createScheduleTable();
  await createNoticesTable();
  await createEventsTable();
  await createUsersTable();
  await createRegistrationsTable();

  console.log("✅ 모든 테이블이 정상적으로 준비되었습니다!");
}
