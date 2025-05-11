package com.exam.Scheduler.repository;

import com.exam.Scheduler.entity.Subject;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    @Query(value = "select s from Subject s where s.isRemove = 0 and s.maMon = :subjectCodes")
    List<Subject> findByMaMon(@Param("subjectCodes") String subjectCodes);
    @Query(value = "SELECT s from Subject s where s.isRemove =0")
    List<Subject> findAll();

    @Query(value = "select s from  Subject s where s.isRemove=0 and s.id = :id")
    Optional<Subject> findById(@Param("id") long id);

    @Transactional
    @Modifying
    @Query("UPDATE Subject s SET s.isRemove = 1 WHERE s.id = :id")
    boolean deleteById(@Param("id") long id);

    @Transactional
    @Modifying
    @Query("update Subject s set s.isRemove=1")
    void deleteAll();
}
