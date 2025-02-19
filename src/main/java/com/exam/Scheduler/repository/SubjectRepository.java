package com.exam.Scheduler.repository;

import com.exam.Scheduler.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findByMaMon(String subjectCodes);
}
