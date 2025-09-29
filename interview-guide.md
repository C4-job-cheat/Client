면접 연습하기는 총 10질문 고정이고 면접 연습하기에서 첫번째 질문은 POST /api/interviews/questions/generate/ 해당 엔드포인트 요청을 통해 질문을 받아오고 렌더링을 통해 화면에 보여지는 것 까지 완료된 상태야.
다음 질문 요청에 대해선 POST /api/interviews/answers/submit-and-next/ 해당 엔드포인트로 현재 질문의 답변과 함께 요청을 보내는데 음성 면접 여부에 따라서 body에 {
  "persona_id": "persona_456",
  "interview_session_id": "session_123",
  "question_id": "q_001",
  "question_number": 1,
  "answer_text": "Django ORM의 N+1 문제는 연관된 객체를 조회할 때 발생하는 성능 문제입니다. 예를 들어, User 모델과 Post 모델이 1:N 관계일 때, 모든 사용자의 게시물을 조회하려고 하면 각 사용자마다 별도의 쿼리가 실행되어 N+1개의 쿼리가 발생합니다. 이를 해결하기 위해서는 select_related()나 prefetch_related()를 사용하여 미리 관련 객체를 로드하거나, 쿼리를 최적화해야 합니다.",
  "time_taken": 120
}
와 음성인 경우
Content-Type: multipart/form-data

persona_id: persona_456
interview_session_id: session_123
question_id: q_001
question_number: 1
audio_file: [음성 파일]
time_taken: 120
로 보내고 나서 서버로 부터 다음 질문에 대한 응답을 받아. 응답 형태는 {
  "question_id": "q_002",
  "question_number": 2,
  "question_type": "경험 기반",
  "question_text": "이전 프로젝트에서 데이터베이스 성능 최적화를 위해 어떤 작업을 수행하셨나요?"
}
이야. 만약 10번째 질문에 대한 답변일 경우에는 최종 결과 응답을 받아. 응답형태는 	{
  "interview_session_id": "session_123",
  "user_id": "user_456",
  "persona_id": "persona_456",
  "total_questions": 10,
  "total_time": 1800,
  "average_answer_time": 180.0,
  "total_answers": 10,
  "average_answer_length": 245.5,
  "score": 85.5,
  "grade": "B+",
  "status": "completed",
  "use_voice": false,
  "questions": [
    {
      "question_id": "q_001",
      "question_number": 1,
      "question_type": "직무 지식",
      "question_text": "Django의 ORM에서 N+1 문제가 발생하는 상황을 설명하고, 이를 해결하는 방법을 알려주세요.",
      "answer_text": "Django ORM의 N+1 문제는 연관된 객체를 조회할 때 발생하는 성능 문제입니다...",
      "time_taken": 120
    },
    {
      "question_id": "q_002",
      "question_number": 2,
      "question_type": "경험 기반",
      "question_text": "이전 프로젝트에서 데이터베이스 성능 최적화를 위해 어떤 작업을 수행하셨나요?",
      "answer_text": "인덱스 최적화와 쿼리 튜닝을 통해 성능을 개선했습니다...",
      "time_taken": 95
    }
  ],
  "final_good_points": [
    "기술적 지식이 탄탄합니다.",
    "실무 경험을 바탕으로 한 구체적인 답변을 제공했습니다.",
    "문제 해결 과정을 체계적으로 설명했습니다."
  ],
  "final_improvement_points": [
    "더 구체적인 예시를 들어 설명하면 좋겠습니다.",
    "문제 해결 과정을 단계별로 설명해보세요.",
    "성능 측정 결과에 대해서도 언급해보세요."
  ],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T11:00:00Z",
  "completed_at": "2024-01-15T11:00:00Z"
}
로 받아. 10번째 질문에 대한 답변을 제출할때도 POST /api/interviews/answers/submit-and-next/  로 동일한 엔드포인트로 제출한다는 점 알고 있어.
10번째 질문에 대한 답변을 제출할 때는 최종 면접 결과를 보여주는 페이지로 렌더링해야겠지? 

위 설명에 맞게 코드 구현해줘. 현재 구현해져있는 코드를 수정해서 사용해도 돼