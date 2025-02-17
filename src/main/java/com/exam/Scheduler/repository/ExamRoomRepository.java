package com.exam.Scheduler.repository;

import com.exam.Scheduler.entity.ExamRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamRoomRepository extends JpaRepository<ExamRoom, Long> {
}
