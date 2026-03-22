'use client';

import { useState } from 'react';
import Link from 'next/link';

function generateDates() {
  const dates: string[] = [];
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() + (1 - start.getDay() + 7) % 7);
  for (let i = 0; i < 5; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

const TIME_SLOTS = ['18:00', '19:00', '20:00', '21:00', '22:00'];
const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

export default function TimeVotePage() {
  const [dates] = useState(generateDates);
  const [myVotes, setMyVotes] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const toggleCell = (date: string, time: string) => {
    if (submitted) return;
    const key = `${date}_${time}`;
    setMyVotes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedCount = Object.values(myVotes).filter(Boolean).length;

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">시간 조율</h1>
        <p className="text-xs text-gray-400 mb-8">가능한 시간대를 클릭하세요</p>

        {/* 그리드 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-xs text-gray-500 text-left w-16" />
                {dates.map((date) => {
                  const d = new Date(date);
                  return (
                    <th key={date} className="p-2 text-center">
                      <div className="text-xs text-gray-500">{d.getMonth() + 1}/{d.getDate()}</div>
                      <div className="text-xs text-gray-400">{dayNames[d.getDay()]}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((time) => (
                <tr key={time}>
                  <td className="p-2 text-xs text-gray-500 font-medium">{time}</td>
                  {dates.map((date) => {
                    const key = `${date}_${time}`;
                    const active = myVotes[key];
                    return (
                      <td key={date} className="p-1">
                        <button
                          onClick={() => toggleCell(date, time)}
                          className={`w-full h-10 rounded text-xs font-medium transition-all ${
                            active
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-50 text-gray-300 hover:bg-gray-100'
                          }`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          {selectedCount}개 시간대 선택됨
        </p>

        {/* 제출 */}
        <div className="flex gap-3">
          <button
            onClick={() => { setSubmitted(true); alert('응답이 제출되었습니다.'); }}
            disabled={submitted || selectedCount === 0}
            className={`px-6 py-2.5 font-medium rounded-lg text-sm ${
              submitted || selectedCount === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {submitted ? '제출 완료' : '응답 제출'}
          </button>
          <Link
            href="/schedule"
            className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 text-sm"
          >
            돌아가기
          </Link>
        </div>
      </div>
    </section>
  );
}
