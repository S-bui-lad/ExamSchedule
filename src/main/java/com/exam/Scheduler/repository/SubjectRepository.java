package com.exam.Scheduler.repository;

import com.exam.Scheduler.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
}
