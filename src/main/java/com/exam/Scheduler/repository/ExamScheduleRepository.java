package com.exam.Scheduler.repository;

import com.exam.Scheduler.entity.ExamSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamScheduleRepository extends JpaRepository<ExamSchedule, Long> {
    @Query( value = "select e from ExamSchedule e order by e.examDate")
    List<ExamSchedule> findAllByOrderByExamDateAsc();
    // Sắp xếp theo ngày thi
}

