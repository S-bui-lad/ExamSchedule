package com.exam.Scheduler.repository;

import com.exam.Scheduler.entity.StudentExam;
import com.exam.Scheduler.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentExamRepository extends JpaRepository<StudentExam, Long> {
}
