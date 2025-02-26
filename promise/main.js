function fetchMovies(title) {
  // 대기(pending) : 이행하거나 거부되지 않은 조기 상태
  const OMDB_API_KEY = "7035c60c";
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(
        `https://omdbapi.com?apikey=${OMDB_API_KEY}&s=${title}`
      );
      // console.log(res);
      // 이행(fulfiled) : 연산이 성공적으로 완료됨
      resolve(res);
    } catch (error) {
      console.log(error.message);
      // 거부(rejected) : 연산이 실패함
      reject("HEROPY?!");
    }
  });
}

async function test() {
  try {
    const res = await fetchMovies("frozen");
    console.log(res);
  } catch (heropy) {
    console.log(heropy);
  }
}

test();

function hello() {
  fetchMovies("jobs")
    .then((res) => console.log(res))
    .catch(() => {
      console.log(heropy);
    });
}
hello();
