package com.exam.Scheduler.repository;

import com.exam.Scheduler.entity.Teacher;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    @Query(value = "SELECT t from Teacher t where t.isRemove = 0")
    List<Teacher>findAll();
    @Query(value = "SELECT t from Teacher t where t.isRemove=0 and t.id = :id")
    Optional<Teacher> findById(@Param("id") long id);

    @Transactional
    @Modifying
    @Query("UPDATE Teacher s SET s.isRemove = 1 WHERE s.id = :id")
    boolean deleteById(@Param("id") long id);

    @Transactional
    @Modifying
    @Query("update Teacher s set s.isRemove=1")
    void deleteAll();
}
