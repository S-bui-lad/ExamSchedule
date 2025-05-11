package com.exam.Scheduler.repository;

import com.exam.Scheduler.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByMaMon(String subjectCodes);
}
