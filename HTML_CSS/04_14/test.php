<?php

$scores = [92, 85, 34, 76, 58, 90, 61, 70, 45, 99, 82, 67, 50, 77, 89];

$grade_A = [];
$grade_B = [];
$grade_C = [];
$grade_D = [];
$grade_F = [];

// scores 리스트에 있는 원소의 갯수 만큼 반복
// PHP 는 인덱스를 지정하지 않으면 자동으로 할당된다.
for ($i = 0; $i < count($scores); $i++) {
    $score = $scores[$i];
    // 반복하며 해당 score 리스트에 삽입
    if ($score >= 90) {
        $grade_A[] = $score;
    } else if ($score >= 80) {
        $grade_B[] = $score;
    } else if ($score >= 70) {
        $grade_C[] = $score;
    } else if ($score >= 60) {
        $grade_D[] = $score;
    } else {
        $grade_F[] = $score;
    }
};

// 평균 함수
// 51번 에서 호출 (리스트[] 받음)
function average($grade_list)
{
    // 총 합계
    $sum = 0;
    // 리스트 원소 갯수
    $counts = count($grade_list);
    // for 문 리스트 원소 갯수 만큼
    for ($i = 0; $i < $counts; $i++) {
        // 총 합계 = 총합계 + 원소 인덱스 순회 하여 더하기 0, 1, 2 번째 원소
        $sum += $grade_list[$i];
    }
    // 반환 값(평균 값) = 총합계 / 리스트의 원소 갯수 (학생 수)
    return $sum / $counts;
};

// 결과 출력 함수
// ~61번 매개 변수 전달받음 ($rank = 등급 , $grade_list = 점수가 담긴 리스트)
function PrintResult($rank, $grade_list)
// $rank = "A", "B", "C", "D", "F" 전달
// $grade_list = 위에서 분류된 리스트 A, B, C, D, F 전달
{
    // 리스트에 담긴 원소 갯수 = 학생수
    $std_num = count($grade_list);
    // 평균을 구하는 함수 실행(average(리스트))
    $avg_result = average($grade_list);
    //  61~ 에서 전달받은 rank 값  + 함수가 호출되고 반환된 $avg_result 값 출력
    echo "$rank 등급: " . "평균 점수 = " . $avg_result . "<br>";
    // 학생 수 만큼 반복하여 "*" 생성
    for ($i = 0; $i < $std_num; $i++) {
        echo "*";
    };
    echo " ( $std_num  명 )" . "<br>";
};
// 첫 번째 실행
PrintResult("A", $grade_A);

// 두 번째 실행
PrintResult("B", $grade_B);

// 세 번째 실행
PrintResult("C", $grade_C);

// 네 번째 실행
PrintResult("D", $grade_D);

// 다섯 번째 실행
PrintResult("F", $grade_F);
