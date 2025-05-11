package com.exam.Scheduler.repository;

import com.exam.Scheduler.entity.ExamRoom;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ExamRoomRepository extends JpaRepository<ExamRoom, Long> {
    @Query(value = "select e from ExamRoom e where e.isRemove = 0")
    List<ExamRoom> findAll();

    @Query(value = "select e from ExamRoom e where e.isRemove=0 and e.id = :id")
    Optional<ExamRoom> findById(@Param("id") long id);

    @Transactional
    @Modifying
    @Query("UPDATE ExamRoom s SET s.isRemove = 1 WHERE s.id = :id")
    boolean deleteById(@Param("id") long id);

    @Transactional
    @Modifying
    @Query("update ExamRoom s set s.isRemove=1")
    void deleteAll();
}
